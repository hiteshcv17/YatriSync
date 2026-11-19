import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Train, BusRoute, PoolGroup } from '../../types';
import { Train as TrainIcon, Bus, Users, Clock, Shield, ArrowRight, CheckCircle2, AlertCircle, Sparkles, MapPin } from 'lucide-react';

interface TrainSearchAndPoolProps {
  onOpenWallet: () => void;
  onOpenTicket: (bookingId: string) => void;
}

export const TrainSearchAndPool: React.FC<TrainSearchAndPoolProps> = ({ onOpenWallet, onOpenTicket }) => {
  const {
    trains,
    routes,
    poolGroups,
    createTrainPoolBooking,
    simulateAddPassengersToPool,
    walletBalance,
  } = useApp();

  const [selectedTrainNumber, setSelectedTrainNumber] = useState<string>(trains[0].trainNumber);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0].routeId);
  const [seatCount, setSeatCount] = useState<number>(2);
  const [passengerName, setPassengerName] = useState<string>('Arjun Prasad');
  const [phone, setPhone] = useState<string>('+91 98860 77123');
  const [pnr, setPnr] = useState<string>('4231889021');
  const [isWomenSafetyPriority, setIsWomenSafetyPriority] = useState<boolean>(false);
  const [submitFeedback, setSubmitFeedback] = useState<{ success: boolean; message: string; bookingId?: string } | null>(null);

  const selectedTrain = trains.find(t => t.trainNumber === selectedTrainNumber) || trains[0];
  const selectedRoute = routes.find(r => r.routeId === selectedRouteId) || routes[0];

  // Find existing pool matching this route
  const existingPool = poolGroups.find(
    p => p.routeId === selectedRouteId && p.status !== 'DISPATCHED' && p.status !== 'CANCELLED'
  );

  const farePerSeat = selectedRoute.standardFare;
  const totalFare = farePerSeat * seatCount;
  const isLateNightTrain = selectedTrainNumber === '16228' || selectedTrainNumber === '06256';

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitFeedback(null);

    const result = createTrainPoolBooking({
      trainNumber: selectedTrain.trainNumber,
      routeId: selectedRoute.routeId,
      destination: selectedRoute.destination,
      seatCount,
      passengerName,
      phone,
      pnr,
      isWomenSafetyPriority,
    });

    setSubmitFeedback(result);
  };

  return (
    <div className="space-y-6">
      {/* Search and Pool Header Banner */}
      <div className="p-6 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Rail-to-Road Connectivity · Mysuru Hub</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Smart Train-to-Bus Passenger Pooling</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Arriving at Mysuru Junction (MYS)? Group with fellow train passengers heading to your corridor. When a route reaches <strong>20 booked seats</strong>, YatriSync requests a dedicated city feeder bus from KSRTC.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Booking Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <TrainIcon className="w-5 h-5 text-blue-600" />
            <span>Step 1: Arriving Train & Destination</span>
          </h3>

          <form onSubmit={handleBookingSubmit} className="space-y-5">
            {/* Train Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Select Arriving Train at Mysuru Junction:
              </label>
              <select
                value={selectedTrainNumber}
                onChange={e => setSelectedTrainNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium text-slate-900"
              >
                {trains.map(t => (
                  <option key={t.trainNumber} value={t.trainNumber}>
                    #{t.trainNumber} {t.trainName} (Arr: {t.arrivalTime}) · from {t.originStation}
                  </option>
                ))}
              </select>

              {/* Train Details Strip */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-900">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Scheduled Arrival: <strong>{selectedTrain.arrivalTime}</strong></span>
                </div>
                <div>Platform: <strong className="font-mono">{selectedTrain.platform}</strong></div>
                <div>Service: <strong className="font-medium">{selectedTrain.serviceType}</strong></div>
                {selectedTrain.delayMinutes > 0 && (
                  <span className="text-amber-700 font-medium font-mono text-[11px]">
                    Expected Delay: +{selectedTrain.delayMinutes} mins
                  </span>
                )}
              </div>
            </div>

            {/* Destination Corridor Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Select Onward Mysuru Destination Corridor:
              </label>
              <select
                value={selectedRouteId}
                onChange={e => setSelectedRouteId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium text-slate-900"
              >
                {routes.map(r => (
                  <option key={r.routeId} value={r.routeId}>
                    {r.destination} (Route {r.routeId}) — ₹{r.standardFare}/seat
                  </option>
                ))}
              </select>

              <div className="text-xs text-slate-500 flex items-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Major corridor stops: {selectedRoute.majorStops.join(' · ')}</span>
              </div>
            </div>

            {/* Passenger Count & PNR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Number of Passengers / Seats:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSeatCount(num)}
                      className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                        seatCount === num
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Railway PNR (or Coach/Seat):
                </label>
                <input
                  type="text"
                  value={pnr}
                  onChange={e => setPnr(e.target.value)}
                  placeholder="e.g. 4231889021"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            {/* Passenger Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Lead Passenger Name:</label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={e => setPassengerName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Mobile Number (for SMS & QR):</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            {/* FR-11: Late-Night Safety & Women's Safety Priority Checkbox */}
            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 space-y-1.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWomenSafetyPriority}
                  onChange={e => setIsWomenSafetyPriority(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <div className="text-xs text-purple-900">
                  <span className="font-bold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    Voluntary Safety-Priority Tagging (FR-11)
                  </span>
                  <p className="text-[11px] text-purple-700 leading-normal mt-0.5">
                    Optional: Flag for late-night / solitary travel priority review by transport operator. Kept strictly confidential and used only for vehicle dispatch coordination.
                  </p>
                </div>
              </label>
            </div>

            {/* Fare Summary & Submit */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Total Estimated Fare (in Escrow)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-slate-900">₹{totalFare}</span>
                  <span className="text-xs text-slate-500 font-mono">(₹{farePerSeat} × {seatCount})</span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Wallet Bal: ₹{walletBalance.toFixed(2)} · Only reserved until bus approved
                </span>
              </div>

              <div className="flex items-center gap-2">
                {walletBalance < totalFare && (
                  <button
                    type="button"
                    onClick={onOpenWallet}
                    className="px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-300 rounded-xl hover:bg-amber-100 transition-colors"
                  >
                    Top Up Wallet
                  </button>
                )}
                <button
                  type="submit"
                  disabled={walletBalance < totalFare}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-xs text-white transition-all flex items-center gap-1.5 ${
                    walletBalance < totalFare
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 shadow-md'
                  }`}
                >
                  <span>Reserve Seats & Join Pool</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Submission Feedback */}
            {submitFeedback && (
              <div className={`p-4 rounded-xl border flex items-start justify-between gap-2 text-xs ${
                submitFeedback.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}>
                <div className="flex items-start gap-2">
                  {submitFeedback.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="block text-sm">{submitFeedback.success ? 'Request Added to Pool!' : 'Request Failed'}</strong>
                    <p className="mt-0.5">{submitFeedback.message}</p>
                    {submitFeedback.bookingId && (
                      <p className="font-mono text-[11px] mt-1 font-semibold">Booking ID: {submitFeedback.bookingId}</p>
                    )}
                  </div>
                </div>

                {submitFeedback.bookingId && (
                  <button
                    type="button"
                    onClick={() => onOpenTicket(submitFeedback.bookingId!)}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors shrink-0"
                  >
                    View Ticket
                  </button>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Active Corridor Pooling Status (FR-03 Live Gauge) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-sm">Active Corridor Pool Status</h4>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Threshold: 20 Seats
              </span>
            </div>

            {existingPool ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-slate-600">{existingPool.targetDestination}</span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {existingPool.bookedSeats} / {existingPool.targetThreshold} Seats
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-1.5 border border-slate-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        existingPool.bookedSeats >= 20
                          ? 'bg-emerald-500'
                          : existingPool.bookedSeats >= 15
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (existingPool.bookedSeats / existingPool.targetThreshold) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Status Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Pool State</span>
                    <span className="font-bold text-slate-900 font-mono">{existingPool.status}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Arrival Window</span>
                    <span className="font-medium text-slate-800">{existingPool.arrivalWindowStart} - {existingPool.arrivalWindowEnd}</span>
                  </div>
                </div>

                {existingPool.status === 'BUS_ASSIGNED' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Bus className="w-4 h-4 text-emerald-700" />
                      <span>Bus Assigned: {existingPool.allocatedBusNumber}</span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Departure: <strong>{existingPool.departureTime}</strong> from <strong>{existingPool.pickupGate}</strong>
                    </p>
                  </div>
                )}

                {existingPool.status === 'THRESHOLD_REACHED' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                    <div className="font-bold">Target Reached (20 Seats)!</div>
                    <p className="text-[11px] text-blue-800">
                      Bus allocation request generated and pending operator approval in the Operator Dashboard.
                    </p>
                  </div>
                )}

                {/* Passenger Manifest Snapshot */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">
                    Co-Passengers in this Corridor ({existingPool.passengers.length} Bookings):
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
                    {existingPool.passengers.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-medium text-slate-800">{p.passengerName}</span>
                          <span className="text-[10px] text-slate-500 block font-mono">Train #{p.trainNumber}</span>
                        </div>
                        <span className="font-mono font-semibold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                          {p.seatCount} {p.seatCount > 1 ? 'seats' : 'seat'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demonstration helper: Simulate +2 or +4 seats */}
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Prototype Test Simulator:</span>
                    <span className="text-[10px] text-slate-500">Fast-forward pooling</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => simulateAddPassengersToPool(existingPool.id, 2)}
                      className="flex-1 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      +2 Co-Passengers
                    </button>
                    <button
                      type="button"
                      onClick={() => simulateAddPassengersToPool(existingPool.id, 4)}
                      className="flex-1 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      +4 Co-Passengers
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No active pool group for this corridor yet. Submitting will inaugurate the 20-seat pool!</p>
              </div>
            )}
          </div>

          {/* Business Rules Summary Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <h5 className="font-bold text-slate-900">YatriSync Pooling Rules (Mysuru Hub):</h5>
            <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-600">
              <li>Standard pooling target: <strong>20 booked seats</strong> per destination corridor.</li>
              <li>Reaching 20 seats sends a request to the operator — does not auto-dispatch.</li>
              <li>Fare is captured only after the operator assigns and approves the vehicle.</li>
              <li>Late-night arrivals receive priority safety review even below 20 seats.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
