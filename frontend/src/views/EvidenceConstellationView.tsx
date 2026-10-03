import React, { useState } from 'react';
import { Network, Dna, BookOpen, BrainCircuit, Activity, ShieldCheck, Info } from 'lucide-react';
import { Variant } from '../types';

interface EvidenceConstellationViewProps {
  variant: Variant;
}

export const EvidenceConstellationView: React.FC<EvidenceConstellationViewProps> = ({ variant }) => {
  const [selectedNode, setSelectedNode] = useState<string>('variant');

  const nodes = [
    {
      id: 'variant',
      label: `${variant.gene} ${variant.hgvs_c}`,
      type: 'CENTER',
      x: 350,
      y: 220,
      icon: Dna,
      color: 'border-cyan-400 bg-cyan-950 text-cyan-200',
      detail: `Variant Locus: ${variant.chromosome}:${variant.position} (${variant.reference}>${variant.alternate}). Allele frequency (VAF): ${(variant.vaf * 100).toFixed(0)}%. Depth: ${variant.depth}X.`
    },
    {
      id: 'gene',
      label: `Gene: ${variant.gene}`,
      type: 'GENE',
      x: 350,
      y: 60,
      icon: Dna,
      color: 'border-teal-500 bg-teal-950 text-teal-300',
      detail: `${variant.gene} Tumor Suppressor Gene. Key role in homologous recombination DNA double-strand break repair.`
    },
    {
      id: 'population',
      label: `gnomAD AF: ${variant.population_frequency}`,
      type: 'POPULATION',
      x: 120,
      y: 140,
      icon: Activity,
      color: 'border-blue-500 bg-blue-950 text-blue-300',
      detail: `gnomAD v4 Allele Frequency: ${variant.population_frequency}. Extremely rare allele consistent with rare monogenic disease.`
    },
    {
      id: 'prediction',
      label: `ML Prob: ${(variant.model_probability * 100).toFixed(1)}%`,
      type: 'PREDICTION',
      x: 580,
      y: 140,
      icon: BrainCircuit,
      color: 'border-violet-500 bg-violet-950 text-violet-300',
      detail: `Random Forest / XGBoost Ensemble score: ${variant.model_probability}. High pathogenicity probability derived from SHAP explainability analysis.`
    },
    {
      id: 'literature',
      label: `Literature: ${variant.literature_citations} Papers`,
      type: 'LITERATURE',
      x: 140,
      y: 310,
      icon: BookOpen,
      color: 'border-amber-500 bg-amber-950 text-amber-300',
      detail: `Found in ${variant.literature_citations} peer-reviewed publications. Functional assays demonstrate complete loss of BRCA1 RING domain ligase activity.`
    },
    {
      id: 'clinical',
      label: `ClinVar: ${variant.pathogenicity}`,
      type: 'CLINICAL',
      x: 560,
      y: 310,
      icon: ShieldCheck,
      color: 'border-rose-500 bg-rose-950 text-rose-300',
      detail: `ClinVar Assertion ID ${variant.clinvar_id}: Classified as ${variant.pathogenicity} for Hereditary Breast and Ovarian Cancer Syndrome.`
    }
  ];

  const activeNodeData = nodes.find(n => n.id === selectedNode) || nodes[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-violet-400" />
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">EVIDENCE CONSTELLATION</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-dimensional evidence network topology for {variant.gene} {variant.hgvs_c}
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300">
          OVERALL EVIDENCE SCORE: <span className="font-bold text-cyan-400">{variant.evidence_score} / 10</span>
        </div>
      </div>

      {/* GRAPH CANVAS & NODE INSPECTION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG NODE GRAPH CANVAS */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[440px]">
          
          <div className="text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
            INTERACTIVE EVIDENCE NETWORK (CLICK NODES TO INSPECT)
          </div>

          <svg className="w-full h-[360px] relative z-10" viewBox="0 0 700 400">
            {/* Connecting Lines to Center Variant */}
            {nodes.slice(1).map((n) => (
              <line
                key={n.id}
                x1={nodes[0].x}
                y1={nodes[0].y}
                x2={n.x}
                y2={n.y}
                stroke={selectedNode === n.id ? '#06B6D4' : '#334155'}
                strokeWidth={selectedNode === n.id ? '3' : '1.5'}
                strokeDasharray={selectedNode === n.id ? 'none' : '4 4'}
                className="transition-all duration-300"
              />
            ))}

            {/* Render Nodes */}
            {nodes.map((n) => {
              const isSelected = selectedNode === n.id;
              const isCenter = n.id === 'variant';

              return (
                <g 
                  key={n.id} 
                  transform={`translate(${n.x}, ${n.y})`}
                  onClick={() => setSelectedNode(n.id)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isCenter ? '32' : '24'}
                    className={`transition-transform duration-300 group-hover:scale-110 ${
                      isSelected ? 'fill-cyan-950 stroke-cyan-400 stroke-[3]' : 'fill-slate-900 stroke-slate-700 stroke-[2]'
                    }`}
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#F1F5F9"
                    fontSize={isCenter ? '11' : '9'}
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {n.type}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="42"
                    fill={isSelected ? '#00F0FF' : '#94A3B8'}
                    fontSize="10"
                    fontFamily="sans-serif"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>6 CONNECTED EVIDENCE DOMAINS</span>
            <span className="text-cyan-400">CONSTELLATION HEALTH: STABLE</span>
          </div>

        </div>

        {/* SELECTED NODE INSPECTION CARD */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs font-bold text-cyan-400">
              <Info className="w-4 h-4" />
              <span>EVIDENCE DOMAIN INSPECTOR</span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase">Selected Domain</div>
              <div className="text-lg font-bold text-white font-mono">{activeNodeData.label}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
              <div className="text-xs font-mono text-cyan-300 font-bold">Scientific Context</div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeNodeData.detail}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
            Evidence nodes are dynamically scored based on ClinVar, gnomAD v4, dbNSFP, and automated PubMed citations.
          </div>
        </div>

      </div>

    </div>
  );
};
