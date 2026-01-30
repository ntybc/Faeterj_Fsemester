import { Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  userName?: string;
  isAdmin?: boolean;
  onAdminPanelClick?: () => void;
}

export function Header({ onLoginClick, isLoggedIn, onLogout, userName, isAdmin, onAdminPanelClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F3E9D2]/95 backdrop-blur-sm border-b border-[#7E7E7E]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => scrollToSection('home')} className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-[#F5B700] rounded-full flex items-center justify-center shadow-md">
                <span className="text-white" style={{ fontFamily: 'Playfair Display' }}>ST</span>
              </div>
              <div>
                <div style={{ fontFamily: 'Playfair Display' }} className="text-[#2C546B]">Santa Teresa</div>
                <div className="text-xs text-[#7E7E7E]">Albergue</div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-[#2C546B] hover:text-[#F5B700] transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('sobre')} 
              className="text-[#2C546B] hover:text-[#F5B700] transition-colors"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('servicos')} 
              className="text-[#2C546B] hover:text-[#F5B700] transition-colors"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection('contato')} 
              className="text-[#2C546B] hover:text-[#F5B700] transition-colors"
            >
              Contato
            </button>
          </nav>

          {/* Login Button - Seal Shape */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-[#2C546B]">Olá, {userName}</span>
                {isAdmin && onAdminPanelClick && (
                  <button
                    onClick={onAdminPanelClick}
                    className="px-4 py-2 bg-[#F5B700] text-[#2C546B] rounded-md hover:bg-[#F5B700]/90 transition-colors flex items-center gap-2"
                    title="Painel Administrativo"
                  >
                    <Shield size={16} />
                    Painel Admin
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-[#B65C39] text-white rounded-md hover:bg-[#B65C39]/90 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-6 py-3 bg-[#B65C39] text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <span className="text-sm" style={{ fontFamily: 'Playfair Display' }}>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#2C546B]"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F3E9D2] border-t border-[#7E7E7E]/20 animate-fade-in">
          <div className="px-4 py-6 space-y-4">
            <button 
              onClick={() => scrollToSection('home')} 
              className="block w-full text-left text-[#2C546B] hover:text-[#F5B700] transition-colors py-2"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('sobre')} 
              className="block w-full text-left text-[#2C546B] hover:text-[#F5B700] transition-colors py-2"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('servicos')} 
              className="block w-full text-left text-[#2C546B] hover:text-[#F5B700] transition-colors py-2"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection('contato')} 
              className="block w-full text-left text-[#2C546B] hover:text-[#F5B700] transition-colors py-2"
            >
              Contato
            </button>
            <div className="pt-4 border-t border-[#7E7E7E]/20">
              {isLoggedIn ? (
                <>
                  <div className="text-[#2C546B] mb-2">Olá, {userName}</div>
                  {isAdmin && onAdminPanelClick && (
                    <button
                      onClick={() => {
                        onAdminPanelClick();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 mb-2 bg-[#F5B700] text-[#2C546B] rounded-md hover:bg-[#F5B700]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Shield size={16} />
                      Painel Admin
                    </button>
                  )}
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 bg-[#B65C39] text-white rounded-md hover:bg-[#B65C39]/90 transition-colors"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="w-full px-4 py-2 bg-[#B65C39] text-white rounded-md hover:bg-[#B65C39]/90 transition-colors"
                >
                  Login / Cadastro
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}