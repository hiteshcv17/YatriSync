import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlternativeTransportOption, Booking } from '../types';
import { X, RefreshCw, AlertTriangle, ShieldCheck, Bus, Car, ArrowRight, CheckCircle2 } from 'lucide-react';

interface JourneyRecoveryModalProps {
  bookingId: string | null;
  onClose: () => void;
}

export const JourneyRecoveryModal: React.FC<JourneyRecoveryModalProps> = ({ bookingId, onClose }) => {
  const { bookings, getRecoveryOptionsForBooking, executeRecoveryOption } = useApp();
  const [selectedReason, setSelectedReason] = useState<string>('MISSED_ALLOCATED_BUS');
  const [confirmedOption, setConfirmedOption] = useState<AlternativeTransportOption | null>(null);

  if (!bookingId) return null;

  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return null;

  const recoveryOptions = getRecoveryOptionsForBooking(bookingId);

  const handleApply = (option: AlternativeTransportOption) => {
    executeRecoveryOption(bookingId, option);
    setConfirmedOption(option);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-500 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-base tracking-tight">YatriSync Journey Recovery Assistant</h3>
              <p className="text-xs text-amber-950 font-medium">Verified Alternative Transport & Contingency Protection (FR-10)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-950 hover:bg-amber-600/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {confirmedOption ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Recovery Solution Confirmed!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your journey has been updated to <strong>{confirmedOption.title}</strong> departing at <strong>{confirmedOption.departureTime}</strong> from <strong>{confirmedOption.boardingPoint}</strong>.
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Context Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 uppercase tracking-wide block">Current Journey Booking</span>
                  <strong className="text-slate-900 text-sm">{booking.destination}</strong>
                  <div className="text-slate-600 mt-0.5">
                    ID: <span className="font-mono">{booking.id}</span> · Passenger: {booking.passengerName} ({booking.seatCount} seats)
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Fare Paid / Reserved</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">₹{booking.totalFare}</span>
                </div>
              </div>

              {/* Contingency Reason Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Select Journey Disruption Reason:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReason('MISSED_ALLOCATED_BUS')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedReason === 'MISSED_ALLOCATED_BUS'
                        ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Missed Allocated Bus
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReason('DELAYED_TRAIN')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedReason === 'DELAYED_TRAIN'
                        ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Train Delayed at Mysore Jn
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReason('POOLING_FAILED')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedReason === 'POOLING_FAILED'
                        ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Pooling Target Incomplete
                  </button>
                </div>
              </div>

              {/* Verified Alternatives List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Verified Mysuru Transport Alternatives (Live Coordinated)
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Real-Time Verified</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {recoveryOptions.map((opt, idx) => {
                    const isNextBus = opt.type === 'NEXT_YATRISYNC_BUS';
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all ${
                          isNextBus
                            ? 'border-emerald-300 bg-emerald-50/40 hover:border-emerald-400'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {isNextBus ? (
                                <Bus className="w-4 h-4 text-emerald-600" />
                              ) : opt.type === 'PREPAID_AUTO_TAXI' ? (
                                <Car className="w-4 h-4 text-amber-600" />
                              ) : (
                                <Bus className="w-4 h-4 text-blue-600" />
                              )}
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                {opt.title}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">{opt.description}</p>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                              <span>Departure: <strong className="text-slate-800">{opt.departureTime}</strong></span>
                              <span>·</span>
                              <span>Boarding: <strong className="text-slate-800">{opt.boardingPoint}</strong></span>
                              <span>·</span>
                              <span>Est. Travel: <strong className="text-slate-800">{opt.travelTime}</strong></span>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <div className="font-mono text-sm font-bold text-slate-900">
                              ₹{opt.estimatedFare}
                            </div>
                            <button
                              onClick={() => handleApply(opt)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                                isNextBus
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-slate-900 text-white hover:bg-slate-800'
                              }`}
                            >
                              {isNextBus ? 'Transfer Free' : 'Refund & Switch'}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Passenger Confirmation Guarantee:</strong> In accordance with YatriSync Business Rule #14, alternative transport information is verified directly with KSRTC Mysore Urban Division and Prepaid Auto stands. No action is taken without your explicit confirmation.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
