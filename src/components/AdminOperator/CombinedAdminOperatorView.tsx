import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PoolGroup, BusVehicle } from '../../types';
import { ConductorScannerView } from '../Conductor/ConductorScannerView';
import {
  Bus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  PlusCircle,
  TrendingUp,
  FileSpreadsheet,
  Train,
  Scan,
  Settings,
  Send,
  Download,
  Filter,
  Search,
  Database,
  Copy,
  Check,
} from 'lucide-react';

export const CombinedAdminOperatorView: React.FC = () => {
  const {
    poolGroups,
    buses,
    trains,
    routes,
    bookings,
    role,
    setRole,
    authSession,
    approveAllocation,
    rejectAllocation,
    addEmergencyAllocationReview,
    simulateAddPassengersToPool,
    departBus,
    addBusToFleet,
    resetDataToSeed,
    updateTrainDelay,
  } = useApp();

  // Active operations section tab
  const [activeSection, setActiveSection] = useState<
    'DISPATCH' | 'FLEET' | 'POLICIES' | 'DATASETS' | 'SCANNER' | 'METRICS' | 'PASSENGER_DATA'
  >('DISPATCH');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Allocation modal state
  const [activeModalPool, setActiveModalPool] = useState<PoolGroup | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const [departureTime, setDepartureTime] = useState<string>('12:45 PM');
  const [pickupGate, setPickupGate] = useState<string>('Main Concourse Bay 2 (PF 1 Exit)');

  // Rejection modal state
  const [rejectionModalPool, setRejectionModalPool] = useState<PoolGroup | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('No available midi-bus in this time slot');

  // Policy & search filters
  const [thresholdSetting, setThresholdSetting] = useState<number>(20);
  const [policySaved, setPolicySaved] = useState<boolean>(false);
  const [routeSearch, setRouteSearch] = useState<string>('');
  const [trainSearch, setTrainSearch] = useState<string>('');

  // Pending allocation requests (FR-04, FR-11)
  const pendingRequests = poolGroups.filter(
    p =>
      (p.status === 'THRESHOLD_REACHED' ||
        p.status === 'ALLOCATION_REQUESTED' ||
        p.isPriorityFlagged) &&
      p.status !== 'BUS_ASSIGNED' &&
      p.status !== 'DISPATCHED' &&
      p.status !== 'CANCELLED'
  );

  const activeAllocatedPools = poolGroups.filter(p => p.status === 'BUS_ASSIGNED');
  const collectingPools = poolGroups.filter(
    p => p.status === 'COLLECTING' && !p.isPriorityFlagged
  );
  const standbyBuses = buses.filter(b => b.status === 'STANDBY');

  const totalPassengers = bookings.reduce((acc, b) => acc + b.seatCount, 0);
  const boardedCount = bookings.filter(b => b.bookingStatus === 'BOARDED').reduce((acc, b) => acc + b.seatCount, 0);

  const handleOpenApproveModal = (pool: PoolGroup) => {
    setActiveModalPool(pool);
    const available = standbyBuses[0] || buses.find(b => b.status === 'STANDBY') || buses[0];
    setSelectedBusId(available?.id || '');
    setDepartureTime(pool.arrivalWindowEnd || '12:45 PM');
  };

  const handleConfirmApproval = () => {
    if (!activeModalPool || !selectedBusId) return;
    approveAllocation(activeModalPool.id, selectedBusId, departureTime, pickupGate);
    setActiveModalPool(null);
  };

  const handleConfirmRejection = () => {
    if (!rejectionModalPool) return;
    rejectAllocation(rejectionModalPool.id, rejectionReason);
    setRejectionModalPool(null);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setPolicySaved(true);
    setTimeout(() => setPolicySaved(false), 2500);
  };

  const filteredRoutes = routes.filter(
    r =>
      r.corridorName.toLowerCase().includes(routeSearch.toLowerCase()) ||
      r.destination.toLowerCase().includes(routeSearch.toLowerCase()) ||
      r.routeId.includes(routeSearch)
  );

  const filteredTrains = trains.filter(
    t =>
      t.trainName.toLowerCase().includes(trainSearch.toLowerCase()) ||
      t.trainNumber.includes(trainSearch) ||
      t.originStation.toLowerCase().includes(trainSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Console Top Header Banner */}
      <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-xl flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight">
              Unified Operator & Admin Operations Console
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              KSRTC & Urban Division
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Single combined authority hub: Dispatch feeder vehicles, review pooling thresholds, audit transit datasets, manage crew rosters, and validate boarding passes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={resetDataToSeed}
            title="Reset to pristine initial seed state"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo Data</span>
          </button>

          <a
            href="/YatriSync.zip"
            download="YatriSync.zip"
            className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export ZIP</span>
          </a>

          <div className="px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Standby Fleet</span>
            <span className="font-mono text-sm font-bold text-emerald-400">{standbyBuses.length} Buses Ready</span>
          </div>

          <div className="px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Queue</span>
            <span className="font-mono text-sm font-bold text-amber-400">{pendingRequests.length} Pending</span>
          </div>
        </div>
      </div>

      {/* Operations Navigation Ribbon / Subtabs */}
      <div className="flex items-center gap-1 overflow-x-auto p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveSection('DISPATCH')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSection === 'DISPATCH'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bus className="w-4 h-4 text-blue-500" />
          <span>Feeder Dispatch Queue</span>
          {pendingRequests.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500 text-slate-950 font-extrabold">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection('FLEET')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSection === 'FLEET'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-500" />
          <span>Fleet & Crew Roster</span>
          <span className="text-[11px] font-mono text-slate-400">({buses.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('SCANNER')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSection === 'SCANNER'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Scan className="w-4 h-4 text-amber-500" />
          <span>Conductor QR Scanner</span>
        </button>

        <button
          onClick={() => setActiveSection('POLICIES')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSection === 'POLICIES'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4 text-purple-500" />
          <span>Governance & 20-Seat Policy</span>
        </button>

        <button
          onClick={() => setActiveSection('DATASETS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSection === 'DATASETS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
          <span>Mysuru Datasets (Routes & Trains)</span>
        </button>

        <button
          onClick={() => setActiveSection('METRICS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSection === 'METRICS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-teal-500" />
          <span>KPI Analytics</span>
        </button>

        <button
          onClick={() => setActiveSection('PASSENGER_DATA')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSection === 'PASSENGER_DATA'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-500" />
          <span>Passenger Data & Storage Explorer</span>
          <span className="text-[11px] font-mono text-slate-400">({bookings.length})</span>
        </button>
      </div>

      {/* ===================== SECTION 1: DISPATCH QUEUE ===================== */}
      {activeSection === 'DISPATCH' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Allocation Requests Queue */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bus className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Incoming Feeder Bus Allocation Requests
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {pendingRequests.length} Requests Active
                </span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">All Allocation Requests Handled!</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    No requests awaiting allocation. Check "Active Allocated Corridors" below to monitor boarding buses or depart vehicles back to standby.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map(pool => {
                    const hasReached20 = pool.bookedSeats >= pool.targetThreshold;
                    const isLateNight = pool.isPriorityFlagged || pool.isLateNight;

                    return (
                      <div
                        key={pool.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isLateNight && !hasReached20
                            ? 'bg-amber-50/60 border-amber-300'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-base">
                                {pool.targetDestination}
                              </h4>
                              {isLateNight && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                  Late-Night Exception
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Corridor: <strong className="text-slate-700">{pool.corridorName}</strong> · Route #{pool.routeId}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                              {pool.bookedSeats} / {pool.targetThreshold} Seats
                            </span>
                            <span className="block text-[11px] text-slate-400 mt-1">
                              Window: {pool.arrivalWindowStart} – {pool.arrivalWindowEnd}
                            </span>
                          </div>
                        </div>

                        {/* Trains contributing */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-4">
                          <Train className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Contributing Trains:</span>
                          {pool.trainNumbers.map(tNum => (
                            <span key={tNum} className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-800">
                              #{tNum}
                            </span>
                          ))}
                          <span className="text-slate-400">·</span>
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{pool.passengers.length} Passenger Bookings</span>
                        </div>

                        {/* Priority Banner if late night */}
                        {isLateNight && pool.priorityReason && (
                          <div className="p-3 mb-4 rounded-xl bg-amber-100/70 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block font-semibold">Priority Safety Flag:</strong>
                              <span>{pool.priorityReason}</span>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            onClick={() => setRejectionModalPool(pool)}
                            className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            Decline Allocation
                          </button>

                          <button
                            onClick={() => handleOpenApproveModal(pool)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Assign Feeder Bus & Approve</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active Allocated Corridors & Boarding Monitoring */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Active Allocated Corridors (Boarding at Bays)
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {activeAllocatedPools.length} Dispatched Buses
                </span>
              </div>

              {activeAllocatedPools.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No corridors currently allocated. Approve an incoming request to dispatch a feeder bus.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeAllocatedPools.map(pool => {
                    const bus = buses.find(b => b.id === pool.allocatedBusId);
                    return (
                      <div
                        key={pool.id}
                        className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">
                              {pool.targetDestination}
                            </h4>
                            <span className="text-xs text-slate-500">
                              {pool.corridorName} · Departs {pool.departureTime}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                            BOARDING
                          </span>
                        </div>

                        <div className="text-xs space-y-1 text-slate-600 font-mono">
                          <div>Bus: <strong className="text-slate-900">{pool.allocatedBusNumber || bus?.regNumber}</strong></div>
                          <div>Bay: <strong className="text-slate-900">{pool.pickupGate || bus?.pickupLocation}</strong></div>
                          <div>Seats Reserved: <strong className="text-emerald-700">{pool.bookedSeats} train passengers</strong></div>
                        </div>

                        <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">Conductor scanning active</span>
                          {bus && (
                            <button
                              onClick={() => departBus(bus.id)}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded-lg transition-colors"
                            >
                              Mark Departed
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Collecting Pools & Standby Roster */}
          <div className="lg:col-span-4 space-y-6">
            {/* Collecting Pools (Watchlist) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Collecting Pools Watchlist</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">{collectingPools.length} Pools</span>
              </div>

              {collectingPools.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">No gathering pools at this moment.</p>
              ) : (
                <div className="space-y-3">
                  {collectingPools.map(pool => (
                    <div key={pool.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{pool.targetDestination}</span>
                        <span className="font-mono font-bold text-blue-600">
                          {pool.bookedSeats} / {pool.targetThreshold}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (pool.bookedSeats / pool.targetThreshold) * 100)}%`,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => simulateAddPassengersToPool(pool.id, 5)}
                          title="Simulate 5 arriving train passengers booking this pool"
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+5 Passengers (Sim)</span>
                        </button>

                        <button
                          onClick={() => addEmergencyAllocationReview(pool.id)}
                          className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>Request Review</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Standby Bus Roster Quick Widget */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 text-sm">Standby Fleet Quick View</h3>
                <button
                  onClick={() => addBusToFleet()}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Bus</span>
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {standbyBuses.map(b => (
                  <div key={b.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900 block">{b.regNumber}</span>
                      <span className="text-[11px] text-slate-500">{b.busType} · {b.totalCapacity} seats</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                      READY
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SECTION 2: FLEET & CREW ROSTER ===================== */}
      {activeSection === 'FLEET' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                KSRTC Feeder Bus Fleet & Assigned Crew Roster
              </h3>
              <p className="text-xs text-slate-500">
                Official Mysore Urban Division dedicated feeder fleet attached to Mysuru Jn.
              </p>
            </div>
            <button
              onClick={() => addBusToFleet()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 self-start transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Vehicle to Standby Fleet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buses.map(bus => (
              <div
                key={bus.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-extrabold text-slate-900">
                    {bus.regNumber}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      bus.status === 'STANDBY'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : bus.status === 'BOARDING'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {bus.status}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-600">
                  <div>Model: <strong className="text-slate-800">{bus.busType}</strong></div>
                  <div>Capacity: <strong className="text-slate-800">{bus.totalCapacity} Seats</strong> {bus.isWheelchairAccessible && '· ♿ Accessible'}</div>
                  <div>Driver: <span className="font-mono text-slate-800">{bus.driverName} ({bus.driverPhone})</span></div>
                  <div>Conductor: <span className="font-mono text-slate-800">{bus.conductorName} ({bus.conductorPhone})</span></div>
                  <div>Station Bay: <span className="text-slate-800">{bus.pickupLocation}</span></div>
                </div>

                {bus.status === 'BOARDING' && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-blue-600 font-semibold">Active Dispatch</span>
                    <button
                      onClick={() => departBus(bus.id)}
                      className="px-2.5 py-1 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                    >
                      Depart Bus
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== SECTION 3: CONDUCTOR SCANNER ===================== */}
      {activeSection === 'SCANNER' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <span>
              <strong>Station Conductor Gate Verification:</strong> Scan digital QR codes on passenger passes to validate seat reservations and enforce anti-duplicate boarding rules.
            </span>
            <span className="font-mono font-bold text-amber-800">Anti-Duplicate Protected</span>
          </div>
          <ConductorScannerView />
        </div>
      )}

      {/* ===================== SECTION 4: GOVERNANCE & POLICIES ===================== */}
      {activeSection === 'POLICIES' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                Pooling Engine Threshold & Operational Policies
              </h3>
              <p className="text-xs text-slate-500">
                Configure standard 20-seat threshold logic, late-night safety exception overrides, and automated dispatch triggers.
              </p>
            </div>

            <form onSubmit={handleSavePolicy} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Standard Pooling Threshold per Feeder Group
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={thresholdSetting}
                    onChange={e => setThresholdSetting(Number(e.target.value))}
                    className="w-32 px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:border-slate-900"
                  />
                  <span className="text-xs text-slate-500">
                    Seats (Standard default is 20 seats for midi-bus economic viability)
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Enforced System Policies:</span>
                <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                  <li><strong>Late-Night Safety Override:</strong> Trains arriving post-22:30 allow manual operator review under 20 seats.</li>
                  <li><strong>Escrow Fare Guarantee:</strong> Fares reserved on booking; captured strictly upon bus assignment.</li>
                  <li><strong>Anti-Duplicate Scan Rule:</strong> QR tickets once marked BOARDED cannot be reused.</li>
                </ul>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Save Policy Configuration
                </button>
                {policySaved && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Policy settings updated!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* System Operations Audit Log */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">System Operations Audit Log</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
                <span>[POL-MYS-01] Pooling engine standard threshold verified at 20 seats per route group</span>
                <span className="text-slate-500 font-bold">Active</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
                <span>[SEC-QR-02] Conductor anti-duplicate scan enforcement enabled</span>
                <span className="text-emerald-600 font-bold">Enforced</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
                <span>[NIGHT-03] Late-night safety review policy activated for arrivals post 10:30 PM</span>
                <span className="text-purple-600 font-bold">Operational</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
                <span>[ESCROW-04] Auto-refund trigger on pool expiry or operator decline verified</span>
                <span className="text-blue-600 font-bold">Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SECTION 5: DATASETS MASTER ===================== */}
      {activeSection === 'DATASETS' && (
        <div className="space-y-6">
          {/* Bus Routes Dataset */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Mysuru Bus Routes Master Dataset</h3>
                  <p className="text-xs text-slate-500">Source: mysuru_bus_routes_bfdf5096.csv</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search routes or corridor..."
                    value={routeSearch}
                    onChange={e => setRouteSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 w-48 sm:w-64 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <span className="text-xs font-mono text-slate-500">{filteredRoutes.length} Routes</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono">
                    <th className="py-2.5 pr-4">Route ID</th>
                    <th className="py-2.5 pr-4">Corridor Name</th>
                    <th className="py-2.5 pr-4">Destination</th>
                    <th className="py-2.5 pr-4">Fare</th>
                    <th className="py-2.5 pr-4">Approved Pickup Stops</th>
                    <th className="py-2.5">Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRoutes.map(route => (
                    <tr key={route.routeId} className="hover:bg-slate-50/70">
                      <td className="py-2.5 pr-4 font-mono font-bold text-slate-900">#{route.routeId}</td>
                      <td className="py-2.5 pr-4 font-semibold text-slate-800">{route.corridorName}</td>
                      <td className="py-2.5 pr-4 text-slate-700">{route.destination}</td>
                      <td className="py-2.5 pr-4 font-mono text-emerald-700 font-bold">₹{route.standardFare}</td>
                      <td className="py-2.5 pr-4 text-slate-500">{route.approvedPickupStops.length} Approved Stops</td>
                      <td className="py-2.5 text-slate-500">{route.frequencyType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Train Timetable Master */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Train className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Mysuru Train Timetable Master</h3>
                  <p className="text-xs text-slate-500">Source: mysuru_train_details_87523f47.csv</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search trains or origin..."
                    value={trainSearch}
                    onChange={e => setTrainSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 w-48 sm:w-64 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <span className="text-xs font-mono text-slate-500">{filteredTrains.length} Trains</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono">
                    <th className="py-2.5 pr-4">Train No.</th>
                    <th className="py-2.5 pr-4">Train Name</th>
                    <th className="py-2.5 pr-4">Origin Station</th>
                    <th className="py-2.5 pr-4">Arrival Time</th>
                    <th className="py-2.5 pr-4">Platform</th>
                    <th className="py-2.5 pr-4">Status / Delay</th>
                    <th className="py-2.5 text-right">Adjust Delay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTrains.map(train => (
                    <tr key={train.trainNumber} className="hover:bg-slate-50/70">
                      <td className="py-2.5 pr-4 font-mono font-bold text-slate-900">#{train.trainNumber}</td>
                      <td className="py-2.5 pr-4 font-semibold text-slate-800">{train.trainName}</td>
                      <td className="py-2.5 pr-4 text-slate-700">{train.originStation}</td>
                      <td className="py-2.5 pr-4 font-mono">{train.arrivalTime}</td>
                      <td className="py-2.5 pr-4 font-mono">PF {train.platform}</td>
                      <td className="py-2.5 pr-4 font-mono">
                        {train.delayMinutes > 0 ? (
                          <span className="text-amber-600 font-bold">+{train.delayMinutes} min late</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">On Time</span>
                        )}
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => updateTrainDelay(train.trainNumber, 0)}
                            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-mono"
                          >
                            0m
                          </button>
                          <button
                            onClick={() => updateTrainDelay(train.trainNumber, 15)}
                            className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-[10px] text-amber-800 font-mono font-bold"
                          >
                            +15m
                          </button>
                          <button
                            onClick={() => updateTrainDelay(train.trainNumber, 30)}
                            className="px-2 py-0.5 rounded bg-red-100 hover:bg-red-200 text-[10px] text-red-800 font-mono font-bold"
                          >
                            +30m
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SECTION 6: KPI METRICS ===================== */}
      {activeSection === 'METRICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Total Passengers Pooled
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {totalPassengers} Seats
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Across Mysuru Corridors</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Confirmed & Boarded
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
                {boardedCount} Boarded
              </div>
              <span className="text-[11px] text-slate-400 font-mono">100% QR Verified</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Active Pooling Groups
              </span>
              <div className="text-2xl font-bold font-mono text-blue-700 tabular-nums">
                {poolGroups.length} Pools
              </div>
              <span className="text-[11px] text-slate-400">Target: 20 seats standard</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Feeder Bus Fleet
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {buses.length} Vehicles
              </div>
              <span className="text-[11px] text-slate-400">KSRTC City Urban Division</span>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SECTION 7: PASSENGER DATA & STORAGE EXPLORER ===================== */}
      {activeSection === 'PASSENGER_DATA' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Passenger Data & Storage Explorer
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live client-side and server-side passenger records, booking manifests, and storage locations.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(bookings, null, 2));
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied JSON!' : 'Copy Bookings JSON'}</span>
                </button>

                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(bookings, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `yatrisync_passenger_bookings_${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .JSON</span>
                </button>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold block">Total Booking Records</span>
                <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {bookings.length}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Stored in localStorage 'yatrisync_bookings'</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold block">Active Logged-in Traveler</span>
                <span className="text-base font-bold text-slate-900 truncate block">
                  {authSession?.name || 'Kavitha Hegde'}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block">
                  PNR: {authSession?.pnr || '4231889021'} · {authSession?.emailOrPhone || '+91 98860 11223'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold block">Pooling Manifest Passengers</span>
                <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
                  {poolGroups.reduce((acc, p) => acc + p.passengers.length, 0)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Across {poolGroups.length} corridor groups</span>
              </div>
            </div>

            {/* Live Table of Passenger Bookings */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Active Passenger Bookings Table</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase font-mono border-b border-slate-200">
                      <th className="py-2.5 px-3">Booking ID</th>
                      <th className="py-2.5 px-3">Passenger</th>
                      <th className="py-2.5 px-3">Contact</th>
                      <th className="py-2.5 px-3">IRCTC PNR</th>
                      <th className="py-2.5 px-3">Train</th>
                      <th className="py-2.5 px-3">Destination</th>
                      <th className="py-2.5 px-3">Seats</th>
                      <th className="py-2.5 px-3">Fare Status</th>
                      <th className="py-2.5 px-3">Booking Status</th>
                      <th className="py-2.5 px-3">QR Ticket Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{b.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{b.passengerName}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{b.passengerPhone}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">{b.pnr || '—'}</td>
                        <td className="py-2.5 px-3 font-mono text-blue-600 font-semibold">#{b.trainNumber || 'Direct'}</td>
                        <td className="py-2.5 px-3 text-slate-700">{b.destination}</td>
                        <td className="py-2.5 px-3 font-mono font-bold">{b.seatCount}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            b.fareStatus === 'CAPTURED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.fareStatus} (₹{b.totalFare})
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            b.bookingStatus === 'BOARDED' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500 max-w-xs truncate">
                          {b.qrTicketCode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Storage Cheat Sheet Box */}
            <div className="p-4 bg-slate-900 rounded-xl text-slate-200 text-xs space-y-2 font-mono">
              <span className="font-bold text-emerald-400 block uppercase">
                Direct Browser Console Command to Fetch Value:
              </span>
              <p className="text-slate-300 font-sans text-xs">
                Open your browser console (<kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono">F12</kbd> → <strong>Console</strong>) and run:
              </p>
              <div className="p-2.5 bg-slate-950 rounded-lg text-emerald-300 font-mono text-xs select-all overflow-x-auto">
                console.table(JSON.parse(localStorage.getItem('yatrisync_bookings')));
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== APPROVAL MODAL ===================== */}
      {activeModalPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Assign Feeder Bus & Approve Allocation</h3>
                <p className="text-xs text-slate-300">
                  {activeModalPool.targetDestination} ({activeModalPool.bookedSeats} seats pooled)
                </p>
              </div>
              <button
                onClick={() => setActiveModalPool(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Standby Vehicle
                </label>
                <select
                  value={selectedBusId}
                  onChange={e => setSelectedBusId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:border-slate-900"
                >
                  {standbyBuses.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.regNumber} ({b.busType}) — Capacity: {b.totalCapacity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Departure Time
                  </label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={e => setDepartureTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Station Pickup Bay
                  </label>
                  <input
                    type="text"
                    value={pickupGate}
                    onChange={e => setPickupGate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                Approving this allocation will automatically capture reserved passenger fares from escrow and issue official QR tickets to all {activeModalPool.passengers.length} pooled passengers.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalPool(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApproval}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== REJECTION MODAL ===================== */}
      {rejectionModalPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-red-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Decline Feeder Allocation</h3>
                <p className="text-xs text-red-200">{rejectionModalPool.targetDestination}</p>
              </div>
              <button
                onClick={() => setRejectionModalPool(null)}
                className="p-1 rounded text-red-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Decline Reason
                </label>
                <select
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="No available midi-bus in this time slot">No available midi-bus in this time slot</option>
                  <option value="Corridor road maintenance / detour active">Corridor road maintenance / detour active</option>
                  <option value="Alternate regular CBS route 119 has frequent capacity">Alternate regular CBS route 119 has frequent capacity</option>
                  <option value="Operational schedule constraint">Operational schedule constraint</option>
                </select>
              </div>

              <p className="text-xs text-slate-500">
                Declining this allocation will immediately release all earmarked escrow funds back to passenger wallets and notify them to view journey recovery alternatives.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectionModalPool(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRejection}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
