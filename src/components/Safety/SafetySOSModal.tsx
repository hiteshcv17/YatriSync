import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  PhoneCall,
  Share2,
  CheckCircle2,
  MapPin,
  Shield,
  UserCheck,
  AlertTriangle,
  X,
  Copy,
} from 'lucide-react';

interface SafetySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetySOSModal: React.FC<SafetySOSModalProps> = ({ isOpen, onClose }) => {
  const { triggerEmergencySOS, activeTicket, bookings } = useApp();
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);
  const [trackingRef, setTrackingRef] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPass = activeTicket || bookings[0] || null;
  const passengerName = currentPass?.passengerName || 'Kavitha Hegde';
  const pickupLocation = currentPass?.pickupStop || 'Mysuru Junction (MYS) - Main Concourse Bay 2';

  const handleTriggerSOS = () => {
    const ref = triggerEmergencySOS(passengerName, currentPass?.id || 'BK-1001', pickupLocation);
    setTrackingRef(ref);
    setSosTriggered(true);
  };

  const shareableLiveLink = `https://yatrisync.in/track/sos?ref=${trackingRef || 'LIVE-MYS-7788'}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareableLiveLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-base">YatriSync Passenger Safety & SOS Shield</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Active Status Alert */}
          {sosTriggered ? (
            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-xl space-y-2 text-red-900">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span>EMERGENCY SOS BROADCAST ACTIVE!</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Railway Protection Force (RPF) Mysuru Division, Station Security Helpdesk, and KSRTC Night Ops have received your location coordinates.
              </p>
              <div className="pt-2 border-t border-red-200 font-mono text-[11px] flex justify-between">
                <span>Emergency Tracking Ref:</span>
                <strong className="text-red-700">{trackingRef}</strong>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Verified Journey Context:</span>
                <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                  Verified Transit Link
                </span>
              </div>
              <div className="text-slate-600 space-y-1 font-mono">
                <div>Passenger: <strong className="text-slate-900">{passengerName}</strong></div>
                <div>Station Pick-up: <strong className="text-slate-900">{pickupLocation}</strong></div>
                {currentPass?.busRegNumber && (
                  <div>Assigned Feeder Bus: <strong className="text-slate-900">{currentPass.busRegNumber}</strong></div>
                )}
              </div>
            </div>
          )}

          {/* Trigger Emergency Button */}
          {!sosTriggered ? (
            <button
              onClick={handleTriggerSOS}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Broadcast Emergency SOS (RPF & KSRTC Ops)</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block">Share Live Journey Link with Family:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableLiveLink}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-[11px]"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shrink-0 font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Direct Emergency Call Strip */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="tel:139"
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 flex items-center justify-center gap-2 font-bold text-slate-800 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>Call 139 (Indian Railways)</span>
            </a>
            <a
              href="tel:112"
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 flex items-center justify-center gap-2 font-bold text-slate-800 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>Call 112 (Police / Emergency)</span>
            </a>
          </div>

          {/* Safety Protocols */}
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Shield className="w-4 h-4 text-purple-700" />
              <span>FR-11 Women Safety & Night Owl Protocol</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Between 10:00 PM and 05:00 AM, all YatriSync passengers have access to station concourse escort
              from platform exit to bus bay, and real-time transit telemetry shared with Mysuru Urban Police.
            </p>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
          >
            Close Safety Shield
          </button>
        </div>
      </div>
    </div>
  );
};
