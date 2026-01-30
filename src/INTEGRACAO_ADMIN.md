# Guia de Integração do Painel Administrativo

## ✅ Integração Completa

O painel administrativo foi totalmente integrado ao site principal do Albergue Santa Teresa. Agora você tem um sistema unificado com controle de acesso baseado em permissões.

## 🔐 Como Funciona

### 1. Sistema de Rotas
- **Site Normal**: `#home` (rota padrão)
- **Painel Admin**: `#admin` (apenas para administradores)

### 2. Controle de Acesso
- **Campo `is_admin`**: Adicionado ao perfil de cada usuário no banco de dados
- **Verificação Automática**: Todas as rotas admin verificam permissões
- **Acesso Negado**: Usuários não-admin são redirecionados com mensagem apropriada

### 3. Interface Unificada
- **Header Inteligente**: Mostra botão "Painel Admin" apenas para administradores
- **Navegação Simples**: Botão com ícone de escudo para fácil identificação
- **Logout Seguro**: Ao sair, retorna para página inicial

## 🚀 Como Usar

### Para Clientes Normais
1. Acesse o site normalmente
2. Faça login ou cadastro
3. Use o sistema de reservas
4. Acesse "Meu Painel" para ver suas reservas

### Para Administradores
1. Faça login com conta de administrador
2. Clique no botão **"Painel Admin"** (com ícone de escudo) no header
3. Acesse todas as funcionalidades administrativas:
   - Dashboard com estatísticas
   - Gerenciamento de reservas
   - Check-in/Check-out
   - Gestão de clientes
   - Controle financeiro
   - Notificações
4. Clique em "Voltar ao Site" para retornar

## 👤 Como Tornar um Usuário Admin

Para tornar um usuário administrador, você precisa atualizar manualmente o campo `is_admin` no Supabase:

### Opção 1: Via Console do Supabase (Recomendado)
1. Acesse o console do Supabase
2. Vá para a seção "Database"
3. Execute o seguinte comando SQL no editor:

```sql
-- Substitua 'email@exemplo.com' pelo email do usuário
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{is_admin}',
  'true'::jsonb
)
WHERE email = 'email@exemplo.com';
```

### Opção 2: Via KV Store (Programático)
Como estamos usando KV Store, você precisa atualizar diretamente:

1. Primeiro, obtenha o ID do usuário através do painel de clientes
2. No backend, atualize o registro do usuário com `is_admin: true`

### Opção 3: Criar Rota Admin (Mais Segura)
Vou criar uma rota especial para você tornar usuários admin de forma segura.

## 🔒 Segurança

### Proteções Implementadas
✅ Verificação de autenticação em todas as rotas
✅ Verificação de permissão admin em rotas administrativas  
✅ Mensagens de erro apropriadas para acesso não autorizado
✅ Redirecionamento automático para usuários não autorizados
✅ Separação clara entre interface pública e administrativa

### Recomendações Adicionais
- Mantenha a lista de administradores restrita
- Use senhas fortes para contas admin
- Monitore logs de acesso ao painel administrativo
- Não compartilhe credenciais de admin

## 📱 Acesso ao Painel

### Desktop
- Botão "Painel Admin" visível no header ao lado do nome do usuário
- Ícone de escudo para fácil identificação

### Mobile  
- Mesmo botão disponível no menu hambúrguer
- Localizado após a saudação do usuário

## 🎨 Estilo Visual
- Botão admin em amarelo-ouro (#F5B700) - destaque na paleta do site
- Ícone de escudo para representar acesso administrativo
- Mantém consistência com design boêmio retrô de Santa Teresa

## 📝 Próximos Passos

1. **Criar primeiro admin**: Use uma das opções acima para tornar sua conta admin
2. **Testar funcionalidades**: Acesse o painel e verifique todas as features
3. **Configurar notificações**: Configure email pauloaminegirl@gmail.com para receber alertas
4. **Adicionar outros admins**: Se necessário, adicione mais contas administrativas

## ⚠️ Importante

- O arquivo `/AdminApp.tsx` agora é **obsoleto** e pode ser removido
- Todo o sistema está integrado em `/App.tsx`
- As rotas admin estão protegidas e verificam permissões
- Novos usuários são criados com `is_admin: false` por padrão

## 🆘 Troubleshooting

### "Acesso Negado" ao tentar acessar painel
- Verifique se sua conta tem `is_admin: true` no banco de dados
- Faça logout e login novamente após atualizar permissões

### Botão "Painel Admin" não aparece
- Faça logout e login novamente
- Verifique se o campo `is_admin` está sendo retornado pela API `/user-profile`

### Problemas de autenticação
- Limpe o cache do navegador
- Verifique se o token de acesso é válido
- Tente fazer login novamente

## 📞 Suporte

Para questões técnicas ou problemas com a integração:
- Email: andre.neves@faeterj-rio.edu.br  
- Tel: (21) 97043-9701

---

**Status**: ✅ Integração Completa e Funcional
**Versão**: 1.0
**Data**: 21/11/2025
