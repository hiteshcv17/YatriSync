import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bus, Users, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Clock, MapPin } from 'lucide-react';

interface DirectBusBookingViewProps {
  onOpenTicket: (bookingId: string) => void;
  onOpenWallet: () => void;
}

export const DirectBusBookingView: React.FC<DirectBusBookingViewProps> = ({ onOpenTicket, onOpenWallet }) => {
  const { buses, poolGroups, routes, bookDirectBus, walletBalance } = useApp();

  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const [seatCount, setSeatCount] = useState<number>(1);
  const [passengerName, setPassengerName] = useState<string>('Arjun Prasad');
  const [phone, setPhone] = useState<string>('+91 98860 77123');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string; bookingId?: string } | null>(null);

  // Filter ONLY allocated buses that are BOARDING or ASSIGNED (FR-05 rule!)
  const allocatedBuses = buses.filter(b => b.status === 'BOARDING' || b.status === 'ASSIGNED');

  const activeBus = buses.find(b => b.id === (selectedBusId || allocatedBuses[0]?.id));
  const activePool = poolGroups.find(p => p.id === activeBus?.currentPoolId);
  const activeRoute = routes.find(r => r.routeId === activePool?.routeId);

  const availableSeats = activeBus
    ? activeBus.totalCapacity - activeBus.reservedSeatsForTrain - activeBus.directBookedSeats - activeBus.enRouteBookedSeats
    : 0;

  const farePerSeat = activeRoute?.standardFare || 30;
  const totalFare = farePerSeat * seatCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBus) return;

    setFeedback(null);
    const res = bookDirectBus({
      busId: activeBus.id,
      seatCount,
      passengerName,
      phone,
    });
    setFeedback(res);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Direct Bus Seat Reservation</h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Board an already allocated YatriSync bus directly without an arriving train ticket (FR-05). Existing rail passenger seats are strictly protected.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Protected Train Reservations</span>
        </div>
      </div>

      {allocatedBuses.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Bus className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Allocated Buses Available for Direct Booking</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Direct seats only open after a passenger pool reaches 20 seats and is approved by the transport operator. Switch to the <strong>Operator Dashboard</strong> to allocate a bus first!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Allocated Bus Cards */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Select an Allocated YatriSync Bus:</h3>
            <div className="space-y-3">
              {allocatedBuses.map(bus => {
                const pool = poolGroups.find(p => p.id === bus.currentPoolId);
                const isSelected = (selectedBusId || allocatedBuses[0]?.id) === bus.id;
                const openSeats = bus.totalCapacity - bus.reservedSeatsForTrain - bus.directBookedSeats - bus.enRouteBookedSeats;

                return (
                  <div
                    key={bus.id}
                    onClick={() => setSelectedBusId(bus.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm font-mono">{bus.regNumber}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {bus.busType}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 font-semibold ${isSelected ? 'text-slate-200' : 'text-slate-800'}`}>
                          Destination: {pool?.targetDestination || 'Corridor Service'}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`text-lg font-bold font-mono ${
                          openSeats > 0 ? (isSelected ? 'text-emerald-300' : 'text-emerald-700') : 'text-red-500'
                        }`}>
                          {openSeats} Open
                        </span>
                        <span className={`block text-[10px] ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                          of {bus.totalCapacity} capacity
                        </span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className={`p-2 rounded-xl text-[11px] grid grid-cols-3 gap-1 text-center font-mono ${
                      isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'
                    }`}>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wide opacity-80">Train Reserved</span>
                        <strong className="font-bold">{bus.reservedSeatsForTrain}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wide opacity-80">Direct Booked</span>
                        <strong className="font-bold">{bus.directBookedSeats}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wide opacity-80">En-Route Booked</span>
                        <strong className="font-bold">{bus.enRouteBookedSeats}</strong>
                      </div>
                    </div>

                    <div className={`mt-3 pt-2 border-t flex flex-wrap items-center justify-between text-xs ${
                      isSelected ? 'border-white/10 text-slate-300' : 'border-slate-100 text-slate-500'
                    }`}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Departure: <strong>{bus.assignedDepartureTime || '12:45 PM'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{bus.pickupLocation}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Direct Booking Form */}
          {activeBus && (
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <h3 className="font-bold text-slate-900 text-base">Direct Booking Details</h3>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bus Registration:</span>
                  <strong className="font-mono text-slate-900">{activeBus.regNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <strong className="text-slate-900">{activePool?.targetDestination}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fare per Seat:</span>
                  <strong className="font-mono text-slate-900">₹{farePerSeat}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Unreserved:</span>
                  <strong className="font-mono text-emerald-700">{availableSeats} seats</strong>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Select Seats:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        type="button"
                        disabled={num > availableSeats}
                        onClick={() => setSeatCount(num)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all ${
                          seatCount === num
                            ? 'bg-slate-900 text-white border-slate-900'
                            : num > availableSeats
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Passenger Name:</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={e => setPassengerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Contact Phone:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Fare to be Captured</span>
                    <span className="text-xl font-bold font-mono text-slate-900">₹{totalFare}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {walletBalance < totalFare && (
                      <button
                        type="button"
                        onClick={onOpenWallet}
                        className="px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-300 rounded-xl"
                      >
                        Top Up
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={availableSeats <= 0 || walletBalance < totalFare}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1 ${
                        availableSeats <= 0 || walletBalance < totalFare
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      <span>Book Direct</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {feedback && (
                  <div className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2 ${
                    feedback.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    <div className="flex items-start gap-1.5">
                      {feedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />}
                      <div>
                        <strong>{feedback.success ? 'Confirmed!' : 'Failed'}</strong>
                        <p>{feedback.message}</p>
                      </div>
                    </div>
                    {feedback.bookingId && (
                      <button
                        type="button"
                        onClick={() => onOpenTicket(feedback.bookingId!)}
                        className="px-2.5 py-1 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 shrink-0"
                      >
                        Ticket
                      </button>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
