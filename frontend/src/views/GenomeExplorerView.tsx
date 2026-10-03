import React, { useState } from 'react';
import { 
  Dna, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Filter, 
  Info, 
  ChevronRight, 
  ExternalLink, 
  X 
} from 'lucide-react';
import { Variant } from '../types';

interface GenomeExplorerViewProps {
  variants: Variant[];
  onSelectVariant: (variant: Variant) => void;
}

export const GenomeExplorerView: React.FC<GenomeExplorerViewProps> = ({
  variants,
  onSelectVariant,
}) => {
  const chromosomes = Array.from({ length: 22 }, (_, i) => `chr${i + 1}`).concat(["chrX", "chrY"]);
  
  const [selectedChr, setSelectedChr] = useState<string>('chr17');
  const [searchGene, setSearchGene] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);

  // Filter variants for current view
  const chrVariants = variants.filter(v => {
    const matchChr = v.chromosome.toLowerCase() === selectedChr.toLowerCase();
    const matchGene = !searchGene || v.gene.toLowerCase().includes(searchGene.toLowerCase()) || v.hgvs_c.toLowerCase().includes(searchGene.toLowerCase());
    const matchPriority = priorityFilter === 'All' || v.priority === priorityFilter;
    return matchChr && matchGene && matchPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500 border-rose-300 shadow-rose-500/50';
      case 'Moderate':
        return 'bg-amber-400 border-amber-200 shadow-amber-400/50';
      default:
        return 'bg-cyan-400 border-cyan-200 shadow-cyan-400/50';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Dna className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">GENOME EXPLORER</h1>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono">GRCh38 / hg38</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Interactive genomic track visualization across Chromosomes 1–22, X, Y
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Gene / Position Search */}
          <div className="relative">
            <input
              type="text"
              value={searchGene}
              onChange={(e) => setSearchGene(e.target.value)}
              placeholder="Search gene or position..."
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Moderate">Moderate Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 border border-slate-700 rounded-lg p-0.5 bg-slate-900">
            <button
              onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-slate-300">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.2))}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* CHROMOSOME SELECTOR TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {chromosomes.map((chr) => {
          const count = variants.filter(v => v.chromosome.toLowerCase() === chr.toLowerCase()).length;
          const isSelected = selectedChr.toLowerCase() === chr.toLowerCase();
          return (
            <button
              key={chr}
              onClick={() => setSelectedChr(chr)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{chr.toUpperCase()}</span>
              {count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* HORIZONTAL GENOMIC TRACK VIEWPORT */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 overflow-hidden">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">{selectedChr.toUpperCase()} TRACK VIEW</span>
            <span className="text-slate-500">|</span>
            <span>Length: 248.9 Mb</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> High Priority</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Moderate</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> Low</span>
          </div>
        </div>

        {/* Visual Track Bar */}
        <div 
          className="relative w-full bg-slate-950 rounded-2xl border border-slate-800 p-6 min-h-[220px] flex flex-col justify-between overflow-x-auto"
          style={{ transform: `scaleX(${zoomLevel})`, transformOrigin: 'left center' }}
        >
          {/* Chromosome Centromere & Ideogram Representation */}
          <div className="relative w-full h-8 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-between px-4 my-auto">
            <span className="text-[10px] font-mono text-slate-400">p-arm (0 Mb)</span>
            <div className="w-4 h-full bg-slate-950 rounded-full border-x border-slate-700"></div>
            <span className="text-[10px] font-mono text-slate-400">q-arm (248 Mb)</span>

            {/* Render Variant Dots on Track */}
            {chrVariants.map((v) => {
              // Estimate relative X position on 250Mb track
              const posPct = Math.min(95, Math.max(5, (v.position / 150000000) * 100));
              const isSelected = activeVariant?.id === v.id;
              
              return (
                <div
                  key={v.id}
                  onClick={() => {
                    setActiveVariant(v);
                    onSelectVariant(v);
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer group z-20`}
                  style={{ left: `${posPct}%` }}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${getPriorityColor(v.priority)} ${
                    isSelected ? 'ring-4 ring-cyan-400 scale-125' : 'group-hover:scale-125'
                  } transition-transform shadow-lg flex items-center justify-center`}>
                  </div>

                  {/* Hover Tooltip Card */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2.5 rounded-xl glass-panel-glow-cyan border border-cyan-500/40 text-[11px] font-mono z-30 shadow-2xl pointer-events-none">
                    <div className="font-bold text-white text-xs">{v.gene} ({v.hgvs_c})</div>
                    <div className="text-slate-400 text-[10px]">{v.chromosome}:{v.position}</div>
                    <div className="text-cyan-300 font-bold mt-1">VAF: {(v.vaf * 100).toFixed(0)}% | Depth: {v.depth}X</div>
                    <div className={`text-[10px] font-bold ${v.priority === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {v.pathogenicity}
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Coordinate Scale Ticks */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
            <span>0 Mb</span>
            <span>50 Mb</span>
            <span>100 Mb</span>
            <span>150 Mb</span>
            <span>200 Mb</span>
            <span>250 Mb</span>
          </div>

        </div>

        {/* Selected Variant Quick Summary Drawer */}
        {activeVariant && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-mono text-white">{activeVariant.gene}</span>
                <span className="text-sm font-mono text-cyan-300">{activeVariant.hgvs_c}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeVariant.priority === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                }`}>
                  {activeVariant.pathogenicity}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">{activeVariant.summary}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectVariant(activeVariant)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <span>View Full Variant Story</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveVariant(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
