import { useState, useEffect } from 'react';
import { X, Users, Calendar, Home, FileText, Settings, DollarSign, Bell, CheckSquare, LogOut, TrendingUp, Bed, CreditCard, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { projectId } from '../utils/supabase/info';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
}

export function AdminPanel({ isOpen, onClose, accessToken }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reservations, setReservations] = useState<any[]>([]);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    totalReservations: 0,
    activeReservations: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    pendingCheckIns: 0,
    cancelledReservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Carregar todas as reservas
      const reservationsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/admin/all-reservations`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const reservationsData = await reservationsRes.json();
      
      if (reservationsData.reservations) {
        setReservations(reservationsData.reservations);
        
        // Calcular estatísticas
        const total = reservationsData.reservations.length;
        const active = reservationsData.reservations.filter((r: any) => r.status === 'confirmed').length;
        const cancelled = reservationsData.reservations.filter((r: any) => r.status === 'cancelled').length;
        const revenue = reservationsData.reservations
          .filter((r: any) => r.status === 'confirmed')
          .reduce((acc: number, r: any) => acc + r.totalAmount, 0);
        
        const today = new Date();
        const pendingCheckIns = reservationsData.reservations.filter((r: any) => {
          const checkIn = new Date(r.checkIn);
          return r.status === 'confirmed' && 
                 checkIn.toDateString() === today.toDateString() &&
                 !r.checkedIn;
        }).length;

        setStatistics({
          totalReservations: total,
          activeReservations: active,
          totalRevenue: revenue,
          occupancyRate: (active / 9) * 100, // 9 quartos no total
          pendingCheckIns,
          cancelledReservations: cancelled,
        });

        // Gerar notificações
        const notifs: any[] = [];
        
        // Notificações de cancelamento pendente
        reservationsData.reservations
          .filter((r: any) => r.status === 'cancelled' && r.requiresApproval)
          .forEach((r: any) => {
            notifs.push({
              id: `cancel-${r.id}`,
              type: 'cancellation',
              message: `Pedido de cancelamento requer aprovação - Reserva ${r.id}`,
              severity: 'high',
              reservation: r,
            });
          });

        // Notificações de check-in hoje
        reservationsData.reservations
          .filter((r: any) => {
            const checkIn = new Date(r.checkIn);
            return r.status === 'confirmed' && 
                   checkIn.toDateString() === today.toDateString() &&
                   !r.checkedIn;
          })
          .forEach((r: any) => {
            notifs.push({
              id: `checkin-${r.id}`,
              type: 'checkin',
              message: `Check-in pendente para hoje - Quarto ${r.roomId}`,
              severity: 'medium',
              reservation: r,
            });
          });

        setNotifications(notifs);
      }

      // Carregar todos os clientes
      const clientsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/admin/all-clients`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const clientsData = await clientsRes.json();
      
      if (clientsData.clients) {
        setAllClients(clientsData.clients);
      }
    } catch (error) {
      console.error('Erro ao carregar dados administrativos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (reservationId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/admin/check-in`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reservationId }),
        }
      );

      if (response.ok) {
        loadAdminData();
      }
    } catch (error) {
      console.error('Erro ao fazer check-in:', error);
    }
  };

  const handleCheckOut = async (reservationId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/admin/check-out`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reservationId }),
        }
      );

      if (response.ok) {
        loadAdminData();
      }
    } catch (error) {
      console.error('Erro ao fazer check-out:', error);
    }
  };

  const handleApproveCancellation = async (reservationId: string, approved: boolean) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/admin/approve-cancellation`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reservationId, approved }),
        }
      );

      if (response.ok) {
        loadAdminData();
      }
    } catch (error) {
      console.error('Erro ao aprovar cancelamento:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      confirmed: 'default',
      cancelled: 'destructive',
      completed: 'secondary',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] bg-[#F3E9D2] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#2C546B] text-white px-8 py-6 flex items-center justify-between border-b-4 border-[#F5B700]">
          <div className="flex items-center gap-4">
            <Home className="w-8 h-8 text-[#F5B700]" />
            <div>
              <h2 className="font-['Playfair_Display']">Painel Administrativo</h2>
              <p className="text-sm opacity-90">Albergue Santa Teresa</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7 mb-8 bg-[#4B6B50]/20">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#F5B700]">
                <TrendingUp className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="reservations" className="data-[state=active]:bg-[#F5B700]">
                <Calendar className="w-4 h-4 mr-2" />
                Reservas
              </TabsTrigger>
              <TabsTrigger value="checkin" className="data-[state=active]:bg-[#F5B700]">
                <CheckSquare className="w-4 h-4 mr-2" />
                Check-in/out
              </TabsTrigger>
              <TabsTrigger value="clients" className="data-[state=active]:bg-[#F5B700]">
                <Users className="w-4 h-4 mr-2" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="rooms" className="data-[state=active]:bg-[#F5B700]">
                <Bed className="w-4 h-4 mr-2" />
                Quartos
              </TabsTrigger>
              <TabsTrigger value="finances" className="data-[state=active]:bg-[#F5B700]">
                <DollarSign className="w-4 h-4 mr-2" />
                Finanças
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-[#F5B700]">
                <Bell className="w-4 h-4 mr-2" />
                Notificações ({notifications.length})
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-[#4B6B50]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Total de Reservas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-['Playfair_Display'] text-[#2C546B]">
                      {statistics.totalReservations}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#4B6B50]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Reservas Ativas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-['Playfair_Display'] text-[#4B6B50]">
                      {statistics.activeReservations}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#4B6B50]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Receita Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-['Playfair_Display'] text-[#B65C39]">
                      R$ {statistics.totalRevenue.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#4B6B50]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Taxa de Ocupação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-['Playfair_Display'] text-[#F5B700]">
                      {statistics.occupancyRate.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-[#4B6B50]">
                  <CardHeader>
                    <CardTitle>Check-ins Pendentes Hoje</CardTitle>
                    <CardDescription>Hóspedes que devem fazer check-in hoje</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reservations
                        .filter((r) => {
                          const checkIn = new Date(r.checkIn);
                          const today = new Date();
                          return r.status === 'confirmed' && 
                                 checkIn.toDateString() === today.toDateString() &&
                                 !r.checkedIn;
                        })
                        .slice(0, 5)
                        .map((reservation) => (
                          <div key={reservation.id} className="flex items-center justify-between p-3 bg-[#F3E9D2] rounded-lg">
                            <div>
                              <p className="font-medium">Quarto {reservation.roomId}</p>
                              <p className="text-sm text-[#7E7E7E]">{reservation.bedsReserved} cama(s)</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleCheckIn(reservation.id)}
                              className="bg-[#4B6B50] hover:bg-[#4B6B50]/90"
                            >
                              Check-in
                            </Button>
                          </div>
                        ))}
                      {statistics.pendingCheckIns === 0 && (
                        <p className="text-center text-[#7E7E7E] py-8">Nenhum check-in pendente para hoje</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#4B6B50]">
                  <CardHeader>
                    <CardTitle>Notificações Recentes</CardTitle>
                    <CardDescription>Ações que requerem atenção</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg ${
                            notification.severity === 'high' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                          }`}
                        >
                          <p className="text-sm">{notification.message}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <p className="text-center text-[#7E7E7E] py-8">Nenhuma notificação pendente</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reservations Tab */}
            <TabsContent value="reservations">
              <Card className="bg-white border-[#4B6B50]">
                <CardHeader>
                  <CardTitle>Todas as Reservas</CardTitle>
                  <CardDescription>Gerenciar todas as reservas do albergue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Quarto</TableHead>
                          <TableHead>Check-in</TableHead>
                          <TableHead>Check-out</TableHead>
                          <TableHead>Camas</TableHead>
                          <TableHead>Valor Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations.map((reservation) => (
                          <TableRow key={reservation.id}>
                            <TableCell className="font-mono text-xs">{reservation.id.substring(0, 8)}...</TableCell>
                            <TableCell>{reservation.roomId}</TableCell>
                            <TableCell>{new Date(reservation.checkIn).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>{new Date(reservation.checkOut).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>{reservation.bedsReserved}</TableCell>
                            <TableCell>R$ {reservation.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedReservation(reservation);
                                  setShowEditModal(true);
                                }}
                              >
                                Detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Check-in/out Tab */}
            <TabsContent value="checkin">
              <Card className="bg-white border-[#4B6B50]">
                <CardHeader>
                  <CardTitle>Gerenciar Check-in e Check-out</CardTitle>
                  <CardDescription>Registrar entrada e saída de hóspedes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-['Playfair_Display'] text-xl mb-4 text-[#2C546B]">Check-ins de Hoje</h3>
                      <div className="grid gap-4">
                        {reservations
                          .filter((r) => {
                            const checkIn = new Date(r.checkIn);
                            const today = new Date();
                            return r.status === 'confirmed' && 
                                   checkIn.toDateString() === today.toDateString();
                          })
                          .map((reservation) => (
                            <div key={reservation.id} className="flex items-center justify-between p-4 bg-[#F3E9D2] rounded-lg border-l-4 border-[#4B6B50]">
                              <div className="flex-1">
                                <p className="font-medium">Quarto {reservation.roomId}</p>
                                <p className="text-sm text-[#7E7E7E]">
                                  {reservation.bedsReserved} cama(s) • R$ {reservation.totalAmount.toFixed(2)}
                                </p>
                              </div>
                              {reservation.checkedIn ? (
                                <Badge variant="secondary">✓ Check-in realizado</Badge>
                              ) : (
                                <Button
                                  onClick={() => handleCheckIn(reservation.id)}
                                  className="bg-[#4B6B50] hover:bg-[#4B6B50]/90"
                                >
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Fazer Check-in
                                </Button>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-['Playfair_Display'] text-xl mb-4 text-[#2C546B]">Check-outs de Hoje</h3>
                      <div className="grid gap-4">
                        {reservations
                          .filter((r) => {
                            const checkOut = new Date(r.checkOut);
                            const today = new Date();
                            return r.status === 'confirmed' && 
                                   checkOut.toDateString() === today.toDateString() &&
                                   r.checkedIn;
                          })
                          .map((reservation) => (
                            <div key={reservation.id} className="flex items-center justify-between p-4 bg-[#F3E9D2] rounded-lg border-l-4 border-[#B65C39]">
                              <div className="flex-1">
                                <p className="font-medium">Quarto {reservation.roomId}</p>
                                <p className="text-sm text-[#7E7E7E]">
                                  {reservation.bedsReserved} cama(s) • R$ {reservation.totalAmount.toFixed(2)}
                                </p>
                              </div>
                              {reservation.checkedOut ? (
                                <Badge variant="secondary">✓ Check-out realizado</Badge>
                              ) : (
                                <Button
                                  onClick={() => handleCheckOut(reservation.id)}
                                  className="bg-[#B65C39] hover:bg-[#B65C39]/90"
                                >
                                  Fazer Check-out
                                </Button>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients">
              <Card className="bg-white border-[#4B6B50]">
                <CardHeader>
                  <CardTitle>Perfis de Clientes</CardTitle>
                  <CardDescription>Visualizar e gerenciar dados dos hóspedes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Nacionalidade</TableHead>
                          <TableHead>Data de Cadastro</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.phone || '-'}</TableCell>
                            <TableCell>{client.cpf || '-'}</TableCell>
                            <TableCell>{client.nationality || '-'}</TableCell>
                            <TableCell>{new Date(client.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rooms Tab */}
            <TabsContent value="rooms">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'].map((roomId) => {
                  const roomReservations = reservations.filter(
                    (r) => r.roomId === roomId && r.status === 'confirmed'
                  );
                  const capacity = roomId <= 'A3' ? 4 : roomId <= 'A6' ? 8 : 12;
                  const occupied = roomReservations.reduce((acc, r) => acc + r.bedsReserved, 0);
                  const available = capacity - occupied;

                  return (
                    <Card key={roomId} className="bg-white border-[#4B6B50]">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Quarto {roomId}
                          <Badge variant={available > 0 ? 'default' : 'destructive'}>
                            {available > 0 ? 'Disponível' : 'Lotado'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Capacidade: {capacity} camas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Ocupadas:</span>
                            <span className="font-medium">{occupied}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Disponíveis:</span>
                            <span className="font-medium text-[#4B6B50]">{available}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                            <div
                              className="bg-[#4B6B50] h-2 rounded-full"
                              style={{ width: `${(occupied / capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Finances Tab */}
            <TabsContent value="finances">
              <div className="grid gap-6">
                <Card className="bg-white border-[#4B6B50]">
                  <CardHeader>
                    <CardTitle>Resumo Financeiro</CardTitle>
                    <CardDescription>Visão geral das finanças do albergue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-[#F3E9D2] rounded-lg">
                        <p className="text-sm text-[#7E7E7E] mb-2">Receita Confirmada</p>
                        <p className="text-3xl font-['Playfair_Display'] text-[#4B6B50]">
                          R$ {statistics.totalRevenue.toFixed(2)}
                        </p>
                      </div>
                      <div className="p-6 bg-[#F3E9D2] rounded-lg">
                        <p className="text-sm text-[#7E7E7E] mb-2">Reservas Canceladas</p>
                        <p className="text-3xl font-['Playfair_Display'] text-[#B65C39]">
                          {statistics.cancelledReservations}
                        </p>
                      </div>
                      <div className="p-6 bg-[#F3E9D2] rounded-lg">
                        <p className="text-sm text-[#7E7E7E] mb-2">Ticket Médio</p>
                        <p className="text-3xl font-['Playfair_Display'] text-[#2C546B]">
                          R$ {statistics.activeReservations > 0 
                            ? (statistics.totalRevenue / statistics.activeReservations).toFixed(2) 
                            : '0.00'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#4B6B50]">
                  <CardHeader>
                    <CardTitle>Transações Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Reserva ID</TableHead>
                          <TableHead>Quarto</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status Pagamento</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations
                          .filter((r) => r.status === 'confirmed')
                          .slice(0, 10)
                          .map((reservation) => (
                            <TableRow key={reservation.id}>
                              <TableCell>{new Date(reservation.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell className="font-mono text-xs">{reservation.id.substring(0, 8)}...</TableCell>
                              <TableCell>{reservation.roomId}</TableCell>
                              <TableCell className="text-[#4B6B50]">R$ {reservation.totalAmount.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge variant="default">Pago</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="bg-white border-[#4B6B50]">
                <CardHeader>
                  <CardTitle>Notificações Administrativas</CardTitle>
                  <CardDescription>Ações que requerem sua atenção</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-6 rounded-lg border-l-4 ${
                          notification.severity === 'high' 
                            ? 'bg-red-50 border-red-500' 
                            : 'bg-yellow-50 border-yellow-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium mb-2">{notification.message}</p>
                            {notification.type === 'cancellation' && (
                              <div className="mt-4 space-y-2">
                                <p className="text-sm text-[#7E7E7E]">
                                  Reembolso: {notification.reservation.refundPercentage}% 
                                  (R$ {notification.reservation.refundAmount?.toFixed(2)})
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveCancellation(notification.reservation.id, true)}
                                    className="bg-[#4B6B50] hover:bg-[#4B6B50]/90"
                                  >
                                    Aprovar Reembolso
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleApproveCancellation(notification.reservation.id, false)}
                                  >
                                    Rejeitar
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="text-center py-12">
                        <Bell className="w-16 h-16 mx-auto text-[#7E7E7E] opacity-50 mb-4" />
                        <p className="text-[#7E7E7E]">Nenhuma notificação pendente</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Reservation Modal */}
      {showEditModal && selectedReservation && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="bg-[#F3E9D2] max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-['Playfair_Display']">Detalhes da Reserva</DialogTitle>
              <DialogDescription>Informações completas da reserva</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID da Reserva</Label>
                  <p className="font-mono text-sm mt-1">{selectedReservation.id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedReservation.status)}</div>
                </div>
                <div>
                  <Label>Quarto</Label>
                  <p className="mt-1">{selectedReservation.roomId}</p>
                </div>
                <div>
                  <Label>Camas Reservadas</Label>
                  <p className="mt-1">{selectedReservation.bedsReserved}</p>
                </div>
                <div>
                  <Label>Check-in</Label>
                  <p className="mt-1">{new Date(selectedReservation.checkIn).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label>Check-out</Label>
                  <p className="mt-1">{new Date(selectedReservation.checkOut).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label>Noites</Label>
                  <p className="mt-1">{selectedReservation.nights}</p>
                </div>
                <div>
                  <Label>Valor Total</Label>
                  <p className="mt-1 text-[#4B6B50]">R$ {selectedReservation.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowEditModal(false)} variant="outline" className="flex-1">
                  Fechar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
