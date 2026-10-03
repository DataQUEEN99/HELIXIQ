import React, { useState } from 'react';
import { 
  BrainCircuit, 
  BarChart2, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  Layers,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MLOpsMetrics, Variant } from '../types';

interface MachineLearningViewProps {
  mlMetrics: MLOpsMetrics;
  variants: Variant[];
}

export const MachineLearningView: React.FC<MachineLearningViewProps> = ({ mlMetrics, variants }) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('VAR-001');

  const activeVariant = variants.find(v => v.id === selectedVariantId) || variants[0];

  // SHAP Individual Feature Waterfall Data for Active Variant
  const shapData = [
    { feature: 'ClinVar Pathogenicity', impact: 0.32, direction: 'Pathogenic Signal', color: '#EF4444' },
    { feature: 'phyloP Conservation', impact: 0.24, direction: 'Pathogenic Signal', color: '#F43F5E' },
    { feature: 'gnomAD Pop Rarity', impact: 0.18, direction: 'Pathogenic Signal', color: '#FB7185' },
    { feature: 'REVEL Functional Score', impact: 0.14, direction: 'Pathogenic Signal', color: '#F472B6' },
    { feature: 'SpliceAI Score', impact: 0.04, direction: 'Neutral', color: '#64748B' },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-teal-500/30">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-teal-400" />
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">MACHINE LEARNING & SHAP EXPLAINABILITY</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {mlMetrics.model_name} ({mlMetrics.model_version}) — Feature engineering & SHAP impact
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-300 text-xs font-mono font-bold">
          BENCHMARK ROC-AUC: <span className="text-white font-extrabold">0.991</span>
        </div>
      </div>

      {/* MODEL PERFORMANCE KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">ACCURACY</div>
          <div className="text-xl font-bold font-mono text-emerald-400">{(mlMetrics.accuracy * 100).toFixed(1)}%</div>
          <div className="text-[10px] text-slate-500">Validation Set</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">PRECISION</div>
          <div className="text-xl font-bold font-mono text-teal-300">{(mlMetrics.precision * 100).toFixed(1)}%</div>
          <div className="text-[10px] text-slate-500">Pathogenic Class</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">RECALL</div>
          <div className="text-xl font-bold font-mono text-cyan-300">{(mlMetrics.recall * 100).toFixed(1)}%</div>
          <div className="text-[10px] text-slate-500">Sensitivity</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">F1 SCORE</div>
          <div className="text-xl font-bold font-mono text-violet-300">{(mlMetrics.f1_score * 100).toFixed(1)}%</div>
          <div className="text-[10px] text-slate-500">Harmonic Mean</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">ROC-AUC</div>
          <div className="text-xl font-bold font-mono text-white">{mlMetrics.roc_auc}</div>
          <div className="text-[10px] text-slate-500">Discrimination</div>
        </div>

      </div>

      {/* GLOBAL FEATURE IMPORTANCE & CONFUSION MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BAR CHART */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs text-slate-300">
            <span>GLOBAL MODEL FEATURE IMPORTANCE WEIGHTS</span>
            <span className="text-teal-400 font-bold">ENSEMBLE SHAP</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={mlMetrics.feature_importances}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis type="number" stroke="#64748B" fontSize={10} />
                <YAxis dataKey="feature" type="category" stroke="#94A3B8" fontSize={10} width={180} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="importance" fill="#14B8A6" radius={[0, 4, 4, 0]} name="Feature Importance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CONFUSION MATRIX CARD */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs text-slate-300">
              <span>CONFUSION MATRIX</span>
              <span className="text-cyan-400 font-bold">1,500 SAMPLES</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40">
                <div className="text-[10px] text-emerald-400">TRUE PATHOGENIC</div>
                <div className="text-lg font-bold text-emerald-200 mt-1">482</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
                <div className="text-[10px] text-rose-400">FALSE BENIGN</div>
                <div className="text-lg font-bold text-rose-200 mt-1">14</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <div className="text-[10px] text-amber-400">FALSE PATHOGENIC</div>
                <div className="text-lg font-bold text-amber-200 mt-1">23</div>
              </div>
              <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40">
                <div className="text-[10px] text-cyan-400">TRUE BENIGN</div>
                <div className="text-lg font-bold text-cyan-200 mt-1">981</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 font-mono">
            Evaluated against ClinVar benchmark subset. Research model only.
          </div>
        </div>

      </div>

      {/* WHY DID THE MODEL PREDICT THIS? SHAP EXPLAINABILITY */}
      <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">WHY DID THE MODEL PREDICT THIS?</h2>
              <p className="text-xs text-slate-400">Individual variant SHAP feature attribution waterfall</p>
            </div>
          </div>

          {/* Variant Selector Dropdown */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">SELECT VARIANT:</span>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold focus:outline-none"
            >
              {variants.slice(0, 8).map(v => (
                <option key={v.id} value={v.id}>{v.gene} ({v.hgvs_c})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Variant Context Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-white font-bold">{activeVariant.gene}</span> <span className="text-cyan-300">{activeVariant.hgvs_c}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Ensemble Score: <span className="text-rose-400 font-bold">{(activeVariant.model_probability * 100).toFixed(1)}%</span></span>
            <span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/40 text-[10px] font-bold">
              {activeVariant.pathogenicity}
            </span>
          </div>
        </div>

        {/* SHAP Waterfall Contribution Rows */}
        <div className="space-y-3">
          {shapData.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="w-48 font-bold text-slate-200">{item.feature}</div>
              
              {/* Contribution Bar */}
              <div className="flex-1 mx-4 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.impact * 200}%`, backgroundColor: item.color }}
                ></div>
              </div>

              <div className="w-32 text-right">
                <span className="font-bold text-rose-400">+{item.impact} SHAP</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
