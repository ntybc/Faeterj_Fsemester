# Como Tornar um Usuário Administrador

## 🔐 Segurança Primeiro!

**IMPORTANTE**: Estas rotas são protegidas por um segredo (secret key). Por padrão, o segredo é:
```
SANTA_TERESA_2025_ADMIN_SECRET
```

⚠️ **RECOMENDAÇÃO**: Altere este segredo no arquivo `/supabase/functions/server/index.tsx` (linha ~575) para algo único e complexo antes de usar em produção!

## 📋 Métodos para Tornar Usuário Admin

### Método 1: Via API REST (Recomendado)

Use esta chamada de API para tornar um usuário administrador:

```bash
# Exemplo usando curl
curl -X POST https://SEU_PROJETO_ID.supabase.co/functions/v1/make-server-0cae32e3/super-admin/make-user-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@exemplo.com",
    "secret": "SANTA_TERESA_2025_ADMIN_SECRET"
  }'
```

#### Exemplo usando JavaScript (Console do Navegador)

```javascript
// Cole isto no console do navegador
fetch('https://SEU_PROJETO_ID.supabase.co/functions/v1/make-server-0cae32e3/super-admin/make-user-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'email@exemplo.com',
    secret: 'SANTA_TERESA_2025_ADMIN_SECRET'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

#### Exemplo usando Postman

1. Abra o Postman
2. Crie uma nova requisição POST
3. URL: `https://SEU_PROJETO_ID.supabase.co/functions/v1/make-server-0cae32e3/super-admin/make-user-admin`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "email": "email@exemplo.com",
  "secret": "SANTA_TERESA_2025_ADMIN_SECRET"
}
```

### Método 2: Via Python Script

```python
import requests
import json

# Configurações
PROJECT_ID = "SEU_PROJETO_ID"
EMAIL_USUARIO = "email@exemplo.com"
SECRET = "SANTA_TERESA_2025_ADMIN_SECRET"

# URL da API
url = f"https://{PROJECT_ID}.supabase.co/functions/v1/make-server-0cae32e3/super-admin/make-user-admin"

# Dados
payload = {
    "email": EMAIL_USUARIO,
    "secret": SECRET
}

# Fazer requisição
response = requests.post(url, json=payload)

# Mostrar resultado
if response.status_code == 200:
    print(f"✅ Sucesso! {EMAIL_USUARIO} agora é administrador")
    print(json.dumps(response.json(), indent=2))
else:
    print(f"❌ Erro: {response.status_code}")
    print(response.text)
```

### Método 3: Via Node.js Script

```javascript
const fetch = require('node-fetch');

// Configurações
const PROJECT_ID = 'SEU_PROJETO_ID';
const EMAIL_USUARIO = 'email@exemplo.com';
const SECRET = 'SANTA_TERESA_2025_ADMIN_SECRET';

// URL da API
const url = `https://${PROJECT_ID}.supabase.co/functions/v1/make-server-0cae32e3/super-admin/make-user-admin`;

// Dados
const payload = {
  email: EMAIL_USUARIO,
  secret: SECRET
};

// Fazer requisição
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => {
  console.log('✅ Sucesso!');
  console.log(JSON.stringify(data, null, 2));
})
.catch(err => {
  console.error('❌ Erro:', err);
});
```

## 🗑️ Remover Privilégios de Admin

Se você precisar remover privilégios de administrador de um usuário:

```bash
curl -X POST https://SEU_PROJETO_ID.supabase.co/functions/v1/make-server-0cae32e3/super-admin/remove-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@exemplo.com",
    "secret": "SANTA_TERESA_2025_ADMIN_SECRET"
  }'
```

## 📝 Passo a Passo Completo

### 1. Crie uma conta de usuário normal
- Acesse o site
- Clique em "Primeiro Acesso"
- Preencha todos os dados (nome, email, senha, etc.)
- Complete o cadastro

### 2. Anote o email da conta criada
- Exemplo: `pauloaminegirl@gmail.com`

### 3. Use a API para tornar a conta admin
- Use um dos métodos acima
- Substitua `SEU_PROJETO_ID` pelo ID do seu projeto Supabase
- Substitua `email@exemplo.com` pelo email da conta
- Execute a requisição

### 4. Verifique o resultado
A API deve retornar:
```json
{
  "success": true,
  "message": "Usuário email@exemplo.com agora tem privilégios de administrador",
  "user": {
    "id": "uuid-do-usuario",
    "email": "email@exemplo.com",
    "name": "Nome do Usuário",
    "is_admin": true
  }
}
```

### 5. Faça logout e login novamente
- Saia do site (logout)
- Faça login novamente
- O botão "Painel Admin" deve aparecer no header

### 6. Acesse o painel administrativo
- Clique no botão "Painel Admin"
- Você será redirecionado para `#admin`
- Todas as funcionalidades administrativas estarão disponíveis

## 🔍 Verificar se o Usuário é Admin

Para verificar se um usuário tem privilégios de admin, você pode:

1. **Via API de Perfil**: Faça login e acesse `/user-profile`
2. **Via Console do Navegador**: 
```javascript
// Após fazer login
fetch('https://SEU_PROJETO_ID.supabase.co/functions/v1/make-server-0cae32e3/user-profile', {
  headers: {
    'Authorization': 'Bearer SEU_TOKEN_DE_ACESSO'
  }
})
.then(res => res.json())
.then(data => {
  console.log('É admin?', data.user.is_admin);
  console.log('Dados do usuário:', data);
});
```

## ⚠️ Avisos Importantes

1. **Guarde o Secret em Segurança**: Não compartilhe o secret key com ninguém
2. **Limite de Admins**: Crie apenas os admins necessários
3. **Primeira Conta**: Recomendamos usar `pauloaminegirl@gmail.com` como primeiro admin
4. **Logs**: Todas as mudanças de privilégio são registradas nos logs do servidor
5. **Produção**: Antes de colocar em produção, altere o secret para algo único

## 🚨 Troubleshooting

### "Não autorizado" (401)
- Verifique se o secret está correto
- Certifique-se de que não há espaços extras

### "Usuário não encontrado" (404)
- Verifique se o email está correto
- Certifique-se de que o usuário já foi cadastrado no sistema

### Botão "Painel Admin" não aparece
- Faça logout e login novamente
- Limpe o cache do navegador
- Verifique no console se `is_admin` é `true`

### Erro ao acessar rotas admin
- Verifique se você está logado
- Confirme que `is_admin` é `true` no seu perfil
- Tente fazer login novamente

## 📞 Contato

Se precisar de ajuda:
- Email: andre.neves@faeterj-rio.edu.br
- Tel: (21) 97043-9701

---

**Última atualização**: 21/11/2025
