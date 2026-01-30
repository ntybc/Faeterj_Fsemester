# Painel Administrativo - Albergue Santa Teresa

## Como Acessar

O painel administrativo está disponível através do arquivo `AdminApp.tsx` e pode ser configurado para funcionar em uma rota separada.

### Acesso via URL

Para acessar o painel administrativo, você precisa:

1. **Fazer login com credenciais de administrador**
   - Email: Qualquer email cadastrado no sistema
   - Senha: A senha correspondente ao email

2. **Acessar através de AdminApp.tsx**
   - O arquivo `AdminApp.tsx` contém a página de login administrativa
   - Após o login, o painel completo é exibido

## Funcionalidades do Painel Administrativo

Conforme o diagrama de caso de uso fornecido, o administrador tem acesso a:

### 1. Dashboard
- **Visão geral do sistema**
  - Total de reservas
  - Reservas ativas
  - Receita total
  - Taxa de ocupação
  - Check-ins pendentes
  - Reservas canceladas

### 2. Gerenciamento de Reservas
- **Visualizar todas as reservas** do sistema
- **Criar novas reservas** manualmente
- **Editar reservas existentes**
- **Cancelar reservas** com cálculo automático de multas
- **Filtrar** por status, data, quarto, etc.

### 3. Check-in / Check-out
- **Registrar check-in** de hóspedes
  - Lista de check-ins pendentes para o dia
  - Registro de horário de entrada
  
- **Registrar check-out** de hóspedes
  - Lista de check-outs do dia
  - Registro de horário de saída
  - Marcação de reserva como concluída

### 4. Gerenciamento de Clientes
- **Visualizar todos os perfis de clientes**
  - Nome, email, telefone
  - CPF, nacionalidade
  - Data de cadastro
  - Histórico de reservas

### 5. Gerenciamento de Quartos
- **Visualização do status de todos os quartos** (A1-A9)
  - Capacidade total
  - Camas ocupadas
  - Camas disponíveis
  - Taxa de ocupação por quarto
  - Tipo de quarto (privativo/compartilhado/grande)

### 6. Relatórios Financeiros
- **Resumo financeiro completo**
  - Receita confirmada
  - Número de reservas canceladas
  - Ticket médio por reserva
  
- **Transações recentes**
  - Histórico de pagamentos
  - Status de cada transação
  - Detalhes de reservas pagas

### 7. Notificações Administrativas
- **Alertas importantes que requerem ação**
  
  #### Cancelamentos Pendentes
  - Pedidos de cancelamento que necessitam aprovação
  - Cálculo automático de multas (50% se cancelado com menos de 3 dias)
  - Opções para aprovar ou rejeitar reembolso
  
  #### Check-ins do Dia
  - Lista de hóspedes que devem fazer check-in hoje
  - Botão rápido para registrar entrada
  
  #### Notificações para o Proprietário
  - Email automático para pauloaminegirl@gmail.com
  - Alertas de cancelamentos que requerem aprovação
  - Resumos de atividades importantes

### 8. Sistema de Pagamento
- **Integrado ao fluxo de reservas**
  - Status de pagamento em cada reserva
  - Marcação automática como "pago" após confirmação
  - Histórico de transações

### 9. Gerenciar Conteúdo do Site
- **Parceiros** (futuro)
  - Adicionar/editar/remover parceiros
  - Upload de logos
  
- **Gerenciar Albergue** (futuro)
  - Configurações gerais
  - Preços por cama
  - Regras de cancelamento

## Regras de Negócio Implementadas

### Cancelamento de Reservas
- **3 ou mais dias antes do check-in**: Reembolso de 100% (sem custos)
- **Menos de 3 dias antes do check-in**: Multa de 50% do valor total
- **Cancelamentos com multa**: Requerem aprovação manual do administrador

### Notificações Automáticas
- O sistema gera notificações automáticas para o email **pauloaminegirl@gmail.com** em casos de:
  - Cancelamentos que requerem aprovação
  - Novas reservas confirmadas
  - Check-ins pendentes do dia

### Preços
- **Preço por cama**: R$ 80,00 por noite
- **Quarto inteiro**: Equivalente a 3 camas (R$ 240,00 por noite)

### Quartos
- **A1, A2, A3**: Privativos com 4 camas e banheiro privativo
- **A4, A5, A6**: Compartilhados com 8 camas
- **A7, A8, A9**: Grandes com 12 camas e banheiro privativo

## Contato Administrativo

- **Email**: andre.neves@faeterj-rio.edu.br
- **Telefone**: (21) 97043-9701
- **Notificações**: pauloaminegirl@gmail.com

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase Edge Functions
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase KV Store
- **Design**: Tema boêmio retrô com paleta de cores de Santa Teresa
