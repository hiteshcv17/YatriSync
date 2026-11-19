import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Leaf,
  Calendar,
  Clock,
  MapPin,
  Bus,
  Users,
  Shield,
  Sparkles,
  BarChart3,
} from 'lucide-react';

export const AIDemandForecasting: React.FC = () => {
  const { poolGroups, bookings } = useApp();
  const [selectedDay, setSelectedDay] = useState<'WEEKDAY' | 'WEEKEND'>('WEEKDAY');

  // Mysuru Corridors with forecast models
  const forecastCorridors = [
    {
      name: 'Hebbal IT Corridor (Infosys Campus)',
      routeId: '119',
      peakHour: '08:30 AM – 10:30 AM & 12:00 PM – 01:30 PM',
      predictedPassengers: selectedDay === 'WEEKDAY' ? 140 : 45,
      busesNeeded: selectedDay === 'WEEKDAY' ? 5 : 2,
      recommendedBusType: 'Electric Midi AC',
      confidence: 96,
      heatLevel: selectedDay === 'WEEKDAY' ? 'VERY_HIGH' : 'MEDIUM',
      driverTrend: 'Vande Bharat (20607) & Shatabdi (12007) commuter arrivals from Bengaluru.',
    },
    {
      name: 'Chamundi Hill Temple & Foothills',
      routeId: '201',
      peakHour: '09:00 AM – 01:00 PM & 04:30 PM – 07:00 PM',
      predictedPassengers: selectedDay === 'WEEKEND' ? 220 : 65,
      busesNeeded: selectedDay === 'WEEKEND' ? 6 : 3,
      recommendedBusType: 'Ashwamedha City Liner (High Capacity)',
      confidence: 94,
      heatLevel: selectedDay === 'WEEKEND' ? 'VERY_HIGH' : 'MEDIUM',
      driverTrend: 'Weekend pilgrim and tourist influx from Chamundi & Golgumbaz Express.',
    },
    {
      name: 'South Kuvempunagar & J.P. Nagar',
      routeId: '6-9 Series',
      peakHour: '07:30 PM – 10:30 PM',
      predictedPassengers: selectedDay === 'WEEKDAY' ? 85 : 90,
      busesNeeded: 3,
      recommendedBusType: 'Electric Midi AC (Night Owl)',
      confidence: 91,
      heatLevel: 'HIGH',
      driverTrend: 'Evening returning residents, students, and late-night safety pooled passengers.',
    },
    {
      name: 'Metaghalli & Industrial Belt',
      routeId: '1 Series',
      peakHour: '07:00 AM – 09:30 AM & 03:00 PM – 05:30 PM',
      predictedPassengers: 70,
      busesNeeded: 2,
      recommendedBusType: 'Mysuru Regular Feeder',
      confidence: 89,
      heatLevel: 'MEDIUM',
      driverTrend: 'Shift workers connecting from commuter passenger trains (06256 / 17308).',
    },
  ];

  // Carbon metrics
  const totalBookedSeats = poolGroups.reduce((acc, p) => acc + p.bookedSeats, 0);
  const estimatedPrivateVehiclesAvoided = Math.round(totalBookedSeats * 0.7);
  const kgCo2Saved = Math.round(totalBookedSeats * 2.8); // ~2.8 kg CO2 saved per passenger trip vs separate auto/cab

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-2xl text-white shadow-lg border border-emerald-800/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Features 8 & 10: Demand Forecasting & Carbon Analytics</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">AI Passenger Demand Forecasting & Green Impact</h2>
            <p className="text-xs text-emerald-200 max-w-2xl leading-relaxed">
              Predicts corridor arrival surges across Mysuru city based on railway reservation trends and calendar schedules,
              enabling KSRTC fleet prepositioning and quantifying carbon emission reductions.
            </p>
          </div>

          {/* Toggle Weekday / Weekend */}
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex gap-1 shrink-0">
            <button
              onClick={() => setSelectedDay('WEEKDAY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedDay === 'WEEKDAY'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekday (IT & Work)
            </button>
            <button
              onClick={() => setSelectedDay('WEEKEND')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedDay === 'WEEKEND'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekend (Chamundi / Tourism)
            </button>
          </div>
        </div>
      </div>

      {/* Carbon Analytics Card (Feature 10) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-500 uppercase block">Active Trip CO₂ Abatement</span>
            <span className="text-2xl font-black font-mono text-emerald-700">{kgCo2Saved} kg</span>
            <span className="text-[10px] text-slate-500 block">vs solo autos/cabs</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-500 uppercase block">Single Occupancy Trips Cut</span>
            <span className="text-2xl font-black font-mono text-slate-900">{estimatedPrivateVehiclesAvoided}</span>
            <span className="text-[10px] text-slate-500 block">vehicles removed from concourse</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-500 uppercase block">Fleet Energy Efficiency</span>
            <span className="text-2xl font-black font-mono text-indigo-700">88.4%</span>
            <span className="text-[10px] text-slate-500 block">Electric Midi fleet utilization</span>
          </div>
        </div>
      </div>

      {/* Demand Heatmap & Fleet Prepositioning Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Mysuru Urban Corridor Demand Heatmap</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Predicted passenger surges at Mysuru Junction over the next 4-hour window.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">Model: YS-Prophet v1.4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forecastCorridors.map(corridor => {
            const isVeryHigh = corridor.heatLevel === 'VERY_HIGH';
            const isHigh = corridor.heatLevel === 'HIGH';

            return (
              <div
                key={corridor.name}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3.5 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{corridor.name}</span>
                      <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                        Route #{corridor.routeId}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      Peak Window: {corridor.peakHour}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                      isVeryHigh
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : isHigh
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {corridor.heatLevel.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-white rounded-lg border border-slate-200 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500 block">Forecast Demand:</span>
                    <strong className="text-slate-900 text-sm font-bold">
                      {corridor.predictedPassengers} Passengers
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Fleet Recommended:</span>
                    <strong className="text-indigo-700 text-sm font-bold">
                      {corridor.busesNeeded} Buses
                    </strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Operational Insight: </strong>
                  {corridor.driverTrend}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Vehicle: {corridor.recommendedBusType}</span>
                  <span className="text-emerald-700 font-bold">{corridor.confidence}% Confidence</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
