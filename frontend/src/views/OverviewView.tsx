import React from 'react';
import { 
  Activity, 
  Dna, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart2, 
  Layers, 
  TrendingUp, 
  Database,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { Sample } from '../types';

interface OverviewViewProps {
  sample: Sample;
  onNavigate: (view: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ sample, onNavigate }) => {

  const pulseMetrics = [
    { label: "Total Reads", value: `${(sample.total_reads / 1000000).toFixed(1)}M`, status: "GOOD", pct: 98, desc: "High-depth paired-end 2x150bp reads." },
    { label: "Read Length", value: "150 bp", status: "GOOD", pct: 100, desc: "Illumina NovaSeq standard length." },
    { label: "Q20 Rate", value: `${sample.q20_rate}%`, status: "GOOD", pct: sample.q20_rate, desc: "99% base call accuracy threshold." },
    { label: "Q30 Rate", value: `${sample.q30_rate}%`, status: "GOOD", pct: sample.q30_rate, desc: "99.9% base call accuracy benchmark." },
    { label: "GC Content", value: `${sample.gc_content}%`, status: "GOOD", pct: sample.gc_content * 1.5, desc: "Balanced GC distribution (40-50% standard)." },
    { label: "Duplication Rate", value: `${sample.duplication_rate}%`, status: "GOOD", pct: 100 - sample.duplication_rate * 5, desc: "Low PCR duplicate rate (< 5.0%)." },
    { label: "Adapter Content", value: `${sample.adapter_content}%`, status: "GOOD", pct: 100 - sample.adapter_content * 10, desc: "Negligible read-through adapter contamination." },
    { label: "Mapping Rate", value: `${sample.mapping_rate}%`, status: "GOOD", pct: sample.mapping_rate, desc: "High alignment efficiency to GRCh38." },
    { label: "Mean Coverage", value: `${sample.mean_coverage}X`, status: "GOOD", pct: 88, desc: "Deep target region exome depth." },
    { label: "Coverage Uniformity (>=20X)", value: `${sample.uniformity_02x}%`, status: "GOOD", pct: sample.uniformity_02x, desc: "High capture region coverage completeness." },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* COMMAND CENTER TOP BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              GENOMIC COMMAND CENTER
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
              ACTIVE SAMPLE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {sample.id} — {sample.label} ({sample.sample_type})
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700">
            <span className="text-xs text-slate-400">ANALYSIS STATUS:</span>
            <span className="flex items-center gap-1.5 text-xs font-bold font-mono text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              READY
            </span>
          </div>

          <button
            onClick={() => onNavigate('variants')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <span>Explore Variants</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAJOR SEQUENCING KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Quality Score</div>
          <div className="text-xl font-bold font-mono text-cyan-400">{sample.quality_score}</div>
          <div className="text-[10px] text-slate-500">Scale /100</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Q20 Rate</div>
          <div className="text-xl font-bold font-mono text-emerald-400">{sample.q20_rate}%</div>
          <div className="text-[10px] text-slate-500">Acc: 99.0%</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Q30 Rate</div>
          <div className="text-xl font-bold font-mono text-emerald-400">{sample.q30_rate}%</div>
          <div className="text-[10px] text-slate-500">Acc: 99.9%</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Mean Coverage</div>
          <div className="text-xl font-bold font-mono text-teal-300">{sample.mean_coverage}X</div>
          <div className="text-[10px] text-slate-500">Target Exome</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Mapping Rate</div>
          <div className="text-xl font-bold font-mono text-cyan-300">{sample.mapping_rate}%</div>
          <div className="text-[10px] text-slate-500">To GRCh38</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Total Reads</div>
          <div className="text-xl font-bold font-mono text-white">{(sample.total_reads / 1000000).toFixed(1)}M</div>
          <div className="text-[10px] text-slate-500">Paired Reads</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Total Variants</div>
          <div className="text-xl font-bold font-mono text-violet-300">{sample.total_variants}</div>
          <div className="text-[10px] text-slate-500">SNVs + Indels</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-1">
          <div className="text-[10px] text-rose-300 font-mono uppercase">High Priority</div>
          <div className="text-xl font-bold font-mono text-rose-400">{sample.high_priority_variants}</div>
          <div className="text-[10px] text-rose-400/80">Pathogenic</div>
        </div>

      </div>

      {/* SEQUENCING PULSE SECTION */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono tracking-tight">SEQUENCING PULSE</h2>
              <p className="text-xs text-slate-400">Comprehensive sequencing health & quality evaluation</p>
            </div>
          </div>

          {/* SEQUENCING HEALTH SCORE GAUGE */}
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-lg">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Sequencing Health Score</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">{sample.quality_score} / 100</div>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          </div>
        </div>

        {/* 10 METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {pulseMetrics.map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 font-semibold truncate">{m.label}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  {m.status}
                </span>
              </div>

              <div className="text-xl font-bold font-mono text-cyan-300">{m.value}</div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.max(10, m.pct))}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Scientific Disclaimer Note */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Note: Sequencing Health Score is a computed quality metric. It does not imply clinical outcome or diagnostic assertion.</span>
        </div>

      </div>

    </div>
  );
};
