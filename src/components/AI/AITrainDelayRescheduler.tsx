import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Train as TrainIcon,
  Bus,
  AlertTriangle,
  CheckCircle2,
  Bell,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Sliders,
} from 'lucide-react';

export const AITrainDelayRescheduler: React.FC = () => {
  const {
    trains,
    poolGroups,
    updateTrainDelay,
    rescheduleBusForDelay,
  } = useApp();

  const [selectedTrainNum, setSelectedTrainNum] = useState<string>('20607');
  const [customDelay, setCustomDelay] = useState<number>(25);
  const [rescheduledPoolId, setRescheduledPoolId] = useState<string | null>(null);

  const selectedTrain = trains.find(t => t.trainNumber === selectedTrainNum) || trains[0];

  // Pools connected to this train
  const connectedPools = poolGroups.filter(p =>
    p.trainNumbers.includes(selectedTrain?.trainNumber || '')
  );

  // Helper to calculate revised departure time
  const calculateRevisedTime = (baseTime: string, delayMin: number) => {
    try {
      // Basic time parser like "12:45 PM"
      const match = baseTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return `+${delayMin} min`;
      let hours = parseInt(match[1], 10);
      let mins = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();

      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const totalMins = hours * 60 + mins + delayMin;
      let newHours = Math.floor(totalMins / 60) % 24;
      const newMins = totalMins % 60;
      const newAmpm = newHours >= 12 ? 'PM' : 'AM';

      newHours = newHours % 12;
      if (newHours === 0) newHours = 12;

      return `${newHours}:${newMins.toString().padStart(2, '0')} ${newAmpm}`;
    } catch {
      return `+${delayMin}m adj`;
    }
  };

  const handleApplyDelay = (delay: number) => {
    if (!selectedTrain) return;
    setCustomDelay(delay);
    updateTrainDelay(selectedTrain.trainNumber, delay);
  };

  const handle1ClickReschedule = (poolId: string, currentDeparture: string) => {
    const revised = calculateRevisedTime(currentDeparture, customDelay);
    rescheduleBusForDelay(poolId, revised);
    setRescheduledPoolId(poolId);
    setTimeout(() => setRescheduledPoolId(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 p-6 rounded-2xl text-white shadow-lg border border-amber-800/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Feature 2: Dynamic Delay Prediction & Bus Rescheduling (High Priority)</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">AI Train Delay Synchronization Engine</h2>
            <p className="text-xs text-amber-200 max-w-2xl leading-relaxed">
              When Indian Railways trains arrive late at Mysuru Junction, YatriSync dynamically recalculates
              passenger deboarding windows and provides 1-click bus departure rescheduling to eliminate stranded riders.
            </p>
          </div>
          <div className="px-3.5 py-2 bg-amber-950/80 rounded-xl border border-amber-700/50 text-right shrink-0">
            <span className="text-[10px] text-amber-300 uppercase block font-mono">Live Feeder Buffer</span>
            <span className="font-mono text-base font-bold text-amber-400">15 Min Post-Deboard</span>
          </div>
        </div>
      </div>

      {/* Simulator Control Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Train Selector & Delay Slider */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrainIcon className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">Select Arriving Rail Service</h3>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Choose Train at Mysuru Jn:</label>
            <div className="space-y-2">
              {trains.slice(0, 5).map(train => {
                const isSelected = train.trainNumber === selectedTrain?.trainNumber;
                return (
                  <button
                    key={train.trainNumber}
                    onClick={() => {
                      setSelectedTrainNum(train.trainNumber);
                      setCustomDelay(train.delayMinutes);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">#{train.trainNumber}</span>
                        <span className="font-semibold text-slate-800">{train.trainName}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Scheduled: {train.arrivalTime} · PF {train.platform}
                      </span>
                    </div>

                    <div className="text-right font-mono">
                      {train.delayMinutes > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          +{train.delayMinutes}m Late
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          On Time
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Delay Slider */}
          {selectedTrain && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Simulate Rail Delay:</span>
                <span className="font-mono font-bold text-sm text-amber-600">
                  +{customDelay} Minutes
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={customDelay}
                onChange={e => handleApplyDelay(parseInt(e.target.value, 10))}
                className="w-full accent-amber-600"
              />

              <div className="flex justify-between gap-1 pt-1">
                {[0, 15, 30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => handleApplyDelay(mins)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors ${
                      customDelay === mins
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mins === 0 ? 'On Time' : `+${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Timeline & 1-Click Feeder Synchronization */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Feeder Bus Synchronization Board</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {connectedPools.length} Feeder Corridors Connected
            </span>
          </div>

          {/* Timeline Simulation Visualizer */}
          {selectedTrain && (
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Timeline Impact:</span>
                <span className="text-amber-400 font-bold">
                  Train #{selectedTrain.trainNumber} ({selectedTrain.trainName})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Scheduled Arrival</span>
                  <span className="text-sm font-bold text-slate-200">{selectedTrain.arrivalTime}</span>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Expected Platform Touch</span>
                  <span className="text-sm font-bold text-amber-400">
                    {calculateRevisedTime(selectedTrain.arrivalTime, selectedTrain.delayMinutes)}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Deboard Concourse Ready</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {calculateRevisedTime(selectedTrain.arrivalTime, selectedTrain.delayMinutes + 15)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Connected Feeder Corridors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800">
              Corridors Impacted by Train #{selectedTrain?.trainNumber}:
            </h4>

            {connectedPools.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                No active pools linked to Train #{selectedTrain?.trainNumber} at this moment. You can view
                Train Pooling tab to create a booking for this train.
              </div>
            ) : (
              <div className="space-y-3">
                {connectedPools.map(pool => {
                  const currentDeparture = pool.departureTime || '12:45 PM';
                  const revisedDeparture = calculateRevisedTime(currentDeparture, selectedTrain?.delayMinutes || 0);
                  const isModified = pool.id === rescheduledPoolId;

                  return (
                    <div
                      key={pool.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{pool.targetDestination}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700">
                              Route #{pool.routeId}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{pool.corridorName} · {pool.bookedSeats} Passengers</p>
                        </div>

                        <div className="text-right">
                          <span className="text-slate-500 block text-[10px] uppercase font-mono">Current Departure</span>
                          <span className="font-mono font-bold text-slate-900">{currentDeparture}</span>
                        </div>
                      </div>

                      {/* Synchronization Action */}
                      <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>AI Proposed Departure:</span>
                            <strong className="font-mono text-amber-600 text-sm">{revisedDeparture}</strong>
                          </span>
                          <p className="text-[10px] text-slate-500">
                            Ensures all {pool.bookedSeats} passengers from Train #{selectedTrain?.trainNumber} reach the bus bay without missing the connection.
                          </p>
                        </div>

                        <button
                          onClick={() => handle1ClickReschedule(pool.id, currentDeparture)}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>1-Click Reschedule</span>
                        </button>
                      </div>

                      {isModified && (
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Bus departure rescheduled to {revisedDeparture}. Push notification sent to all passengers!</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
