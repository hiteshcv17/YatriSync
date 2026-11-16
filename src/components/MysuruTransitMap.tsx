import React from 'react';
import { BusRoute } from '../types';
import { MapPin, Bus, Train, Navigation, ShieldCheck } from 'lucide-react';

interface MysuruTransitMapProps {
  routes: BusRoute[];
  selectedRouteId?: string;
  onSelectRoute?: (routeId: string) => void;
}

export const MysuruTransitMap: React.FC<MysuruTransitMapProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-sm">Mysuru Train-to-Bus Corridor Network</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span>Hub: Mysuru Jn (MYS)</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 ml-2" />
          <span>Active Bus Corridors</span>
        </div>
      </div>

      {/* Visual Transit Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {routes.map(r => {
          const isSelected = selectedRouteId === r.routeId;
          return (
            <div
              key={r.routeId}
              onClick={() => onSelectRoute && onSelectRoute(r.routeId)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300 text-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  Route {r.routeId}
                </span>
                <span className={`text-[11px] font-mono font-bold ${
                  isSelected ? 'text-emerald-300' : 'text-slate-900'
                }`}>
                  ₹{r.standardFare}
                </span>
              </div>

              <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                {r.destination}
              </h4>
              <p className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                via {r.majorStops.join(' · ')}
              </p>

              <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] ${
                isSelected ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-500'
              }`}>
                <span>{r.approvedPickupStops.length} Approved Stops</span>
                <span>{r.frequencyType}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Station Boarding Hub:</strong> All pooled buses depart directly from Mysuru Junction (MYS) Platform 1 Concourse Bay 1/2 or Platform 6 West Terminal to avoid CBS walking transfer.
        </span>
      </div>
    </div>
  );
};
