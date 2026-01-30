import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Configurar CORS para aceitar requisições do frontend
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Estrutura dos quartos do albergue
const ROOMS = [
  // 3 quartos de 4 vagas (privativo)
  { id: 'A1', capacity: 4, type: 'private', hasPrivateBathroom: true, beds: 4 },
  { id: 'A2', capacity: 4, type: 'private', hasPrivateBathroom: true, beds: 4 },
  { id: 'A3', capacity: 4, type: 'private', hasPrivateBathroom: true, beds: 4 },
  // 3 quartos de 8 vagas (coletivo)
  { id: 'A4', capacity: 8, type: 'shared', hasPrivateBathroom: false, beds: 8 },
  { id: 'A5', capacity: 8, type: 'shared', hasPrivateBathroom: false, beds: 8 },
  { id: 'A6', capacity: 8, type: 'shared', hasPrivateBathroom: false, beds: 8 },
  // 3 quartos de 12 vagas (privativo)
  { id: 'A7', capacity: 12, type: 'large', hasPrivateBathroom: true, beds: 12 },
  { id: 'A8', capacity: 12, type: 'large', hasPrivateBathroom: true, beds: 12 },
  { id: 'A9', capacity: 12, type: 'large', hasPrivateBathroom: true, beds: 12 },
];

// Preço base por cama/noite
const BED_PRICE = 80; // R$ 80 por cama

// Rota de signup
app.post('/make-server-0cae32e3/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, dateOfBirth, cpf, nationality, phone, documentPhoto, profilePhoto } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, senha e nome são obrigatórios' }, 400);
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (authError) {
      console.log('Erro ao criar usuário:', authError);
      return c.json({ error: 'Erro ao criar usuário: ' + authError.message }, 400);
    }

    // Salvar dados adicionais do usuário no KV store
    await kv.set(`user:${authData.user.id}`, {
      id: authData.user.id,
      email,
      name,
      dateOfBirth,
      cpf,
      nationality,
      phone,
      documentPhoto,
      profilePhoto,
      is_admin: false, // Por padrão, novos usuários não são admin
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, user: authData.user });
  } catch (error) {
    console.log('Erro no signup:', error);
    return c.json({ error: 'Erro interno no servidor: ' + error.message }, 500);
  }
});

// Rota para obter informações dos quartos
app.get('/make-server-0cae32e3/rooms', async (c) => {
  return c.json({ rooms: ROOMS });
});

// Rota para verificar disponibilidade
app.post('/make-server-0cae32e3/availability', async (c) => {
  try {
    const body = await c.req.json();
    const { checkIn, checkOut, roomType } = body;

    if (!checkIn || !checkOut) {
      return c.json({ error: 'Datas de check-in e check-out são obrigatórias' }, 400);
    }

    // Buscar todas as reservas para o período
    const allReservations = await kv.getByPrefix('reservation:');
    
    // Filtrar reservas que conflitam com as datas solicitadas
    const conflictingReservations = allReservations.filter(res => {
      const resCheckIn = new Date(res.checkIn);
      const resCheckOut = new Date(res.checkOut);
      const reqCheckIn = new Date(checkIn);
      const reqCheckOut = new Date(checkOut);
      
      return !(resCheckOut <= reqCheckIn || resCheckIn >= reqCheckOut);
    });

    // Calcular disponibilidade por quarto
    const availability = ROOMS.map(room => {
      if (roomType && room.type !== roomType) {
        return null;
      }

      const roomReservations = conflictingReservations.filter(res => res.roomId === room.id);
      const occupiedBeds = roomReservations.reduce((acc, res) => acc + res.bedsReserved, 0);
      const availableBeds = room.capacity - occupiedBeds;

      return {
        ...room,
        availableBeds,
        occupied: occupiedBeds,
        pricePerBed: BED_PRICE,
        wholeRoomPrice: BED_PRICE * 3, // Preço de quarto inteiro = 3 camas
      };
    }).filter(Boolean);

    return c.json({ availability });
  } catch (error) {
    console.log('Erro ao verificar disponibilidade:', error);
    return c.json({ error: 'Erro ao verificar disponibilidade: ' + error.message }, 500);
  }
});

// Rota para criar uma reserva
app.post('/make-server-0cae32e3/reservations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const body = await c.req.json();
    const { roomId, checkIn, checkOut, bedsReserved, bedDetails, wholeRoom, paymentInfo } = body;

    if (!roomId || !checkIn || !checkOut || !bedsReserved) {
      return c.json({ error: 'Informações de reserva incompletas' }, 400);
    }

    // Verificar se o quarto existe
    const room = ROOMS.find(r => r.id === roomId);
    if (!room) {
      return c.json({ error: 'Quarto não encontrado' }, 404);
    }

    // Calcular valor total
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = wholeRoom 
      ? BED_PRICE * 3 * nights 
      : BED_PRICE * bedsReserved * nights;

    // Criar ID da reserva
    const reservationId = `${user.id}_${Date.now()}`;

    // Salvar reserva
    const reservation = {
      id: reservationId,
      userId: user.id,
      roomId,
      checkIn,
      checkOut,
      bedsReserved,
      bedDetails,
      wholeRoom: wholeRoom || false,
      totalAmount,
      nights,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentInfo,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`reservation:${reservationId}`, reservation);

    // Enviar confirmação por email (simulado)
    console.log(`Email de confirmação enviado para ${user.email}: Reserva ${reservationId} confirmada!`);

    return c.json({ success: true, reservation });
  } catch (error) {
    console.log('Erro ao criar reserva:', error);
    return c.json({ error: 'Erro ao criar reserva: ' + error.message }, 500);
  }
});

// Rota para obter reservas do usuário
app.get('/make-server-0cae32e3/my-reservations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const allReservations = await kv.getByPrefix('reservation:');
    const userReservations = allReservations
      .filter(res => res.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ reservations: userReservations });
  } catch (error) {
    console.log('Erro ao buscar reservas:', error);
    return c.json({ error: 'Erro ao buscar reservas: ' + error.message }, 500);
  }
});

// Rota para cancelar reserva
app.post('/make-server-0cae32e3/cancel-reservation', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const body = await c.req.json();
    const { reservationId } = body;

    if (!reservationId) {
      return c.json({ error: 'ID da reserva é obrigatório' }, 400);
    }

    const reservation = await kv.get(`reservation:${reservationId}`);
    
    if (!reservation) {
      return c.json({ error: 'Reserva não encontrada' }, 404);
    }

    if (reservation.userId !== user.id) {
      return c.json({ error: 'Você não tem permissão para cancelar esta reserva' }, 403);
    }

    if (reservation.status === 'cancelled') {
      return c.json({ error: 'Esta reserva já foi cancelada' }, 400);
    }

    // Calcular dias até o check-in
    const today = new Date();
    const checkInDate = new Date(reservation.checkIn);
    const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let refundAmount = 0;
    let refundPercentage = 0;

    if (daysUntilCheckIn >= 3) {
      // Cancelamento sem custos
      refundAmount = reservation.totalAmount;
      refundPercentage = 100;
    } else {
      // Perde 50% do valor
      refundAmount = reservation.totalAmount * 0.5;
      refundPercentage = 50;
    }

    // Atualizar reserva
    const updatedReservation = {
      ...reservation,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      refundAmount,
      refundPercentage,
      requiresApproval: refundPercentage < 100,
    };

    await kv.set(`reservation:${reservationId}`, updatedReservation);

    // Notificar Sr. Almeida se necessário aprovação
    if (refundPercentage < 100) {
      console.log(`NOTIFICAÇÃO URGENTE para pauloaminegirl@gmail.com: Pedido de cancelamento da reserva ${reservationId} requer aprovação. Reembolso: ${refundPercentage}% (R$ ${refundAmount.toFixed(2)})`);
    }

    return c.json({ 
      success: true, 
      reservation: updatedReservation,
      refundAmount,
      refundPercentage,
      message: refundPercentage === 100 
        ? 'Reserva cancelada com reembolso total' 
        : 'Pedido de cancelamento enviado. O reembolso está sujeito à aprovação do proprietário.'
    });
  } catch (error) {
    console.log('Erro ao cancelar reserva:', error);
    return c.json({ error: 'Erro ao cancelar reserva: ' + error.message }, 500);
  }
});

// Rota para adicionar avaliação
app.post('/make-server-0cae32e3/reviews', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const body = await c.req.json();
    const { rating, comment, reservationId } = body;

    if (!rating || !comment) {
      return c.json({ error: 'Avaliação e comentário são obrigatórios' }, 400);
    }

    // Buscar dados do usuário
    const userData = await kv.get(`user:${user.id}`);

    const reviewId = `${user.id}_${Date.now()}`;
    const review = {
      id: reviewId,
      userId: user.id,
      userName: userData?.name || 'Hóspede',
      rating,
      comment,
      reservationId,
      createdAt: new Date().toISOString(),
      // APENAS avaliações positivas (4 ou 5 estrelas) serão exibidas
      visible: rating >= 4,
    };

    await kv.set(`review:${reviewId}`, review);

    return c.json({ success: true, review });
  } catch (error) {
    console.log('Erro ao criar avaliação:', error);
    return c.json({ error: 'Erro ao criar avaliação: ' + error.message }, 500);
  }
});

// Rota para obter avaliações públicas (apenas positivas)
app.get('/make-server-0cae32e3/reviews', async (c) => {
  try {
    const allReviews = await kv.getByPrefix('review:');
    
    let publicReviews = allReviews
      .filter(review => review.visible)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Se não houver reviews, retorna dados de exemplo
    if (publicReviews.length === 0) {
      publicReviews = [
        {
          id: 'mock-1',
          rating: 5,
          comment: 'Lugar incrível! A localização em Santa Teresa é perfeita, perto de tudo e com aquele charme boêmio que adoro. Os quartos são limpos e confortáveis.',
          userName: 'Maria Silva',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true
        },
        {
          id: 'mock-2',
          rating: 5,
          comment: 'Experiência maravilhosa! A equipe é super atenciosa e o ambiente é acolhedor. Voltarei com certeza!',
          userName: 'João Santos',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true
        },
        {
          id: 'mock-3',
          rating: 5,
          comment: 'Melhor custo-benefício do Rio! Conheci pessoas incríveis e a vista é de tirar o fôlego.',
          userName: 'Ana Costa',
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true
        },
        {
          id: 'mock-4',
          rating: 4,
          comment: 'Albergue muito bom! Ótima estrutura e localização privilegiada no coração de Santa Teresa.',
          userName: 'Pedro Oliveira',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true
        },
        {
          id: 'mock-5',
          rating: 5,
          comment: 'Simplesmente perfeito! A decoração retrô é linda e o atendimento impecável. Recomendo muito!',
          userName: 'Carla Mendes',
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true
        },
        {
          id: 'mock-6',
          rating: 4,
          comment: 'Ótima experiência! WiFi rápido, cozinha equipada e uma vibe incrível. Santa Teresa é demais!',
          userName: 'Lucas Ferreira',
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true
        }
      ];
    }

    return c.json({ reviews: publicReviews });
  } catch (error) {
    console.log('Erro ao buscar avaliações:', error);
    // Retorna reviews mock mesmo em caso de erro
    return c.json({ 
      reviews: [
        {
          id: 'mock-1',
          rating: 5,
          comment: 'Lugar incrível! A localização em Santa Teresa é perfeita, perto de tudo e com aquele charme boêmio que adoro.',
          userName: 'Maria Silva',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true
        },
        {
          id: 'mock-2',
          rating: 5,
          comment: 'Experiência maravilhosa! A equipe é super atenciosa e o ambiente é acolhedor.',
          userName: 'João Santos',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true
        },
        {
          id: 'mock-3',
          rating: 5,
          comment: 'Melhor custo-benefício do Rio! Conheci pessoas incríveis.',
          userName: 'Ana Costa',
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true
        }
      ]
    });
  }
});

// Rota para obter dados do usuário
app.get('/make-server-0cae32e3/user-profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    
    return c.json({ user: userData });
  } catch (error) {
    console.log('Erro ao buscar perfil:', error);
    return c.json({ error: 'Erro ao buscar perfil: ' + error.message }, 500);
  }
});

// ===== ROTAS ADMINISTRATIVAS =====

// Função helper para verificar se o usuário é admin
async function isUserAdmin(userId: string): Promise<boolean> {
  const userData = await kv.get(`user:${userId}`);
  return userData?.is_admin === true;
}

// Rota para obter todas as reservas (admin)
app.get('/make-server-0cae32e3/admin/all-reservations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    // Verificar se o usuário é admin
    const userIsAdmin = await isUserAdmin(user.id);
    if (!userIsAdmin) {
      return c.json({ error: 'Acesso negado - privilégios de administrador necessários' }, 403);
    }

    const allReservations = await kv.getByPrefix('reservation:');
    const sortedReservations = allReservations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ reservations: sortedReservations });
  } catch (error) {
    console.log('Erro ao buscar reservas:', error);
    return c.json({ error: 'Erro ao buscar reservas: ' + error.message }, 500);
  }
});

// Rota para obter todos os clientes (admin)
app.get('/make-server-0cae32e3/admin/all-clients', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    // Verificar se o usuário é admin
    const userIsAdmin = await isUserAdmin(user.id);
    if (!userIsAdmin) {
      return c.json({ error: 'Acesso negado - privilégios de administrador necessários' }, 403);
    }

    const allClients = await kv.getByPrefix('user:');
    const sortedClients = allClients.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ clients: sortedClients });
  } catch (error) {
    console.log('Erro ao buscar clientes:', error);
    return c.json({ error: 'Erro ao buscar clientes: ' + error.message }, 500);
  }
});

// Rota para fazer check-in (admin)
app.post('/make-server-0cae32e3/admin/check-in', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    // Verificar se o usuário é admin
    const userIsAdmin = await isUserAdmin(user.id);
    if (!userIsAdmin) {
      return c.json({ error: 'Acesso negado - privilégios de administrador necessários' }, 403);
    }

    const body = await c.req.json();
    const { reservationId } = body;

    const reservation = await kv.get(`reservation:${reservationId}`);
    
    if (!reservation) {
      return c.json({ error: 'Reserva não encontrada' }, 404);
    }

    const updatedReservation = {
      ...reservation,
      checkedIn: true,
      checkInTime: new Date().toISOString(),
    };

    await kv.set(`reservation:${reservationId}`, updatedReservation);

    console.log(`Check-in realizado para reserva ${reservationId}`);

    return c.json({ success: true, reservation: updatedReservation });
  } catch (error) {
    console.log('Erro ao fazer check-in:', error);
    return c.json({ error: 'Erro ao fazer check-in: ' + error.message }, 500);
  }
});

// Rota para fazer check-out (admin)
app.post('/make-server-0cae32e3/admin/check-out', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    // Verificar se o usuário é admin
    const userIsAdmin = await isUserAdmin(user.id);
    if (!userIsAdmin) {
      return c.json({ error: 'Acesso negado - privilégios de administrador necessários' }, 403);
    }

    const body = await c.req.json();
    const { reservationId } = body;

    const reservation = await kv.get(`reservation:${reservationId}`);
    
    if (!reservation) {
      return c.json({ error: 'Reserva não encontrada' }, 404);
    }

    const updatedReservation = {
      ...reservation,
      checkedOut: true,
      checkOutTime: new Date().toISOString(),
      status: 'completed',
    };

    await kv.set(`reservation:${reservationId}`, updatedReservation);

    console.log(`Check-out realizado para reserva ${reservationId}`);

    return c.json({ success: true, reservation: updatedReservation });
  } catch (error) {
    console.log('Erro ao fazer check-out:', error);
    return c.json({ error: 'Erro ao fazer check-out: ' + error.message }, 500);
  }
});

// Rota para aprovar/rejeitar cancelamento (admin)
app.post('/make-server-0cae32e3/admin/approve-cancellation', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    // Verificar se o usuário é admin
    const userIsAdmin = await isUserAdmin(user.id);
    if (!userIsAdmin) {
      return c.json({ error: 'Acesso negado - privilégios de administrador necessários' }, 403);
    }

    const body = await c.req.json();
    const { reservationId, approved } = body;

    const reservation = await kv.get(`reservation:${reservationId}`);
    
    if (!reservation) {
      return c.json({ error: 'Reserva não encontrada' }, 404);
    }

    const updatedReservation = {
      ...reservation,
      cancellationApproved: approved,
      cancellationApprovedAt: new Date().toISOString(),
      requiresApproval: false,
    };

    await kv.set(`reservation:${reservationId}`, updatedReservation);

    console.log(`Cancelamento ${approved ? 'aprovado' : 'rejeitado'} para reserva ${reservationId}`);

    return c.json({ success: true, reservation: updatedReservation });
  } catch (error) {
    console.log('Erro ao processar aprovação:', error);
    return c.json({ error: 'Erro ao processar aprovação: ' + error.message }, 500);
  }
});

// Rota super-admin para tornar um usuário admin (PROTEGIDA)
// IMPORTANTE: Esta rota só deve ser usada pelo proprietário
app.post('/make-server-0cae32e3/super-admin/make-user-admin', async (c) => {
  try {
    const body = await c.req.json();
    const { email, secret } = body;

    // IMPORTANTE: Altere este segredo para algo único e seguro
    const SUPER_ADMIN_SECRET = 'SANTA_TERESA_2025_ADMIN_SECRET';

    if (secret !== SUPER_ADMIN_SECRET) {
      console.log('Tentativa de acesso não autorizado à rota super-admin');
      return c.json({ error: 'Não autorizado' }, 401);
    }

    if (!email) {
      return c.json({ error: 'Email é obrigatório' }, 400);
    }

    // Buscar usuário pelo email
    const allUsers = await kv.getByPrefix('user:');
    const targetUser = allUsers.find(u => u.email === email);

    if (!targetUser) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    // Atualizar usuário para admin
    const updatedUser = {
      ...targetUser,
      is_admin: true,
      adminGrantedAt: new Date().toISOString(),
    };

    await kv.set(`user:${targetUser.id}`, updatedUser);

    console.log(`Usuário ${email} agora é administrador`);

    return c.json({ 
      success: true, 
      message: `Usuário ${email} agora tem privilégios de administrador`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        is_admin: updatedUser.is_admin,
      }
    });
  } catch (error) {
    console.log('Erro ao conceder privilégios admin:', error);
    return c.json({ error: 'Erro ao conceder privilégios admin: ' + error.message }, 500);
  }
});

// Rota super-admin para remover privilégios de admin (PROTEGIDA)
app.post('/make-server-0cae32e3/super-admin/remove-admin', async (c) => {
  try {
    const body = await c.req.json();
    const { email, secret } = body;

    const SUPER_ADMIN_SECRET = 'SANTA_TERESA_2025_ADMIN_SECRET';

    if (secret !== SUPER_ADMIN_SECRET) {
      console.log('Tentativa de acesso não autorizado à rota super-admin');
      return c.json({ error: 'Não autorizado' }, 401);
    }

    if (!email) {
      return c.json({ error: 'Email é obrigatório' }, 400);
    }

    // Buscar usuário pelo email
    const allUsers = await kv.getByPrefix('user:');
    const targetUser = allUsers.find(u => u.email === email);

    if (!targetUser) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    // Remover privilégios de admin
    const updatedUser = {
      ...targetUser,
      is_admin: false,
      adminRevokedAt: new Date().toISOString(),
    };

    await kv.set(`user:${targetUser.id}`, updatedUser);

    console.log(`Privilégios de administrador removidos de ${email}`);

    return c.json({ 
      success: true, 
      message: `Privilégios de administrador removidos de ${email}`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        is_admin: updatedUser.is_admin,
      }
    });
  } catch (error) {
    console.log('Erro ao remover privilégios admin:', error);
    return c.json({ error: 'Erro ao remover privilégios admin: ' + error.message }, 500);
  }
});

Deno.serve(app.fetch);