import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Train,
  Bus,
  ShieldCheck,
  User,
  Scan,
  Settings,
  Sparkles,
  MapPin,
  Ticket,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Globe,
  ShieldAlert,
  Wallet,
  Building2,
  Users,
  FileSpreadsheet,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenWallet: () => void;
  onOpenNotifications: () => void;
  onOpenRoleSwitcher: () => void;
  onOpenBackendModal: () => void;
  onOpenSafetySOS: () => void;
  onOpenMultilingual: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isOpen,
  onToggle,
  currentTab,
  setCurrentTab,
  onOpenWallet,
  onOpenNotifications,
  onOpenRoleSwitcher,
  onOpenBackendModal,
  onOpenSafetySOS,
  onOpenMultilingual,
}) => {
  const { authSession, logout, bookings, poolGroups, walletBalance, reservedAmount } = useApp();

  const isStaff = authSession?.portal === 'admin_operator';
  const pendingRequests = poolGroups.filter(
    p =>
      (p.status === 'THRESHOLD_REACHED' ||
        p.status === 'ALLOCATION_REQUESTED' ||
        p.isPriorityFlagged) &&
      p.status !== 'BUS_ASSIGNED' &&
      p.status !== 'DISPATCHED' &&
      p.status !== 'CANCELLED'
  );

  return (
    <>
      {/* Mobile Backdrop Overlay (only visible on mobile when open) */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sideways Dashboard Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 overflow-hidden'
        }`}
      >
        {/* Top Header of Sidebar */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-white text-slate-900 font-extrabold flex items-center justify-center text-sm shrink-0 shadow-xs">
              Y
            </div>
            <div className="leading-tight truncate">
              <span className="font-extrabold text-sm text-white tracking-tight block">YatriSync</span>
              <span className="text-[10px] text-slate-400 font-mono truncate block">Mysuru Transit Hub</span>
            </div>
          </div>

          <button
            onClick={onToggle}
            title="Close sidebar (like in ChatGPT)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Button (Like ChatGPT "New chat" button) */}
        <div className="p-3 shrink-0">
          <button
            onClick={() => {
              if (isStaff) {
                setCurrentTab('combined-admin-operator');
              } else {
                setCurrentTab('train-pool');
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-semibold border border-slate-700/80 flex items-center justify-between transition-colors shadow-xs"
          >
            <span className="flex items-center gap-2 truncate">
              {isStaff ? (
                <>
                  <Bus className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Operations Center</span>
                </>
              ) : (
                <>
                  <Train className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">Plan Train-to-Bus Pool</span>
                </>
              )}
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              Live
            </span>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Main Navigation Items */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
              {isStaff ? 'Operations Console' : 'Passenger Services'}
            </div>

            {isStaff ? (
              /* Staff Combined Dashboard Sidebar Links */
              <>
                <button
                  onClick={() => setCurrentTab('combined-admin-operator')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentTab === 'combined-admin-operator'
                      ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">Operator & Admin Console</span>
                  </div>
                  {pendingRequests.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                      {pendingRequests.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setCurrentTab('conductor-scanner')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentTab === 'conductor-scanner'
                      ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Scan className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">Conductor QR Scanner</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('transit-map')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentTab === 'transit-map'
                      ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="truncate">Mysuru Transit Map</span>
                  </div>
                </button>
              </>
            ) : (
              /* Passenger Dashboard Sidebar Links */
              <>
                <button
                  onClick={() => setCurrentTab('train-pool')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentTab === 'train-pool'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Train className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate">Train Smart Pooling</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">20-seat</span>
                </button>

                <button
                  onClick={() => setCurrentTab('ai-pooling')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentTab === 'ai-pooling'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate">AI Match & Delay Sync</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('direct-bus')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentTab === 'direct-bus'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Bus className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">Direct Bus Booking</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('en-route')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentTab === 'en-route'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">En-Route Pickup</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('demand-forecast')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentTab === 'demand-forecast'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">Demand & Green AI</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('my-bookings')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentTab === 'my-bookings'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Ticket className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="truncate">My Passes & QR Tickets</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-200">
                    {bookings.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('transit-map')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentTab === 'transit-map'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="truncate">Corridor Transit Map</span>
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Quick Tools & Assistance */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Utilities & Safety
            </div>

            <button
              onClick={onOpenMultilingual}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">ಕನ್ನಡ · English · हिंदी</span>
            </button>

            <button
              onClick={onOpenSafetySOS}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span className="truncate font-semibold">RPF Emergency SOS</span>
            </button>

            <button
              onClick={onOpenWallet}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-mono"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Wallet className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate font-sans">Escrow Wallet</span>
              </div>
              <span className="font-bold text-emerald-400 tabular-nums">
                ₹{walletBalance.toFixed(0)}
              </span>
            </button>

            <button
              onClick={onOpenBackendModal}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">FastAPI Backend Status</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">Live</span>
            </button>
          </div>
        </div>

        {/* Bottom User Persona & Logout Card */}
        <div className="p-3 border-t border-slate-800 shrink-0 space-y-2 bg-slate-950/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                isStaff ? 'bg-emerald-500 text-slate-950' : 'bg-blue-500 text-white'
              }`}>
                {authSession?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate leading-tight">
                <span className="font-bold text-xs text-white block truncate">
                  {authSession?.name || 'Logged In User'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">
                  {isStaff ? `KSRTC · ${authSession?.staffRole?.toUpperCase() || 'STAFF'}` : 'Passenger'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign out & switch portal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
            <button
              onClick={onOpenRoleSwitcher}
              className="hover:text-white transition-colors underline"
            >
              Switch Role View
            </button>
            <button
              onClick={logout}
              className="hover:text-red-400 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
