import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PoolGroup, BusVehicle } from '../../types';
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
  Sparkles,
  RotateCcw,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Send,
} from 'lucide-react';

export const OperatorDashboardView: React.FC = () => {
  const {
    poolGroups,
    buses,
    approveAllocation,
    rejectAllocation,
    addEmergencyAllocationReview,
    simulateAddPassengersToPool,
    departBus,
    addBusToFleet,
    resetDataToSeed,
  } = useApp();

  const [activeModalPool, setActiveModalPool] = useState<PoolGroup | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const [departureTime, setDepartureTime] = useState<string>('12:45 PM');
  const [pickupGate, setPickupGate] = useState<string>('Main Concourse Bay 2 (PF 1 Exit)');
  const [rejectionModalPool, setRejectionModalPool] = useState<PoolGroup | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('No available midi-bus in this time slot');

  // Requests needing review or action — explicitly exclude already assigned, dispatched, or cancelled!
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

  const handleAddStandbyBusAndSelect = () => {
    addBusToFleet();
    // After adding, select the newly added bus
    setTimeout(() => {
      const latest = buses[0];
      if (latest) setSelectedBusId(latest.id);
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight">KSRTC Transport Operator Operations Console</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Mysuru Urban Transit Coordination: Review passenger pooling groups, dispatch feeder vehicles, approve allocations, and manage late-night safety exceptions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={resetDataToSeed}
            title="Reset to pristine initial seed state"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo Data</span>
          </button>

          <div className="px-3.5 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Standby Fleet</span>
            <span className="font-mono text-sm font-bold text-emerald-400">{standbyBuses.length} Buses Ready</span>
          </div>
          <div className="px-3.5 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Allocation Queue</span>
            <span className="font-mono text-sm font-bold text-amber-400">{pendingRequests.length} Pending</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Allocation Requests Queue (FR-04, FR-11, FR-12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Pending Allocation Requests */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Incoming Feeder Bus Allocation Requests</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">{pendingRequests.length} Requests Active</span>
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
                        isLateNight
                          ? 'border-purple-300 bg-purple-50/30'
                          : hasReached20
                            ? 'border-emerald-300 bg-emerald-50/20'
                            : 'border-slate-200 bg-white'
                      }`}
                    >
                      {/* Priority Tag Banner for FR-11 */}
                      {isLateNight && (
                        <div className="mb-3 p-2.5 rounded-xl bg-purple-100/80 border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">FR-11 Late-Night Safety Exception Review:</span>
                            <span className="text-[11px] leading-relaxed">
                              {pool.priorityReason || 'Final scheduled night bus: Low occupancy exception review. Dispatched to protect vulnerable and stranded rail arrivals.'}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-white font-bold">
                              Route {pool.routeId}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 font-mono">
                              Trains #{pool.trainNumbers.join(', ')}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 pt-0.5">
                            {pool.targetDestination}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span>Corridor: <strong>{pool.corridorName}</strong></span>
                            <span>·</span>
                            <span>Arrival Window: <strong className="font-mono">{pool.arrivalWindowStart} - {pool.arrivalWindowEnd}</strong></span>
                          </div>
                        </div>

                        {/* Seat Meter Badge */}
                        <div className="text-right sm:self-center shrink-0">
                          <div className={`text-2xl font-bold font-mono ${
                            hasReached20 ? 'text-emerald-700' : 'text-purple-700'
                          }`}>
                            {pool.bookedSeats} / {pool.targetThreshold}
                          </div>
                          <span className="text-[11px] text-slate-500 block uppercase font-mono">
                            {hasReached20 ? 'Standard Target Met' : 'Low-Occupancy Exception'}
                          </span>
                        </div>
                      </div>

                      {/* Passenger list snapshot & Cost Estimation */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{pool.passengers.length} Bookings ({pool.bookedSeats} seats)</span>
                          </div>
                          <span className="text-slate-300">|</span>
                          <div className="flex items-center gap-1 text-slate-700 font-mono">
                            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Est. Cost: ₹{pool.operatingCostEstimate || 420}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setRejectionModalPool(pool)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                          >
                            Decline Request
                          </button>
                          <button
                            onClick={() => handleOpenApproveModal(pool)}
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                          >
                            <span>Assign Bus & Approve</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Active / Dispatched Pools */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Active Allocated Corridors & Boarding Buses</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">{activeAllocatedPools.length} Dispatched</span>
            </div>

            {activeAllocatedPools.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No corridors currently boarding. Approved feeder buses will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {activeAllocatedPools.map(pool => (
                  <div
                    key={pool.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{pool.allocatedBusNumber}</span>
                        <span className="font-semibold text-emerald-700">· Boarding Active</span>
                      </div>
                      <p className="font-bold text-slate-800">{pool.targetDestination}</p>
                      <div className="text-slate-500 text-[11px] flex items-center gap-2">
                        <span>Gate: {pool.pickupGate}</span>
                        <span>·</span>
                        <span>Departure: {pool.departureTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right">
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {pool.bookedSeats} Seats Reserved
                        </span>
                        <span className="block text-[10px] text-slate-400">Fare captured</span>
                      </div>

                      {pool.allocatedBusId && (
                        <button
                          onClick={() => departBus(pool.allocatedBusId!)}
                          className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg shadow-2xs transition-colors shrink-0 flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5 text-blue-600" />
                          <span>Mark Departed</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Fleet Management & Quick Simulator */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fleet Status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bus className="w-4 h-4 text-emerald-600" />
                <span>Mysuru KSRTC Fleet Inventory</span>
              </h3>
              <button
                onClick={() => addBusToFleet()}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Bus</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {buses.map(bus => (
                <div
                  key={bus.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{bus.regNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      bus.status === 'BOARDING'
                        ? 'bg-emerald-100 text-emerald-800'
                        : bus.status === 'STANDBY'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                    }`}>
                      {bus.status}
                    </span>
                  </div>

                  <p className="text-slate-600 font-medium">{bus.busType} ({bus.totalCapacity} seats)</p>

                  <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-200/60 font-mono">
                    <span>Driver: {bus.driverName}</span>
                    {bus.status === 'BOARDING' && (
                      <button
                        onClick={() => departBus(bus.id)}
                        className="text-[10px] text-indigo-600 font-bold hover:underline"
                      >
                        Free Bus
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Simulation Trigger for Collecting Pools */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Corridors Currently Collecting</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Groups gathering bookings. Simulate arriving rail passengers to reach the 20-seat threshold:
            </p>

            <div className="space-y-2">
              {collectingPools.map(pool => (
                <div key={pool.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-900 truncate max-w-[150px]">{pool.targetDestination}</span>
                    <span className="font-mono text-slate-800 font-bold">{pool.bookedSeats} / 20</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => simulateAddPassengersToPool(pool.id, 4)}
                      className="flex-1 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                    >
                      +4 Seats
                    </button>
                    <button
                      type="button"
                      onClick={() => addEmergencyAllocationReview(pool.id)}
                      className="py-1 px-2 text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg transition-colors"
                    >
                      Flag Safety
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bus Assignment & Approval Modal */}
      {activeModalPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Assign Bus & Confirm Dispatch</h3>
                <p className="text-xs text-slate-300">Operator Review for {activeModalPool.targetDestination}</p>
              </div>
              <button
                onClick={() => setActiveModalPool(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination Corridor:</span>
                  <strong className="text-slate-900">{activeModalPool.targetDestination}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Pooled Train Passengers:</span>
                  <strong className="font-mono text-slate-900">{activeModalPool.bookedSeats} Seats</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Connected Rail Arrival:</span>
                  <span className="text-slate-700 font-mono">Train #{activeModalPool.trainNumbers.join(', ')}</span>
                </div>
              </div>

              {/* AI Vehicle Recommendation & Cost Optimization */}
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200/80 space-y-1 text-indigo-950">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Fleet Optimization:</span>
                  </span>
                  <span className="font-mono font-bold text-indigo-700">
                    Est. Cost ₹{activeModalPool.operatingCostEstimate || 420}
                  </span>
                </div>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  Electric Midi AC (32 seats) recommended for this {activeModalPool.bookedSeats}-passenger group to maximize fuel economy.
                </p>
              </div>

              {/* Select Bus */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 block">Select Vehicle from Fleet:</label>
                  <button
                    type="button"
                    onClick={handleAddStandbyBusAndSelect}
                    className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>+ Quick Deploy Reserve Bus</span>
                  </button>
                </div>

                <select
                  value={selectedBusId}
                  onChange={e => setSelectedBusId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 text-xs"
                >
                  {buses.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.regNumber} — {b.busType} ({b.totalCapacity} capacity, status: {b.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Departure Time */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">Scheduled Departure Time:</label>
                <input
                  type="text"
                  value={departureTime}
                  onChange={e => setDepartureTime(e.target.value)}
                  placeholder="e.g. 12:45 PM"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              {/* Pickup Gate */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">Designated Station Boarding Bay:</label>
                <select
                  value={pickupGate}
                  onChange={e => setPickupGate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Main Concourse Bay 2 (PF 1 Exit)">Main Concourse Bay 2 (PF 1 Exit)</option>
                  <option value="Main Concourse Bay 1 (Front Porch)">Main Concourse Bay 1 (Front Porch)</option>
                  <option value="Platform 6 West Terminal Bus Bay">Platform 6 West Terminal Bus Bay</option>
                  <option value="Station Front Safe Transit Zone">Station Front Safe Transit Zone</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 leading-relaxed text-[11px]">
                <strong>Fare Capture Notice:</strong> Upon clicking approve, YatriSync will instantly capture all reserved wallet fares for {activeModalPool.bookedSeats} passengers, generate unique QR tickets, and notify passengers.
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setActiveModalPool(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Approve & Dispatch Bus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModalPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-red-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Decline Feeder Allocation</h3>
              <button onClick={() => setRejectionModalPool(null)}>✕</button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Declining this request will immediately cancel the pool, release 100% of the reserved wallet escrow to all passengers, and trigger the Journey Recovery assistant with alternative transport.
              </p>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Reason for Decline:</label>
                <textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                  rows={3}
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setRejectionModalPool(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleConfirmRejection}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Confirm Decline & Release Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
