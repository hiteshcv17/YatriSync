import React, { useState, useEffect } from 'react';
import { checkBackendHealth } from '../services/api';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Code2, Copy, Check } from 'lucide-react';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({ isOpen, onClose }) => {
  const [apiUrl, setApiUrl] = useState<string>(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  );
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [healthStatus, setHealthStatus] = useState<{
    tested: boolean;
    online: boolean;
    details?: any;
    message?: string;
    activeUrl?: string;
  }>({
    tested: false,
    online: false,
  });
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      testHealth();
    }
  }, [isOpen]);

  const testHealth = async (overrideUrl?: string) => {
    setIsChecking(true);
    // If running in cloud preview without explicit custom URL, test current integrated backend
    const urlToTest = overrideUrl !== undefined 
      ? overrideUrl 
      : (window.location.hostname.includes('run.app') && apiUrl.includes('localhost') ? '' : apiUrl);
    
    const result = await checkBackendHealth(urlToTest);
    setHealthStatus({
      tested: true,
      online: result.online,
      details: result.details,
      message: result.message,
      activeUrl: result.activeUrl,
    });
    setIsChecking(false);
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">Backend Architecture & Live Status</h3>
              <p className="text-xs text-slate-300">Integrated REST Server + Standalone Python FastAPI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Status Box */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            healthStatus.online
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            {healthStatus.online ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-sm">
                  {healthStatus.online
                    ? 'Backend Server Connected (HTTP 200 OK)'
                    : 'Backend In Standby / Disconnected'}
                </strong>
                <button
                  onClick={() => testHealth()}
                  disabled={isChecking}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/80 border border-current/20 text-[11px] font-semibold hover:bg-white transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>Ping Health</span>
                </button>
              </div>

              <p className="leading-relaxed">
                {healthStatus.online
                  ? `Active backend responding from "${healthStatus.activeUrl || 'Current Origin'}". Service: ${healthStatus.details?.service || 'YatriSync API'} (Location: ${healthStatus.details?.location || 'Mysuru'}).`
                  : `Could not reach ${apiUrl}. If running locally in VS Code, start the backend terminal with: cd backend && uvicorn main:app --reload --port 8000.`}
              </p>
            </div>
          </div>

          {/* Config URL */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">FastAPI Base URL (`VITE_API_BASE_URL`):</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000 or https://your-backend.onrender.com"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={() => testHealth(apiUrl)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shrink-0"
              >
                Test URL
              </button>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Set this in your `.env` or Render environment settings as `VITE_API_BASE_URL`.
            </span>
          </div>

          {/* Backend Codebase in Repository */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Code2 className="w-4 h-4 text-blue-600" />
                <span>FastAPI Codebase Generated in `/backend`</span>
              </div>
              <button
                onClick={() => copyCommand('cd backend && uvicorn main:app --reload --port 8000')}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded hover:bg-slate-100"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy run command'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-600">
              The complete FastAPI codebase has been scaffolded inside the project at <strong>`/backend`</strong>:
            </p>

            <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside font-mono">
              <li>backend/main.py: FastAPI REST endpoints with CORS & seed data</li>
              <li>backend/models.py: SQLAlchemy ORM models (PostgreSQL & SQLite)</li>
              <li>backend/schemas.py: Pydantic request & response validation</li>
              <li>backend/database.py: Database connection & session management</li>
              <li>backend/requirements.txt: Dependencies (fastapi, uvicorn, sqlalchemy)</li>
              <li>backend/README.md: Local run instructions & Render deployment guide</li>
            </ul>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <a
            href="/YatriSync.zip"
            download="YatriSync.zip"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors"
          >
            <span>Download YatriSync Folder (.ZIP)</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
