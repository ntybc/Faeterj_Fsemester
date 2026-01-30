# 🎯 Tutorial: Criar Primeiro Administrador

## Guia Visual Passo a Passo

### PASSO 1: Criar Conta no Site
```
1. Abra o site do Albergue Santa Teresa
2. Clique no botão "Primeiro Acesso"
3. Preencha o formulário:
   ┌─────────────────────────────────┐
   │ Nome: Paulo Almeida             │
   │ Email: pauloaminegirl@gmail.com │
   │ Senha: ********                 │
   │ Data Nascimento: 01/01/1980     │
   │ CPF: 123.456.789-00             │
   │ Nacionalidade: Brasileiro       │
   │ Telefone: (21) 99999-9999       │
   │                                 │
   │ [Enviar Foto do Documento]      │
   │ [Enviar Foto de Perfil]         │
   │                                 │
   │      [ Criar Conta ]            │
   └─────────────────────────────────┘
4. Clique em "Criar Conta"
5. Aguarde confirmação
```

### PASSO 2: Acessar Ferramenta Super Admin
```
Na barra de endereço do navegador:

ANTES:  http://localhost:3000
        ou
        https://seu-site.com

DEPOIS: http://localhost:3000#super-admin
        ou
        https://seu-site.com#super-admin

Pressione ENTER
```

Você verá esta tela:
```
┌─────────────────────────────────────────────────┐
│  🛡️  Ferramenta Super Admin                     │
│      Conceder ou remover privilégios            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ⚠️  ATENÇÃO: Esta ferramenta deve ser usada   │
│      apenas pelo proprietário do albergue       │
│                                                 │
│  Ação:                                          │
│  ┌─────────────┐  ┌──────────────┐             │
│  │ ✓ Conceder  │  │ ✗ Remover    │             │
│  │   Admin     │  │   Admin      │             │
│  └─────────────┘  └──────────────┘             │
│                                                 │
│  Email do Usuário:                              │
│  ┌───────────────────────────────────────────┐ │
│  │ pauloaminegirl@gmail.com                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Secret Key:                                    │
│  ┌───────────────────────────────────────────┐ │
│  │ ••••••••••••••••••••••••••••              │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [ Copiar Comando JavaScript ]                  │
│  [ Copiar Comando cURL ]                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### PASSO 3: Preencher Formulário
```
1. Email do Usuário: pauloaminegirl@gmail.com
2. Secret Key: SANTA_TERESA_2025_ADMIN_SECRET
3. Clique em "Copiar Comando JavaScript"
```

### PASSO 4: Abrir Console do Navegador
```
OPÇÃO A - Windows/Linux:
   Pressione: F12
   ou
   Pressione: Ctrl + Shift + J

OPÇÃO B - Mac:
   Pressione: Cmd + Option + J

Você verá algo assim:
┌─────────────────────────────────────────────┐
│ Elements  Console  Sources  Network  ...   │
├─────────────────────────────────────────────┤
│ >                                          │ ← Cole aqui
│                                             │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

### PASSO 5: Colar e Executar Comando
```
No console, você verá um cursor piscando.

1. Cole o comando (Ctrl+V ou Cmd+V)
2. Pressione ENTER

O comando será algo assim:
┌─────────────────────────────────────────────┐
│ > fetch('https://jdjeikzwybpbjqmlculs...   │
│                                             │
│   Promise {<pending>}                       │
│                                             │
│ ✅ Resultado: {                             │
│     success: true,                          │
│     message: "Usuário...tem privilégios"   │
│     user: {                                 │
│       id: "...",                            │
│       email: "pauloaminegirl@gmail.com",   │
│       is_admin: true                        │
│     }                                       │
│   }                                         │
└─────────────────────────────────────────────┘
```

### PASSO 6: Resultado Esperado

✅ **SUCESSO** - Você verá:
```json
{
  "success": true,
  "message": "Usuário pauloaminegirl@gmail.com agora tem privilégios de administrador",
  "user": {
    "id": "uuid-do-usuario",
    "email": "pauloaminegirl@gmail.com",
    "name": "Paulo Almeida",
    "is_admin": true  ← IMPORTANTE: deve ser true
  }
}
```

❌ **ERRO** - Se aparecer erro:
```javascript
// Erro: "Usuário não encontrado"
// → Crie a conta primeiro (Passo 1)

// Erro: "Não autorizado"
// → Verifique se o secret está correto

// Erro: "missing authorization header"
// → Use o método do Console (F12), não Postman
```

### PASSO 7: Logout e Login
```
1. No site, clique em "Sair"
   ┌──────────────────────┐
   │ Olá, Paulo     [Sair]│
   └──────────────────────┘

2. Clique em "Login"
3. Entre com suas credenciais:
   Email: pauloaminegirl@gmail.com
   Senha: sua_senha
```

### PASSO 8: Verificar Botão Admin
```
Após login, você verá:

┌──────────────────────────────────────────────┐
│ Santa Teresa  Home Sobre Serviços  Contato  │
│                                              │
│ Olá, Paulo  [🛡️ Painel Admin]  [Sair]       │ ← NOVO!
└──────────────────────────────────────────────┘
```

### PASSO 9: Acessar Painel Admin
```
1. Clique em "🛡️ Painel Admin"
2. Você será redirecionado para #admin
3. Verá o painel completo:

┌─────────────────────────────────────────────┐
│  PAINEL ADMINISTRATIVO                      │
│  Albergue Santa Teresa                      │
├─────────────────────────────────────────────┤
│                                             │
│  📊 Dashboard                               │
│  ├─ Reservas Hoje: 5                        │
│  ├─ Check-ins Pendentes: 2                  │
│  ├─ Ocupação: 67%                           │
│  └─ Receita Mês: R$ 12.450,00               │
│                                             │
│  📅 Reservas  👥 Clientes  🏠 Quartos       │
│  💰 Finanças  🔔 Notificações              │
│                                             │
└─────────────────────────────────────────────┘
```

## 🎉 Pronto! Você é Admin!

Agora você tem acesso completo a:
- ✅ Dashboard com estatísticas
- ✅ Gerenciar reservas
- ✅ Check-in/Check-out
- ✅ Cadastro de clientes
- ✅ Controle de quartos
- ✅ Relatórios financeiros
- ✅ Notificações

## 🔄 Comandos Rápidos de Referência

### Tornar Admin (Copy & Paste)
```javascript
fetch('https://jdjeikzwybpbjqmlculs.supabase.co/functions/v1/make-server-0cae32e3/super-admin/make-user-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'pauloaminegirl@gmail.com',
    secret: 'SANTA_TERESA_2025_ADMIN_SECRET'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Resultado:', data))
.catch(err => console.error('❌ Erro:', err));
```

### Remover Admin (Copy & Paste)
```javascript
fetch('https://jdjeikzwybpbjqmlculs.supabase.co/functions/v1/make-server-0cae32e3/super-admin/remove-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'pauloaminegirl@gmail.com',
    secret: 'SANTA_TERESA_2025_ADMIN_SECRET'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Resultado:', data))
.catch(err => console.error('❌ Erro:', err));
```

### Verificar se é Admin (Copy & Paste)
```javascript
// Após fazer login, execute no console:
fetch('https://jdjeikzwybpbjqmlculs.supabase.co/functions/v1/make-server-0cae32e3/user-profile', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('supabase.auth.token')
  }
})
.then(res => res.json())
.then(data => {
  console.log('É admin?', data.user?.is_admin);
  console.log('Dados completos:', data);
});
```

## ⚠️ Checklist de Segurança

Antes de colocar em produção:

- [ ] Alterar o SECRET_KEY para algo único
- [ ] Testar logout e login após tornar admin
- [ ] Verificar se botão "Painel Admin" aparece
- [ ] Testar acesso ao painel administrativo
- [ ] Criar backup do secret em local seguro
- [ ] Não compartilhar o secret com ninguém
- [ ] Considerar criar mais de um admin como backup

## 📞 Precisa de Ajuda?

**Desenvolvedor**:  
André Neves  
📧 andre.neves@faeterj-rio.edu.br  
📱 (21) 97043-9701

**Proprietário**:  
Paulo Almeida  
📧 pauloaminegirl@gmail.com

---

**Informações Técnicas**:
- Project ID: `jdjeikzwybpbjqmlculs`
- Secret Padrão: `SANTA_TERESA_2025_ADMIN_SECRET`
- Super Admin URL: `#super-admin`
- Admin Panel URL: `#admin`

**Última Atualização**: 21/11/2025
