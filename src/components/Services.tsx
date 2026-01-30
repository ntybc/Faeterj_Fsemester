import { Wifi, Coffee, Utensils, Car, Shirt, Gamepad2, Tv, TreeDeciduous, BedDouble, Clock, Volume2, Ban } from 'lucide-react';

export function Services() {
  const amenities = [
    { icon: <Wifi size={24} />, name: 'Wi-Fi Grátis', available: true },
    { icon: <BedDouble size={24} />, name: 'Roupas de Cama', available: true },
    { icon: <Utensils size={24} />, name: 'Cozinha Compartilhada', available: true },
    { icon: <Shirt size={24} />, name: 'Lavanderia', available: true },
    { icon: <Car size={24} />, name: 'Estacionamento (limitado)', available: true },
    { icon: <TreeDeciduous size={24} />, name: 'Jardim', available: true },
    { icon: <Gamepad2 size={24} />, name: 'Salão de Jogos', available: true },
    { icon: <Tv size={24} />, name: 'Sala de TV', available: true },
  ];

  const rules = [
    { icon: <Ban size={20} />, text: 'Proibido fumar' },
    { icon: <Ban size={20} />, text: 'Proibido uso de drogas' },
    { icon: <Ban size={20} />, text: 'Não aceitamos animais' },
    { icon: <Volume2 size={20} />, text: 'Silêncio: 22h às 8h' },
  ];

  const checkInOut = [
    { icon: <Clock size={20} />, label: 'Check-in', time: '12:00' },
    { icon: <Clock size={20} />, label: 'Check-out', time: '12:00' },
  ];

  return (
    <section id="servicos" className="py-24 bg-[#F3E9D2] texture-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[#2C546B] mb-6" style={{ fontFamily: 'Playfair Display' }}>
          Serviços e Comodidades
        </h2>
        <p className="text-center text-[#7E7E7E] mb-16 max-w-2xl mx-auto">
          Tudo que você precisa para uma estadia confortável e agradável
        </p>

        {/* Amenidades */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {amenities.map((amenity, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-8 text-center shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4B6B50] text-white rounded-full mb-4">
                {amenity.icon}
              </div>
              <p className="text-[#2C546B]">{amenity.name}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {/* Check-in/Check-out */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-[#2C546B] mb-6" style={{ fontFamily: 'Playfair Display' }}>
              Horários
            </h3>
            <div className="space-y-4">
              {checkInOut.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-3 bg-[#F5B700] rounded-lg text-white">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[#7E7E7E] text-sm">{item.label}</div>
                    <div className="text-[#2C546B]">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-[#7E7E7E]">
              Extensões de estadia podem ser solicitadas mediante disponibilidade
            </p>
          </div>

          {/* Regras */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-[#2C546B] mb-6" style={{ fontFamily: 'Playfair Display' }}>
              Regras de Convivência
            </h3>
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-3 bg-[#B65C39] rounded-lg text-white">
                    {rule.icon}
                  </div>
                  <p className="text-[#2C546B]">{rule.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-[#7E7E7E]">
              Respeitamos o descanso de todos os hóspedes para garantir uma estadia agradável
            </p>
          </div>
        </div>

        {/* Alimentação */}
        <div className="bg-gradient-to-r from-[#4B6B50] to-[#2C546B] rounded-lg p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-[#F5B700] rounded-full flex items-center justify-center">
                <Coffee size={40} className="text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="mb-3" style={{ fontFamily: 'Playfair Display' }}>
                Parceria para Alimentação
              </h3>
              <p className="text-white/90">
                Não oferecemos alimentação própria, mas mantemos convênio com um restaurante vizinho. 
                Nossos hóspedes recebem <span className="text-[#F5B700]">30% de desconto</span> em todas as refeições!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}