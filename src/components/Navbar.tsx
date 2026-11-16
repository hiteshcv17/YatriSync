import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Wallet,
  Bell,
  User,
  Bus,
  ShieldAlert,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Building2,
  Scan,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenWallet: () => void;
  onOpenNotifications: () => void;
  onOpenRoleSwitcher: () => void;
  onOpenBackendModal: () => void;
  onOpenSafetySOS: () => void;
  onOpenMultilingual: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isSidebarOpen,
  onToggleSidebar,
  onOpenWallet,
  onOpenNotifications,
  onOpenRoleSwitcher,
  onOpenBackendModal,
  onOpenSafetySOS,
  onOpenMultilingual,
}) => {
  const { role, authSession, logout, walletBalance, reservedAmount, notifications, poolGroups } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="w-full mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5">
        {/* Zone 1: Sidebar Toggle (ChatGPT-style) & Brand wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleSidebar}
            title={isSidebarOpen ? 'Close sidebar (Ctrl+[)' : 'Open sidebar (Ctrl+[)'}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors shadow-2xs"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-4 h-4 text-slate-700" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab(isStaff ? 'combined-admin-operator' : 'train-pool')}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm">
              Y
            </div>
            <span className="hidden sm:inline">YatriSync</span>
          </button>

          {/* Persona Label Tag */}
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded border hidden md:inline-flex items-center gap-1 ${
            isStaff
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            {isStaff ? 'Admin & Operator Console' : 'Passenger View'}
          </span>
        </div>

        {/* Zone 2: Contextual Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-600">
          {isStaff ? (
            <>
              <button
                onClick={() => setCurrentTab('combined-admin-operator')}
                className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
                  currentTab === 'combined-admin-operator'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <span>Combined Operations Hub</span>
                {pendingRequests.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                    {pendingRequests.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('conductor-scanner')}
                className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
                  currentTab === 'conductor-scanner'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Conductor Scanner
              </button>

              <button
                onClick={() => setCurrentTab('transit-map')}
                className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
                  currentTab === 'transit-map'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Corridor Map
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentTab('train-pool')}
                className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
                  currentTab === 'train-pool'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Train Pooling (20-seat)
              </button>

              <button
                onClick={() => setCurrentTab('ai-pooling')}
                className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
                  currentTab === 'ai-pooling'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                AI Matching & Delays
              </button>

              <button
                onClick={() => setCurrentTab('direct-bus')}
                className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
                  currentTab === 'direct-bus'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Direct Bus
              </button>

              <button
                onClick={() => setCurrentTab('en-route')}
                className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
                  currentTab === 'en-route'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                En-Route
              </button>

              <button
                onClick={() => setCurrentTab('demand-forecast')}
                className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
                  currentTab === 'demand-forecast'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Demand & Green AI
              </button>

              <button
                onClick={() => setCurrentTab('my-bookings')}
                className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
                  currentTab === 'my-bookings'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                My Passes
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Multilingual Assistant button */}
          <button
            onClick={onOpenMultilingual}
            title="ಕನ್ನಡ · English · हिंदी Assistant"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline font-mono">ಕನ್ನಡ/EN</span>
          </button>

          {/* Safety SOS button */}
          <button
            onClick={onOpenSafetySOS}
            title="Passenger Safety & RPF SOS"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* Wallet Quick Pill */}
          <button
            onClick={onOpenWallet}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-mono transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-bold text-slate-900 tabular-nums">₹{walletBalance.toFixed(0)}</span>
            {reservedAmount > 0 && (
              <span className="text-[10px] text-amber-700 font-medium">
                (₹{reservedAmount.toFixed(0)} esc)
              </span>
            )}
          </button>

          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* Role / Switcher Pill */}
          <button
            onClick={onOpenRoleSwitcher}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            {isStaff ? (
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <User className="w-3.5 h-3.5 text-blue-400" />
            )}
            <span>{isStaff ? 'Operator & Admin' : 'Passenger'}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Log out and switch login portal"
            className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
