from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from app.data.demo_data import SAMPLES_DATA, VARIANTS_DATA, PIPELINE_STAGES, MLOPS_METRICS, CLOUD_NODES

app = FastAPI(
    title="HELIXIQ Platform API",
    description="AI-Powered NGS Analysis, Variant Intelligence & Genomic Discovery API",
    version="2.4.0"
)

# Enable CORS for local React Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "HELIXIQ Genomic Intelligence Backend",
        "version": "2.4.0",
        "disclaimer": "RESEARCH USE ONLY - NOT FOR CLINICAL DIAGNOSIS"
    }

@app.get("/api/health")
def health_check():
    return {"status": "HEALTHY", "db_connected": True, "ml_engine": "ACTIVE", "version": "2.4.0"}

# 1. Samples Endpoints
@app.get("/api/samples")
def get_samples():
    return {"samples": SAMPLES_DATA, "total": len(SAMPLES_DATA)}

@app.get("/api/samples/{sample_id}")
def get_sample_by_id(sample_id: str):
    for sample in SAMPLES_DATA:
        if sample["id"].upper() == sample_id.upper():
            return sample
    raise HTTPException(status_code=404, detail=f"Sample {sample_id} not found")

# 2. Variants Endpoints
@app.get("/api/variants")
def get_variants(
    gene: Optional[str] = None,
    chromosome: Optional[str] = None,
    priority: Optional[str] = None,
    pathogenicity: Optional[str] = None,
    consequence: Optional[str] = None,
    min_vaf: Optional[float] = None,
    min_depth: Optional[int] = None
):
    results = VARIANTS_DATA
    if gene:
        results = [v for v in results if gene.lower() in v["gene"].lower()]
    if chromosome:
        results = [v for v in results if v["chromosome"].lower() == chromosome.lower()]
    if priority:
        results = [v for v in results if v["priority"].lower() == priority.lower()]
    if pathogenicity:
        results = [v for v in results if v["pathogenicity"].lower() == pathogenicity.lower()]
    if consequence:
        results = [v for v in results if consequence.lower() in v["consequence"].lower()]
    if min_vaf is not None:
        results = [v for v in results if v["vaf"] >= min_vaf]
    if min_depth is not None:
        results = [v for v in results if v["depth"] >= min_depth]
    return {"variants": results, "total": len(results)}

@app.get("/api/variants/{variant_id}")
def get_variant_by_id(variant_id: str):
    for v in VARIANTS_DATA:
        if v["id"].upper() == variant_id.upper():
            return v
    raise HTTPException(status_code=404, detail=f"Variant {variant_id} not found")

@app.get("/api/genes/{gene_name}")
def get_variants_by_gene(gene_name: str):
    matches = [v for v in VARIANTS_DATA if v["gene"].upper() == gene_name.upper()]
    if not matches:
        raise HTTPException(status_code=404, detail=f"No variants found for gene {gene_name}")
    return {"gene": gene_name, "variants": matches, "total": len(matches)}

# 3. Quality Control (QC) & Coverage Endpoints
@app.get("/api/qc/{sample_id}")
def get_qc_metrics(sample_id: str):
    sample = get_sample_by_id(sample_id)
    return {
        "sample_id": sample["id"],
        "quality_score": sample["quality_score"],
        "q20_rate": sample["q20_rate"],
        "q30_rate": sample["q30_rate"],
        "gc_content": sample["gc_content"],
        "duplication_rate": sample["duplication_rate"],
        "adapter_content": sample["adapter_content"],
        "mapping_rate": sample["mapping_rate"],
        "mean_coverage": sample["mean_coverage"],
        "uniformity_02x": sample["uniformity_02x"],
        "per_base_quality": [
            {"pos": i, "mean_quality": round(36.0 + (i % 5) * 0.4 - (i / 150.0) * 2.0, 1)}
            for i in range(1, 151, 10)
        ],
        "gc_distribution": [
            {"gc_bin": f"{gc}%", "read_count": int(1000000 * (0.8 ** (abs(gc - sample['gc_content']) / 5)))}
            for gc in range(10, 91, 10)
        ]
    }

@app.get("/api/coverage/{sample_id}")
def get_coverage(sample_id: str, gene: Optional[str] = None):
    # Simulated depth across exons
    target_genes = ["BRCA1", "TP53", "EGFR", "KRAS", "CFTR"] if not gene else [gene]
    exon_coverage = []
    for g in target_genes:
        for exon_num in range(1, 11):
            exon_coverage.append({
                "gene": g,
                "exon": f"Exon {exon_num}",
                "mean_depth": round(75 + (exon_num * 11) % 60, 1),
                "pct_10x": 99.8,
                "pct_30x": 97.4,
                "pct_50x": 92.1,
                "pct_100x": 78.5
            })
    return {"sample_id": sample_id, "exons": exon_coverage}

# 4. Pipeline Endpoints
@app.get("/api/pipeline/{sample_id}")
def get_pipeline_status(sample_id: str):
    return {"sample_id": sample_id, "stages": PIPELINE_STAGES}

# 5. Machine Learning & Evidence Endpoints
@app.get("/api/model/{sample_id}")
def get_model_metrics(sample_id: str):
    return {"sample_id": sample_id, "metrics": MLOPS_METRICS}

@app.get("/api/evidence/{variant_id}")
def get_evidence_constellation(variant_id: str):
    variant = get_variant_by_id(variant_id)
    return {
        "variant": variant,
        "nodes": [
            {"id": "variant", "name": f"{variant['gene']} {variant['hgvs_c']}", "type": "variant", "val": 10},
            {"id": "gene", "name": f"Gene: {variant['gene']}", "type": "gene", "val": 8},
            {"id": "population", "name": f"gnomAD AF: {variant['population_frequency']}", "type": "population", "val": 6},
            {"id": "prediction", "name": f"ML Prob: {variant['model_probability']}", "type": "prediction", "val": 7},
            {"id": "literature", "name": f"Citations: {variant['literature_citations']}", "type": "literature", "val": 5},
            {"id": "clinical", "name": f"ClinVar: {variant['pathogenicity']}", "type": "clinical", "val": 9}
        ]
    }

# 6. Genomic Copilot AI Endpoint
@app.post("/api/copilot/query")
def copilot_query(payload: Dict[str, Any]):
    query = payload.get("query", "").strip().lower()
    
    # Contextual pattern responses
    if "high-priority" in query or "highest" in query or "pathogenic" in query:
        high_vars = [v for v in VARIANTS_DATA if v["priority"] == "High"]
        return {
            "query": payload.get("query"),
            "observed_data": f"Found {len(high_vars)} high-priority pathogenic variants in active sample: BRCA1 (c.1234A>G), TP53 (c.818C>T), EGFR (c.2573T>G), and KRAS (c.34G>T).",
            "model_prediction": "XGBoost model confidence > 93% for all 4 variants based on conservation scores, protein domain impact, and gnomAD rarity.",
            "ai_explanation": "These variants disrupt crucial functional domains (e.g., BRCA1 RING finger, TP53 DNA binding) and have strong clinical annotations in ClinVar. Recommend prioritizing for research review.",
            "suggested_actions": ["Open Variant Detail for BRCA1", "Generate PDF Summary Report", "Examine Evidence Constellation"]
        }
    elif "brca1" in query or "brca" in query:
        brca = [v for v in VARIANTS_DATA if v["gene"] == "BRCA1"][0]
        return {
            "query": payload.get("query"),
            "observed_data": f"BRCA1 chr17:43044295 A>G (c.1234A>G, p.Tyr412Cys). VAF: {brca['vaf']}, Read Depth: {brca['depth']}X, gnomAD AF: {brca['population_frequency']}.",
            "model_prediction": f"Ensemble score: {brca['model_probability']} (Pathogenic class probability). High SHAP impact from conservation score (0.94).",
            "ai_explanation": "BRCA1 c.1234A>G is a missense mutation located in exon 11. ClinVar lists 14 independent assertions classifying this variant as Pathogenic for Hereditary Breast and Ovarian Cancer Syndrome.",
            "suggested_actions": ["View Evidence Constellation for BRCA1", "Examine Exon Coverage", "Inspect Literature Citations"]
        }
    elif "quality" in query or "qc" in query or "coverage" in query:
        return {
            "query": payload.get("query"),
            "observed_data": "Sample-001 Sequencing Pulse Score: 98.4/100. Q30 Rate: 94.8%, Mean Depth: 87.4X, Mapping Rate: 98.8%.",
            "model_prediction": "No quality anomaly detected. FastQC metrics conform to high-depth whole-exome sequencing standards.",
            "ai_explanation": "Sequencing health is robust. Reads are uniformly distributed across target capture regions (96.5% >= 20X) with negligible adapter contamination (0.8%).",
            "suggested_actions": ["Navigate to Quality Analysis Page", "View Per-Base Quality Curve", "Check GC Distribution"]
        }
    else:
        return {
            "query": payload.get("query"),
            "observed_data": f"Parsed query against 76 called variants in SAMPLE-001.",
            "model_prediction": "Prioritization model evaluated variants across 6 genomic features with 96.8% benchmark accuracy.",
            "ai_explanation": f"I can assist you with variant interpretation, sequencing QC metrics, literature summaries, and model explainability. Try asking: 'Show high-priority variants' or 'Explain BRCA1'.",
            "suggested_actions": ["Show high-priority variants", "Explain BRCA1 c.1234A>G", "Check sequencing quality"]
        }

# 7. Upload & Validation Simulation Endpoint
@app.post("/api/upload")
def upload_sample_file(payload: Dict[str, Any]):
    filename = payload.get("filename", "uploaded_sample.vcf")
    file_type = payload.get("file_type", "VCF")
    return {
        "status": "VALIDATED",
        "sample_id": "SAMPLE-004",
        "filename": filename,
        "file_type": file_type,
        "validation_summary": {
            "format_valid": True,
            "header_check": "PASS (GRCh38 header detected)",
            "parsed_records": 128,
            "duplicate_records": 0,
            "missing_values": 0,
            "invalid_coordinates": 0
        },
        "next_step": "Ready for Pipeline Ingestion"
    }

# 8. Cloud & MLOps Endpoint
@app.get("/api/cloud/architecture")
def get_cloud_architecture():
    return {"nodes": CLOUD_NODES}

# 9. Reports Endpoint
@app.get("/api/report/{sample_id}")
def generate_sample_report(sample_id: str):
    sample = get_sample_by_id(sample_id)
    high_priority = [v for v in VARIANTS_DATA if v["priority"] == "High"]
    return {
        "report_id": f"REP-{sample_id}-20261003",
        "timestamp": "2026-10-03T11:45:00Z",
        "sample_info": sample,
        "high_priority_variants": high_priority,
        "qc_summary": {
            "quality_score": sample["quality_score"],
            "q30_rate": sample["q30_rate"],
            "mean_coverage": sample["mean_coverage"],
            "mapping_rate": sample["mapping_rate"]
        },
        "ml_model_summary": MLOPS_METRICS,
        "disclaimer": "FOR RESEARCH USE ONLY. THIS REPORT IS PRODUCED BY AN AUTOMATED GENOMIC ANALYSIS PIPELINE AND SHOULD NOT BE USED AS A DEFINITIVE CLINICAL DIAGNOSIS."
    }
