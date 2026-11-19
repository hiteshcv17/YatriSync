import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Bus, ShieldAlert, CheckCircle2, AlertCircle, ArrowRight, Clock } from 'lucide-react';

interface EnRoutePickupBookingViewProps {
  onOpenTicket: (bookingId: string) => void;
  onOpenWallet: () => void;
}

export const EnRoutePickupBookingView: React.FC<EnRoutePickupBookingViewProps> = ({
  onOpenTicket,
  onOpenWallet,
}) => {
  const { buses, poolGroups, routes, bookEnRoutePickup, walletBalance } = useApp();

  const allocatedBuses = buses.filter(b => b.status === 'BOARDING' || b.status === 'ASSIGNED');
  const [selectedBusId, setSelectedBusId] = useState<string>(allocatedBuses[0]?.id || '');
  const [selectedStopId, setSelectedStopId] = useState<string>('');
  const [seatCount, setSeatCount] = useState<number>(1);
  const [passengerName, setPassengerName] = useState<string>('Arjun Prasad');
  const [phone, setPhone] = useState<string>('+91 98860 77123');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string; bookingId?: string } | null>(null);

  const activeBus = buses.find(b => b.id === (selectedBusId || allocatedBuses[0]?.id));
  const activePool = poolGroups.find(p => p.id === activeBus?.currentPoolId);
  const activeRoute = routes.find(r => r.routeId === activePool?.routeId);

  const availableStops = activeRoute?.approvedPickupStops || [];
  const selectedStop = availableStops.find(s => s.id === (selectedStopId || availableStops[0]?.id)) || availableStops[0];

  const availableSeats = activeBus
    ? activeBus.totalCapacity - activeBus.reservedSeatsForTrain - activeBus.directBookedSeats - activeBus.enRouteBookedSeats
    : 0;

  const farePerSeat = selectedStop?.fare || 25;
  const totalFare = farePerSeat * seatCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBus || !selectedStop) return;

    setFeedback(null);
    const res = bookEnRoutePickup({
      busId: activeBus.id,
      stopId: selectedStop.id,
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
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Approved En-Route Pickup Booking</h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Board an active YatriSync bus along its corridor at officially certified pickup shelters (FR-06). Arbitrary roadside hail is strictly prohibited for passenger safety.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-semibold text-amber-800 flex items-center gap-1.5 shrink-0">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Designated Safe Stops Only</span>
        </div>
      </div>

      {allocatedBuses.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Bus className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Buses En-Route Currently</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            En-route pickups are enabled only when a bus has been allocated to a corridor route. Check the Operator Dashboard or create a pooled booking first.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Approved Stops on Active Route */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Active Vehicle & Corridor:</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {activeBus?.regNumber} ({activeBus?.busType}) · {activePool?.targetDestination}
                  </p>
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {availableSeats} Seats Open
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Certified Pickup Shelter:
                </label>
                <div className="space-y-2">
                  {availableStops.map(stop => {
                    const isSelected = (selectedStopId || availableStops[0]?.id) === stop.id;
                    return (
                      <div
                        key={stop.id}
                        onClick={() => setSelectedStopId(stop.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300 text-slate-900'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          <div>
                            <span className="font-bold text-xs block">{stop.name}</span>
                            <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                              Landmark: {stop.landmark}
                            </span>
                            <div className={`flex items-center gap-2 text-[10px] mt-1 font-mono ${
                              isSelected ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              <span>{stop.kmFromStation} km from Station</span>
                              <span>·</span>
                              <span>Bus ETA +{stop.etaMinutes} mins</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`font-mono font-bold text-xs ${
                            isSelected ? 'text-emerald-300' : 'text-slate-900'
                          }`}>
                            ₹{stop.fare}
                          </span>
                          <span className={`block text-[9px] ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                            per passenger
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: En-Route Booking Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="font-bold text-slate-900 text-base">En-Route Reservation</h3>

            {selectedStop && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Location:</span>
                  <strong className="text-slate-900">{selectedStop.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Landmark Shelter:</span>
                  <span className="text-slate-700 font-medium">{selectedStop.landmark}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bus Registration:</span>
                  <strong className="font-mono text-slate-900">{activeBus?.regNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Boarding ETA:</span>
                  <span className="text-emerald-700 font-semibold font-mono">
                    Departure +{selectedStop.etaMinutes} mins
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Number of Passengers:</label>
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
                <label className="text-xs font-bold text-slate-700 block">Lead Passenger Name:</label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={e => setPassengerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Mobile Phone:</label>
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
                  <span className="text-xs text-slate-500 block">Total Fare to Capture</span>
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
                    <span>Confirm Pickup</span>
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
        </div>
      )}
    </div>
  );
};
