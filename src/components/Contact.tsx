import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export function Contact() {
  return (
    <section id="contato" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[#2C546B] mb-6" style={{ fontFamily: 'Playfair Display' }}>
          Entre em Contato
        </h2>
        <p className="text-center text-[#7E7E7E] mb-16 max-w-2xl mx-auto">
          Estamos aqui para ajudar! Entre em contato conosco através de qualquer um dos canais abaixo
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Informações de Contato */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#F5B700] rounded-lg text-white flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-[#2C546B] mb-2" style={{ fontFamily: 'Playfair Display' }}>
                  Endereço
                </h4>
                <p className="text-[#7E7E7E]">
                  Bairro de Santa Teresa<br />
                  Região Central, Rio de Janeiro - RJ<br />
                  Perto do bondinho histórico
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#4B6B50] rounded-lg text-white flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-[#2C546B] mb-2" style={{ fontFamily: 'Playfair Display' }}>
                  E-mail
                </h4>
                <a href="mailto:andre.neves@faeterj-rio.edu.br" className="text-[#7E7E7E] hover:text-[#F5B700] transition-colors">
                  andre.neves@faeterj-rio.edu.br
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#2C546B] rounded-lg text-white flex-shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-[#2C546B] mb-2" style={{ fontFamily: 'Playfair Display' }}>
                  Telefone / WhatsApp
                </h4>
                <a href="tel:+5521970439701" className="text-[#7E7E7E] hover:text-[#F5B700] transition-colors">
                  +55 21 97043-9701
                </a>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="pt-8 border-t border-[#7E7E7E]/20">
              <h4 className="text-[#2C546B] mb-6" style={{ fontFamily: 'Playfair Display' }}>
                Siga-nos
              </h4>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-lg text-white hover:opacity-80 transition-opacity"
                >
                  <Instagram size={24} />
                </a>
                <a 
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-[#1877F2] rounded-lg text-white hover:opacity-80 transition-opacity"
                >
                  <Facebook size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="rounded-lg overflow-hidden shadow-xl h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.1989345678!2d-43.18753492378583!3d-22.914722079233823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997f5e3c0e2e55%3A0x6b3d8e4e0e6e7e8e!2sSanta%20Teresa%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do Albergue Santa Teresa"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}