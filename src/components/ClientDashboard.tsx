import { useState, useEffect } from 'react';
import { X, Calendar, BedDouble, CreditCard, AlertCircle, Star } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ClientDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
}

export function ClientDashboard({ isOpen, onClose, accessToken }: ClientDashboardProps) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState<'reservations' | 'reviews'>('reservations');
  
  // Review state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewReservation, setReviewReservation] = useState<any>(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadReservations();
    }
  }, [isOpen]);

  const loadReservations = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/my-reservations`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao carregar reservas');
      }

      setReservations(result.reservations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/cancel-reservation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ reservationId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao cancelar reserva');
      }

      alert(result.message);
      loadReservations();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!reviewData.comment.trim()) {
      setError('Por favor, escreva um comentário');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...reviewData,
            reservationId: reviewReservation.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar avaliação');
      }

      alert('Avaliação enviada com sucesso!');
      setShowReviewForm(false);
      setReviewReservation(null);
      setReviewData({ rating: 5, comment: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getReservationStatus = (reservation: any) => {
    if (reservation.status === 'cancelled') {
      return { text: 'Cancelada', color: 'text-red-600' };
    }
    
    const today = new Date();
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    
    if (today < checkIn) {
      return { text: 'Confirmada', color: 'text-green-600' };
    } else if (today >= checkIn && today <= checkOut) {
      return { text: 'Em andamento', color: 'text-blue-600' };
    } else {
      return { text: 'Concluída', color: 'text-gray-600' };
    }
  };

  const canCancel = (reservation: any) => {
    if (reservation.status === 'cancelled') return false;
    const today = new Date();
    const checkIn = new Date(reservation.checkIn);
    return today < checkIn;
  };

  const canReview = (reservation: any) => {
    if (reservation.status === 'cancelled') return false;
    const today = new Date();
    const checkOut = new Date(reservation.checkOut);
    return today > checkOut;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#2C546B] text-white p-6 flex justify-between items-center rounded-t-lg">
          <h2 style={{ fontFamily: 'Playfair Display' }}>Meu Painel</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#7E7E7E]/20">
          <div className="flex">
            <button
              onClick={() => setSelectedTab('reservations')}
              className={`flex-1 px-6 py-4 ${
                selectedTab === 'reservations'
                  ? 'border-b-2 border-[#F5B700] text-[#F5B700]'
                  : 'text-[#7E7E7E]'
              }`}
            >
              Minhas Reservas
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loading && reservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#7E7E7E]">Carregando...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#7E7E7E]">Você ainda não tem reservas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => {
                const status = getReservationStatus(reservation);
                
                return (
                  <div
                    key={reservation.id}
                    className="border border-[#7E7E7E]/20 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-[#2C546B]" style={{ fontFamily: 'Playfair Display' }}>
                            Quarto {reservation.roomId}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm ${status.color} bg-gray-100`}>
                            {status.text}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#7E7E7E] mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                              Check-in: {new Date(reservation.checkIn).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                              Check-out: {new Date(reservation.checkOut).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BedDouble size={16} />
                            <span>
                              {reservation.wholeRoom
                                ? 'Quarto inteiro'
                                : `${reservation.bedsReserved} cama(s)`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard size={16} />
                            <span>Total: R$ {reservation.totalAmount}</span>
                          </div>
                        </div>

                        {reservation.status === 'cancelled' && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                            <p className="text-red-800">
                              Cancelada em: {new Date(reservation.cancelledAt).toLocaleDateString('pt-BR')}
                            </p>
                            {reservation.refundAmount > 0 && (
                              <p className="text-red-800">
                                Reembolso: R$ {reservation.refundAmount.toFixed(2)} ({reservation.refundPercentage}%)
                                {reservation.requiresApproval && ' - Aguardando aprovação'}
                              </p>
                            )}
                          </div>
                        )}

                        {reservation.paymentStatus === 'paid' && reservation.status !== 'cancelled' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                            <p className="text-green-800">
                              ✓ Pagamento confirmado - Cartão final {reservation.paymentInfo?.lastFourDigits}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 min-w-[140px]">
                        {canCancel(reservation) && (
                          <button
                            onClick={() => cancelReservation(reservation.id)}
                            disabled={loading}
                            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        )}
                        {canReview(reservation) && (
                          <button
                            onClick={() => {
                              setReviewReservation(reservation);
                              setShowReviewForm(true);
                            }}
                            className="px-4 py-2 bg-[#F5B700] text-white rounded-lg hover:bg-[#F5B700]/90 transition-colors"
                          >
                            <Star size={16} className="inline mr-1" />
                            Avaliar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Política de Cancelamento */}
          <div className="mt-8 bg-[#F3E9D2] rounded-lg p-6">
            <h3 className="text-[#2C546B] mb-3" style={{ fontFamily: 'Playfair Display' }}>
              Política de Cancelamento
            </h3>
            <ul className="space-y-2 text-sm text-[#7E7E7E]">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Cancelamento gratuito: até 3 dias antes do check-in</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">⚠</span>
                <span>Menos de 3 dias: reembolso de 50% (sujeito a aprovação)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">ℹ</span>
                <span>Extensões de estadia podem ser solicitadas mediante disponibilidade</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewForm && reviewReservation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
            <div className="bg-[#F5B700] text-white p-6 flex justify-between items-center rounded-t-lg">
              <h3 style={{ fontFamily: 'Playfair Display' }}>Avaliar Estadia</h3>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setReviewReservation(null);
                }}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[#2C546B] mb-3">Sua Avaliação</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={star <= reviewData.rating ? 'fill-[#F5B700] text-[#F5B700]' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#2C546B] mb-2">Seu Comentário</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Conte-nos sobre sua experiência..."
                  rows={5}
                  className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <AlertCircle size={16} className="inline mr-2" />
                  Apenas avaliações positivas (4 ou 5 estrelas) são exibidas publicamente
                </p>
              </div>

              <button
                onClick={submitReview}
                disabled={loading}
                className="w-full px-6 py-3 bg-[#F5B700] text-white rounded-lg hover:bg-[#F5B700]/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar Avaliação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
