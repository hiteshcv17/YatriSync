import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Train,
  Bus,
  ShieldCheck,
  User,
  Scan,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Lock,
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';

export const AuthPortal: React.FC = () => {
  const { loginPassenger, loginStaff } = useApp();

  const [activePortal, setActivePortal] = useState<'passenger' | 'admin_operator'>('passenger');

  // Passenger form state
  const [passengerName, setPassengerName] = useState<string>('Kavitha Hegde');
  const [passengerPhone, setPassengerPhone] = useState<string>('+91 98860 11223');
  const [passengerPnr, setPassengerPnr] = useState<string>('4231889021');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [enteredOtp, setEnteredOtp] = useState<string>('428190');

  // Staff form state
  const [staffRole, setStaffRole] = useState<'operator' | 'admin' | 'conductor'>('operator');
  const [staffName, setStaffName] = useState<string>('Rajesh Rao');
  const [staffBadge, setStaffBadge] = useState<string>('KSRTC-OPS-8842');
  const [staffPassword, setStaffPassword] = useState<string>('••••••••');

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginPassenger({
      name: passengerName.trim() || 'Mysuru Rail Traveler',
      phone: passengerPhone.trim() || '+91 98860 11223',
      pnr: passengerPnr.trim() || '4231889021',
    });
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginStaff({
      name: staffName.trim() || (staffRole === 'operator' ? 'Rajesh Rao' : staffRole === 'admin' ? 'Deepak Kumar' : 'Suresh Babu'),
      staffRole,
      badgeNumber: staffBadge.trim() || 'KSRTC-OPS-8842',
    });
  };

  const setStaffPreset = (role: 'operator' | 'admin' | 'conductor') => {
    setStaffRole(role);
    if (role === 'operator') {
      setStaffName('Rajesh Rao');
      setStaffBadge('KSRTC-OPS-8842');
    } else if (role === 'admin') {
      setStaffName('Deepak Kumar');
      setStaffBadge('ADMIN-SYS-01');
    } else {
      setStaffName('Suresh Babu');
      setStaffBadge('MYS-COND-5510');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Container */}
      <div className="max-w-4xl w-full mx-auto space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Mysuru Junction (MYS) Rail-to-Bus Integrated Feeder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center font-black text-xl shadow-md">
              Y
            </div>
            <span>YatriSync</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Choose your login portal to proceed: Passenger services or Unified Operator & Admin operations.
          </p>
        </div>

        {/* Portal Selection Switcher Tabs */}
        <div className="flex p-1 bg-slate-800/90 rounded-2xl border border-slate-700 max-w-lg mx-auto shadow-inner">
          <button
            type="button"
            onClick={() => setActivePortal('passenger')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activePortal === 'passenger'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Passenger Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortal('admin_operator')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activePortal === 'admin_operator'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Admin & Operator Portal</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-700/90 shadow-2xl p-6 sm:p-8 lg:p-10">
          {activePortal === 'passenger' ? (
            /* =================== PASSENGER AUTHENTICATION =================== */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Form Section */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Train className="w-5 h-5 text-blue-400" />
                    <span>Passenger Sign In & Ticket Access</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Connect your arriving train at Mysuru Jn with onward city feeder buses.
                  </p>
                </div>

                <form onSubmit={handlePassengerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={e => setPassengerName(e.target.value)}
                      placeholder="e.g. Kavitha Hegde"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <input
                          type="tel"
                          required
                          value={passengerPhone}
                          onChange={e => setPassengerPhone(e.target.value)}
                          placeholder="+91 98860 11223"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        IRCTC PNR (Optional)
                      </label>
                      <input
                        type="text"
                        value={passengerPnr}
                        onChange={e => setPassengerPnr(e.target.value)}
                        placeholder="e.g. 4231889021"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* OTP Verification Toggle */}
                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">One-Time Password (OTP)</span>
                      <button
                        type="button"
                        onClick={() => setOtpSent(true)}
                        className="text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        {otpSent ? 'Resend OTP' : 'Send SMS OTP'}
                      </button>
                    </div>
                    {otpSent ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={enteredOtp}
                          onChange={e => setEnteredOtp(e.target.value)}
                          className="w-36 px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono tracking-widest text-center text-sm"
                        />
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Code Verified
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        Demo Mode: Click "Continue to Passenger Dashboard" to authenticate immediately.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Continue to Passenger Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* 1-Click Demo Profiles */}
                <div className="pt-2 border-t border-slate-700/60">
                  <span className="text-[11px] text-slate-400 font-medium block mb-2">
                    Or 1-click test login as sample passenger:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        loginPassenger({
                          name: 'Kavitha Hegde',
                          phone: '+91 98860 11223',
                          pnr: '4231889021',
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>Kavitha Hegde (Vande Bharat #20607)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        loginPassenger({
                          name: 'Raghuvaran S.',
                          phone: '+91 94480 33441',
                          pnr: '8821901144',
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Raghuvaran S. (Mysore Express)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Passenger Features Highlight Column */}
              <div className="lg:col-span-5 bg-slate-900/70 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider block">
                  Passenger Capabilities
                </span>
                <div className="space-y-3.5 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                      <Train className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block">Train-to-Bus Smart Pooling</strong>
                      <span>20-seat threshold pooling from Mysuru Jn to Infosys, Chamundi Hill, and KRS.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block">Escrow Fare Reservation</strong>
                      <span>Fares are reserved in wallet escrow and captured only when bus allocation is approved.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                      <Scan className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block">Digital QR Boarding Pass</strong>
                      <span>Instant tamper-proof QR tickets scanned by platform conductors.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block">Journey Recovery & SOS</strong>
                      <span>Guaranteed backup options (next bus, CBS shuttle, prepaid auto) plus 1-tap RPF SOS.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* =================== ADMIN & OPERATOR AUTHENTICATION =================== */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Form Section */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono mb-1">
                    Karnataka State Road Transport Corporation (KSRTC)
                  </div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Admin & Operator Unified Operations Login</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Combined authority console for feeder bus dispatch, fleet allocations, conductor scanning, and system governance.
                  </p>
                </div>

                <form onSubmit={handleStaffSubmit} className="space-y-4">
                  {/* Persona Selector inside combined login */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Select Staff Role / Authority
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setStaffPreset('operator')}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          staffRole === 'operator'
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <Bus className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-xs block">Operator</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStaffPreset('admin')}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          staffRole === 'admin'
                            ? 'bg-purple-500 text-white border-purple-400 font-bold shadow-md'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <ShieldAlert className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-xs block">Admin</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStaffPreset('conductor')}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          staffRole === 'conductor'
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <Scan className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-xs block">Conductor</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Staff Officer Name
                      </label>
                      <input
                        type="text"
                        required
                        value={staffName}
                        onChange={e => setStaffName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Badge ID / Staff Key
                      </label>
                      <input
                        type="text"
                        required
                        value={staffBadge}
                        onChange={e => setStaffBadge(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Security Passcode
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={staffPassword}
                        onChange={e => setStaffPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Launch Combined Admin & Operator Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* 1-Click Demo Logins for Staff */}
                <div className="pt-2 border-t border-slate-700/60">
                  <span className="text-[11px] text-slate-400 font-medium block mb-2">
                    Quick 1-click test credentials:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        loginStaff({
                          name: 'Rajesh Rao',
                          staffRole: 'operator',
                          badgeNumber: 'KSRTC-OPS-8842',
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Bus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Log In as Fleet Operator</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        loginStaff({
                          name: 'Deepak Kumar',
                          staffRole: 'admin',
                          badgeNumber: 'ADMIN-SYS-01',
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                      <span>Log In as System Admin</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        loginStaff({
                          name: 'Suresh Babu',
                          staffRole: 'conductor',
                          badgeNumber: 'MYS-COND-5510',
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Scan className="w-3.5 h-3.5 text-amber-400" />
                      <span>Log In as Station Conductor</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Combined Operator & Admin Capabilities Highlight */}
              <div className="lg:col-span-5 bg-slate-900/70 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider block">
                  Combined Operations Powers
                </span>
                <div className="space-y-3.5 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block">Feeder Fleet Dispatch & Approval</strong>
                      <span>Approve allocations when pools hit 20 seats, assign standby buses, and handle late-night safety exceptions.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block">System Governance & Policy Master</strong>
                      <span>Audit Mysore urban transit datasets, adjust pooling threshold rules, and review tamper-proof audit trails.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                      <Scan className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block">Integrated QR Scanner & Conductor Tool</strong>
                      <span>Scan passenger passes, verify booking manifests, and enforce anti-duplicate entry directly within the operations console.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block">Unified Workspace</strong>
                      <span>All admin and operator controls unified in one collapsible dashboard interface.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quiet Footer */}
        <div className="text-center text-xs text-slate-500 space-x-3">
          <span>YatriSync Platform</span>
          <span>·</span>
          <span>Mysuru City Feeder Coordination System</span>
          <span>·</span>
          <span>KSRTC & Indian Railways Feeder Integration</span>
        </div>
      </div>
    </div>
  );
};
