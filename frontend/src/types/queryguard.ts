export type UserRole = 'DBA' | 'ENGINEER' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export type DataSourceMode = 'DEMO' | 'CONNECTED_POSTGRES';
export type ConnectionStatus = 'CONNECTED' | 'ERROR' | 'DISCONNECTED';

export interface DataSource {
  id: string;
  name: string;
  mode: DataSourceMode;
  connectionStatus: ConnectionStatus;
  privacyConfigVersion: string;
  endpoint?: string;
  lastSyncAt: string;
}

export type BottleneckType = 
  | 'LARGE_SEQ_SCAN'
  | 'REPEATED_INNER_LOOP'
  | 'EXPENSIVE_SORT'
  | 'CARDINALITY_MISMATCH'
  | 'TIME_RANGE_REPETITION'
  | 'INSUFFICIENT_EVIDENCE';

export type AnalysisStatus = 'NEW' | 'ANALYZED' | 'SIMULATED' | 'APPROVED' | 'REJECTED' | 'ABSTAINED';
export type PrivacyStatus = 'VERIFIED_MASKED' | 'BLOCKED' | 'ERROR';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface PlanNodeData {
  id: string;
  parentId?: string;
  operatorType: 'SEQ_SCAN' | 'INDEX_SCAN' | 'INDEX_ONLY_SCAN' | 'NESTED_LOOP' | 'HASH_JOIN' | 'SORT' | 'AGGREGATE';
  relationToken?: string;
  indexToken?: string;
  joinType?: 'INNER' | 'LEFT' | 'RIGHT';
  estimatedCost: number;
  estimatedRowsBucket: string;
  actualRowsBucket?: string;
  actualTimeMsBucket?: string;
  loopsBucket?: string;
  scanType?: string;
  filterColumns?: string[];
  sortColumns?: string[];
  isCritical: boolean;
  depth: number;
  notes?: string;
}

export interface PlanGraphData {
  id: string;
  queryEventId: string;
  planCost: number;
  planDepth: number;
  nodeCount: number;
  nodes: PlanNodeData[];
}

export type RecommendationActionType = 
  | 'INDEX'
  | 'SQL_REWRITE'
  | 'PARTITION_ADVISORY'
  | 'STATS_ADVISORY'
  | 'ABSTAIN';

export type RecommendationStatus = 
  | 'DRAFT'
  | 'SIMULATING'
  | 'VALIDATED'
  | 'REJECTED_BY_SAFETY'
  | 'APPROVED'
  | 'REJECTED'
  | 'DEFERRED';

export interface RankingScoreBreakdown {
  score: number; // Formula: 0.45*readBenefit - 0.20*writePenalty - 0.15*storagePenalty - 0.20*operationalRisk
  readBenefit: number;
  writePenalty: number;
  storagePenalty: number;
  operationalRisk: number;
}

export interface EvidencePacket {
  version: string;
  bottleneckType: string;
  affectedPlanNodes: string[];
  reasonCodes: string[];
  observedEvidence: {
    scanType?: string;
    loopCountBucket?: string;
    relationSizeBucket?: string;
    cardinalityMismatchRatio?: number;
    sortSpillDetected?: boolean;
  };
  recommendedAction: string;
  maskedChangeTemplate: string;
  alternativesConsidered: Array<{
    action: string;
    rank: number;
    reasonLowerRank: string;
  }>;
  simulationSummary?: {
    status: string;
    label: string;
    improvementRangePercent: [number, number];
  };
  confidence: ConfidenceLevel;
  riskLevel: RiskLevel;
  limitations: string[];
  privacyStatus: string;
}

export interface SimulationResult {
  id: string;
  recommendationId: string;
  simulationEngine: 'HYPOPG' | 'EXPLAIN' | 'RULE_ESTIMATOR';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'UNSUPPORTED' | 'FAILED';
  baseline: {
    plannerCost: number;
    dominantOperations: string[];
    executionTimeEstimateMs: number;
  };
  candidate: {
    plannerCost: number;
    dominantOperations: string[];
    executionTimeEstimateMs: number;
  };
  estimatedImprovementPercentRange: [number, number];
  estimatedWriteOverheadMsRange: [number, number];
  estimatedStorageOverheadGbRange: [number, number];
  confidence: ConfidenceLevel;
  limitations: string[];
  runAt: string;
}

export interface Recommendation {
  id: string;
  queryEventId: string;
  actionType: RecommendationActionType;
  title: string;
  maskedChangeTemplate: string;
  status: RecommendationStatus;
  confidence: ConfidenceLevel;
  riskLevel: RiskLevel;
  rankingScore: RankingScoreBreakdown;
  evidence: EvidencePacket;
  simulation?: SimulationResult;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  rejectionReason?: string;
}

export interface QueryEvent {
  id: string;
  queryFingerprint: string;
  title: string;
  maskedQueryTemplate: string;
  latencyMsBucket: string;
  averageDurationMs: number;
  frequencyBucket: string;
  callsPerMin: number;
  impactScore: number;
  bottleneckType: BottleneckType;
  analysisStatus: AnalysisStatus;
  privacyStatus: PrivacyStatus;
  observedAt: string;
  planGraph: PlanGraphData;
  recommendations: Recommendation[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  eventType: 'INGESTED' | 'MASKED' | 'ANALYZED' | 'SIMULATED' | 'APPROVED' | 'REJECTED' | 'PRIVACY_BLOCKED' | 'SETTINGS_CHANGED';
  entityType: 'QUERY' | 'RECOMMENDATION' | 'SIMULATION' | 'PRIVACY_GATEWAY';
  entityId: string;
  description: string;
  metadataJson: Record<string, any>;
  privacyStatus: PrivacyStatus;
}
