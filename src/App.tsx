import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AppSidebar } from './components/Sidebar/AppSidebar';
import { AuthPortal } from './components/Auth/AuthPortal';
import { CombinedAdminOperatorView } from './components/AdminOperator/CombinedAdminOperatorView';
import { TrainSearchAndPool } from './components/Passenger/TrainSearchAndPool';
import { DirectBusBookingView } from './components/Passenger/DirectBusBookingView';
import { EnRoutePickupBookingView } from './components/Passenger/EnRoutePickupBookingView';
import { MyBookingsView } from './components/Passenger/MyBookingsView';
import { MysuruTransitMap } from './components/MysuruTransitMap';
import { ConductorScannerView } from './components/Conductor/ConductorScannerView';
import { TicketModal } from './components/TicketModal';
import { WalletDrawer } from './components/WalletDrawer';
import { NotificationDrawer } from './components/NotificationDrawer';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { JourneyRecoveryModal } from './components/JourneyRecoveryModal';
import { BackendStatusModal } from './components/BackendStatusModal';
import { AIPassengerPoolingMatcher } from './components/AI/AIPassengerPoolingMatcher';
import { AITrainDelayRescheduler } from './components/AI/AITrainDelayRescheduler';
import { AIDemandForecasting } from './components/AI/AIDemandForecasting';
import { SafetySOSModal } from './components/Safety/SafetySOSModal';
import { MultilingualAssistantModal } from './components/Multilingual/MultilingualAssistantModal';
import {
  GitMerge,
  Clock,
  Train,
  Bus,
  Building2,
  Scan,
  ShieldAlert,
  PanelLeftOpen,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { authSession, role, setRole, routes, bookings } = useApp();

  const isStaff = authSession?.portal === 'admin_operator';

  // Current view tab
  const [currentTab, setCurrentTab] = useState<string>(() =>
    isStaff ? 'combined-admin-operator' : 'train-pool'
  );

  // ChatGPT-style sideways collapsible sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // AI Sub-tab
  const [aiSubTab, setAiSubTab] = useState<'matcher' | 'delays'>('matcher');

  // Modals & Drawers state
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState<boolean>(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState<boolean>(false);
  const [isMultilingualModalOpen, setIsMultilingualModalOpen] = useState<boolean>(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [recoveryBookingId, setRecoveryBookingId] = useState<string | null>(null);

  // Automatically sync tab when switching portal
  React.useEffect(() => {
    if (authSession?.portal === 'admin_operator') {
      setCurrentTab('combined-admin-operator');
    } else if (authSession?.portal === 'passenger') {
      setCurrentTab('train-pool');
    }
  }, [authSession?.portal]);

  const selectedTicket = activeTicketId
    ? bookings.find(b => b.id === activeTicketId) || null
    : null;

  // 1. If not authenticated, show Dual Authentication Screen (Passenger vs Admin & Operator)
  if (!authSession) {
    return <AuthPortal />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* ChatGPT-style sideways collapsible dashboard sidebar */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(prev => !prev)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        onOpenSafetySOS={() => setIsSafetyModalOpen(true)}
        onOpenMultilingual={() => setIsMultilingualModalOpen(true)}
      />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onOpenWallet={() => setIsWalletOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
          onOpenBackendModal={() => setIsBackendModalOpen(true)}
          onOpenSafetySOS={() => setIsSafetyModalOpen(true)}
          onOpenMultilingual={() => setIsMultilingualModalOpen(true)}
        />

        {/* Quick Context Sub-Bar */}
        <div className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Active Workspace:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded border ${
                isStaff
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                  : 'bg-blue-950 text-blue-300 border-blue-700'
              }`}>
                {isStaff ? 'Combined Operator & Admin Console' : 'Train & Bus Passenger Portal'}
              </span>
              <span className="text-slate-500 hidden md:inline">·</span>
              <span className="text-slate-400 hidden md:inline">
                Mysuru Jn (MYS) Feeder Coordination
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Logged in as:</span>
              <span className="font-semibold text-white truncate max-w-[150px]">
                {authSession.name}
              </span>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setIsRoleSwitcherOpen(true)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline"
              >
                Switch Workspace
              </button>
            </div>
          </div>
        </div>

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {/* STAFF COMBINED DASHBOARD VIEW */}
          {isStaff ? (
            currentTab === 'conductor-scanner' ? (
              <ConductorScannerView />
            ) : currentTab === 'transit-map' ? (
              <div className="space-y-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mysuru Urban Feeder Transit Map</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Integrated railway and bus routes originating from Mysuru Junction (MYS) and City Bus Stand (CBS).
                  </p>
                </div>
                <MysuruTransitMap routes={routes} />
              </div>
            ) : (
              <CombinedAdminOperatorView />
            )
          ) : (
            /* PASSENGER DASHBOARD VIEWS */
            <div className="space-y-6">
              {/* Mobile Tab Pills */}
              <div className="flex lg:hidden items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200">
                <button
                  onClick={() => setCurrentTab('train-pool')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    currentTab === 'train-pool' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  Train Pool
                </button>
                <button
                  onClick={() => setCurrentTab('ai-pooling')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    currentTab === 'ai-pooling' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  AI Match
                </button>
                <button
                  onClick={() => setCurrentTab('direct-bus')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    currentTab === 'direct-bus' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  Direct Bus
                </button>
                <button
                  onClick={() => setCurrentTab('en-route')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    currentTab === 'en-route' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  En-Route
                </button>
                <button
                  onClick={() => setCurrentTab('demand-forecast')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    currentTab === 'demand-forecast' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  Demand AI
                </button>
                <button
                  onClick={() => setCurrentTab('my-bookings')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    currentTab === 'my-bookings' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  My Passes ({bookings.length})
                </button>
                <button
                  onClick={() => setCurrentTab('transit-map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    currentTab === 'transit-map' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  Corridor Map
                </button>
              </div>

              {/* Active Tab Content */}
              {currentTab === 'train-pool' && (
                <TrainSearchAndPool
                  onOpenWallet={() => setIsWalletOpen(true)}
                  onOpenTicket={(id) => setActiveTicketId(id)}
                />
              )}

              {currentTab === 'ai-pooling' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <button
                      onClick={() => setAiSubTab('matcher')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        aiSubTab === 'matcher'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>AI Group Matching & Auto-Merge</span>
                    </button>
                    <button
                      onClick={() => setAiSubTab('delays')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        aiSubTab === 'delays'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Train Delay Rescheduler</span>
                    </button>
                  </div>

                  {aiSubTab === 'matcher' ? (
                    <AIPassengerPoolingMatcher />
                  ) : (
                    <AITrainDelayRescheduler />
                  )}
                </div>
              )}

              {currentTab === 'direct-bus' && (
                <DirectBusBookingView
                  onOpenTicket={(id) => setActiveTicketId(id)}
                  onOpenWallet={() => setIsWalletOpen(true)}
                />
              )}

              {currentTab === 'en-route' && (
                <EnRoutePickupBookingView
                  onOpenTicket={(id) => setActiveTicketId(id)}
                  onOpenWallet={() => setIsWalletOpen(true)}
                />
              )}

              {currentTab === 'demand-forecast' && (
                <AIDemandForecasting />
              )}

              {currentTab === 'my-bookings' && (
                <MyBookingsView
                  onOpenTicket={(id) => setActiveTicketId(id)}
                  onOpenRecovery={(id) => setRecoveryBookingId(id)}
                  onNewBookingClick={() => setCurrentTab('train-pool')}
                />
              )}

              {currentTab === 'transit-map' && (
                <div className="space-y-4">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mysuru Urban Feeder Transit Map</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Integrated railway and bus routes originating from Mysuru Junction (MYS) and City Bus Stand (CBS).
                    </p>
                  </div>
                  <MysuruTransitMap routes={routes} />
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">YatriSync</span>
              <span>·</span>
              <span>Every Arrival, A Connected Journey</span>
              <span>·</span>
              <span>Mysuru, Karnataka, India</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600">
              <span>20-Seat Pooling Standard</span>
              <span>·</span>
              <span>KSRTC City Urban Feeder</span>
              <span>·</span>
              <span>Escrow Guarantee</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Drawers & Modals */}
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setActiveTicketId(null)}
          onOpenRecovery={(id) => setRecoveryBookingId(id)}
        />
      )}

      <WalletDrawer
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
      />

      <BackendStatusModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />

      <SafetySOSModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      <MultilingualAssistantModal
        isOpen={isMultilingualModalOpen}
        onClose={() => setIsMultilingualModalOpen(false)}
      />

      {recoveryBookingId && (
        <JourneyRecoveryModal
          bookingId={recoveryBookingId}
          onClose={() => setRecoveryBookingId(null)}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
