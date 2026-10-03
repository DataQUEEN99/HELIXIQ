import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight, Dna, Database, BrainCircuit, ShieldAlert } from 'lucide-react';
import { Sample, CopilotResponse } from '../types';

interface GenomicCopilotViewProps {
  sample: Sample;
  onNavigate: (view: string) => void;
  initialQuery?: string;
}

export const GenomicCopilotView: React.FC<GenomicCopilotViewProps> = ({
  sample,
  onNavigate,
  initialQuery
}) => {
  const [queryInput, setQueryInput] = useState(initialQuery || '');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string | CopilotResponse }>>([
    {
      role: 'assistant',
      content: {
        query: 'Welcome to HELIXIQ Genomic Copilot',
        observed_data: `Active Dataset: ${sample.id} (${sample.label}). Total called variants: ${sample.total_variants}. 4 High-priority pathogenic variants detected.`,
        model_prediction: `Prioritization ensemble (v2.4.1) active with 96.8% benchmark accuracy.`,
        ai_explanation: `I am your contextual genomic research assistant. Ask me questions about variant pathogenicity, evidence constellation, quality control metrics, or literature summaries.`,
        suggested_actions: [
          'Show high-priority variants',
          'Explain BRCA1 c.1234A>G',
          'Check sequencing quality'
        ]
      }
    }
  ]);

  const presetQueries = [
    "Show me the highest-priority variants.",
    "Which variants have the strongest available evidence?",
    "Show variants in BRCA1.",
    "Explain BRCA1 c.1234A>G.",
    "Why was TP53 c.818C>T prioritized?",
    "Show me the sequencing quality metrics."
  ];

  const handleSendQuery = (textToSend?: string) => {
    const text = (textToSend || queryInput).trim();
    if (!text) return;

    // Add user message
    const updatedHistory = [...chatHistory, { role: 'user' as const, content: text }];
    setChatHistory(updatedHistory);
    setQueryInput('');

    // Generate response
    setTimeout(() => {
      let resp: CopilotResponse;
      const lower = text.toLowerCase();

      if (lower.includes('high') || fontContains(lower, ['priority', 'highest', 'pathogenic'])) {
        resp = {
          query: text,
          observed_data: `4 High-priority variants identified in ${sample.id}: BRCA1 c.1234A>G (p.Tyr412Cys), TP53 c.818C>T (p.Arg273Ter), EGFR c.2573T>G (p.Leu858Arg), and KRAS c.34G>T (p.Gly12Cys).`,
          model_prediction: `XGBoost model pathogenicity confidence > 93% across all 4 loci based on phyloP conservation and protein domain impact.`,
          ai_explanation: `These 4 variants alter critical functional domains and possess strong consensus assertions in ClinVar. Prioritize for research review.`,
          suggested_actions: ['Open Variant Intelligence Table', 'Examine Evidence Constellation', 'Generate Summary Report']
        };
      } else if (lower.includes('brca1') || lower.includes('brca')) {
        resp = {
          query: text,
          observed_data: `BRCA1 chr17:43044295 A>G (c.1234A>G, p.Tyr412Cys). VAF: 48%, Depth: 112X, gnomAD AF: 0.00002.`,
          model_prediction: `Pathogenicity probability: 94.5%. High SHAP impact from phyloP conservation score (0.94).`,
          ai_explanation: `BRCA1 c.1234A>G is located in the zinc-finger RING domain. 14 independent ClinVar submissions classify this mutation as Pathogenic for Hereditary Breast and Ovarian Cancer Syndrome.`,
          suggested_actions: ['View BRCA1 Locus in Genome Explorer', 'Inspect Literature Citations', 'Generate PDF Report']
        };
      } else if (lower.includes('quality') || lower.includes('qc') || lower.includes('depth')) {
        resp = {
          query: text,
          observed_data: `Sequencing Health Score: ${sample.quality_score}/100. Q30 Rate: ${sample.q30_rate}%, Mean Depth: ${sample.mean_coverage}X, Mapping Rate: ${sample.mapping_rate}%.`,
          model_prediction: `FastQC quality checks passed. Coverage depth uniformity >= 20X is ${sample.uniformity_02x}%.`,
          ai_explanation: `Sequencing metrics conform to high-depth exome capture standards. Adapter contamination is negligible (${sample.adapter_content}%).`,
          suggested_actions: ['Navigate to Quality Analysis Page', 'Examine Exon Coverage Curves']
        };
      } else {
        resp = {
          query: text,
          observed_data: `Queried 76 variants in dataset ${sample.id}.`,
          model_prediction: `XGBoost prioritization model evaluated variants across 6 genomic feature dimensions.`,
          ai_explanation: `Parsed query '${text}'. I can analyze variant consequence, ClinVar evidence, population frequency, or sequencing health.`,
          suggested_actions: ['Show high-priority variants', 'Explain BRCA1 c.1234A>G', 'Check sequencing quality']
        };
      }

      setChatHistory(prev => [...prev, { role: 'assistant', content: resp }]);
    }, 600);
  };

  function fontContains(str: string, words: string[]) {
    return words.some(w => str.includes(w));
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-violet-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-400" />
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">GENOMIC COPILOT</h1>
            <span className="px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-500/40 text-xs font-mono">AI ASSISTANT</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Context-aware AI research assistant synthesizing observed data, ML predictions, and evidence.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-violet-300">
          CONTEXT: <span className="font-bold text-cyan-300">{sample.id}</span>
        </div>
      </div>

      {/* QUICK PRESET PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <span className="text-xs font-mono text-slate-400 shrink-0">SUGGESTED:</span>
        {presetQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuery(q)}
            className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 hover:border-violet-500/50 text-xs text-slate-300 hover:text-white font-sans shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* CHAT DISPLAY CONTAINER */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 min-h-[420px] flex flex-col justify-between">
        
        <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className="space-y-3">
              
              {/* User Bubble */}
              {msg.role === 'user' && (
                <div className="flex items-start gap-3 justify-end">
                  <div className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-xs text-cyan-100 max-w-xl">
                    {msg.content as string}
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Assistant Structured Response */}
              {msg.role === 'assistant' && typeof msg.content === 'object' && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-950 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs space-y-4 max-w-3xl">
                    
                    {/* 1. OBSERVED DATA BADGE */}
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-bold">
                        <Database className="w-3 h-3" />
                        <span>OBSERVED SEQUENCING DATA</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed pt-1">
                        {(msg.content as CopilotResponse).observed_data}
                      </p>
                    </div>

                    {/* 2. MODEL PREDICTION BADGE */}
                    <div className="space-y-1 border-t border-slate-800 pt-3">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-500/40 font-mono text-[10px] font-bold">
                        <BrainCircuit className="w-3 h-3" />
                        <span>MACHINE-LEARNING PREDICTION</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed pt-1">
                        {(msg.content as CopilotResponse).model_prediction}
                      </p>
                    </div>

                    {/* 3. AI EXPLANATION BADGE */}
                    <div className="space-y-1 border-t border-slate-800 pt-3">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-500/40 font-mono text-[10px] font-bold">
                        <Sparkles className="w-3 h-3" />
                        <span>AI-GENERATED RESEARCH EXPLANATION</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed pt-1 font-sans">
                        {(msg.content as CopilotResponse).ai_explanation}
                      </p>
                    </div>

                    {/* Suggested Actions */}
                    {(msg.content as CopilotResponse).suggested_actions && (
                      <div className="border-t border-slate-800 pt-3 flex flex-wrap gap-2">
                        {(msg.content as CopilotResponse).suggested_actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (act.includes('Table')) onNavigate('variants');
                              else if (act.includes('Constellation')) onNavigate('evidence');
                              else if (act.includes('Report')) onNavigate('reports');
                              else handleSendQuery(act);
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
                          >
                            <span>{act}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* INPUT PROMPT FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="relative pt-4 border-t border-slate-800"
        >
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Ask Genomic Copilot a question..."
            className="w-full pl-4 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-5.5 p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
