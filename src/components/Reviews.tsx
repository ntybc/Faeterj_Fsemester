import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

// Dados mock locais - não depende de backend
const MOCK_REVIEWS = [
  {
    id: 'local-1',
    rating: 5,
    comment: 'Lugar incrível! A localização em Santa Teresa é perfeita, perto de tudo e com aquele charme boêmio que adoro. Os quartos são limpos e confortáveis.',
    userName: 'Maria Silva',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    visible: true
  },
  {
    id: 'local-2',
    rating: 5,
    comment: 'Experiência maravilhosa! A equipe é super atenciosa e o ambiente é acolhedor. Voltarei com certeza!',
    userName: 'João Santos',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    visible: true
  },
  {
    id: 'local-3',
    rating: 5,
    comment: 'Melhor custo-benefício do Rio! Conheci pessoas incríveis e a vista é de tirar o fôlego. Recomendo!',
    userName: 'Ana Costa',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    visible: true
  },
  {
    id: 'local-4',
    rating: 4,
    comment: 'Albergue muito bom! Ótima estrutura e localização privilegiada no coração de Santa Teresa. WiFi funciona perfeitamente.',
    userName: 'Pedro Oliveira',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    visible: true
  },
  {
    id: 'local-5',
    rating: 5,
    comment: 'Simplesmente perfeito! A decoração retrô é linda e o atendimento impecável. Me senti em casa. Recomendo muito!',
    userName: 'Carla Mendes',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    visible: true
  },
  {
    id: 'local-6',
    rating: 4,
    comment: 'Ótima experiência! WiFi rápido, cozinha bem equipada e uma vibe incrível. Santa Teresa é demais e o albergue complementa perfeitamente!',
    userName: 'Lucas Ferreira',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    visible: true
  }
];

export function Reviews() {
  const [reviews, setReviews] = useState<any[]>(MOCK_REVIEWS);
  const [loading, setLoading] = useState(false);

  // Componente agora usa apenas dados locais
  // Quando o backend for reimplantado, você pode descomentar o código abaixo

  /* 
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/reviews`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.reviews && result.reviews.length > 0) {
          setReviews(result.reviews);
        }
      }
    } catch (err) {
      // Mantém reviews mock em caso de erro
      console.log('Usando reviews locais');
    }
  };
  */

  if (loading) {
    return null;
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[#2C546B] mb-6" style={{ fontFamily: 'Playfair Display' }}>
          O Que Nossos Hóspedes Dizem
        </h2>
        <p className="text-center text-[#7E7E7E] mb-16 max-w-2xl mx-auto">
          Experiências reais de viajantes que se hospedaram conosco
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.slice(0, 6).map((review) => (
            <div
              key={review.id}
              className="bg-[#F3E9D2] rounded-lg p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className={
                      index < review.rating
                        ? 'fill-[#F5B700] text-[#F5B700]'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>

              <p className="text-[#7E7E7E] mb-6 italic">"{review.comment}"</p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#2C546B] rounded-full flex items-center justify-center text-white">
                  {review.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[#2C546B]">{review.userName}</p>
                  <p className="text-xs text-[#7E7E7E]">
                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}