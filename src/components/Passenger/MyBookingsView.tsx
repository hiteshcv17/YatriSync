import React from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { Bus, QrCode, RefreshCw, XCircle, CheckCircle, Clock, MapPin, AlertTriangle } from 'lucide-react';

interface MyBookingsViewProps {
  onOpenTicket: (bookingId: string) => void;
  onOpenRecovery: (bookingId: string) => void;
  onNewBookingClick: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  onOpenTicket,
  onOpenRecovery,
  onNewBookingClick,
}) => {
  const { bookings, cancelBooking } = useApp();

  return (
    <div className="space-y-6">
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Journey Passes & Bookings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View active boarding passes, track pooling status, access QR tickets, or request contingency journey recovery.
          </p>
        </div>
        <button
          onClick={onNewBookingClick}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shrink-0"
        >
          + New Train-to-Bus Pool
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Bus className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Journey Bookings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any reservations yet. Search an arriving train to pool with passengers traveling to your destination.
          </p>
          <div className="pt-2">
            <button
              onClick={onNewBookingClick}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Start Train Pooling
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => {
            const isConfirmed = booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'BOARDED';
            const isBoarded = booking.bookingStatus === 'BOARDED';
            const isPending = booking.bookingStatus === 'PENDING_POOL';
            const isCancelled = booking.bookingStatus === 'CANCELLED';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {booking.id}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isBoarded
                          ? 'bg-emerald-100 text-emerald-800'
                          : isConfirmed
                            ? 'bg-blue-100 text-blue-800'
                            : isPending
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.bookingStatus}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {booking.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 pt-1">
                      {booking.destination}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>Type: <strong className="text-slate-700">{booking.type.replace('_', ' ')}</strong></span>
                      <span>·</span>
                      <span>Passengers: <strong className="font-mono text-slate-700">{booking.seatCount} Seats</strong></span>
                      <span>·</span>
                      <span>Fare: <strong className="font-mono text-slate-900">₹{booking.totalFare}</strong> ({booking.fareStatus})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* View QR Ticket */}
                    <button
                      onClick={() => onOpenTicket(booking.id)}
                      className="px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <QrCode className="w-4 h-4 text-slate-700" />
                      <span>View QR Pass</span>
                    </button>

                    {/* Journey Recovery trigger (FR-10) */}
                    {!isBoarded && !isCancelled && (
                      <button
                        onClick={() => onOpenRecovery(booking.id)}
                        className="px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                        <span>Recovery</span>
                      </button>
                    )}

                    {/* Cancel Booking */}
                    {isPending && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Escrow</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Additional Details Strip */}
                <div className="p-4 bg-slate-50/70 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block text-[11px]">Boarding Bay</span>
                      <strong className="text-slate-800">{booking.pickupStop}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Bus className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block text-[11px]">Assigned Feeder Bus</span>
                      <strong className="text-slate-800 font-mono">
                        {booking.busRegNumber || 'Awaiting 20-seat threshold'}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block text-[11px]">Departure Timing</span>
                      <strong className="text-slate-800">
                        {booking.departureTime || 'Coordinated after train arrival'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
