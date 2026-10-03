import React, { useState } from 'react';
import { 
  Layers, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Trash2, 
  Plus, 
  X, 
  FileCheck,
  Dna
} from 'lucide-react';
import { Sample } from '../types';

interface SamplesViewProps {
  samples: Sample[];
  currentSample: Sample;
  onSelectSample: (sample: Sample) => void;
  onUploadModalClose?: () => void;
}

export const SamplesView: React.FC<SamplesViewProps> = ({
  samples,
  currentSample,
  onSelectSample
}) => {
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadStep, setUploadStep] = useState<'idle' | 'validating' | 'completed'>('idle');
  const [selectedFileType, setSelectedFileType] = useState<string>('VCF');
  const [uploadedFileName, setUploadedFileName] = useState<string>('sample_tumor_panel.vcf');

  const handleSimulateUpload = () => {
    setUploadStep('validating');
    setTimeout(() => {
      setUploadStep('completed');
    }, 1800);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">NGS SAMPLE MANAGEMENT & UPLOAD</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage active whole-exome, panel, and whole-genome sequencing callsets
          </p>
        </div>

        <button
          onClick={() => {
            setUploadStep('idle');
            setShowUploadModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-teal-400 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New NGS File</span>
        </button>
      </div>

      {/* SAMPLES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {samples.map((s) => {
          const isSelected = s.id === currentSample.id;
          return (
            <div
              key={s.id}
              onClick={() => onSelectSample(s)}
              className={`glass-panel p-6 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-400'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="font-mono text-base font-bold text-white">{s.id}</div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  s.status === 'READY' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-400'
                }`}>
                  {s.status}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-200">{s.label}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{s.sample_type}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-2 border-t border-slate-800">
                <div className="p-2 rounded-xl bg-slate-900"><span className="text-slate-500">Quality:</span> <span className="text-cyan-300 font-bold">{s.quality_score}</span></div>
                <div className="p-2 rounded-xl bg-slate-900"><span className="text-slate-500">Coverage:</span> <span className="text-teal-300 font-bold">{s.mean_coverage}X</span></div>
                <div className="p-2 rounded-xl bg-slate-900"><span className="text-slate-500">Variants:</span> <span className="text-violet-300 font-bold">{s.total_variants}</span></div>
                <div className="p-2 rounded-xl bg-slate-900"><span className="text-slate-500">High Prio:</span> <span className="text-rose-400 font-bold">{s.high_priority_variants}</span></div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between pt-1">
                <span>{s.sequencing_platform}</span>
                {isSelected && <span className="text-cyan-400 font-bold">ACTIVE</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-panel p-6 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-mono">UPLOAD NGS SAMPLE DATASET</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: File Type & Drag-Drop */}
            {uploadStep === 'idle' && (
              <div className="space-y-4">
                
                <div className="space-y-1.5 font-mono text-xs">
                  <label className="text-slate-300">File Type:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['FASTQ', 'BAM', 'CRAM', 'VCF'].map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedFileType(t)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedFileType === t ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div 
                  onClick={handleSimulateUpload}
                  className="p-8 rounded-2xl bg-slate-950/80 border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 text-center space-y-2 cursor-pointer transition-colors"
                >
                  <Dna className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
                  <div className="text-sm font-bold text-white">Click or drag {selectedFileType} file here</div>
                  <div className="text-xs text-slate-400">Supports .vcf, .vcf.gz, .fastq.gz, .bam (GRCh38 header required)</div>
                </div>

              </div>
            )}

            {/* Step 2: Validating */}
            {uploadStep === 'validating' && (
              <div className="p-8 text-center space-y-4 font-mono">
                <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mx-auto"></div>
                <div className="text-sm font-bold text-white">VALIDATING FILE SCHEMA & COORDINATES...</div>
                <p className="text-xs text-slate-400">Checking GRCh38 header, variant syntax, and duplicate records...</p>
              </div>
            )}

            {/* Step 3: Completed & Validation Summary */}
            {uploadStep === 'completed' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-sm">VALIDATION PASSED SUCCESSFULLY</div>
                    <div className="text-xs text-emerald-400/90">Created Sample ID: SAMPLE-004</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="font-bold text-white border-b border-slate-800 pb-1">Validation Summary Report</div>
                  <div className="flex justify-between"><span className="text-slate-400">Header Check:</span> <span className="text-emerald-400">PASS (GRCh38)</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Parsed Variants:</span> <span className="text-white">128 records</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Duplicate Variants:</span> <span className="text-white">0</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Schema Match:</span> <span className="text-emerald-400">100% Valid</span></div>
                </div>

                <button
                  onClick={() => setShowUploadModal(false)}
                  className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
                >
                  Done & Load Sample
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
