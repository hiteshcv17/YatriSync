import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { X, User, Bus, Scan, ShieldAlert, Building2, Check, LogOut } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { role, setRole, authSession, loginPassenger, loginStaff, logout } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Switch Workspace Persona</h3>
            <p className="text-xs text-slate-300">Quickly toggle between Passenger and Combined Operator & Admin consoles</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Passenger Option */}
          <div
            onClick={() => {
              loginPassenger({
                name: 'Kavitha Hegde',
                phone: '+91 98860 11223',
                pnr: '4231889021',
              });
              onClose();
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
              authSession?.portal === 'passenger'
                ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-900'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${
              authSession?.portal === 'passenger' ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-blue-600'
            }`}>
              <User className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Train & Bus Passenger Portal</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                  authSession?.portal === 'passenger' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  Passenger
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${
                authSession?.portal === 'passenger' ? 'text-slate-300' : 'text-slate-500'
              }`}>
                Search arriving trains at Mysuru Jn, join 20-seat corridor pools, reserve fares in wallet escrow, access QR passes, and book direct/en-route.
              </p>
            </div>
          </div>

          {/* Unified Operator & Admin Option */}
          <div
            onClick={() => {
              loginStaff({
                name: 'Rajesh Rao',
                staffRole: 'operator',
                badgeNumber: 'KSRTC-OPS-8842',
              });
              onClose();
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
              authSession?.portal === 'admin_operator'
                ? 'border-emerald-700 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-900'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${
              authSession?.portal === 'admin_operator' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white border border-slate-200 text-emerald-600'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Combined Operator & Admin Console</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                  authSession?.portal === 'admin_operator' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Unified Authority
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${
                authSession?.portal === 'admin_operator' ? 'text-slate-300' : 'text-slate-500'
              }`}>
                Combined powerhouse: Approve 20-seat feeder bus allocations, depart vehicles, manage standby fleet & crew rosters, audit datasets, and validate QR tickets.
              </p>
            </div>
          </div>

          {/* Sub-view shortcut: Conductor Scanner */}
          <div
            onClick={() => {
              loginStaff({
                name: 'Suresh Babu',
                staffRole: 'conductor',
                badgeNumber: 'MYS-COND-5510',
              });
              setRole('conductor');
              onClose();
            }}
            className="p-3.5 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 cursor-pointer transition-all flex items-center justify-between text-xs text-slate-700"
          >
            <div className="flex items-center gap-2.5">
              <Scan className="w-4 h-4 text-amber-600" />
              <span>Direct Shortcut: Station Conductor Gate Scanner</span>
            </div>
            <span className="font-mono text-slate-400">Launch →</span>
          </div>

          {/* Logout & Return to Portal Choice */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need to sign in with different credentials?</span>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out & Go to Login Screen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
