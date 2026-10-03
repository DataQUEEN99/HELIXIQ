import React, { useState } from 'react';
import { 
  Dna, 
  Search, 
  Play, 
  Sparkles, 
  Upload, 
  FileText, 
  ChevronDown, 
  ShieldAlert, 
  CheckCircle2
} from 'lucide-react';
import { Sample } from '../types';

interface HeaderProps {
  currentSample: Sample;
  samples: Sample[];
  onSelectSample: (sample: Sample) => void;
  onOpenUpload: () => void;
  onOpenReport: () => void;
  onOpenCopilot: () => void;
  onReplayAnalysis: () => void;
  onSearch: (term: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSample,
  samples,
  onSelectSample,
  onOpenUpload,
  onOpenReport,
  onOpenCopilot,
  onReplayAnalysis,
  onSearch,
  setActiveView,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setActiveView('variants');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#070B14]/80 backdrop-blur-md px-4 lg:px-6 py-3">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Identity & Active Sample Selector */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveView('landing')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300 shadow-lg shadow-cyan-950/50">
              <Dna className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300 animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm -z-10"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                  HELIX<span className="text-cyan-400">IQ</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-medium">
                  Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Genomic Discovery & Variant Intelligence
              </p>
            </div>
          </div>

          {/* Active Sample Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/40 text-xs font-mono transition-all"
            >
              <span className="text-slate-400 font-sans text-[11px]">SAMPLE:</span>
              <span className="text-cyan-300 font-bold">{currentSample.id}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl glass-panel border border-slate-700 shadow-2xl z-50 p-1.5 space-y-1">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select NGS Dataset
                </div>
                {samples.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSample(s);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      s.id === currentSample.id
                        ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-200'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-mono font-bold">{s.id}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[170px]">{s.label}</div>
                    </div>
                    {s.id === currentSample.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64 lg:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Gene (BRCA1), Position, or rsID..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </form>

        {/* Status Indicator & Quick Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Analysis Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              READY
            </span>
          </div>

          {/* Action Buttons */}
          <button
            onClick={onReplayAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 text-xs font-medium transition-all shadow-sm"
            title="Replay visual analysis pipeline"
          >
            <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-950/80 border border-violet-500/40 text-violet-300 hover:bg-violet-900/50 hover:border-violet-400 text-xs font-medium transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-spin-slow" />
            <span className="hidden sm:inline">Copilot</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700/80 text-xs font-medium transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700/80 text-xs font-medium transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>

      </div>

      {/* Disclaimers Bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-amber-400/90 font-mono">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>RESEARCH USE ONLY - SIMULATED / DEMO DATA (NOT FOR CLINICAL DIAGNOSIS)</span>
        </div>
        <div className="hidden md:block font-mono text-[10px] text-slate-400">
          BUILD: GRCh38 / hg38 | MODEL: v2.4.1-prod
        </div>
      </div>
    </header>
  );
};
