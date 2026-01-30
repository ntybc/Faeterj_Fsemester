import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onFirstAccessClick: () => void;
  onRoomsClick: () => void;
  onReservationsClick: () => void;
}

export function Hero({ onFirstAccessClick, onRoomsClick, onReservationsClick }: HeroProps) {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1613390250147-171878866f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFc2NhZGFyaWElMjBTZWxhcm9uJTIwUmlvfGVufDF8fHx8MTc2MzA2OTg3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
        <h1 className="text-white mb-6" style={{ fontFamily: 'Playfair Display' }}>
          Bem-vindo ao coração de Santa Teresa
        </h1>
        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
          Experimente o charme boêmio do Rio de Janeiro em um albergue acolhedor, 
          onde tradição e modernidade se encontram
        </p>

        {/* Três Botões Principais */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          {/* Primeiro Acesso */}
          <button
            onClick={onFirstAccessClick}
            className="group w-full sm:w-64 px-8 py-5 bg-[#F5B700] text-[#2C546B] rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-between"
          >
            <span style={{ fontFamily: 'Playfair Display' }}>Primeiro Acesso</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>

          {/* Quartos */}
          <button
            onClick={onRoomsClick}
            className="group w-full sm:w-64 px-8 py-5 bg-[#4B6B50] text-white rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-between"
          >
            <span style={{ fontFamily: 'Playfair Display' }}>Conhecer Quartos</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>

          {/* Reservas */}
          <button
            onClick={onReservationsClick}
            className="group w-full sm:w-64 px-8 py-5 bg-[#B65C39] text-white rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-between"
          >
            <span style={{ fontFamily: 'Playfair Display' }}>Fazer Reserva</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full mx-auto flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}