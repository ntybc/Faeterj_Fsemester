import { useState, useEffect } from 'react';
import { X, Calendar, BedDouble, CreditCard, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  accessToken?: string;
  preselectedRoomId?: string;
}

export function ReservationModal({
  isOpen,
  onClose,
  isLoggedIn,
  onLoginRequired,
  accessToken,
  preselectedRoomId
}: ReservationModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Step 1: Dates
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState<'all' | 'private' | 'shared' | 'large'>('all');
  
  // Step 2: Room selection
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [wholeRoom, setWholeRoom] = useState(false);
  const [bedsCount, setBedsCount] = useState(1);
  const [selectedBeds, setSelectedBeds] = useState<number[]>([]);
  
  // Step 3: Payment
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });

  useEffect(() => {
    if (isOpen && !isLoggedIn) {
      onLoginRequired();
      onClose();
    }
  }, [isOpen, isLoggedIn]);

  useEffect(() => {
    if (preselectedRoomId && availability.length > 0) {
      const room = availability.find(r => r.id === preselectedRoomId);
      if (room) {
        setSelectedRoom(room);
        setStep(2);
      }
    }
  }, [preselectedRoomId, availability]);

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      setError('Por favor, selecione as datas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/availability`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            checkIn,
            checkOut,
            roomType: roomType === 'all' ? undefined : roomType,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao verificar disponibilidade');
      }

      setAvailability(result.availability);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async () => {
    if (!selectedRoom) {
      setError('Selecione um quarto');
      return;
    }

    if (!wholeRoom && selectedBeds.length === 0) {
      setError('Selecione pelo menos uma cama');
      return;
    }

    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.cardExpiry || !paymentData.cardCvv) {
      setError('Preencha todos os dados do cartão');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0cae32e3/reservations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            roomId: selectedRoom.id,
            checkIn,
            checkOut,
            bedsReserved: wholeRoom ? selectedRoom.capacity : selectedBeds.length,
            bedDetails: wholeRoom ? 'Quarto inteiro' : selectedBeds.map(b => `Cama ${b + 1}`).join(', '),
            wholeRoom,
            paymentInfo: {
              lastFourDigits: paymentData.cardNumber.slice(-4),
              cardName: paymentData.cardName,
            },
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar reserva');
      }

      alert('Reserva realizada com sucesso! Você receberá uma confirmação por e-mail.');
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedRoom || !checkIn || !checkOut) return 0;
    
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (wholeRoom) {
      return selectedRoom.wholeRoomPrice * nights;
    }
    
    return selectedRoom.pricePerBed * selectedBeds.length * nights;
  };

  const toggleBedSelection = (bedIndex: number) => {
    if (selectedBeds.includes(bedIndex)) {
      setSelectedBeds(selectedBeds.filter(b => b !== bedIndex));
    } else {
      setSelectedBeds([...selectedBeds, bedIndex]);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#2C546B] text-white p-6 flex justify-between items-center rounded-t-lg">
          <div>
            <h2 style={{ fontFamily: 'Playfair Display' }}>
              {step === 1 && 'Selecione as Datas'}
              {step === 2 && 'Escolha seu Quarto'}
              {step === 3 && 'Pagamento'}
            </h2>
            <p className="text-sm text-white/80 mt-1">Passo {step} de 3</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Select Dates */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#2C546B] mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={today}
                    className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                  />
                </div>

                <div>
                  <label className="block text-[#2C546B] mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || today}
                    className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2C546B] mb-2">Tipo de Acomodação</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: 'private', label: 'Privativo (4 camas)' },
                    { value: 'shared', label: 'Compartilhado (8 camas)' },
                    { value: 'large', label: 'Grande (12 camas)' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRoomType(option.value as any)}
                      className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                        roomType === option.value
                          ? 'border-[#F5B700] bg-[#F5B700] text-white'
                          : 'border-[#7E7E7E]/30 text-[#7E7E7E] hover:border-[#F5B700]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={checkAvailability}
                disabled={loading || !checkIn || !checkOut}
                className="w-full px-6 py-3 bg-[#F5B700] text-white rounded-lg hover:bg-[#F5B700]/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Verificar Disponibilidade'}
              </button>
            </div>
          )}

          {/* Step 2: Select Room */}
          {step === 2 && (
            <div className="space-y-6">
              {availability.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#7E7E7E]">Nenhum quarto disponível para essas datas</p>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-4 px-6 py-2 border border-[#2C546B] text-[#2C546B] rounded-lg hover:bg-[#2C546B] hover:text-white transition-colors"
                  >
                    Escolher Outras Datas
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availability.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedRoom?.id === room.id
                            ? 'border-[#F5B700] bg-[#F5B700]/10'
                            : 'border-[#7E7E7E]/20 hover:border-[#F5B700]'
                        }`}
                      >
                        <h3 className="text-[#2C546B] mb-2" style={{ fontFamily: 'Playfair Display' }}>
                          Quarto {room.id}
                        </h3>
                        <div className="space-y-1 text-sm text-[#7E7E7E]">
                          <p>Capacidade: {room.capacity} pessoas</p>
                          <p>Disponível: {room.availableBeds} camas</p>
                          <p>Banheiro: {room.hasPrivateBathroom ? 'Privativo' : 'Compartilhado'}</p>
                          <p className="text-[#F5B700]">R$ {room.pricePerBed}/cama/noite</p>
                          <p className="text-[#4B6B50]">R$ {room.wholeRoomPrice}/quarto inteiro</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedRoom && (
                    <div className="bg-[#F3E9D2] rounded-lg p-6">
                      <h3 className="text-[#2C546B] mb-4" style={{ fontFamily: 'Playfair Display' }}>
                        Quarto {selectedRoom.id} - Configuração
                      </h3>

                      <div className="mb-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={wholeRoom}
                            onChange={(e) => {
                              setWholeRoom(e.target.checked);
                              setSelectedBeds([]);
                            }}
                            className="w-5 h-5"
                          />
                          <span className="text-[#2C546B]">Reservar quarto inteiro (R$ {selectedRoom.wholeRoomPrice * Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} total)</span>
                        </label>
                      </div>

                      {!wholeRoom && (
                        <div>
                          <p className="text-[#2C546B] mb-3">Selecione as camas:</p>
                          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                            {Array.from({ length: selectedRoom.availableBeds }).map((_, index) => (
                              <button
                                key={index}
                                onClick={() => toggleBedSelection(index)}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  selectedBeds.includes(index)
                                    ? 'border-[#F5B700] bg-[#F5B700] text-white'
                                    : 'border-[#7E7E7E]/30 text-[#7E7E7E] hover:border-[#F5B700]'
                                }`}
                              >
                                <BedDouble size={20} className="mx-auto mb-1" />
                                <span className="text-xs">{index + 1}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-3 border border-[#2C546B] text-[#2C546B] rounded-lg hover:bg-[#2C546B] hover:text-white transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!selectedRoom || (!wholeRoom && selectedBeds.length === 0)}
                      className="flex-1 px-6 py-3 bg-[#F5B700] text-white rounded-lg hover:bg-[#F5B700]/90 transition-colors disabled:opacity-50"
                    >
                      Continuar para Pagamento
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-[#F3E9D2] rounded-lg p-6">
                <h3 className="text-[#2C546B] mb-4" style={{ fontFamily: 'Playfair Display' }}>
                  Resumo da Reserva
                </h3>
                <div className="space-y-2 text-[#7E7E7E]">
                  <p><strong>Quarto:</strong> {selectedRoom?.id}</p>
                  <p><strong>Check-in:</strong> {new Date(checkIn).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Check-out:</strong> {new Date(checkOut).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Noites:</strong> {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}</p>
                  <p><strong>Tipo:</strong> {wholeRoom ? 'Quarto inteiro' : `${selectedBeds.length} cama(s)`}</p>
                  <p className="text-xl text-[#F5B700]"><strong>Total: R$ {calculateTotal()}</strong></p>
                </div>
              </div>

              <div>
                <h3 className="text-[#2C546B] mb-4" style={{ fontFamily: 'Playfair Display' }}>
                  Dados do Cartão
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#2C546B] mb-2">
                      <CreditCard size={16} className="inline mr-2" />
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2C546B] mb-2">Nome no Cartão</label>
                    <input
                      type="text"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                      placeholder="NOME COMO NO CARTÃO"
                      className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#2C546B] mb-2">Validade</label>
                      <input
                        type="text"
                        value={paymentData.cardExpiry}
                        onChange={(e) => setPaymentData({...paymentData, cardExpiry: e.target.value})}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#2C546B] mb-2">CVV</label>
                      <input
                        type="text"
                        value={paymentData.cardCvv}
                        onChange={(e) => setPaymentData({...paymentData, cardCvv: e.target.value})}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-3 border border-[#7E7E7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <AlertCircle size={16} className="inline mr-2" />
                  Pagamento integral no cartão de crédito. Não há opção de parcelamento.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 border border-[#2C546B] text-[#2C546B] rounded-lg hover:bg-[#2C546B] hover:text-white transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={createReservation}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#F5B700] text-white rounded-lg hover:bg-[#F5B700]/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
