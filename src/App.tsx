import { useState, useEffect } from 'react';
import { createClient } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ImageGallery } from './components/ImageGallery';
import { Partners } from './components/Partners';
import { About } from './components/About';
import { Services } from './components/Services';
import { Reviews } from './components/Reviews';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { RoomsGallery } from './components/RoomsGallery';
import { ReservationModal } from './components/ReservationModal';
import { ClientDashboard } from './components/ClientDashboard';
import { AdminPanel } from './components/AdminPanel';
import { SuperAdminTool } from './components/SuperAdminTool';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('home');

  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [showRoomsGallery, setShowRoomsGallery] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSuperAdminTool, setShowSuperAdminTool] = useState(false);
  const [preselectedRoomId, setPreselectedRoomId] = useState<string | undefined>(undefined);

  const supabase = createClient();

  useEffect(() => {
    checkSession();
    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  const handleRouteChange = () => {
    const hash = window.location.hash.slice(1) || 'home';
    setCurrentRoute(hash);
    
    // Rota especial para super-admin tool
    if (hash === 'super-admin') {
      setShowSuperAdminTool(true);
    }
  };

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        setIsLoggedIn(true);
        setUser(session.user);
        setAccessToken(session.access_token);
        
        // Fetch user profile
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/user-profile`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        );
        
        const result = await response.json();
        if (response.ok && result.user) {
          setUserName(result.user.name);
          setIsAdmin(result.user.is_admin || false);
        }
      }
    } catch (err) {
      console.error('Erro ao verificar sessão:', err);
    }
  };

  const handleLoginSuccess = (newUser: any, token: string) => {
    setIsLoggedIn(true);
    setUser(newUser);
    setAccessToken(token);
    
    // Fetch user profile
    fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/user-profile`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )
      .then(res => res.json())
      .then(result => {
        if (result.user) {
          setUserName(result.user.name);
          setIsAdmin(result.user.is_admin || false);
        }
      })
      .catch(err => console.error('Erro ao buscar perfil:', err));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setAccessToken('');
    setUserName('');
    setIsAdmin(false);
    window.location.hash = 'home';
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      setShowDashboard(true);
    } else {
      setAuthModalMode('login');
      setShowAuthModal(true);
    }
  };

  const handleFirstAccessClick = () => {
    if (isLoggedIn) {
      setShowDashboard(true);
    } else {
      setAuthModalMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleRoomsClick = () => {
    setShowRoomsGallery(true);
  };

  const handleReservationsClick = () => {
    if (!isLoggedIn) {
      setAuthModalMode('signup');
      setShowAuthModal(true);
    } else {
      setPreselectedRoomId(undefined);
      setShowReservationModal(true);
    }
  };

  const handleBookRoom = (roomId: string) => {
    setShowRoomsGallery(false);
    if (!isLoggedIn) {
      setAuthModalMode('signup');
      setShowAuthModal(true);
    } else {
      setPreselectedRoomId(roomId);
      setShowReservationModal(true);
    }
  };

  const handleLoginRequired = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleAdminPanelAccess = () => {
    window.location.hash = 'admin';
  };

  const handleBackToSite = () => {
    window.location.hash = 'home';
  };

  // Render Admin Panel if route is admin and user is admin
  if (currentRoute === 'admin') {
    if (!isLoggedIn) {
      // Redirect to login
      setTimeout(() => {
        window.location.hash = 'home';
        setAuthModalMode('login');
        setShowAuthModal(true);
      }, 0);
      return null;
    }

    if (!isAdmin) {
      // Not authorized
      return (
        <div className="min-h-screen bg-[#F3E9D2] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="font-['Playfair_Display'] text-[#B65C39] mb-4">Acesso Negado</h2>
            <p className="text-[#7E7E7E] mb-6">
              Você não tem permissão para acessar o painel administrativo.
            </p>
            <button
              onClick={handleBackToSite}
              className="px-6 py-2 bg-[#F5B700] text-[#2C546B] rounded-lg hover:bg-[#F5B700]/90"
            >
              Voltar ao Site
            </button>
          </div>
        </div>
      );
    }

    // Show Admin Panel
    return (
      <div className="min-h-screen bg-[#F3E9D2]">
        <AdminPanel
          isOpen={true}
          onClose={handleBackToSite}
          accessToken={accessToken}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3E9D2]">
      <Header
        onLoginClick={handleLoginClick}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userName={userName}
        isAdmin={isAdmin}
        onAdminPanelClick={handleAdminPanelAccess}
      />

      <main>
        <Hero
          onFirstAccessClick={handleFirstAccessClick}
          onRoomsClick={handleRoomsClick}
          onReservationsClick={handleReservationsClick}
        />

        <ImageGallery />

        <Partners />

        <About />

        <Services />

        <Reviews />

        <Contact />
      </main>

      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
      />

      <RoomsGallery
        isOpen={showRoomsGallery}
        onClose={() => setShowRoomsGallery(false)}
        onBookRoom={handleBookRoom}
      />

      <ReservationModal
        isOpen={showReservationModal}
        onClose={() => {
          setShowReservationModal(false);
          setPreselectedRoomId(undefined);
        }}
        isLoggedIn={isLoggedIn}
        onLoginRequired={handleLoginRequired}
        accessToken={accessToken}
        preselectedRoomId={preselectedRoomId}
      />

      {isLoggedIn && (
        <ClientDashboard
          isOpen={showDashboard}
          onClose={() => setShowDashboard(false)}
          accessToken={accessToken}
        />
      )}

      {showSuperAdminTool && (
        <SuperAdminTool
          isOpen={showSuperAdminTool}
          onClose={() => setShowSuperAdminTool(false)}
          accessToken={accessToken}
        />
      )}
    </div>
  );
}