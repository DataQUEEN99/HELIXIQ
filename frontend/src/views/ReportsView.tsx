import React, { useState } from 'react';
import { 
  FileCheck, 
  Download, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  Dna, 
  FileText,
  Activity
} from 'lucide-react';
import { Sample, Variant } from '../types';

interface ReportsViewProps {
  sample: Sample;
  variants: Variant[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ sample, variants }) => {
  const [includeQc, setIncludeQc] = useState(true);
  const [includeVariants, setIncludeVariants] = useState(true);
  const [includeMl, setIncludeMl] = useState(true);
  const [includeCopilot, setIncludeCopilot] = useState(true);

  const highPriority = variants.filter(v => v.priority === 'High');

  const handleDownloadPDF = () => {
    alert("Simulating PDF Report Download: HELIXIQ_" + sample.id + "_Genomic_Report.pdf");
  };

  const handleDownloadJSON = () => {
    const reportData = {
      report_id: `REP-${sample.id}-20261003`,
      timestamp: new Date().toISOString(),
      sample: sample,
      high_priority_variants: highPriority,
      disclaimer: "RESEARCH USE ONLY - NOT FOR CLINICAL DIAGNOSIS"
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HELIXIQ_${sample.id}_Report.json`;
    link.click();
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">COMPREHENSIVE REPORT GENERATOR</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compile production-grade genomic summary reports with evidence citations & disclaimers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-500/40 text-xs font-mono font-bold"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>JSON Export</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-500/20"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* REPORT CUSTOMIZATION TOGGLES */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-6 font-mono text-xs">
        <span className="text-slate-400 font-bold uppercase">Include Sections:</span>
        
        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
          <input type="checkbox" checked={includeQc} onChange={() => setIncludeQc(!includeQc)} className="accent-cyan-400 rounded" />
          <span>Sequencing QC & Depth</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
          <input type="checkbox" checked={includeVariants} onChange={() => setIncludeVariants(!includeVariants)} className="accent-cyan-400 rounded" />
          <span>High-Priority Variants</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
          <input type="checkbox" checked={includeMl} onChange={() => setIncludeMl(!includeMl)} className="accent-cyan-400 rounded" />
          <span>ML & SHAP Explainability</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
          <input type="checkbox" checked={includeCopilot} onChange={() => setIncludeCopilot(!includeCopilot)} className="accent-cyan-400 rounded" />
          <span>AI Evidence Summary</span>
        </label>
      </div>

      {/* LIVE REPORT PREVIEW DOCUMENT */}
      <div className="glass-panel p-8 lg:p-12 rounded-3xl border border-slate-700 bg-slate-950 space-y-8 font-sans max-w-4xl mx-auto shadow-2xl">
        
        {/* REPORT DOCUMENT HEADER */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Dna className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-white font-mono tracking-tight">HELIX<span className="text-cyan-400">IQ</span></div>
              <div className="text-[10px] text-slate-400 font-mono">GENOMIC INTELLIGENCE REPORT</div>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400">
            <div>REPORT ID: <span className="text-white font-bold">REP-{sample.id}-20261003</span></div>
            <div>DATE: <span className="text-slate-300">2026-10-03</span></div>
          </div>
        </div>

        {/* SAMPLE INFORMATION BLOCK */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">1. SAMPLE & SEQUENCING METADATA</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
            <div><span className="text-slate-500 block text-[10px]">SAMPLE ID</span><span className="text-white font-bold">{sample.id}</span></div>
            <div><span className="text-slate-500 block text-[10px]">PLATFORM</span><span className="text-slate-200">{sample.sequencing_platform}</span></div>
            <div><span className="text-slate-500 block text-[10px]">MEAN DEPTH</span><span className="text-cyan-300 font-bold">{sample.mean_coverage}X</span></div>
            <div><span className="text-slate-500 block text-[10px]">HEALTH SCORE</span><span className="text-emerald-400 font-bold">{sample.quality_score}/100</span></div>
          </div>
        </div>

        {/* HIGH PRIORITY VARIANTS TABLE */}
        {includeVariants && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">2. HIGH-PRIORITY PATHOGENIC VARIANTS</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Gene</th>
                    <th className="p-3">HGVS c</th>
                    <th className="p-3">HGVS p</th>
                    <th className="p-3">VAF</th>
                    <th className="p-3">Pathogenicity</th>
                    <th className="p-3">ClinVar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {highPriority.map(v => (
                    <tr key={v.id} className="bg-slate-950">
                      <td className="p-3 font-bold text-white">{v.gene}</td>
                      <td className="p-3 text-cyan-300">{v.hgvs_c}</td>
                      <td className="p-3 text-slate-400">{v.hgvs_p}</td>
                      <td className="p-3 font-bold">{(v.vaf * 100).toFixed(0)}%</td>
                      <td className="p-3 text-rose-400 font-bold">{v.pathogenicity}</td>
                      <td className="p-3 text-slate-400">{v.clinvar_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI RESEARCH SUMMARY */}
        {includeCopilot && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">3. AI-GENERATED RESEARCH SUMMARY</h3>
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
              Sample {sample.id} exhibits 4 high-priority loss-of-function variants across BRCA1, TP53, EGFR, and KRAS. All loci possess high coverage depth (&gt; 80X) and robust allele frequencies (VAF 35%–62%), supported by expert ClinVar panel assertions and high phyloP conservation scores.
            </div>
          </div>
        )}

        {/* REQUIRED CLINICAL DISCLAIMER */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300/90 space-y-1 font-mono">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>RESEARCH USE ONLY DISCLAIMER</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            THIS REPORT IS GENERATED FOR RESEARCH AND DEMONSTRATION PURPOSES ONLY. IT IS NOT INTENDED FOR CLINICAL DIAGNOSIS, PATIENT MANAGEMENT, OR DIRECT THERAPEUTIC DECISION-MAKING.
          </p>
        </div>

      </div>

    </div>
  );
};
