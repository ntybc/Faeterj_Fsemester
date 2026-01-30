export function ImageGallery() {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1743116591552-9ff5e8c1ad31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBiZWRyb29tJTIwY296eXxlbnwxfHx8fDE3NjMwNjk4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Quartos Confortáveis',
      description: 'Ambientes acolhedores e bem equipados'
    },
    {
      url: 'https://images.unsplash.com/photo-1627917579160-eb774dc3dbfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaG9zdGVsJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYzMDY5ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Espaços Compartilhados',
      description: 'Áreas de convivência com charme vintage'
    },
    {
      url: 'https://images.unsplash.com/photo-1688433339044-87e5ab8cabb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYW50YSUyMFRlcmVzYSUyMFJpbyUyMEphbmVpcm98ZW58MXx8fHwxNzYzMDY5ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Santa Teresa',
      description: 'Localização privilegiada no coração do bairro'
    }
  ];

  return (
    <section className="py-24 bg-[#F3E9D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[#2C546B] mb-16" style={{ fontFamily: 'Playfair Display' }}>
          Conheça Nossos Espaços
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {images.map((image, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 aspect-[4/3]"
            >
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 style={{ fontFamily: 'Playfair Display' }}>{image.title}</h3>
                  <p className="text-sm mt-2">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}