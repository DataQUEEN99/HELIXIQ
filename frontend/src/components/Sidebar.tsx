import React from 'react';
import { 
  Home, 
  Activity, 
  Layers, 
  Dna, 
  ListFilter, 
  Network, 
  Sparkles, 
  ShieldCheck, 
  GitCommit, 
  BrainCircuit, 
  Cloud, 
  FileCheck, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  collapsed,
  setCollapsed,
}) => {
  const navItems = [
    { id: 'landing', label: 'Platform Home', icon: Home },
    { id: 'overview', label: 'Overview & Pulse', icon: Activity },
    { id: 'samples', label: 'Samples & Data', icon: Layers },
    { id: 'genome', label: 'Genome Explorer', icon: Dna },
    { id: 'variants', label: 'Variant Intelligence', icon: ListFilter },
    { id: 'evidence', label: 'Evidence & Story', icon: Network },
    { id: 'copilot', label: 'Genomic Copilot', icon: Sparkles },
    { id: 'qc', label: 'NGS Quality & Depth', icon: ShieldCheck },
    { id: 'pipeline', label: 'Analysis Pipeline', icon: GitCommit },
    { id: 'ml', label: 'ML & SHAP Explainability', icon: BrainCircuit },
    { id: 'cloud', label: 'Cloud & MLOps', icon: Cloud },
    { id: 'reports', label: 'Reports Generator', icon: FileCheck },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`relative z-30 transition-all duration-300 border-r border-slate-800 bg-[#070B14]/90 backdrop-blur-md flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400 flex items-center justify-center shadow-md z-40 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation List */}
      <div className="py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
              }`} />
              
              {!collapsed && (
                <span className="truncate tracking-wide">{item.label}</span>
              )}

              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status */}
      {!collapsed && (
        <div className="p-3 m-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">PIPELINE:</span>
            <span className="text-cyan-400 font-bold">GATK4 + VEP</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">ML INFERENCE:</span>
            <span className="text-violet-400 font-bold">XGBoost 2.4</span>
          </div>
        </div>
      )}
    </aside>
  );
};
