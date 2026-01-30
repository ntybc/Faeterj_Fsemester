import { ImageWithFallback } from './figma/ImageWithFallback';
import { ExternalLink, Instagram, MessageCircle } from 'lucide-react';

export function Partners() {
  const partners = [
    {
      name: 'Restaurante Aprazível',
      type: 'restaurant',
      description: 'Desconto de 30% para hóspedes',
      image: 'https://images.unsplash.com/photo-1710846929339-72634edf6f5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzYzMDUxMzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      whatsapp: '5521987654321',
      instagram: 'aprazivel_rio',
      website: '#'
    },
    {
      name: 'Café do Alto',
      type: 'cafe',
      description: 'Café da manhã especial',
      image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wfGVufDF8fHx8MTc2MzA5OTI5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      whatsapp: '5521987654322',
      instagram: 'cafedoalto',
      website: '#'
    },
    {
      name: 'Bar do Mineiro',
      type: 'bar',
      description: 'Drinks com desconto',
      image: 'https://images.unsplash.com/photo-1720694924759-2a2daaa98987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjMxMjI3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      whatsapp: '5521987654323',
      instagram: 'bardomineiro',
      website: '#'
    },
    {
      name: 'Bondinho de Santa Teresa',
      type: 'attraction',
      description: 'Informações e ingressos',
      image: 'https://images.unsplash.com/photo-1649260349635-0f1b62ffb26e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFtJTIwc3RyZWV0Y2FyfGVufDF8fHx8MTc2MzEyMjcyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      whatsapp: '5521987654324',
      instagram: 'bondinhooficial',
      website: '#'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#2C546B] to-[#4B6B50]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-white mb-4" style={{ fontFamily: 'Playfair Display' }}>
          Nossos Parceiros
        </h2>
        <p className="text-center text-white/80 mb-16 max-w-2xl mx-auto">
          Aproveite vantagens exclusivas em estabelecimentos selecionados de Santa Teresa
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              <div className="h-40 overflow-hidden">
                <ImageWithFallback 
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-white mb-2" style={{ fontFamily: 'Playfair Display' }}>
                  {partner.name}
                </h3>
                <p className="text-white/70 text-sm mb-4">{partner.description}</p>

                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/${partner.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#25D366] rounded-full hover:bg-[#25D366]/80 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle size={18} className="text-white" />
                  </a>
                  <a
                    href={`https://instagram.com/${partner.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-full hover:opacity-80 transition-opacity"
                    title="Instagram"
                  >
                    <Instagram size={18} className="text-white" />
                  </a>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#F5B700] rounded-full hover:bg-[#F5B700]/80 transition-colors"
                    title="Website"
                  >
                    <ExternalLink size={18} className="text-white" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}