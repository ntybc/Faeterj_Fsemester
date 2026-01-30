import { BedDouble, Users, Bath, Maximize2, X } from 'lucide-react';
import { useState } from 'react';

interface RoomsGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onBookRoom: (roomId: string) => void;
}

export function RoomsGallery({ isOpen, onClose, onBookRoom }: RoomsGalleryProps) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const rooms = [
    {
      id: 'A1',
      name: 'Quarto Privativo A1',
      type: 'private',
      capacity: 4,
      beds: 4,
      hasPrivateBathroom: true,
      price: 80,
      image: 'https://images.unsplash.com/photo-1743116591552-9ff5e8c1ad31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBiZWRyb29tJTIwY296eXxlbnwxfHx8fDE3NjMwNjk4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Quarto privativo com 4 camas, banheiro privativo e armários individuais.',
      features: ['Janela com vista', 'Boa ventilação', 'Iluminação natural', 'Tomadas individuais']
    },
    {
      id: 'A2',
      name: 'Quarto Privativo A2',
      type: 'private',
      capacity: 4,
      beds: 4,
      hasPrivateBathroom: true,
      price: 80,
      image: 'https://images.unsplash.com/photo-1743116591552-9ff5e8c1ad31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBiZWRyb29tJTIwY296eXxlbnwxfHx8fDE3NjMwNjk4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Quarto privativo com 4 camas, banheiro privativo e armários individuais.',
      features: ['Janela lateral', 'Ar-condicionado', 'Espaço amplo', 'Cofre individual']
    },
    {
      id: 'A3',
      name: 'Quarto Privativo A3',
      type: 'private',
      capacity: 4,
      beds: 4,
      hasPrivateBathroom: true,
      price: 80,
      image: 'https://images.unsplash.com/photo-1743116591552-9ff5e8c1ad31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBiZWRyb29tJTIwY296eXxlbnwxfHx8fDE3NjMwNjk4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Quarto privativo com 4 camas, banheiro privativo e armários individuais.',
      features: ['Mais silencioso', 'Ventilador de teto', 'Luz de leitura', 'Varanda pequena']
    },
    {
      id: 'A4',
      name: 'Quarto Compartilhado A4',
      type: 'shared',
      capacity: 8,
      beds: 8,
      hasPrivateBathroom: false,
      price: 80,
      image: 'https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsfGVufDF8fHx8MTc2MzA2OTg3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Quarto compartilhado com 8 camas beliche, banheiro compartilhado e armários.',
      features: ['Ambiente social', 'Beliches confortáveis', 'Espaço amplo', 'Ótimo custo-benefício']
    },
    {
      id: 'A5',
      name: 'Quarto Compartilhado A5',
      type: 'shared',
      capacity: 8,
      beds: 8,
      hasPrivateBathroom: false,
      price: 80,
      image: 'https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsfGVufDF8fHx8MTc2MzA2OTg3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Quarto compartilhado com 8 camas beliche, banheiro compartilhado e armários.',
      features: ['Perto da cozinha', 'Janelas grandes', 'Muita luz natural', 'Convívio social']
    },
    {
      id: 'A6',
      name: 'Quarto Compartilhado A6',
      type: 'shared',
      capacity: 8,
      beds: 8,
      hasPrivateBathroom: false,
      price: 80,
      image: 'https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsfGVufDF8fHx8MTc2MzA2OTg3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Quarto compartilhado com 8 camas beliche, banheiro compartilhado e armários.',
      features: ['Vista para o jardim', 'Mais afastado', 'Tranquilo', 'Área de convivência']
    },
    {
      id: 'A7',
      name: 'Quarto Grande A7',
      type: 'large',
      capacity: 12,
      beds: 12,
      hasPrivateBathroom: true,
      price: 80,
      image: 'https://images.unsplash.com/photo-1627917579160-eb774dc3dbfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaG9zdGVsJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYzMDY5ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Quarto amplo com 12 camas, banheiro privativo e muito espaço.',
      features: ['Espaço generoso', 'Banheiro privativo', 'Área de estar', 'Ideal para grupos']
    },
    {
      id: 'A8',
      name: 'Quarto Grande A8',
      type: 'large',
      capacity: 12,
      beds: 12,
      hasPrivateBathroom: true,
      price: 80,
      image: 'https://images.unsplash.com/photo-1627917579160-eb774dc3dbfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaG9zdGVsJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYzMDY5ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Quarto amplo com 12 camas, banheiro privativo e muito espaço.',
      features: ['Vista panorâmica', 'Mais silencioso', 'Grande capacidade', 'Confortável']
    },
    {
      id: 'A9',
      name: 'Quarto Grande A9',
      type: 'large',
      capacity: 12,
      beds: 12,
      hasPrivateBathroom: true,
      price: 80,
      image: 'https://images.unsplash.com/photo-1627917579160-eb774dc3dbfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaG9zdGVsJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYzMDY5ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Quarto amplo com 12 camas, banheiro privativo e muito espaço.',
      features: ['Perto da área comum', 'Terraço compartilhado', 'Excelente iluminação', 'Espaçoso']
    },
  ];

  const selectedRoomData = selectedRoom ? rooms.find(r => r.id === selectedRoom) : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#2C546B] text-white p-6 flex justify-between items-center rounded-t-lg">
          <h2 style={{ fontFamily: 'Playfair Display' }}>Nossos Quartos</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="group border border-[#7E7E7E]/20 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-[#F5B700] text-white px-3 py-1 rounded-full">
                    R$ {room.price}/noite
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-[#2C546B] mb-3" style={{ fontFamily: 'Playfair Display' }}>
                    {room.name}
                  </h3>
                  <p className="text-sm text-[#7E7E7E] mb-6">{room.description}</p>

                  <div className="flex gap-4 mb-6 text-sm text-[#7E7E7E]">
                    <div className="flex items-center gap-1">
                      <BedDouble size={16} />
                      <span>{room.beds} camas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{room.capacity} pessoas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath size={16} />
                      <span>{room.hasPrivateBathroom ? 'Privativo' : 'Compartilhado'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRoom(room.id)}
                      className="flex-1 px-4 py-2 border border-[#2C546B] text-[#2C546B] rounded-lg hover:bg-[#2C546B] hover:text-white transition-colors"
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => onBookRoom(room.id)}
                      className="flex-1 px-4 py-2 bg-[#F5B700] text-white rounded-lg hover:bg-[#F5B700]/90 transition-colors"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedRoomData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedRoomData.image}
                alt={selectedRoomData.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <h2 className="text-[#2C546B] mb-4" style={{ fontFamily: 'Playfair Display' }}>
                {selectedRoomData.name}
              </h2>

              <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <BedDouble className="text-[#F5B700]" size={24} />
                  <span>{selectedRoomData.beds} camas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-[#4B6B50]" size={24} />
                  <span>Até {selectedRoomData.capacity} pessoas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="text-[#2C546B]" size={24} />
                  <span>{selectedRoomData.hasPrivateBathroom ? 'Banheiro Privativo' : 'Banheiro Compartilhado'}</span>
                </div>
              </div>

              <p className="text-[#7E7E7E] mb-6">{selectedRoomData.description}</p>

              <h3 className="text-[#2C546B] mb-3" style={{ fontFamily: 'Playfair Display' }}>
                Características
              </h3>
              <ul className="grid grid-cols-2 gap-3 mb-6">
                {selectedRoomData.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-[#7E7E7E]">
                    <div className="w-2 h-2 bg-[#F5B700] rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="bg-[#F3E9D2] rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-[#7E7E7E]">Preço por cama/noite</p>
                    <p className="text-[#2C546B]" style={{ fontFamily: 'Playfair Display' }}>
                      R$ {selectedRoomData.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7E7E7E]">Quarto inteiro</p>
                    <p className="text-[#2C546B]" style={{ fontFamily: 'Playfair Display' }}>
                      R$ {selectedRoomData.price * 3}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onBookRoom(selectedRoomData.id);
                    setSelectedRoom(null);
                  }}
                  className="w-full px-6 py-3 bg-[#F5B700] text-white rounded-lg hover:bg-[#F5B700]/90 transition-colors"
                >
                  Reservar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}