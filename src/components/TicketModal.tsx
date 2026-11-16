import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Booking } from '../types';
import { X, CheckCircle, Clock, MapPin, Bus, User, Shield, Printer } from 'lucide-react';

interface TicketModalProps {
  ticket: Booking;
  onClose: () => void;
  onOpenRecovery?: (bookingId: string) => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ ticket, onClose, onOpenRecovery }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        ticket.qrTicketCode,
        {
          width: 180,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [ticket.qrTicketCode]);

  const isConfirmed = ticket.bookingStatus === 'CONFIRMED' || ticket.bookingStatus === 'BOARDED';
  const isBoarded = ticket.bookingStatus === 'BOARDED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Strip */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-emerald-400" />
            <span className="font-bold tracking-tight text-base">YatriSync Boarding Pass</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className={`p-3 rounded-xl flex items-center justify-between ${
            isBoarded
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : isConfirmed
                ? 'bg-blue-50 border border-blue-200 text-blue-800'
                : 'bg-amber-50 border border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-current shrink-0" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider">
                  Status: {ticket.bookingStatus}
                </div>
                <div className="text-xs opacity-80">
                  {isBoarded
                    ? `Boarded at ${ticket.boardedAt}`
                    : isConfirmed
                      ? 'Operator Confirmed & Fare Captured'
                      : 'Pooling in Progress (Fare in Escrow)'}
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-white/70 border border-current/20">
              {ticket.id}
            </span>
          </div>

          {/* QR Code and Key Metas */}
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex flex-col items-center">
              <canvas ref={canvasRef} className="rounded-lg shadow-xs bg-white p-1" />
              <span className="mt-2 text-[11px] font-mono text-slate-500 text-center select-all">
                {ticket.qrTicketCode}
              </span>
            </div>

            <div className="flex-1 space-y-3 w-full text-sm">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wide">Destination Corridor</span>
                <p className="font-bold text-slate-900 text-base leading-snug">{ticket.destination}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Assigned Bus</span>
                  <span className="font-semibold font-mono text-slate-900">
                    {ticket.busRegNumber || 'Awaiting Allocation'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Departure Time</span>
                  <span className="font-semibold text-slate-900">
                    {ticket.departureTime || 'Pending Dispatch'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Seats Reserved</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {ticket.seatCount} {ticket.seatCount > 1 ? 'Seats' : 'Seat'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Fare</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    ₹{ticket.totalFare} ({ticket.fareStatus})
                  </span>
                </div>
              </div>

              {ticket.isWomenSafetyPriority && (
                <div className="flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 p-1.5 rounded-lg border border-purple-200">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>Voluntary Safety-Priority Tagged</span>
                </div>
              )}
            </div>
          </div>

          {/* Boarding Point Details */}
          <div className="space-y-2 text-xs text-slate-600 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Boarding Location:</span>
                <p className="text-slate-700 font-medium">{ticket.pickupStop || 'Mysuru Junction Station Front Concourse'}</p>
                {ticket.pickupGate && (
                  <p className="text-emerald-700 font-medium mt-0.5">Designated Gate: {ticket.pickupGate}</p>
                )}
              </div>
            </div>

            {ticket.trainNumber && (
              <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Connected Rail Arrival:</span>
                  <p className="text-slate-700">
                    Train #{ticket.trainNumber} {ticket.trainName ? `(${ticket.trainName})` : ''} · PNR: {ticket.pnr || 'N/A'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
              <User className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div className="flex justify-between w-full">
                <span>Passenger: <strong className="text-slate-900">{ticket.passengerName}</strong></span>
                <span>Contact: <strong className="font-mono text-slate-900">{ticket.passengerPhone}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {onOpenRecovery ? (
            <button
              onClick={() => {
                onClose();
                onOpenRecovery(ticket.id);
              }}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors underline"
            >
              Need Alternative? Journey Recovery
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Pass
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
