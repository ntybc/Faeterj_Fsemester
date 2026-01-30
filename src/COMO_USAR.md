# Como Usar os Dois Aplicativos

## 🏠 Site Principal vs 🔐 Painel Admin

Este projeto possui **duas interfaces separadas**:

---

## 1️⃣ SITE PRINCIPAL (Para Clientes)

### Arquivo: `App.tsx`

Este é o site público que os hóspedes acessam para:
- Ver informações do albergue
- Conhecer os quartos
- Fazer reservas
- Gerenciar suas próprias reservas
- Deixar avaliações

### Como está configurado atualmente:
O `App.tsx` é o arquivo de entrada padrão do projeto.

---

## 2️⃣ PAINEL ADMINISTRATIVO (Para Gestão)

### Arquivo: `AdminApp.tsx`

Este é o painel completo de administração com:
- Dashboard com todas as estatísticas
- Visão de todas as reservas do sistema
- Gerenciamento de check-in/check-out
- Lista de todos os clientes
- Monitoramento de quartos
- Relatórios financeiros
- Central de notificações

### Como acessar:

Para usar o painel administrativo, você precisa configurar uma rota separada. 

#### Opção A: Modificar temporariamente o ponto de entrada

**Para testar o painel admin agora:**

1. Renomeie os arquivos:
   ```
   App.tsx → AppCliente.tsx
   AdminApp.tsx → App.tsx
   ```

2. O painel admin agora será carregado como página principal

3. Para voltar ao site normal, reverta:
   ```
   App.tsx → AdminApp.tsx
   AppCliente.tsx → App.tsx
   ```

#### Opção B: Configurar duas rotas (Recomendado para produção)

Se você estiver usando um router (como React Router), configure:

```typescript
// main.tsx ou index.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminApp from './AdminApp';

function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Então:
- `https://seusite.com/` → Site do cliente
- `https://seusite.com/admin` → Painel administrativo

---

## 🔑 Login no Painel Admin

1. Acesse o AdminApp
2. Faça login com qualquer conta cadastrada
3. O painel completo será exibido

**Nota**: Por enquanto, qualquer usuário logado pode acessar o painel admin. Em produção, você deve adicionar verificação de permissão (role: admin).

---

## 📊 Funcionalidades do Painel Admin

Conforme o diagrama de caso de uso fornecido:

### Dashboard
- Total de reservas
- Reservas ativas
- Receita total
- Taxa de ocupação
- Check-ins pendentes hoje

### Aba Reservas
- Lista completa de todas as reservas
- Filtros e busca
- Visualizar detalhes de cada reserva

### Aba Check-in/Check-out
- Lista de check-ins do dia
- Lista de check-outs do dia
- Botões de ação rápida

### Aba Clientes
- Todos os perfis cadastrados
- Informações completas (nome, email, telefone, CPF, etc.)

### Aba Quartos
- Status de todos os 9 quartos (A1-A9)
- Camas ocupadas vs disponíveis
- Taxa de ocupação por quarto

### Aba Finanças
- Receita confirmada
- Ticket médio
- Transações recentes

### Aba Notificações
- Cancelamentos que precisam de aprovação
- Check-ins pendentes
- Alertas importantes
- Botões para aprovar/rejeitar

---

## 🎨 Design Consistente

Ambas as interfaces usam o mesmo design boêmio retrô:
- Paleta de cores de Santa Teresa
- Tipografia Playfair Display + Poppins
- Componentes shadcn/ui
- Estilo cohesivo e profissional

---

## 📧 Notificações

O sistema envia notificações automáticas para:
- **pauloaminegirl@gmail.com** (proprietário)
  - Novas reservas
  - Cancelamentos pendentes
  - Alertas importantes

---

## 🚀 Próximos Passos

### Para produção:
1. Configure rotas separadas (opção B acima)
2. Implemente sistema de roles/permissões
3. Configure email real para notificações
4. Ajuste regras de acesso ao painel admin
5. Configure domínio/subdomínio para o admin

### Melhorias futuras:
- Adicionar gráficos de ocupação
- Exportar relatórios em PDF
- Integração com gateway de pagamento
- Sistema de backup automático
- Logs de auditoria

---

## 💡 Dica Rápida

**Para testar agora:**

1. Crie uma conta no site principal
2. Faça uma reserva de teste
3. Mude para o AdminApp
4. Veja a reserva aparecer no painel admin
5. Teste fazer check-in da reserva
6. Teste cancelar e aprovar cancelamento

Tudo está integrado no mesmo backend Supabase!

---

## 📞 Contato

Dúvidas sobre o sistema:
- Email: andre.neves@faeterj-rio.edu.br
- Tel: (21) 97043-9701
