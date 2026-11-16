import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, Trash2 } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Real-Time Transit Alerts</h3>
              <p className="text-[11px] text-slate-300">Mysuru Junction Train-to-Bus Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No recent notifications.
            </div>
          ) : (
            notifications.map(notif => {
              const iconMap = {
                SUCCESS: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
                INFO: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
                WARNING: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
                ALERT: <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />,
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-slate-50 border-slate-200 opacity-70'
                      : 'bg-white border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {iconMap[notif.type]}
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs">{notif.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
