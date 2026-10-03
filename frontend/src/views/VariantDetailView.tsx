import React, { useState } from 'react';
import { 
  Dna, 
  ChevronRight, 
  Network, 
  FileText, 
  BrainCircuit, 
  ShieldCheck, 
  ExternalLink, 
  BookOpen, 
  Activity, 
  Database,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Variant } from '../types';

interface VariantDetailViewProps {
  variant: Variant;
  onOpenCopilotWithQuery?: (query: string) => void;
  onNavigateToConstellation?: () => void;
}

export const VariantDetailView: React.FC<VariantDetailViewProps> = ({
  variant,
  onOpenCopilotWithQuery,
  onNavigateToConstellation
}) => {
  const [activeStoryStage, setActiveStoryStage] = useState<number>(0);

  const storyStages = [
    {
      id: "GENOMIC",
      title: "1. Genomic Locus & Allele",
      badge: `${variant.chromosome}:${variant.position}`,
      detail: `Variant located in gene ${variant.gene} (${variant.transcript}). Reference allele '${variant.reference}' mutated to alternate allele '${variant.alternate}'. Coding syntax: ${variant.hgvs_c}.`,
    },
    {
      id: "FUNCTIONAL",
      title: "2. Functional & Protein Impact",
      badge: variant.consequence,
      detail: `Protein change ${variant.hgvs_p}. Consequence evaluated as '${variant.consequence.replace(/_/g, ' ')}'. Functional score: ${variant.functional_score}/1.0. Disrupts key conserved functional protein domain.`,
    },
    {
      id: "POPULATION",
      title: "3. Population Rarity Signal",
      badge: `gnomAD AF: ${variant.population_frequency}`,
      detail: `Examine global reference population frequencies in gnomAD v4. Extremely rare variant (${(variant.population_frequency * 100).toFixed(4)}%), consistent with high penetrance hereditary mutation.`,
    },
    {
      id: "COMPUTATIONAL",
      title: "4. Machine Learning & Conservation",
      badge: `Model Prob: ${variant.model_probability}`,
      detail: `Ensemble XGBoost model calculated Pathogenic probability score of ${(variant.model_probability * 100).toFixed(1)}%. Evolutionary conservation score phyloP: ${variant.conservation_score}/1.0.`,
    },
    {
      id: "LITERATURE",
      title: "5. Scientific Literature & Publications",
      badge: `${variant.literature_citations} Citations`,
      detail: `Cross-referenced in ${variant.literature_citations} peer-reviewed research papers. Functional assays confirm loss-of-function mechanism in cellular models.`,
    },
    {
      id: "CLINICAL",
      title: "6. Clinical Assertion & ClinVar",
      badge: variant.clinvar_id,
      detail: `ClinVar accession ${variant.clinvar_id} lists expert panel consensus as '${variant.pathogenicity}'. High clinical priority rating.`,
    },
    {
      id: "INTERPRETATION",
      title: "7. AI-Assisted Synthesis & Summary",
      badge: `Score: ${variant.evidence_score}/10`,
      detail: `Overall Evidence Score: ${variant.evidence_score}/10. Priority: ${variant.priority}. Summary: ${variant.summary}`,
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER SECTION */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white font-mono">{variant.gene}</h1>
            <span className="text-lg font-mono text-cyan-300 font-bold">{variant.hgvs_c}</span>
            <span className="text-sm font-mono text-slate-400">({variant.hgvs_p})</span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
              variant.pathogenicity === 'Pathogenic' ? 'bg-rose-950 text-rose-400 border border-rose-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
            }`}>
              {variant.pathogenicity}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {variant.summary}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onNavigateToConstellation && (
            <button
              onClick={onNavigateToConstellation}
              className="px-4 py-2.5 rounded-xl bg-violet-950 border border-violet-500/40 text-violet-300 hover:bg-violet-900/60 text-xs font-bold font-mono flex items-center gap-2 transition-all shadow-lg"
            >
              <Network className="w-4 h-4 text-violet-400" />
              <span>Evidence Constellation</span>
            </button>
          )}

          {onOpenCopilotWithQuery && (
            <button
              onClick={() => onOpenCopilotWithQuery(`Explain variant ${variant.gene} ${variant.hgvs_c}`)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <span>Ask Copilot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 CORE METRIC GRID PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. GENOMIC INFO */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 border-b border-slate-800 pb-2">
            <Dna className="w-4 h-4" />
            <span>GENOMIC INFORMATION</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between"><span className="text-slate-400">Chromosome:</span> <span className="text-white">{variant.chromosome}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Position:</span> <span className="text-white">{variant.position}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Ref / Alt:</span> <span className="text-cyan-300">{variant.reference} &gt; {variant.alternate}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Transcript:</span> <span className="text-slate-300 truncate max-w-[140px]">{variant.transcript}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Genome Build:</span> <span className="text-slate-300">GRCh38 / hg38</span></div>
          </div>
        </div>

        {/* 2. VARIANT SEQUENCING METRICS */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-teal-400 border-b border-slate-800 pb-2">
            <Activity className="w-4 h-4" />
            <span>SEQUENCING CALL METRICS</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between"><span className="text-slate-400">Consequence:</span> <span className="text-teal-300">{variant.consequence}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">VAF (Allele Freq):</span> <span className="text-white font-bold">{(variant.vaf * 100).toFixed(0)}%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Read Depth:</span> <span className="text-white">{variant.depth}X</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Zygosity:</span> <span className="text-slate-300">{variant.zygosities}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">gnomAD Pop AF:</span> <span className="text-slate-300">{variant.population_frequency}</span></div>
          </div>
        </div>

        {/* 3. ML PREDICTION SCORE */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-violet-400 border-b border-slate-800 pb-2">
            <BrainCircuit className="w-4 h-4" />
            <span>ML ENSEMBLE PREDICTION</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between"><span className="text-slate-400">Model Probability:</span> <span className="text-violet-300 font-bold">{(variant.model_probability * 100).toFixed(1)}%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Confidence Score:</span> <span className="text-white">{(variant.confidence * 100).toFixed(0)}%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">PhyloP Conservation:</span> <span className="text-white">{variant.conservation_score}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">SpliceAI Score:</span> <span className="text-slate-300">{variant.splice_score}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">REVEL Functional:</span> <span className="text-slate-300">{variant.functional_score}</span></div>
          </div>
        </div>

        {/* 4. EVIDENCE & CLINICAL */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-400 border-b border-slate-800 pb-2">
            <BookOpen className="w-4 h-4" />
            <span>EVIDENCE & CLINICAL</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between"><span className="text-slate-400">ClinVar Accession:</span> <span className="text-rose-400 font-bold">{variant.clinvar_id}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">dbSNP rsID:</span> <span className="text-cyan-400">{variant.dbsnp_id}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Literature Papers:</span> <span className="text-white">{variant.literature_citations} Articles</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Evidence Score:</span> <span className="text-amber-400 font-bold">{variant.evidence_score} / 10</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Prioritization:</span> <span className="text-rose-400 font-bold">{variant.priority}</span></div>
          </div>
        </div>

      </div>

      {/* VARIANT STORY VISUAL NARRATIVE */}
      <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">VARIANT STORY</h2>
              <p className="text-xs text-slate-400">Step-by-step visual narrative explaining variant prioritization</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono">
            STAGE {activeStoryStage + 1} OF {storyStages.length}
          </span>
        </div>

        {/* Horizontal Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {storyStages.map((stage, idx) => (
            <button
              key={stage.id}
              onClick={() => setActiveStoryStage(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeStoryStage === idx
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-200 shadow-lg shadow-cyan-950/60'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] font-mono text-cyan-400 font-bold">{stage.id}</div>
              <div className="text-xs font-bold truncate mt-0.5">{stage.title.split('.')[1]}</div>
            </button>
          ))}
        </div>

        {/* Expanded Active Stage Story Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-mono">
              {storyStages[activeStoryStage].title}
            </h3>
            <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              {storyStages[activeStoryStage].badge}
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {storyStages[activeStoryStage].detail}
          </p>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveStoryStage(Math.max(0, activeStoryStage - 1))}
              disabled={activeStoryStage === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-40"
            >
              Previous Stage
            </button>

            <button
              onClick={() => setActiveStoryStage(Math.min(storyStages.length - 1, activeStoryStage + 1))}
              disabled={activeStoryStage === storyStages.length - 1}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 disabled:opacity-40 flex items-center gap-1"
            >
              <span>Next Stage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
