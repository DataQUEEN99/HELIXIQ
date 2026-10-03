import React from 'react';
import { 
  Dna, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Network, 
  BrainCircuit, 
  Cloud, 
  Activity, 
  CheckCircle,
  FileText
} from 'lucide-react';

interface LandingPageViewProps {
  onExploreDemo: () => void;
  onViewAnalysis: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onExploreDemo,
  onViewAnalysis,
}) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl glass-panel-glow-cyan p-8 lg:p-14 border border-cyan-500/30">
        
        {/* Animated Grid & Ambient Lights */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>NEXT-GENERATION SEQUENCING INTELLIGENCE PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Transforming NGS data into an <span className="text-gradient-cyan">intelligent genomic story.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              HELIXIQ bridges observed sequencing data, machine-learning prioritization, multi-evidence constellation scoring, and contextual AI explainability for genomics researchers and computational biologists.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExploreDemo}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-teal-400 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                <span>Explore Demo Sample</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewAnalysis}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>View Variant Intelligence</span>
              </button>
            </div>

            {/* Research Disclaimer Badge */}
            <div className="flex items-center gap-2 pt-2 text-xs text-amber-400/90 font-mono">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Research Use Only • Clearly Labeled Demonstration Dataset</span>
            </div>

          </div>

          {/* Hero Visual Graphic */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md aspect-square rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-700/80 p-6 flex flex-col justify-between shadow-2xl relative">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
                  <Dna className="w-4 h-4 animate-bounce" />
                  <span>SAMPLE-001 (WES Core)</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono border border-emerald-500/30">
                  HEALTH SCORE: 98.4/100
                </span>
              </div>

              {/* Dynamic Helix Pulse Card */}
              <div className="space-y-4 my-auto py-4">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">HIGHEST PRIORITY MUTATION</div>
                    <div className="text-sm font-bold text-white font-mono">BRCA1 c.1234A&gt;G (p.Tyr412Cys)</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/40 text-[10px] font-bold font-mono">
                    PATHOGENIC
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-violet-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">ML ENSEMBLE CONFIDENCE</div>
                    <div className="text-sm font-bold text-violet-300 font-mono">0.945 (XGBoost + SHAP)</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-violet-950 text-violet-300 text-[10px] font-mono">
                    94.5% PROB
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">EVIDENCE CONSTELLATION</div>
                    <div className="text-xs text-slate-300">6 Multi-Layer Evidence Nodes</div>
                  </div>
                  <span className="text-cyan-400 font-mono font-bold text-xs">SCORE: 9.2/10</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>PIPELINE: 9 STAGES PASSED</span>
                <span className="text-emerald-400">0 ERRORS</span>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 4 FEATURE PILLARS */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Architected for Modern Genomic Science
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From raw FASTQ reads to evidence-backed variant stories, explore full-stack genomic intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl hover:border-cyan-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">1. Sequencing Pulse</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time evaluation of Q20/Q30 scores, coverage depth, GC bias, duplication, and mapping efficiency with overall Sequencing Health Scoring.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-cyan-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">2. Evidence Constellation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive visual graph mapping variant interactions across population frequency, literature citations, functional assays, and ClinVar evidence.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-cyan-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">3. ML & SHAP Explainers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              XGBoost pathogenicity prediction coupled with SHAP waterfall contributions to transparently explain why variants are prioritized.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-cyan-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Cloud className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">4. Cloud & MLOps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cloud-native AWS execution architecture, Docker containers, and active MLOps monitoring for data drift, model drift, and retraining schedules.
            </p>
          </div>

        </div>
      </section>

      {/* CORE WORKFLOW SCHEMATIC */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white font-mono">PRIMARY ANALYTICAL WORKFLOW</h3>
            <p className="text-xs text-slate-400">Standardized end-to-end NGS pipeline architecture</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            9 STAGES INTEGRATED
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {[
            "NGS DATA",
            "QUALITY CONTROL",
            "HEALTH SCORE",
            "ALIGNMENT",
            "COVERAGE",
            "VARIANT CALLS",
            "ANNOTATION",
            "PRIORITIZATION",
            "REPORT"
          ].map((stage, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-1 hover:border-cyan-500/40 transition-colors">
              <div className="text-[10px] font-mono text-cyan-400 font-bold">STEP 0{idx + 1}</div>
              <div className="text-xs font-bold text-white tracking-tight">{stage}</div>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mx-auto pt-0.5" />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
