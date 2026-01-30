# Guia de Configuração - Albergue Santa Teresa

Este projeto contém **dois aplicativos separados**:

## 1. Site Principal (App.tsx)
**Acesso dos Clientes/Hóspedes**

### Funcionalidades:
- Visualização do albergue e seus serviços
- Galeria de fotos
- Informações sobre Santa Teresa
- Sistema de autenticação (login/cadastro)
- Fazer reservas online
- Painel do cliente com histórico de reservas
- Cancelamento de reservas
- Sistema de avaliações

### Como usar:
1. O arquivo `App.tsx` é o **ponto de entrada principal**
2. Os clientes acessam o site normalmente
3. Podem se cadastrar, fazer login e reservar quartos
4. Acessam seu painel pessoal através do botão "Login" no header

---

## 2. Painel Administrativo (AdminApp.tsx)
**Acesso Exclusivo para Administradores**

### Funcionalidades:
- Dashboard com visão geral completa
- Gerenciamento de todas as reservas
- Check-in e check-out de hóspedes
- Visualização de todos os clientes
- Monitoramento de quartos em tempo real
- Relatórios financeiros
- Sistema de notificações
- Aprovação de cancelamentos

### Como usar:
1. O arquivo `AdminApp.tsx` é uma **aplicação separada**
2. Acesso através de login administrativo
3. Interface exclusiva para gerenciamento completo do albergue

---

## Estrutura de Arquivos

```
/
├── App.tsx                    # Site principal (clientes)
├── AdminApp.tsx               # Painel administrativo
├── components/
│   ├── Header.tsx            # Cabeçalho do site
│   ├── Hero.tsx              # Seção hero
│   ├── ImageGallery.tsx      # Galeria de fotos
│   ├── Partners.tsx          # Parceiros
│   ├── About.tsx             # Sobre
│   ├── Services.tsx          # Serviços
│   ├── Reviews.tsx           # Avaliações
│   ├── Contact.tsx           # Contato
│   ├── Footer.tsx            # Rodapé
│   ├── AuthModal.tsx         # Modal de autenticação
│   ├── RoomsGallery.tsx      # Galeria de quartos
│   ├── ReservationModal.tsx  # Modal de reservas
│   ├── ClientDashboard.tsx   # Painel do cliente
│   └── AdminPanel.tsx        # Painel administrativo completo
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx     # Backend API
│           └── kv_store.tsx  # Armazenamento de dados
├── utils/
│   └── supabase/
│       ├── client.ts         # Cliente Supabase
│       └── info.tsx          # Configurações
└── styles/
    └── globals.css           # Estilos globais
```

---

## Configuração de Rotas (Sugestão)

Para usar ambos os aplicativos, você pode configurar rotas diferentes:

### Opção 1: Rotas Separadas
```
https://seusite.com/           → App.tsx (site principal)
https://seusite.com/admin      → AdminApp.tsx (painel admin)
```

### Opção 2: Subdomínios
```
https://albergue.seusite.com/  → App.tsx (site principal)
https://admin.seusite.com/     → AdminApp.tsx (painel admin)
```

---

## Credenciais de Acesso

### Site Principal (Clientes)
- Qualquer pessoa pode se cadastrar
- Cadastro requer: nome, email, senha
- Dados opcionais: telefone, CPF, nacionalidade

### Painel Administrativo
- Acesso restrito a administradores
- Login com credenciais autorizadas
- Email de notificações: pauloaminegirl@gmail.com
- Suporte: andre.neves@faeterj-rio.edu.br

---

## Fluxo de Uso

### Para Clientes:
1. Acessa o site (App.tsx)
2. Navega pelas seções
3. Cria uma conta
4. Faz uma reserva
5. Acessa seu painel pessoal
6. Pode cancelar reservas (sujeito a regras)
7. Pode deixar avaliações após a estadia

### Para Administradores:
1. Acessa o painel admin (AdminApp.tsx)
2. Faz login com credenciais administrativas
3. Visualiza dashboard com estatísticas
4. Gerencia todas as reservas
5. Faz check-in/check-out de hóspedes
6. Aprova ou rejeita cancelamentos
7. Visualiza relatórios financeiros
8. Monitora notificações importantes

---

## Design System

Ambos os aplicativos compartilham o mesmo design boêmio retrô:

### Paleta de Cores:
- **Amarelo-ouro**: #F5B700 (destaques, botões primários)
- **Verde-musgo**: #4B6B50 (elementos secundários)
- **Azul-petróleo**: #2C546B (textos importantes, header admin)
- **Terracota**: #B65C39 (botões de ação, alertas)
- **Branco-antigo**: #F3E9D2 (fundo principal)
- **Cinza-pedra**: #7E7E7E (textos secundários)

### Tipografia:
- **Títulos**: Playfair Display (serif, elegante)
- **Corpo**: Poppins (sans-serif, moderna)

---

## Backend (Supabase)

### Rotas Públicas:
- `GET /rooms` - Lista de quartos
- `POST /availability` - Verificar disponibilidade
- `POST /signup` - Cadastro de usuários
- `GET /reviews` - Avaliações públicas

### Rotas Autenticadas (Cliente):
- `GET /my-reservations` - Minhas reservas
- `POST /reservations` - Criar reserva
- `POST /cancel-reservation` - Cancelar reserva
- `POST /reviews` - Adicionar avaliação
- `GET /user-profile` - Perfil do usuário

### Rotas Administrativas:
- `GET /admin/all-reservations` - Todas as reservas
- `GET /admin/all-clients` - Todos os clientes
- `POST /admin/check-in` - Registrar check-in
- `POST /admin/check-out` - Registrar check-out
- `POST /admin/approve-cancellation` - Aprovar cancelamento

---

## Integração Futura

### Possíveis Melhorias:
1. **Sistema de Permissões**
   - Roles de usuário (cliente, admin, super-admin)
   - Controle de acesso granular

2. **Gerenciamento de Conteúdo**
   - CMS para editar textos do site
   - Upload de imagens da galeria
   - Gerenciar parceiros

3. **Notificações em Tempo Real**
   - WebSocket para atualizações instantâneas
   - Notificações push para mobile

4. **Relatórios Avançados**
   - Exportação para PDF/Excel
   - Gráficos de ocupação por período
   - Análise de receita

5. **Integração com Pagamento**
   - Stripe, PayPal, ou gateway brasileiro
   - Pagamento por Pix
   - Boleto bancário

---

## Suporte

Para dúvidas ou suporte técnico:
- **Email**: andre.neves@faeterj-rio.edu.br
- **Telefone**: (21) 97043-9701
