import { useState } from 'react';
import { X, User, Mail, Lock, Calendar, Phone, Globe, CreditCard, Upload } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, token: string) => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    cpf: '',
    nationality: '',
    phone: '',
    documentPhoto: '',
    profilePhoto: '',
  });

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (authError) throw authError;

      if (data.session) {
        onLoginSuccess(data.user, data.session.access_token);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(signupData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar conta');
      }

      // Auto-login após cadastro
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: signupData.email,
        password: signupData.password,
      });

      if (authError) throw authError;

      if (data.session) {
        onLoginSuccess(data.user, data.session.access_token);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#2C546B] text-white p-6 flex justify-between items-center rounded-t-lg">
          <h2 style={{ fontFamily: 'Playfair Display' }}>
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[#2C546B] mb-2">
                  <Mail size={16} className="inline mr-2" />
                  E-mail
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#2C546B] mb-2">
                  <Lock size={16} className="inline mr-2" />
                  Senha
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F5B700] text-white py-3 rounded-lg hover:bg-[#F5B700]/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <p className="text-center text-[#7E7E7E]">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-[#F5B700] hover:underline"
                >
                  Cadastre-se
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#2C546B] mb-2">
                    <User size={16} className="inline mr-2" />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={signupData.name}
                    onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2C546B] mb-2">
                    <Mail size={16} className="inline mr-2" />
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2C546B] mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={signupData.dateOfBirth}
                    onChange={(e) => setSignupData({...signupData, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                  />
                </div>

                <div>
                  <label className="block text-[#2C546B] mb-2">
                    <CreditCard size={16} className="inline mr-2" />
                    CPF (para brasileiros)
                  </label>
                  <input
                    type="text"
                    value={signupData.cpf}
                    onChange={(e) => setSignupData({...signupData, cpf: e.target.value})}
                    className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block text-[#2C546B] mb-2">
                    <Globe size={16} className="inline mr-2" />
                    Nacionalidade
                  </label>
                  <input
                    type="text"
                    value={signupData.nationality}
                    onChange={(e) => setSignupData({...signupData, nationality: e.target.value})}
                    className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                  />
                </div>

                <div>
                  <label className="block text-[#2C546B] mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                  />
                </div>

                <div>
                  <label className="block text-[#2C546B] mb-2">
                    <Lock size={16} className="inline mr-2" />
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2C546B] mb-2">
                    <Lock size={16} className="inline mr-2" />
                    Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F5B700] text-white py-3 rounded-lg hover:bg-[#F5B700]/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </button>

              <p className="text-center text-[#7E7E7E]">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#F5B700] hover:underline"
                >
                  Fazer login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}