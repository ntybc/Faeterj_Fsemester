import { MapPin, Heart, Users, Award } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: <MapPin className="text-[#F5B700]" size={32} />,
      title: 'Localização Privilegiada',
      description: 'No coração de Santa Teresa, perto do bondinho histórico e dos melhores restaurantes do bairro'
    },
    {
      icon: <Heart className="text-[#B65C39]" size={32} />,
      title: 'Ambiente Acolhedor',
      description: 'Combine o charme boêmio com conforto moderno em um espaço reservado e silencioso'
    },
    {
      icon: <Users className="text-[#4B6B50]" size={32} />,
      title: 'Comunidade Vibrante',
      description: 'Conheça viajantes de todo o mundo em nossos espaços compartilhados'
    },
    {
      icon: <Award className="text-[#2C546B]" size={32} />,
      title: 'Qualidade Garantida',
      description: 'Quartos limpos, camas confortáveis e serviços de primeira qualidade'
    }
  ];

  return (
    <section id="sobre" className="py-24 bg-white texture-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-[#2C546B] mb-8" style={{ fontFamily: 'Playfair Display' }}>
            Sobre o Albergue Santa Teresa
          </h2>
          <p className="max-w-3xl mx-auto text-[#7E7E7E] leading-relaxed text-center">
            Localizado no charmoso bairro de Santa Teresa, nosso albergue oferece uma experiência única 
            que combina a autenticidade da cultura carioca com instalações modernas e confortáveis. 
            Seja você um mochileiro em busca de aventura ou um viajante procurando um refúgio acolhedor, 
            este é o lugar perfeito para chamar de lar durante sua estadia no Rio de Janeiro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-lg hover:bg-[#F3E9D2]/50 transition-colors duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-[#F3E9D2] rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-[#2C546B] mb-4" style={{ fontFamily: 'Playfair Display' }}>
                {feature.title}
              </h3>
              <p className="text-[#7E7E7E]">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1521110629568-767880bfa449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBraXRjaGVuJTIwaG9zdGVsfGVufDF8fHx8MTc2MzA2OTg3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Cozinha compartilhada"
              className="rounded-lg shadow-xl w-full h-[400px] object-cover"
            />
          </div>
          <div>
            <h3 className="text-[#2C546B] mb-6" style={{ fontFamily: 'Playfair Display' }}>
              Nossa História
            </h3>
            <p className="text-[#7E7E7E] mb-6">
              Fundado com o propósito de criar um espaço onde viajantes de todas as nacionalidades 
              pudessem se encontrar e compartilhar experiências, o Albergue Santa Teresa se tornou 
              um ponto de encontro para aventureiros que buscam conhecer o verdadeiro Rio de Janeiro.
            </p>
            <p className="text-[#7E7E7E]">
              Com uma arquitetura que preserva o charme histórico do bairro e amenidades modernas, 
              oferecemos o equilíbrio perfeito entre tradição e conforto. Cada detalhe foi pensado 
              para proporcionar uma experiência memorável e autêntica.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}