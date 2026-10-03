import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  Clock,
  Layers,
  Database
} from 'lucide-react';
import { QueryEvent, BottleneckType } from '../types/queryguard';

interface SlowQueriesViewProps {
  queries: QueryEvent[];
  onSelectQuery: (queryId: string) => void;
}

export const SlowQueriesView: React.FC<SlowQueriesViewProps> = ({ 
  queries, 
  onSelectQuery 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bottleneckFilter, setBottleneckFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredQueries = queries.filter(q => {
    const matchesSearch = 
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.queryFingerprint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.maskedQueryTemplate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBottleneck = bottleneckFilter === 'ALL' || q.bottleneckType === bottleneckFilter;
    const matchesStatus = statusFilter === 'ALL' || q.analysisStatus === statusFilter;

    return matchesSearch && matchesBottleneck && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* View Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              Slow Queries Catalog
            </h1>
            <span className="badge badge-brand">
              {filteredQueries.length} of {queries.length} Queries
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Aggregated telemetry from pg_stat_statements & EXPLAIN plans with masked literals and HMAC tokens.
          </p>
        </div>

        {/* Impact formula callout */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 12px',
          fontSize: 11,
          color: 'var(--text-muted)'
        }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Ranking Model: </strong>
          Impact = normalized(latency × frequency × planner_cost)
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 260, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by query title, fingerprint, or token (e.g. TBL_SALES)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: 32 }}
          />
        </div>

        {/* Bottleneck filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bottleneck:</span>
          <select 
            value={bottleneckFilter} 
            onChange={(e) => setBottleneckFilter(e.target.value)}
            style={{ fontSize: 12 }}
          >
            <option value="ALL">All Bottlenecks</option>
            <option value="LARGE_SEQ_SCAN">LARGE_SEQ_SCAN</option>
            <option value="REPEATED_INNER_LOOP">REPEATED_INNER_LOOP</option>
            <option value="EXPENSIVE_SORT">EXPENSIVE_SORT</option>
            <option value="INSUFFICIENT_EVIDENCE">INSUFFICIENT_EVIDENCE</option>
          </select>
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Status:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ fontSize: 12 }}
          >
            <option value="ALL">All Statuses</option>
            <option value="SIMULATED">Simulated</option>
            <option value="ANALYZED">Analyzed</option>
            <option value="ABSTAINED">Abstained</option>
          </select>
        </div>

        {(searchTerm || bottleneckFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setBottleneckFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="btn btn-ghost"
            style={{ fontSize: 11, padding: '4px 8px' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Query Fingerprint & Title</th>
              <th>Impact Score</th>
              <th>Dominant Bottleneck</th>
              <th>Plan Depth</th>
              <th>Duration & Calls</th>
              <th>Analysis Status</th>
              <th>Observed</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueries.map((query) => (
              <tr 
                key={query.id} 
                className="clickable"
                onClick={() => onSelectQuery(query.id)}
              >
                <td style={{ maxWidth: 320 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {query.title}
                    </span>
                    <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {query.queryFingerprint}
                    </span>
                    <span className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {query.maskedQueryTemplate.split('\n')[0]}
                    </span>
                  </div>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 50,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'var(--bg-subtle)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${query.impactScore}%`,
                        height: '100%',
                        backgroundColor: query.impactScore > 80 ? 'var(--danger)' : query.impactScore > 50 ? 'var(--warning)' : 'var(--brand-primary)'
                      }} />
                    </div>
                    <span className="tabular-nums font-mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {query.impactScore}
                    </span>
                  </div>
                </td>

                <td>
                  <span className={`badge ${
                    query.bottleneckType === 'LARGE_SEQ_SCAN' ? 'badge-danger' : 
                    query.bottleneckType === 'EXPENSIVE_SORT' ? 'badge-warning' : 
                    query.bottleneckType === 'REPEATED_INNER_LOOP' ? 'badge-info' : 'badge-neutral'
                  }`}>
                    {query.bottleneckType}
                  </span>
                </td>

                <td>
                  <span className="badge badge-neutral" style={{ fontSize: 11 }}>
                    {query.planGraph.nodes.length} nodes • Depth {query.planGraph.planDepth}
                  </span>
                </td>

                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="tabular-nums font-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {query.averageDurationMs} ms
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {query.callsPerMin} calls/min
                    </span>
                  </div>
                </td>

                <td>
                  <span className={`badge ${
                    query.analysisStatus === 'SIMULATED' ? 'badge-brand' :
                    query.analysisStatus === 'ABSTAINED' ? 'badge-neutral' : 'badge-info'
                  }`}>
                    {query.analysisStatus}
                  </span>
                </td>

                <td>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {query.observedAt}
                  </span>
                </td>

                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectQuery(query.id);
                    }}
                    className="btn btn-secondary" 
                    style={{ padding: '5px 10px', fontSize: 11 }}
                  >
                    <span>View Detail</span>
                    <ChevronRight size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
