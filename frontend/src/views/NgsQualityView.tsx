import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart2, 
  Activity, 
  Database,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { Sample } from '../types';

interface NgsQualityViewProps {
  sample: Sample;
}

export const NgsQualityView: React.FC<NgsQualityViewProps> = ({ sample }) => {
  const [selectedGene, setSelectedGene] = useState<string>('BRCA1');

  // Per-base Quality Distribution Data
  const perBaseData = Array.from({ length: 15 }, (_, i) => {
    const pos = (i + 1) * 10;
    return {
      pos: `${pos}bp`,
      quality: Number((37.5 - (i * 0.2) + Math.sin(i) * 0.8).toFixed(1)),
      threshold: 30
    };
  });

  // GC Content Distribution vs Baseline
  const gcData = [
    { gc: '10%', sampleReads: 2, baseline: 3 },
    { gc: '20%', sampleReads: 12, baseline: 15 },
    { gc: '30%', sampleReads: 45, baseline: 42 },
    { gc: '40%', sampleReads: 98, baseline: 95 },
    { gc: '50%', sampleReads: 85, baseline: 88 },
    { gc: '60%', sampleReads: 32, baseline: 35 },
    { gc: '70%', sampleReads: 8, baseline: 10 },
    { gc: '80%', sampleReads: 1, baseline: 2 },
  ];

  // Coverage Depth per Exon
  const exonData = [
    { exon: 'Exon 1', depth: 112, pct10x: 100, pct30x: 99.2, pct50x: 95.4 },
    { exon: 'Exon 2', depth: 98, pct10x: 100, pct30x: 98.5, pct50x: 92.1 },
    { exon: 'Exon 3', depth: 145, pct10x: 100, pct30x: 99.8, pct50x: 98.2 },
    { exon: 'Exon 4', depth: 88, pct10x: 99.5, pct30x: 96.2, pct50x: 88.5 },
    { exon: 'Exon 5', depth: 125, pct10x: 100, pct30x: 99.1, pct50x: 94.8 },
    { exon: 'Exon 6', depth: 105, pct10x: 100, pct30x: 98.7, pct50x: 93.2 },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">NGS QUALITY CONTROL & COVERAGE DEPTH</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            FastQC metrics, base quality distribution, GC bias, and exon-level depth analysis
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>FASTQC ASSESSMENT: ALL PASSED</span>
        </div>
      </div>

      {/* 4 STATUS BADGE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">PER-BASE QUALITY (Q30)</div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold font-mono text-emerald-400">{sample.q30_rate}%</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold">PASS</span>
          </div>
          <p className="text-[10px] text-slate-500">Threshold &gt;= 85.0%</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">GC CONTENT BIAS</div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold font-mono text-emerald-400">{sample.gc_content}%</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold">PASS</span>
          </div>
          <p className="text-[10px] text-slate-500">Normal Range: 40–50%</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">DUPLICATION RATE</div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold font-mono text-emerald-400">{sample.duplication_rate}%</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold">PASS</span>
          </div>
          <p className="text-[10px] text-slate-500">Threshold &lt; 10.0%</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">ADAPTER CONTAMINATION</div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold font-mono text-emerald-400">{sample.adapter_content}%</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold">PASS</span>
          </div>
          <p className="text-[10px] text-slate-500">Threshold &lt; 5.0%</p>
        </div>
      </div>

      {/* CHARTS GRID: PER-BASE QUALITY & GC DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PER-BASE QUALITY CHART */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs text-slate-300">
            <span>PER-BASE PHRED QUALITY SCORE (1-150 bp)</span>
            <span className="text-cyan-400 font-bold">Q30 BENCHMARK</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={perBaseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="pos" stroke="#64748B" fontSize={10} />
                <YAxis domain={[0, 40]} stroke="#64748B" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="quality" stroke="#06B6D4" strokeWidth={2.5} dot={{ fill: '#06B6D4' }} name="Mean Phred Q" />
                <Line type="monotone" dataKey="threshold" stroke="#F59E0B" strokeDasharray="5 5" strokeWidth={1.5} name="Q30 Threshold" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GC CONTENT DISTRIBUTION */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs text-slate-300">
            <span>GC CONTENT DISTRIBUTION VS GRCh38 BASELINE</span>
            <span className="text-teal-400 font-bold">46.2% MEAN GC</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gcData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="gc" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="sampleReads" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Sample Reads" />
                <Bar dataKey="baseline" fill="#334155" radius={[4, 4, 0, 0]} name="Human Baseline" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* EXON-LEVEL COVERAGE DEPTH ANALYSIS */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white font-mono">EXON-LEVEL COVERAGE DEPTH</h2>
            <p className="text-xs text-slate-400">Target capture region depth & percentage above threshold</p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Target Gene:</span>
            {['BRCA1', 'TP53', 'EGFR', 'KRAS'].map(g => (
              <button
                key={g}
                onClick={() => setSelectedGene(g)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedGene === g ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Exon Depth Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Exon Region</th>
                <th className="p-3">Mean Depth (X)</th>
                <th className="p-3">% Reads &gt;= 10X</th>
                <th className="p-3">% Reads &gt;= 30X</th>
                <th className="p-3">% Reads &gt;= 50X</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {exonData.map((e, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60">
                  <td className="p-3 font-bold text-white">{selectedGene} {e.exon}</td>
                  <td className="p-3 text-cyan-300 font-bold">{e.depth}X</td>
                  <td className="p-3 text-slate-300">{e.pct10x}%</td>
                  <td className="p-3 text-emerald-400">{e.pct30x}%</td>
                  <td className="p-3 text-teal-300">{e.pct50x}%</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      ADEQUATE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
