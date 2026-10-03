export interface Sample {
  id: string;
  label: string;
  sample_type: string;
  status: 'READY' | 'PROCESSING' | 'WARNING' | 'FAILED';
  quality_score: number;
  total_reads: number;
  mapped_reads: number;
  mapping_rate: number;
  mean_coverage: number;
  q20_rate: number;
  q30_rate: number;
  gc_content: number;
  duplication_rate: number;
  adapter_content: number;
  uniformity_02x: number;
  total_variants: number;
  high_priority_variants: number;
  moderate_priority_variants: number;
  low_priority_variants: number;
  created_at: string;
  organism: string;
  sequencing_platform: string;
}

export interface Variant {
  id: string;
  gene: string;
  chromosome: string;
  position: number;
  reference: string;
  alternate: string;
  transcript: string;
  consequence: string;
  hgvs_c: string;
  hgvs_p: string;
  vaf: number;
  depth: number;
  zygosities: string;
  population_frequency: number;
  pathogenicity: 'Pathogenic' | 'Likely Pathogenic' | 'Uncertain Significance' | 'Likely Benign' | 'Benign';
  priority: 'High' | 'Moderate' | 'Low';
  confidence: number;
  conservation_score: number;
  splice_score: number;
  functional_score: number;
  model_probability: number;
  evidence_score: number;
  clinvar_id: string;
  dbsnp_id: string;
  literature_citations: number;
  summary: string;
}

export interface PipelineStage {
  id: number;
  name: string;
  status: 'COMPLETED' | 'RUNNING' | 'QUEUED' | 'WARNING' | 'FAILED';
  runtime: string;
  input: string;
  output: string;
  metrics: string;
  log: string;
}

export interface MLOpsMetrics {
  model_name: string;
  model_version: string;
  last_trained: string;
  framework: string;
  dataset_version: string;
  total_predictions: number;
  avg_confidence: number;
  data_drift_score: number;
  model_drift_score: number;
  prediction_drift_score: number;
  retraining_status: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  confusion_matrix: {
    true_pathogenic_predicted_pathogenic: number;
    true_pathogenic_predicted_benign: number;
    true_benign_predicted_pathogenic: number;
    true_benign_predicted_benign: number;
  };
  feature_importances: Array<{
    feature: string;
    importance: number;
  }>;
}

export interface CopilotResponse {
  query: string;
  observed_data: string;
  model_prediction: string;
  ai_explanation: string;
  suggested_actions: string[];
}

export interface CloudNode {
  id: string;
  label: string;
  category: string;
  status: string;
  desc: string;
}
