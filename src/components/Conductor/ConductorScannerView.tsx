import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bus,
  User,
  ShieldCheck,
  Search,
  Scan,
  RefreshCw,
} from 'lucide-react';

export const ConductorScannerView: React.FC = () => {
  const { bookings, verifyAndBoardTicket, buses } = useApp();

  const [inputCode, setInputCode] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    duplicate?: boolean;
    booking?: Booking;
    message: string;
  } | null>(null);

  // Active confirmed or boarded tickets for testing
  const validTickets = bookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'BOARDED');

  const handleVerify = (codeToTest?: string) => {
    const code = codeToTest || inputCode;
    if (!code.trim()) return;

    const res = verifyAndBoardTicket(code.trim());
    setScanResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight">Conductor Digital Gate & QR Boarding Scanner</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Mysuru Junction Station Bus Bay: Verify genuine passenger QR tickets, mark passengers as boarded, and prevent fraudulent duplicate entries (FR-08).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Total Verified</span>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {bookings.filter(b => b.bookingStatus === 'BOARDED').length} Boarded
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scanner Terminal */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            <span>Interactive QR Verification Terminal</span>
          </h3>

          {/* Simulated Scanner Viewport */}
          <div className="relative aspect-video max-h-56 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center text-center p-4">
            <div className="absolute inset-8 border-2 border-emerald-400/60 rounded-xl pointer-events-none flex items-center justify-center">
              <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-bounce" />
            </div>
            <Scan className="w-8 h-8 text-emerald-400/80 mb-2" />
            <span className="text-xs font-mono text-emerald-300 font-semibold">
              OPTICAL QR SCANNER ACTIVE
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Point passenger boarding pass QR code at camera or enter ticket hash below
            </span>
          </div>

          {/* Manual Input / Barcode Scanner Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Scan or Enter Ticket Code (e.g., YS-MYS-BK1001-KA09F2144):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                placeholder="Scan / paste ticket QR string..."
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={() => handleVerify()}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
              >
                Scan Ticket
              </button>
            </div>
          </div>

          {/* Scan Results Display */}
          {scanResult && (
            <div
              className={`p-5 rounded-2xl border transition-all ${
                scanResult.duplicate
                  ? 'bg-red-50 border-red-300 text-red-900 shadow-sm'
                  : scanResult.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
                    : 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.duplicate ? (
                  <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                ) : scanResult.success ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm sm:text-base">
                      {scanResult.duplicate
                        ? 'SECURITY ALERT: DUPLICATE QR SCAN DETECTED!'
                        : scanResult.success
                          ? 'BOARDING PASS VERIFIED & MARKED BOARDED'
                          : 'VERIFICATION ERROR'}
                    </h4>
                    {scanResult.booking && (
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/80 border border-current/20">
                        {scanResult.booking.id}
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed font-medium">{scanResult.message}</p>

                  {scanResult.booking && (
                    <div className="p-3 bg-white/70 rounded-xl border border-current/20 text-xs grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Passenger</span>
                        <strong className="text-slate-900">{scanResult.booking.passengerName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Seats Reserved</span>
                        <strong className="font-mono text-slate-900">{scanResult.booking.seatCount} Seats</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Destination</span>
                        <strong className="text-slate-900">{scanResult.booking.destination}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Assigned Bus</span>
                        <strong className="font-mono text-slate-900">{scanResult.booking.busRegNumber}</strong>
                      </div>
                    </div>
                  )}

                  {scanResult.duplicate && (
                    <div className="p-2.5 bg-red-100 rounded-lg text-[11px] text-red-900 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-red-700 shrink-0" />
                      <span>Security Rule Enforced: Duplicate boarding ticket re-entry strictly denied.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 1-Click Test Boarding Passes Manifest */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Active Journey Passes Manifest</h3>
              <span className="text-xs text-slate-500 font-mono">{validTickets.length} Passes</span>
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              Click any passenger pass below to test instant scanning or verify duplicate scan rejection:
            </p>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {validTickets.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No confirmed tickets found yet. Approve an allocation in the Operator Dashboard to generate passes.
                </div>
              ) : (
                validTickets.map(ticket => {
                  const isAlreadyBoarded = ticket.bookingStatus === 'BOARDED';
                  return (
                    <div
                      key={ticket.id}
                      className={`p-3 rounded-xl border text-xs flex flex-col justify-between gap-2 transition-all ${
                        isAlreadyBoarded
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-slate-900">{ticket.passengerName}</strong>
                            <span className="font-mono text-[11px] text-slate-500">({ticket.seatCount} seats)</span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate max-w-[200px] mt-0.5">
                            {ticket.destination}
                          </p>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          isAlreadyBoarded
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ticket.bookingStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                        <span className="font-mono truncate max-w-[150px]">{ticket.qrTicketCode}</span>

                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setInputCode(ticket.qrTicketCode);
                              handleVerify(ticket.qrTicketCode);
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                              isAlreadyBoarded
                                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                          >
                            {isAlreadyBoarded ? 'Test Duplicate Scan' : 'Scan & Board'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
