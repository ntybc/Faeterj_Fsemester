import { useState, useEffect } from 'react';
import { createClient } from './utils/supabase/client';
import { projectId } from './utils/supabase/info';
import { AdminPanel } from './components/AdminPanel';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Shield } from 'lucide-react';

export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        setIsLoggedIn(true);
        setAccessToken(session.access_token);
      }
    } catch (err) {
      console.error('Erro ao verificar sessão:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('Email ou senha incorretos');
        return;
      }

      if (data.session) {
        setAccessToken(data.session.access_token);
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError('Erro ao fazer login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setAccessToken('');
    setEmail('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C546B] via-[#4B6B50] to-[#2C546B] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#F3E9D2] border-4 border-[#F5B700] shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-20 h-20 bg-[#F5B700] rounded-full flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-[#2C546B]" />
            </div>
            <CardTitle className="font-['Playfair_Display'] text-[#2C546B]">
              Painel Administrativo
            </CardTitle>
            <CardDescription>
              Albergue Santa Teresa - Rio de Janeiro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Administrativo</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@santateresa.com"
                  required
                  className="bg-white border-[#4B6B50]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white border-[#4B6B50]"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F5B700] hover:bg-[#F5B700]/90 text-[#2C546B]"
              >
                {loading ? 'Entrando...' : 'Acessar Painel'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#7E7E7E]/20 text-center text-sm text-[#7E7E7E]">
              <p>Acesso restrito a administradores</p>
              <p className="mt-1">Email: andre.neves@faeterj-rio.edu.br</p>
              <p>Tel: (21) 97043-9701</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3E9D2]">
      <AdminPanel
        isOpen={true}
        onClose={handleLogout}
        accessToken={accessToken}
      />
    </div>
  );
}
