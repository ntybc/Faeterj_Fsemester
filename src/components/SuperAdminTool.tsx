import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Shield, Check, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface SuperAdminToolProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken?: string;
}

export function SuperAdminTool({ isOpen, onClose, accessToken }: SuperAdminToolProps) {
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [action, setAction] = useState<'grant' | 'revoke'>('grant');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Como a rota edge function está protegida, vamos usar uma abordagem diferente
      // Vamos usar o Supabase Storage/Database diretamente
      
      // Por enquanto, vou mostrar as instruções de como fazer manualmente
      setMessage({
        type: 'info',
        text: `Devido às proteções do Supabase, você precisa executar este comando via Console do Supabase ou Postman. Copie o comando abaixo:`
      });

    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Erro ao processar solicitação'
      });
    } finally {
      setLoading(false);
    }
  };

  const curlCommand = `curl -X POST https://jdjeikzwybpbjqmlculs.supabase.co/functions/v1/make-server-0cae32e3/super-admin/${action === 'grant' ? 'make-user-admin' : 'remove-admin'} \\
  -H "Content-Type: application/json" \\
  -d '{"email":"${email}","secret":"${secret}"}'`;

  const jsCommand = `fetch('https://jdjeikzwybpbjqmlculs.supabase.co/functions/v1/make-server-0cae32e3/super-admin/${action === 'grant' ? 'make-user-admin' : 'remove-admin'}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: '${email}',
    secret: '${secret}'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Resultado:', data))
.catch(err => console.error('❌ Erro:', err));`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-[#F3E9D2] border-4 border-[#F5B700] shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-[#7E7E7E]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#F5B700] rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#2C546B]" />
              </div>
              <div>
                <CardTitle className="font-['Playfair_Display'] text-[#2C546B]">
                  Ferramenta Super Admin
                </CardTitle>
                <CardDescription>
                  Conceder ou remover privilégios de administrador
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[#7E7E7E] hover:text-[#2C546B]"
            >
              <X size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Alertas de Segurança */}
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>ATENÇÃO:</strong> Esta ferramenta deve ser usada apenas pelo proprietário do albergue.
              Mantenha o secret em segurança absoluta.
            </AlertDescription>
          </Alert>

          {/* Seleção de Ação */}
          <div className="space-y-2">
            <Label>Ação</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAction('grant')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  action === 'grant'
                    ? 'border-[#F5B700] bg-[#F5B700]/10'
                    : 'border-[#7E7E7E]/20 hover:border-[#F5B700]/50'
                }`}
              >
                <Check className="w-5 h-5 mx-auto mb-2 text-green-600" />
                <div className="font-medium text-[#2C546B]">Conceder Admin</div>
                <div className="text-xs text-[#7E7E7E] mt-1">Tornar usuário administrador</div>
              </button>
              <button
                type="button"
                onClick={() => setAction('revoke')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  action === 'revoke'
                    ? 'border-[#B65C39] bg-[#B65C39]/10'
                    : 'border-[#7E7E7E]/20 hover:border-[#B65C39]/50'
                }`}
              >
                <X className="w-5 h-5 mx-auto mb-2 text-red-600" />
                <div className="font-medium text-[#2C546B]">Remover Admin</div>
                <div className="text-xs text-[#7E7E7E] mt-1">Revogar privilégios</div>
              </button>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email do Usuário</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pauloaminegirl@gmail.com"
                required
                className="bg-white border-[#4B6B50]"
              />
              <p className="text-xs text-[#7E7E7E]">
                O usuário deve estar cadastrado no sistema
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret">Secret Key</Label>
              <Input
                id="secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="SANTA_TERESA_2025_ADMIN_SECRET"
                required
                className="bg-white border-[#4B6B50] font-mono"
              />
              <p className="text-xs text-[#7E7E7E]">
                Secret padrão: SANTA_TERESA_2025_ADMIN_SECRET
              </p>
            </div>
          </form>

          {/* Comandos para Copiar */}
          <div className="space-y-4 pt-4 border-t border-[#7E7E7E]/20">
            <div>
              <Label className="mb-2 block">Método 1: Console do Navegador (F12)</Label>
              <div className="bg-[#2C546B] text-white p-4 rounded-lg font-mono text-xs overflow-x-auto">
                <pre>{jsCommand}</pre>
              </div>
              <Button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(jsCommand);
                  setMessage({ type: 'success', text: 'Comando JavaScript copiado!' });
                }}
                className="mt-2 w-full bg-[#4B6B50] hover:bg-[#4B6B50]/90"
                size="sm"
              >
                Copiar Comando JavaScript
              </Button>
            </div>

            <div>
              <Label className="mb-2 block">Método 2: Terminal/CMD (cURL)</Label>
              <div className="bg-[#2C546B] text-white p-4 rounded-lg font-mono text-xs overflow-x-auto">
                <pre>{curlCommand}</pre>
              </div>
              <Button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(curlCommand);
                  setMessage({ type: 'success', text: 'Comando cURL copiado!' });
                }}
                className="mt-2 w-full bg-[#4B6B50] hover:bg-[#4B6B50]/90"
                size="sm"
              >
                Copiar Comando cURL
              </Button>
            </div>
          </div>

          {/* Instruções */}
          <div className="space-y-2 pt-4 border-t border-[#7E7E7E]/20">
            <Label>📋 Instruções de Uso</Label>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#2C546B]">
              <li>Certifique-se de que o usuário já está cadastrado no sistema</li>
              <li>Preencha o email e o secret key acima</li>
              <li>Copie um dos comandos (JavaScript ou cURL)</li>
              <li>Execute o comando conforme o método escolhido:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-xs text-[#7E7E7E]">
                  <li><strong>JavaScript:</strong> Abra o Console (F12) e cole o código</li>
                  <li><strong>cURL:</strong> Abra o Terminal/CMD e cole o comando</li>
                </ul>
              </li>
              <li>Aguarde a resposta com confirmação</li>
              <li>O usuário deve fazer logout e login novamente</li>
            </ol>
          </div>

          {/* Mensagens */}
          {message && (
            <Alert className={
              message.type === 'success' 
                ? 'bg-green-50 border-green-200' 
                : message.type === 'error'
                ? 'bg-red-50 border-red-200'
                : 'bg-blue-50 border-blue-200'
            }>
              <AlertDescription className={
                message.type === 'success'
                  ? 'text-green-800'
                  : message.type === 'error'
                  ? 'text-red-800'
                  : 'text-blue-800'
              }>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#7E7E7E] text-[#2C546B]"
            >
              Fechar
            </Button>
          </div>

          {/* Informações de Contato */}
          <div className="pt-4 border-t border-[#7E7E7E]/20 text-center text-xs text-[#7E7E7E]">
            <p>Precisa de ajuda?</p>
            <p className="mt-1">Email: andre.neves@faeterj-rio.edu.br</p>
            <p>Tel: (21) 97043-9701</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}