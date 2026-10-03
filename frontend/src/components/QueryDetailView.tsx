import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Play, 
  Copy, 
  Check, 
  AlertTriangle, 
  ChevronRight,
  FileCode
} from 'lucide-react';
import type { QueryEvent, Recommendation } from '../types/queryguard';
import { PlanGraphCanvas } from './PlanGraphCanvas';

interface QueryDetailViewProps {
  query: QueryEvent;
  onBack: () => void;
  onSelectRecommendation: (recId: string) => void;
  onOpenSimulationModal: (rec: Recommendation) => void;
}

export const QueryDetailView: React.FC<QueryDetailViewProps> = ({
  query,
  onBack,
  onSelectRecommendation,
  onOpenSimulationModal
}) => {
  const [copiedSql, setCopiedSql] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(query.maskedQueryTemplate);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const primaryRec = query.recommendations[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Navigation Breadcrumb & Header Bar */}
      <div>
        <button 
          onClick={onBack}
          className="btn btn-ghost" 
          style={{ padding: '4px 0', fontSize: 12, marginBottom: 8, color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Slow Queries Catalog</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {query.title}
              </h1>
              <span className="badge badge-brand font-mono">{query.queryFingerprint}</span>
              <span className="badge badge-neutral">
                <ShieldCheck size={12} style={{ color: 'var(--brand-primary-text)' }} />
                Masked Metadata
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
              Bottleneck: <strong style={{ color: 'var(--danger-text)' }}>{query.bottleneckType}</strong> • Observed: {query.observedAt}
            </p>
          </div>

          {/* Primary Action Button */}
          {primaryRec && (
            <button 
              onClick={() => onOpenSimulationModal(primaryRec)}
              className="btn btn-primary"
              style={{ fontSize: 13, padding: '9px 18px' }}
            >
              <Play size={15} />
              <span>Run Safe Simulation</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 4 Metric Chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: '12px 16px' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Average Latency</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }} className="tabular-nums font-mono">
            {query.averageDurationMs} ms
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Bucket: {query.latencyMsBucket}</span>
        </div>

        <div className="card" style={{ padding: '12px 16px' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Workload Frequency</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }} className="tabular-nums font-mono">
            {query.callsPerMin} calls/min
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Bucket: {query.frequencyBucket}</span>
        </div>

        <div className="card" style={{ padding: '12px 16px' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Impact Score</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--danger-text)' }} className="tabular-nums font-mono">
            {query.impactScore} / 100
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>High Production Cost</span>
        </div>

        <div className="card" style={{ padding: '12px 16px' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Planner Baseline Cost</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }} className="tabular-nums font-mono">
            {query.planGraph.planCost.toLocaleString()}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Depth: {query.planGraph.planDepth} nodes</span>
        </div>
      </div>

      {/* Two-Column Diagnostic Section: Plan Graph (Left 7) + XAI Evidence (Right 5) */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 'var(--space-6)' }}>
        {/* Left: Interactive Execution Plan Graph */}
        <div>
          <PlanGraphCanvas planGraph={query.planGraph} />
        </div>

        {/* Right: XAI Evidence Packet & Reason Codes */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-default)' }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                XAI Diagnostic Evidence
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Deterministic reason codes derived from plan graph
              </span>
            </div>
            <span className="badge badge-brand">
              Model Confidence: {primaryRec?.confidence || 'HIGH'}
            </span>
          </div>

          {primaryRec?.evidence ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Detected Bottleneck Reason Codes
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {primaryRec.evidence.reasonCodes.map(code => (
                    <span key={code} className="badge badge-danger">
                      <AlertTriangle size={11} />
                      {code}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: 12, fontSize: 12 }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Observed Plan Metrics:
                </strong>
                <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <li>Scan Type: <strong className="font-mono">{primaryRec.evidence.observedEvidence.scanType || 'SEQ_SCAN'}</strong></li>
                  {primaryRec.evidence.observedEvidence.relationSizeBucket && (
                    <li>Relation Size Bucket: <strong className="font-mono">{primaryRec.evidence.observedEvidence.relationSizeBucket}</strong></li>
                  )}
                  {primaryRec.evidence.observedEvidence.cardinalityMismatchRatio && (
                    <li>Cardinality Mismatch: <strong className="font-mono">{primaryRec.evidence.observedEvidence.cardinalityMismatchRatio}x discrepancy</strong></li>
                  )}
                </ul>
              </div>

              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Safety & Limitations
                </span>
                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {primaryRec.evidence.limitations.map((lim, idx) => (
                    <div key={idx} style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
                      <span style={{ color: 'var(--warning-text)' }}>•</span>
                      <span>{lim}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              System abstained: No high-confidence degradation patterns identified.
            </div>
          )}
        </div>
      </div>

      {/* Masked SQL Template Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileCode size={16} style={{ color: 'var(--brand-primary-text)' }} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              Masked SQL Query Template
            </h3>
            <span className="badge badge-brand" style={{ fontSize: 10 }}>
              Literals & Identifiers Masked Locally
            </span>
          </div>

          <button 
            onClick={handleCopySql}
            className="btn btn-secondary" 
            style={{ fontSize: 11, padding: '4px 10px' }}
          >
            {copiedSql ? <Check size={12} style={{ color: 'var(--success-text)' }} /> : <Copy size={12} />}
            <span>{copiedSql ? 'Copied' : 'Copy Template'}</span>
          </button>
        </div>

        <pre className="code-block" style={{ maxHeight: 180 }}>
          {query.maskedQueryTemplate}
        </pre>
      </div>

      {/* Candidate Recommendations Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              Candidate Optimizations ({query.recommendations.length})
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Simulation-backed recommendations ranked by transparent cost-benefit formula
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {query.recommendations.map(rec => (
            <div 
              key={rec.id}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                    {rec.title}
                  </strong>
                  <span className="badge badge-brand font-mono">{rec.actionType}</span>
                  <span className={`badge ${rec.riskLevel === 'LOW' ? 'badge-success' : 'badge-warning'}`}>
                    Risk: {rec.riskLevel}
                  </span>
                </div>
                <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {rec.maskedChangeTemplate}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {rec.simulation && (
                  <span className="badge badge-success font-mono" style={{ fontSize: 11 }}>
                    Simulated: -{((1 - rec.simulation.candidate.plannerCost / rec.simulation.baseline.plannerCost) * 100).toFixed(1)}% cost
                  </span>
                )}
                <button
                  onClick={() => onSelectRecommendation(rec.id)}
                  className="btn btn-secondary"
                  style={{ fontSize: 12, padding: '6px 12px' }}
                >
                  <span>Inspect Plan Comparison</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
