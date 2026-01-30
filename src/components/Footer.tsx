import { Mail, Phone, MapPin, Instagram, Facebook, Heart, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2C546B] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Sobre */}
          <div>
            <h3 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>
              Albergue Santa Teresa
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Experimente o charme boêmio do Rio de Janeiro em um albergue acolhedor, 
              onde tradição e modernidade se encontram.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>
              Links Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>
              Contato
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="flex-shrink-0 mt-1" />
                <span className="text-white/80">
                  Santa Teresa, Rio de Janeiro - RJ
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="flex-shrink-0 mt-1" />
                <a
                  href="mailto:nathaliayasmin2007@gmail.com"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  nathaliayasmin2007@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="flex-shrink-0 mt-1" />
                <a
                  href="tel:+5521970439701"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  +55 21 97043-9701
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2025 Albergue Santa Teresa. Todos os direitos reservados.
          </p>
          <p className="text-white/60 text-sm mt-2 flex items-center justify-center gap-1">
            Feito com <Heart size={14} className="fill-red-500 text-red-500" /> no Rio de Janeiro
          </p>
        </div>
      </div>
    </footer>
  );
}