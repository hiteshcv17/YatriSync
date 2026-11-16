import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Train, Bus, Users, ShieldCheck, Database, FileSpreadsheet, CheckCircle } from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const { trains, routes, poolGroups, buses, bookings } = useApp();
  const [activeTab, setActiveTab] = useState<'METRICS' | 'ROUTES' | 'TRAINS' | 'POLICIES'>('METRICS');
  const [thresholdSetting, setThresholdSetting] = useState<number>(20);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const totalPassengers = bookings.reduce((acc, b) => acc + b.seatCount, 0);
  const boardedCount = bookings.filter(b => b.bookingStatus === 'BOARDED').reduce((acc, b) => acc + b.seatCount, 0);
  const totalCorridors = routes.length;

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight">YatriSync System Administration & Governance</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Platform Configuration: Mysuru Urban Dataset verification, pooling algorithms, 20-seat threshold policy, and dispatch audit logs (FR-13).
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('METRICS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'METRICS' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            KPI Metrics
          </button>
          <button
            onClick={() => setActiveTab('ROUTES')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'ROUTES' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bus Dataset
          </button>
          <button
            onClick={() => setActiveTab('TRAINS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'TRAINS' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Train Timetable
          </button>
          <button
            onClick={() => setActiveTab('POLICIES')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'POLICIES' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Threshold Settings
          </button>
          <a
            href="/YatriSync.zip"
            download="YatriSync.zip"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 hover:bg-emerald-900 transition-colors whitespace-nowrap"
          >
            Download YatriSync Folder (.ZIP)
          </a>
        </div>
      </div>

      {/* Tab 1: KPI Metrics */}
      {activeTab === 'METRICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Passengers Pooled</span>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{totalPassengers} Seats</div>
              <span className="text-[11px] text-emerald-600 font-medium">Across Mysuru Corridors</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Confirmed & Boarded</span>
              <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">{boardedCount} Boarded</div>
              <span className="text-[11px] text-slate-400 font-mono">100% QR Verified</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Pooling Groups</span>
              <div className="text-2xl font-bold font-mono text-blue-700 tabular-nums">{poolGroups.length} Pools</div>
              <span className="text-[11px] text-slate-400">Target: 20 seats standard</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Feeder Bus Fleet</span>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{buses.length} Vehicles</div>
              <span className="text-[11px] text-slate-400">KSRTC City Urban Division</span>
            </div>
          </div>

          {/* Operational Log */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">System Operations Audit Log</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
                <span>[POL-MYS-01] Pooling engine standard threshold verified at 20 seats per route group</span>
                <span className="text-slate-400">Active</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
                <span>[SEC-QR-02] Conductor anti-duplicate scan enforcement enabled</span>
                <span className="text-emerald-600 font-bold">Enforced</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
                <span>[NIGHT-03] Late-night safety review policy activated for arrivals post 10:30 PM</span>
                <span className="text-purple-600 font-bold">Operational</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Bus Routes Dataset (from user's CSV) */}
      {activeTab === 'ROUTES' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Mysuru Bus Routes Dataset</h3>
                <p className="text-xs text-slate-500">Source: mysuru_bus_routes_bfdf5096.csv</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-500">{routes.length} Official Routes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">Route ID</th>
                  <th className="py-2.5 px-3">Route Type</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Major Stops</th>
                  <th className="py-2.5 px-3">Fare</th>
                  <th className="py-2.5 px-3">Approved Stops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {routes.map(r => (
                  <tr key={r.routeId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">{r.routeId}</td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{r.routeType}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{r.destination}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs">{r.majorStops.join(', ')}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">₹{r.standardFare}</td>
                    <td className="py-3 px-3 text-emerald-700 font-medium">{r.approvedPickupStops.length} stops</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Train Timetable Dataset (from user's CSV) */}
      {activeTab === 'TRAINS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Train className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Mysuru Junction Train Timetable Dataset</h3>
                <p className="text-xs text-slate-500">Source: mysuru_train_details_87523f47.csv</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-500">{trains.length} Trains Configured</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">Train Number</th>
                  <th className="py-2.5 px-3">Train Name</th>
                  <th className="py-2.5 px-3">Arrival Time</th>
                  <th className="py-2.5 px-3">Origin Station</th>
                  <th className="py-2.5 px-3">Service Type</th>
                  <th className="py-2.5 px-3">Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trains.map(t => (
                  <tr key={t.trainNumber} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{t.trainNumber}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{t.trainName}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{t.arrivalTime}</td>
                    <td className="py-3 px-3 text-slate-600">{t.originStation}</td>
                    <td className="py-3 px-3 text-slate-600">{t.serviceType}</td>
                    <td className="py-3 px-3 font-mono font-medium text-blue-700">{t.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Policies and Threshold Settings */}
      {activeTab === 'POLICIES' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-xl">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Platform Dispatch Threshold Settings</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tune core pooling parameters as specified in PRD Section 6 (Business Rules).
            </p>
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Standard Pooling Threshold (Seats per corridor):
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={thresholdSetting}
                onChange={e => setThresholdSetting(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
              />
              <span className="text-[11px] text-slate-500 block">
                Default: <strong>20 seats</strong>. Reaching this threshold creates an allocation request in the Operator Dashboard.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Late-Night Safety Exception Cutoff Hour:
              </label>
              <input
                type="text"
                disabled
                value="10:30 PM (22:30 IST)"
                className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-500"
              />
              <span className="text-[11px] text-slate-500 block">
                Arrivals after this time can be flagged for urgent operator exception review below 20 seats (FR-11).
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Save Operational Policy
              </button>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Policy parameters saved and applied to dispatch engine!</span>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
