import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  GitMerge,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AIPassengerPoolingMatcher: React.FC = () => {
  const { poolGroups, routes, mergePoolGroups, simulateAddPassengersToPool } = useApp();
  const [mergedSuccessId, setMergedSuccessId] = useState<string | null>(null);

  // Find candidate merge pools
  const mergeCandidateA = poolGroups.find(p => p.id === 'pool-merge-alpha' || p.compatibleWithPoolId);
  const mergeCandidateB = mergeCandidateA?.compatibleWithPoolId
    ? poolGroups.find(p => p.id === mergeCandidateA.compatibleWithPoolId)
    : null;

  const handleMerge = () => {
    if (mergeCandidateA && mergeCandidateB) {
      mergePoolGroups(mergeCandidateA.id, mergeCandidateB.id);
      setMergedSuccessId(mergeCandidateA.id);
      setTimeout(() => setMergedSuccessId(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feature Intro Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 p-6 rounded-2xl text-white shadow-lg border border-indigo-800/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Feature 1: AI Multimodal Passenger Pooling</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Intelligent Grouping & Compatibility Engine</h2>
            <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
              Dynamically matches arriving train passengers using arrival times, route detour compatibility,
              destination similarity, and predicted pace to reach the 20-seat threshold.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 bg-indigo-950/80 rounded-xl border border-indigo-700/50 text-right">
              <span className="text-[10px] text-indigo-300 uppercase block font-mono">Standard Target</span>
              <span className="font-mono text-base font-bold text-emerald-400">20 Seats / Bus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Merge Suggestion Showcase (Addressing Example 1 & 2 from User Request) */}
      {mergeCandidateA && mergeCandidateB && (
        <div className="p-6 bg-white rounded-2xl border-2 border-indigo-500/40 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <GitMerge className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    AI Auto-Merge Opportunity Detected
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                    96% Compatibility Score
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Combine 2 compatible train arrivals heading along North Mysuru Ring Road to reach 20 seats immediately.
                </p>
              </div>
            </div>

            <button
              onClick={handleMerge}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Merge & Form 20-Seat Dispatch Bus</span>
            </button>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Candidate A */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">Group Alpha (Train #17308)</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-200 text-slate-800">
                  {mergeCandidateA.bookedSeats} / 20 Seats
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{mergeCandidateA.targetDestination}</p>
                <p className="text-xs text-slate-500">{mergeCandidateA.corridorName}</p>
              </div>
              <div className="text-xs text-slate-600 space-y-1 font-mono pt-2 border-t border-slate-200/80">
                <div className="flex justify-between">
                  <span>Arrival Window:</span>
                  <span>{mergeCandidateA.arrivalWindowStart} – {mergeCandidateA.arrivalWindowEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span>Predicted to 20:</span>
                  <span className="text-amber-600 font-bold">~{mergeCandidateA.predictedTimeTo20Min || 15} mins</span>
                </div>
              </div>
            </div>

            {/* Candidate B */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">Group Beta (Train #12613)</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-200 text-slate-800">
                  {mergeCandidateB.bookedSeats} / 20 Seats
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{mergeCandidateB.targetDestination}</p>
                <p className="text-xs text-slate-500">{mergeCandidateB.corridorName}</p>
              </div>
              <div className="text-xs text-slate-600 space-y-1 font-mono pt-2 border-t border-slate-200/80">
                <div className="flex justify-between">
                  <span>Arrival Window:</span>
                  <span>{mergeCandidateB.arrivalWindowStart} – {mergeCandidateB.arrivalWindowEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span>Predicted to 20:</span>
                  <span className="text-amber-600 font-bold">~{mergeCandidateB.predictedTimeTo20Min || 20} mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Merge Result Simulation Indicator */}
          <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Merged Dispatch Outcome:</span>
              </div>
              <p className="text-indigo-800">
                {mergeCandidateA.bookedSeats} + {mergeCandidateB.bookedSeats} ={' '}
                <strong className="font-bold font-mono text-emerald-700">
                  {mergeCandidateA.bookedSeats + mergeCandidateB.bookedSeats} Seats (Threshold Met!)
                </strong>
                . Combined route detours only +3.2 km, saving ₹390 in duplicate fleet fuel.
              </p>
            </div>
            <button
              onClick={handleMerge}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shrink-0 shadow-xs"
            >
              Execute AI Merge Now
            </button>
          </div>
        </div>
      )}

      {mergedSuccessId && (
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>
            Groups successfully merged into 20-seat threshold! Request has been queued for immediate Operator Approval.
          </span>
        </div>
      )}

      {/* Dynamic Compatibility Engine Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Active Corridor Groups & Dynamic AI Matching</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time monitoring of passenger pooling groups arriving at Mysuru Junction (MYS).
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">{poolGroups.length} Corridors Monitored</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {poolGroups.map(pool => {
            const pct = Math.min(100, Math.round((pool.bookedSeats / pool.targetThreshold) * 100));
            const isFull = pool.bookedSeats >= pool.targetThreshold;

            return (
              <div
                key={pool.id}
                className={`p-4 rounded-xl border space-y-3 transition-all ${
                  isFull
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : pool.isPriorityFlagged
                      ? 'border-purple-300 bg-purple-50/20'
                      : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    Route #{pool.routeId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      pool.status === 'BUS_ASSIGNED'
                        ? 'bg-blue-100 text-blue-800'
                        : isFull
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {pool.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{pool.targetDestination}</h4>
                  <p className="text-xs text-slate-500">{pool.corridorName}</p>
                </div>

                {/* Progress toward 20 seats */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600">Booked Seats</span>
                    <strong className="text-slate-900">{pool.bookedSeats} / {pool.targetThreshold}</strong>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isFull ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* AI Prediction & Operating Cost */}
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">AI Match Score:</span>
                    <strong className="text-indigo-600">{pool.aiMatchScore || 94}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time to 20 Seats:</span>
                    <strong className="text-slate-800">
                      {isFull ? 'Ready to Dispatch' : `~${pool.predictedTimeTo20Min ?? 10} min`}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Est. Operating Cost:</span>
                    <strong className="text-slate-800">₹{pool.operatingCostEstimate || 420}</strong>
                  </div>
                </div>

                {pool.status === 'COLLECTING' && (
                  <button
                    type="button"
                    onClick={() => simulateAddPassengersToPool(pool.id, 4)}
                    className="w-full py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Simulate +4 Arriving Passengers</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
