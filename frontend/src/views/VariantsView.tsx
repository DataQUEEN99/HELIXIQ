import React, { useState, useMemo } from 'react';
import { 
  ListFilter, 
  Search, 
  Download, 
  SlidersHorizontal, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';
import { Variant } from '../types';

interface VariantsViewProps {
  variants: Variant[];
  onSelectVariant: (variant: Variant) => void;
}

export const VariantsView: React.FC<VariantsViewProps> = ({ variants, onSelectVariant }) => {
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGene, setSelectedGene] = useState('');
  const [selectedChr, setSelectedChr] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedPatho, setSelectedPatho] = useState('All');
  const [minVaf, setMinVaf] = useState(0);
  const [minDepth, setMinDepth] = useState(0);

  // Sorting State
  const [sortField, setSortField] = useState<keyof Variant>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Filtered and Sorted Variants
  const processedVariants = useMemo(() => {
    return variants
      .filter((v) => {
        const matchesSearch = 
          !searchTerm || 
          v.gene.toLowerCase().includes(searchTerm.toLowerCase()) || 
          v.hgvs_c.toLowerCase().includes(searchTerm.toLowerCase()) || 
          v.hgvs_p.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.dbsnp_id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesChr = selectedChr === 'All' || v.chromosome.toLowerCase() === selectedChr.toLowerCase();
        const matchesPriority = selectedPriority === 'All' || v.priority === selectedPriority;
        const matchesPatho = selectedPatho === 'All' || v.pathogenicity === selectedPatho;
        const matchesVaf = v.vaf >= minVaf;
        const matchesDepth = v.depth >= minDepth;

        return matchesSearch && matchesChr && matchesPriority && matchesPatho && matchesVaf && matchesDepth;
      })
      .sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        if (typeof aVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
        }
        return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      });
  }, [variants, searchTerm, selectedChr, selectedPriority, selectedPatho, minVaf, minDepth, sortField, sortOrder]);

  const totalPages = Math.ceil(processedVariants.length / pageSize);
  const paginatedVariants = processedVariants.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof Variant) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const exportCSV = () => {
    const headers = ['Gene', 'Chromosome', 'Position', 'Ref', 'Alt', 'Consequence', 'HGVS_c', 'HGVS_p', 'VAF', 'Depth', 'Population_Freq', 'Pathogenicity', 'Priority'];
    const rows = processedVariants.map(v => [
      v.gene, v.chromosome, v.position, v.reference, v.alternate, v.consequence, v.hgvs_c, v.hgvs_p, v.vaf, v.depth, v.population_frequency, v.pathogenicity, v.priority
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'HELIXIQ_Variants_Export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <ListFilter className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">VARIANT INTELLIGENCE EXPLORER</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Displaying {processedVariants.length} filtered variants from called callset
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-500/40 text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Search */}
          <div className="relative col-span-1 sm:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Gene, HGVS, rsID..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Chromosome */}
          <select
            value={selectedChr}
            onChange={(e) => setSelectedChr(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="All">All Chromosomes</option>
            {Array.from({ length: 22 }, (_, i) => `chr${i + 1}`).concat(["chrX", "chrY"]).map(c => (
              <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Moderate">Moderate Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Pathogenicity */}
          <select
            value={selectedPatho}
            onChange={(e) => setSelectedPatho(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="All">All Pathogenicity</option>
            <option value="Pathogenic">Pathogenic</option>
            <option value="Likely Pathogenic">Likely Pathogenic</option>
            <option value="Uncertain Significance">Uncertain Significance</option>
            <option value="Benign">Benign</option>
          </select>

          {/* Min VAF */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs">
            <span className="text-slate-400 font-mono">Min VAF:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={minVaf}
              onChange={(e) => setMinVaf(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="font-mono text-cyan-300 w-8">{(minVaf * 100).toFixed(0)}%</span>
          </div>

        </div>

      </div>

      {/* SOPHISTICATED VARIANT TABLE */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('gene')}>
                  <div className="flex items-center gap-1">Gene <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-3 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('chromosome')}>
                  <div className="flex items-center gap-1">Chr:Pos <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-3">Ref/Alt</th>
                <th className="p-3 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('consequence')}>
                  <div className="flex items-center gap-1">Consequence <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-3">HGVS c / p</th>
                <th className="p-3 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('vaf')}>
                  <div className="flex items-center gap-1">VAF <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-3 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('depth')}>
                  <div className="flex items-center gap-1">Depth <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-3 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('population_frequency')}>
                  <div className="flex items-center gap-1">gnomAD AF <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-3 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('pathogenicity')}>
                  <div className="flex items-center gap-1">Pathogenicity <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-3 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('priority')}>
                  <div className="flex items-center gap-1">Priority <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paginatedVariants.map((v) => (
                <tr 
                  key={v.id} 
                  onClick={() => onSelectVariant(v)}
                  className="hover:bg-slate-900/80 cursor-pointer transition-colors group"
                >
                  <td className="p-3 font-bold text-white group-hover:text-cyan-400">{v.gene}</td>
                  <td className="p-3 text-slate-400">{v.chromosome}:{v.position}</td>
                  <td className="p-3 text-slate-400">
                    <span className="text-cyan-400 font-bold">{v.reference}</span> &gt; <span className="text-rose-400 font-bold">{v.alternate}</span>
                  </td>
                  <td className="p-3 font-sans text-slate-300">{v.consequence.replace(/_/g, ' ')}</td>
                  <td className="p-3 text-slate-300">
                    <div>{v.hgvs_c}</div>
                    <div className="text-[10px] text-slate-500">{v.hgvs_p}</div>
                  </td>
                  <td className="p-3 text-cyan-300 font-bold">{(v.vaf * 100).toFixed(0)}%</td>
                  <td className="p-3 text-slate-300">{v.depth}X</td>
                  <td className="p-3 text-slate-400">{v.population_frequency.toFixed(5)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.pathogenicity === 'Pathogenic' ? 'bg-rose-950 text-rose-400 border border-rose-500/40' :
                      v.pathogenicity === 'Likely Pathogenic' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                      'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {v.pathogenicity}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.priority === 'High' ? 'bg-rose-500 text-slate-950' :
                      v.priority === 'Moderate' ? 'bg-amber-400 text-slate-950' :
                      'bg-cyan-950 text-cyan-300'
                    }`}>
                      {v.priority}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVariant(v);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 text-[10px] transition-colors"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* PAGINATION BAR */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div>
            Showing Page {currentPage} of {totalPages || 1} ({processedVariants.length} total variants)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
