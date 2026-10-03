import React, { useState, useEffect } from 'react';
import { 
  GitCommit, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  FileText, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PipelineStage } from '../types';

interface AnalysisPipelineViewProps {
  stages: PipelineStage[];
  onReplayFinish?: () => void;
}

export const AnalysisPipelineView: React.FC<AnalysisPipelineViewProps> = ({
  stages,
  onReplayFinish
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(8); // default all finished
  const [replaySpeed, setReplaySpeed] = useState<number>(1);
  const [logConsole, setLogConsole] = useState<string[]>(stages.map(s => s.log));

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      if (currentStep >= stages.length - 1) {
        // Loop restart
        setCurrentStep(0);
      } else {
        timer = setInterval(() => {
          setCurrentStep(prev => {
            if (prev >= stages.length - 1) {
              setIsPlaying(false);
              if (onReplayFinish) onReplayFinish();
              return prev;
            }
            return prev + 1;
          });
        }, 1500 / replaySpeed);
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStep, replaySpeed, stages, onReplayFinish]);

  const startReplay = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <GitCommit className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">ANALYSIS PIPELINE & REPLAY ENGINE</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized 9-stage bioinformatic pipeline execution & interactive playback animation
          </p>
        </div>

        {/* REPLAY CONTROLLER BUTTONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-teal-400 transition-all shadow-lg shadow-cyan-500/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
            <span>{isPlaying ? 'Pause Replay' : 'Replay Analysis'}</span>
          </button>

          <button
            onClick={startReplay}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            title="Reset to Stage 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <select
            value={replaySpeed}
            onChange={(e) => setReplaySpeed(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none"
          >
            <option value={1}>Speed: 1X</option>
            <option value={2}>Speed: 2X</option>
            <option value={4}>Speed: 4X</option>
          </select>
        </div>
      </div>

      {/* PIPELINE STAGES STEP PROGRESS BAR */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs text-slate-300">
          <span>ACTIVE PIPELINE EXECUTION PROGRESS</span>
          <span className="text-cyan-400 font-bold">STAGE {currentStep + 1} OF {stages.length}</span>
        </div>

        {/* Stage Nodes Horizontal Track */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentStep;
            const isActive = idx === currentStep && isPlaying;
            return (
              <div
                key={stage.id}
                onClick={() => setCurrentStep(idx)}
                className={`p-3 rounded-2xl border text-center space-y-1.5 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400 scale-105 shadow-xl shadow-cyan-950'
                    : isCompleted
                    ? 'bg-slate-900/90 border-slate-700 text-slate-200'
                    : 'bg-slate-950 border-slate-800/80 text-slate-600 opacity-60'
                }`}
              >
                <div className="text-[10px] font-mono font-bold">STAGE 0{stage.id}</div>
                <div className="text-xs font-bold truncate">{stage.name.split(' ')[0]}</div>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-600 mx-auto" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE STAGE DETAILS & LOG CONSOLE STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ACTIVE STAGE METRICS CARD */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white font-mono">
              Stage 0{stages[currentStep].id}: {stages[currentStep].name}
            </h3>
            <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
              {stages[currentStep].status}
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Execution Runtime:</span>
              <span className="text-cyan-300 font-bold">{stages[currentStep].runtime}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Input Artifact:</span>
              <span className="text-slate-200 truncate max-w-[200px]">{stages[currentStep].input}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Output Artifact:</span>
              <span className="text-slate-200 truncate max-w-[200px]">{stages[currentStep].output}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Stage Metrics:</span>
              <span className="text-teal-300 font-bold">{stages[currentStep].metrics}</span>
            </div>
          </div>
        </div>

        {/* LOG STREAM CONSOLE */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs text-slate-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>REAL-TIME PIPELINE LOG STREAM</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 font-mono text-[11px] text-emerald-400 space-y-2 h-48 overflow-y-auto border border-slate-900">
            {stages.slice(0, currentStep + 1).map((s, idx) => (
              <div key={idx} className="leading-relaxed">
                <span className="text-slate-500">[{s.runtime}]</span> {s.log}
              </div>
            ))}
          </div>

          <div className="text-[10px] font-mono text-slate-400">
            LOG STREAM: GRCh38 Decoy • Docker Container ID: container-gatk4-v2.4
          </div>
        </div>

      </div>

    </div>
  );
};
