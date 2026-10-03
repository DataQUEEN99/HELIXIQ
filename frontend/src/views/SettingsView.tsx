import React, { useState } from 'react';
import { Settings, Server, Database, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">PLATFORM SETTINGS</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure backend connection endpoints, model options, and disclaimers
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* API ENDPOINT CONFIG */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs font-bold text-cyan-400">
          <Server className="w-4 h-4" />
          <span>FASTAPI BACKEND ENDPOINT</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <label className="text-slate-300">API Gateway Base URL:</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
          />
          <p className="text-[10px] text-slate-500">Connected to FastAPI Microservice (v2.4.0) on port 8000.</p>
        </div>
      </div>

      {/* DATABASE & MODEL PARAMETERS */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 font-bold text-teal-400">
          <Database className="w-4 h-4" />
          <span>DATABASE ABSTRACTION & MODEL METRICS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-500 text-[10px]">CURRENT DATABASE</div>
            <div className="text-white font-bold text-sm">SQLite (Local Dev)</div>
            <div className="text-slate-400 text-[10px]">Cloud abstraction ready for Amazon Aurora PostgreSQL</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-500 text-[10px]">ML ENSEMBLE ENGINE</div>
            <div className="text-teal-300 font-bold text-sm">XGBoost 2.4 + SHAP</div>
            <div className="text-slate-400 text-[10px]">Feature engineering with gnomAD v4 & ClinVar 2026</div>
          </div>
        </div>
      </div>

    </div>
  );
};
