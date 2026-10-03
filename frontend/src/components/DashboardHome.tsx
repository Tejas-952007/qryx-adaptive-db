import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  Layers, 
  TrendingDown, 
  Zap, 
  ChevronRight,
  Database,
  Lock,
  Play
} from 'lucide-react';
import type { QueryEvent, Recommendation, User } from '../types/queryguard';

interface DashboardHomeProps {
  queries: QueryEvent[];
  recommendations: Recommendation[];
  currentUser: User;
  onSelectQuery: (queryId: string) => void;
  onSelectRecommendation: (recId: string) => void;
  onOpenSimulationModal: (rec: Recommendation) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  queries,
  recommendations,
  currentUser,
  onSelectQuery,
  onSelectRecommendation,
  onOpenSimulationModal
}) => {
  const topSlowQueries = [...queries].sort((a, b) => b.impactScore - a.impactScore);
  const topQuery = topSlowQueries[0];
  const pendingRecommendations = recommendations.filter(r => r.status === 'VALIDATED');
  const simulatedCount = recommendations.filter(r => r.simulation && r.simulation.status === 'COMPLETED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Alert Notification */}
      <div style={{
        background: 'var(--brand-primary-muted)',
        border: '1px solid var(--brand-primary-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            color: 'var(--danger-text)', 
            display: 'flex', 
            alignItems: 'center',
            background: '#FFFFFF',
            padding: 6,
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <AlertTriangle size={16} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, flexWrap: 'wrap' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Triage Attention: Top Slow Query Needs Review</strong>
            <span className="badge badge-danger" style={{ fontSize: 10, padding: '1px 6px', marginLeft: 4 }}>Impact Score {topQuery?.impactScore}</span>
            <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>
              {topQuery?.title} ({topQuery?.queryFingerprint?.substring(0,8)}) is causing {topQuery?.averageDurationMs}ms sequential scans.
            </span>
          </div>
        </div>

        <button 
          onClick={() => topQuery && onSelectQuery(topQuery.id)}
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap', padding: '5px 16px', fontSize: 12, borderRadius: 'var(--radius-sm)' }}
        >
          <span>Review Top Issue</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* 4 Summary Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>High-Impact Queries</span>
            <span className="badge badge-warning" style={{ padding: '2px 6px' }}>
              <AlertTriangle size={12} />
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }} className="tabular-nums">
            3
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Ranked by latency × frequency
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Pending DBA Approvals</span>
            <span className="badge badge-info" style={{ padding: '2px 6px' }}>
              <Clock size={12} />
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }} className="tabular-nums">
            {pendingRecommendations.length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Simulation-backed recommendations
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Validated Simulations</span>
            <span className="badge badge-success" style={{ padding: '2px 6px' }}>
              <CheckCircle2 size={12} />
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }} className="tabular-nums">
            {simulatedCount}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            HypoPG virtual index tested
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Simulated Potential Gain</span>
            <span className="badge badge-brand" style={{ padding: '2px 6px' }}>
              <TrendingDown size={12} />
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-primary-text)', letterSpacing: '-0.01em' }} className="tabular-nums">
            Up to 85%
          </div>
          <div style={{ fontSize: 11, color: 'var(--warning-text)', marginTop: 4 }}>
            * Planner-based simulated estimate
          </div>
        </div>
      </div>

      {/* Main 2-Column Content: Left 8 cols, Right 4 cols */}
      <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 'var(--space-6)' }}>
        {/* Left Column: Top Slow Queries Table */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Top Slow Query Workload
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Ingested telemetry ranked by estimated production impact
              </p>
            </div>
            <span className="badge badge-brand">
              <ShieldCheck size={12} />
              Masked Telemetry
            </span>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Query Fingerprint</th>
                  <th>Impact</th>
                  <th>Bottleneck</th>
                  <th>Latency</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {topSlowQueries.map((q) => (
                  <tr 
                    key={q.id} 
                    className="clickable"
                    onClick={() => onSelectQuery(q.id)}
                  >
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {q.title}
                        </span>
                        <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {q.queryFingerprint}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                          width: 44,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'var(--bg-subtle)',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${q.impactScore}%`,
                            height: '100%',
                            backgroundColor: q.impactScore > 80 ? 'var(--danger-text)' : q.impactScore > 50 ? 'var(--warning-text)' : 'var(--brand-primary-text)'
                          }} />
                        </div>
                        <span className="tabular-nums font-mono" style={{ fontSize: 12, fontWeight: 700 }}>
                          {q.impactScore}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        q.bottleneckType === 'LARGE_SEQ_SCAN' ? 'badge-danger' : 
                        q.bottleneckType === 'EXPENSIVE_SORT' ? 'badge-warning' : 
                        q.bottleneckType === 'REPEATED_INNER_LOOP' ? 'badge-info' : 'badge-neutral'
                      }`}>
                        {q.bottleneckType}
                      </span>
                    </td>
                    <td>
                      <span className="tabular-nums font-mono" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {q.averageDurationMs} ms
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-brand">
                        {q.analysisStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectQuery(q.id);
                        }}
                        className="btn btn-secondary" 
                        style={{ padding: '4px 9px', fontSize: 11 }}
                      >
                        Inspect
                        <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Pending Decisions + Privacy Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Pending DBA Approvals Queue */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                Pending DBA Queue
              </h3>
              <span className="badge badge-warning" style={{ fontSize: 10 }}>
                Human Approval Required
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingRecommendations.map((rec) => (
                <div 
                  key={rec.id}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {rec.title}
                    </span>
                    <span className="badge badge-brand font-mono" style={{ fontSize: 10 }}>
                      {rec.actionType}
                    </span>
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Est. Gain: <strong style={{ color: 'var(--brand-primary-text)' }}>70–85%</strong> • Risk: <strong style={{ color: 'var(--success-text)' }}>{rec.riskLevel}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <button
                      onClick={() => onSelectRecommendation(rec.id)}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '4px 8px', fontSize: 11 }}
                    >
                      Review & Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Health Assurance Card */}
          <div className="card" style={{ backgroundColor: 'var(--bg-surface-raised)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand-primary-text)' }}>
              <ShieldCheck size={18} />
              <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>Privacy Gateway Status</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 11, color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircle2 size={13} style={{ color: 'var(--success-text)' }} />
                <span>Zero raw rows or query results persisted</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircle2 size={13} style={{ color: 'var(--success-text)' }} />
                <span>Schema tokens hashed via HMAC-SHA256</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircle2 size={13} style={{ color: 'var(--success-text)' }} />
                <span>AST parser replaces all literals with :INT/:TEXT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircle2 size={13} style={{ color: 'var(--success-text)' }} />
                <span>Zero automatic production DDL execution</span>
              </div>
            </div>

            <div style={{ marginTop: 6, padding: '7px 10px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', fontSize: 11, color: 'var(--text-muted)' }}>
              Self-hosted local trust zone active.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
