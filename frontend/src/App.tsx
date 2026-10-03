import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPageView } from './views/LandingPageView';
import { OverviewView } from './views/OverviewView';
import { SamplesView } from './views/SamplesView';
import { GenomeExplorerView } from './views/GenomeExplorerView';
import { VariantsView } from './views/VariantsView';
import { VariantDetailView } from './views/VariantDetailView';
import { EvidenceConstellationView } from './views/EvidenceConstellationView';
import { GenomicCopilotView } from './views/GenomicCopilotView';
import { NgsQualityView } from './views/NgsQualityView';
import { AnalysisPipelineView } from './views/AnalysisPipelineView';
import { MachineLearningView } from './views/MachineLearningView';
import { CloudArchitectureView } from './views/CloudArchitectureView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

import { Sample, Variant, PipelineStage, MLOpsMetrics, CloudNode } from './types';
import { 
  MOCK_SAMPLES, 
  MOCK_VARIANTS, 
  MOCK_PIPELINE_STAGES, 
  MOCK_MLOPS_METRICS, 
  MOCK_CLOUD_NODES 
} from './data/mockData';

export function App() {
  const [activeView, setActiveView] = useState<string>('landing');
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // State Data
  const [samples, setSamples] = useState<Sample[]>(MOCK_SAMPLES);
  const [currentSample, setCurrentSample] = useState<Sample>(MOCK_SAMPLES[0]);
  const [variants, setVariants] = useState<Variant[]>(MOCK_VARIANTS);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(MOCK_VARIANTS[0]);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(MOCK_PIPELINE_STAGES);
  const [mlMetrics, setMlMetrics] = useState<MLOpsMetrics>(MOCK_MLOPS_METRICS);
  const [cloudNodes, setCloudNodes] = useState<CloudNode[]>(MOCK_CLOUD_NODES);
  
  const [copilotInitialQuery, setCopilotInitialQuery] = useState<string>('');

  // Fetch live API data if FastAPI backend is available
  useEffect(() => {
    fetch('/api/samples')
      .then(res => res.json())
      .then(data => {
        if (data && data.samples && data.samples.length > 0) {
          setSamples(data.samples);
          setCurrentSample(data.samples[0]);
        }
      })
      .catch(() => {
        // Fallback silently to mock data
      });

    fetch('/api/variants')
      .then(res => res.json())
      .then(data => {
        if (data && data.variants && data.variants.length > 0) {
          setVariants(data.variants);
          setSelectedVariant(data.variants[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectSample = (sample: Sample) => {
    setCurrentSample(sample);
  };

  const handleSelectVariant = (variant: Variant) => {
    setSelectedVariant(variant);
    setActiveView('evidence');
  };

  const handleSearch = (term: string) => {
    const match = variants.find(v => v.gene.toLowerCase() === term.toLowerCase());
    if (match) {
      setSelectedVariant(match);
      setActiveView('evidence');
    } else {
      setActiveView('variants');
    }
  };

  const handleOpenCopilotWithQuery = (query: string) => {
    setCopilotInitialQuery(query);
    setActiveView('copilot');
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* HEADER */}
      <Header
        currentSample={currentSample}
        samples={samples}
        onSelectSample={handleSelectSample}
        onOpenUpload={() => setActiveView('samples')}
        onOpenReport={() => setActiveView('reports')}
        onOpenCopilot={() => setActiveView('copilot')}
        onReplayAnalysis={() => setActiveView('pipeline')}
        onSearch={handleSearch}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* BODY LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* MAIN CONTENT VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          
          {activeView === 'landing' && (
            <LandingPageView
              onExploreDemo={() => setActiveView('overview')}
              onViewAnalysis={() => setActiveView('variants')}
            />
          )}

          {activeView === 'overview' && (
            <OverviewView
              sample={currentSample}
              onNavigate={setActiveView}
            />
          )}

          {activeView === 'samples' && (
            <SamplesView
              samples={samples}
              currentSample={currentSample}
              onSelectSample={handleSelectSample}
            />
          )}

          {activeView === 'genome' && (
            <GenomeExplorerView
              variants={variants}
              onSelectVariant={handleSelectVariant}
            />
          )}

          {activeView === 'variants' && (
            <VariantsView
              variants={variants}
              onSelectVariant={handleSelectVariant}
            />
          )}

          {activeView === 'evidence' && (
            <div className="space-y-8">
              <VariantDetailView
                variant={selectedVariant}
                onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
                onNavigateToConstellation={() => {
                  const elem = document.getElementById('evidence-constellation-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
              />
              <div id="evidence-constellation-section">
                <EvidenceConstellationView variant={selectedVariant} />
              </div>
            </div>
          )}

          {activeView === 'copilot' && (
            <GenomicCopilotView
              sample={currentSample}
              onNavigate={setActiveView}
              initialQuery={copilotInitialQuery}
            />
          )}

          {activeView === 'qc' && (
            <NgsQualityView sample={currentSample} />
          )}

          {activeView === 'pipeline' && (
            <AnalysisPipelineView stages={pipelineStages} />
          )}

          {activeView === 'ml' && (
            <MachineLearningView mlMetrics={mlMetrics} variants={variants} />
          )}

          {activeView === 'cloud' && (
            <CloudArchitectureView cloudNodes={cloudNodes} mlMetrics={mlMetrics} />
          )}

          {activeView === 'reports' && (
            <ReportsView sample={currentSample} variants={variants} />
          )}

          {activeView === 'settings' && (
            <SettingsView />
          )}

        </main>
      </div>

    </div>
  );
}
export default App;
