import React, { useState } from 'react';
import { 
  Cloud, 
  Server, 
  Database, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Radio, 
  Clock, 
  RefreshCw,
  Info
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CloudNode, MLOpsMetrics } from '../types';

interface CloudArchitectureViewProps {
  cloudNodes: CloudNode[];
  mlMetrics: MLOpsMetrics;
}

export const CloudArchitectureView: React.FC<CloudArchitectureViewProps> = ({ cloudNodes, mlMetrics }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('fastapi');

  const selectedNode = cloudNodes.find(n => n.id === selectedNodeId) || cloudNodes[2];

  // Time-series Drift Data over 30 Days
  const driftTimeSeries = Array.from({ length: 10 }, (_, i) => ({
    day: `Day ${i * 3 + 1}`,
    dataDrift: Number((0.015 + i * 0.001 + Math.sin(i) * 0.002).toFixed(3)),
    modelDrift: Number((0.012 + i * 0.0008).toFixed(3)),
    predictionDrift: Number((0.020 + Math.cos(i) * 0.003).toFixed(3)),
    threshold: 0.05
  }));

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-blue-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">CLOUD ARCHITECTURE & MLOPS MONITORING</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            AWS cloud-native deployment topology, Docker microservices, and continuous drift monitoring
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-950 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold">
          <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
          <span>MLOPS HEALTH: STABLE</span>
        </div>
      </div>

      {/* CLOUD ARCHITECTURE DIAGRAM */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs text-slate-300">
          <span>AWS CLOUD-NATIVE DEPLOYMENT ARCHITECTURE (CLICK NODES)</span>
          <span className="text-cyan-400 font-bold">DOCKER CONTAINERIZED</span>
        </div>

        {/* Node Diagram Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {cloudNodes.map((n) => {
            const isSelected = selectedNodeId === n.id;
            return (
              <div
                key={n.id}
                onClick={() => setSelectedNodeId(n.id)}
                className={`p-4 rounded-2xl border text-center space-y-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400 scale-105 shadow-xl shadow-blue-950'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono text-blue-400 uppercase font-bold">{n.category}</div>
                <div className="text-xs font-bold truncate">{n.label.split(' ')[0]}</div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[9px] font-mono font-bold block">
                  {n.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Node Inspection Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
          <div>
            <div className="text-slate-400 text-[10px] uppercase">Selected AWS Infrastructure Node</div>
            <div className="text-base font-bold text-white mt-0.5">{selectedNode.label}</div>
            <p className="text-xs text-slate-300 font-sans mt-1">{selectedNode.desc}</p>
          </div>
          <span className="px-3 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
            {selectedNode.category}
          </span>
        </div>
      </div>

      {/* MLOPS DRIFT MONITORING SECTION */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white font-mono">MLOPS CONTINUOUS DRIFT MONITORING</h2>
            <p className="text-xs text-slate-400">Data drift, model performance decay, and prediction drift tracking</p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-xl">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{mlMetrics.retraining_status}</span>
          </div>
        </div>

        {/* 3 DRIFT KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 font-mono">DATA DRIFT SCORE</div>
            <div className="text-2xl font-bold font-mono text-cyan-400">{mlMetrics.data_drift_score}</div>
            <div className="text-[10px] text-emerald-400">Low Drift (&lt; 0.05 Threshold)</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 font-mono">MODEL DRIFT SCORE</div>
            <div className="text-2xl font-bold font-mono text-teal-300">{mlMetrics.model_drift_score}</div>
            <div className="text-[10px] text-emerald-400">Stable Accuracy</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 font-mono">PREDICTION DRIFT SCORE</div>
            <div className="text-2xl font-bold font-mono text-violet-300">{mlMetrics.prediction_drift_score}</div>
            <div className="text-[10px] text-emerald-400">Consistent Outputs</div>
          </div>
        </div>

        {/* TIME SERIES DRIFT CHART */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={driftTimeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
              <YAxis domain={[0, 0.08]} stroke="#64748B" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="dataDrift" stroke="#06B6D4" strokeWidth={2} name="Data Drift" />
              <Line type="monotone" dataKey="modelDrift" stroke="#14B8A6" strokeWidth={2} name="Model Drift" />
              <Line type="monotone" dataKey="predictionDrift" stroke="#A855F7" strokeWidth={2} name="Prediction Drift" />
              <Line type="monotone" dataKey="threshold" stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1.5} name="Warning Threshold" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
};
