import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  Play,
  TrendingDown
} from 'lucide-react';
import { Recommendation, QueryEvent } from '../types/queryguard';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
  queries: QueryEvent[];
  onSelectRecommendation: (recId: string) => void;
  onOpenSimulationModal: (rec: Recommendation) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  queries,
  onSelectRecommendation,
  onOpenSimulationModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = recommendations.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.maskedChangeTemplate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || r.actionType === actionFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesAction && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              Recommendations Queue
            </h1>
            <span className="badge badge-brand">
              {filtered.length} Generated Optimizations
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Evidence-backed composite indexes, constrained rewrites, and partition advisories pending human review.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 260, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search recommendations or change templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: 32 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Action:</span>
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} style={{ fontSize: 12 }}>
            <option value="ALL">All Actions</option>
            <option value="INDEX">Index</option>
            <option value="SQL_REWRITE">SQL Rewrite</option>
            <option value="PARTITION_ADVISORY">Partition Advisory</option>
            <option value="ABSTAIN">Abstain</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Status:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ fontSize: 12 }}>
            <option value="ALL">All Statuses</option>
            <option value="VALIDATED">Validated</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Recommendations Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Recommendation & Action</th>
              <th>Ranking Score</th>
              <th>Estimated Gain</th>
              <th>Risk</th>
              <th>Simulation Engine</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(rec => {
              const query = queries.find(q => q.id === rec.queryEventId);
              return (
                <tr 
                  key={rec.id} 
                  className="clickable"
                  onClick={() => onSelectRecommendation(rec.id)}
                >
                  <td style={{ maxWidth: 360 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: 13 }}>
                        {rec.title}
                      </strong>
                      <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Target: {query?.title || rec.queryEventId}
                      </span>
                      <code className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {rec.maskedChangeTemplate.split('\n')[0]}
                      </code>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="tabular-nums font-mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {rec.rankingScore.score.toFixed(2)}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ 1.0</span>
                    </div>
                  </td>

                  <td>
                    {rec.simulation ? (
                      <span className="badge badge-brand font-mono tabular-nums" style={{ fontSize: 11 }}>
                        {rec.simulation.estimatedImprovementPercentRange[0]}% – {rec.simulation.estimatedImprovementPercentRange[1]}%
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Not simulated</span>
                    )}
                  </td>

                  <td>
                    <span className={`badge ${rec.riskLevel === 'LOW' ? 'badge-success' : rec.riskLevel === 'MEDIUM' ? 'badge-warning' : 'badge-danger'}`}>
                      {rec.riskLevel}
                    </span>
                  </td>

                  <td>
                    <span className="badge badge-neutral font-mono" style={{ fontSize: 10 }}>
                      {rec.simulation?.simulationEngine || 'HypoPG Ready'}
                    </span>
                  </td>

                  <td>
                    <span className={`badge ${
                      rec.status === 'APPROVED' ? 'badge-success' :
                      rec.status === 'REJECTED' ? 'badge-danger' :
                      rec.status === 'VALIDATED' ? 'badge-warning' : 'badge-neutral'
                    }`}>
                      {rec.status}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                      {!rec.simulation && (
                        <button 
                          onClick={() => onOpenSimulationModal(rec)}
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: 11 }}
                          title="Run safe simulation"
                        >
                          <Play size={11} />
                          <span>Simulate</span>
                        </button>
                      )}
                      <button 
                        onClick={() => onSelectRecommendation(rec.id)}
                        className="btn btn-secondary" 
                        style={{ padding: '4px 8px', fontSize: 11 }}
                      >
                        Inspect
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
