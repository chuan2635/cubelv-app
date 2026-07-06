export type ExecutionStatus = 'success' | 'cancelled' | 'failed' | 'running'
export type TriggeredBy = '手動' | 'chat' | '排程'

export interface Folder {
  id: string
  name: string
  type: 'workspace' | 'department'
  ownerId: string
  createdAt: string
}

export interface Agent {
  id: string
  folderId: string
  name: string
  instructions: string
  aiModel: string
  maxRounds: number
  scheduleCron: string[]
  scheduleEnabled: boolean
  notificationsEnabled: boolean
  avatarIcon: string
  statusLabel: string
  createdAt: string
  updatedAt: string
}

export interface AgentMemory {
  id: string
  agentId: string
  content: string
  updatedAt: string
}

export interface AgentSkill {
  id: string
  agentId: string
  skillType: string
  label: string
  enabled: boolean
  config: Record<string, unknown>
}

/** Monitoring-only usage stats. No limits, no billing — see docs/PRD.md section 10. */
export interface AgentUsageStats {
  agentId: string
  tokensUsedTotal: number
  executionsCount: number
  last7DaysAvgTokens: number
}

export interface ExecutionLog {
  id: string
  agentId: string
  triggeredBy: TriggeredBy
  status: ExecutionStatus
  durationSeconds: number
  tokensUsed: number
  startedAt: string
  endedAt: string | null
}

export interface Note {
  id: string
  folderId: string
  title: string
  content: string
  createdByAgentId: string | null
  createdAt: string
}

export interface Todo {
  id: string
  folderId: string
  title: string
  completed: boolean
  parentId: string | null
  assignedToAgentId: string | null
  dueAt: string | null
  createdAt: string
}

export interface ChartDataPoint {
  label: string
  [seriesKey: string]: string | number
}

export interface Chart {
  id: string
  folderId: string
  title: string
  chartType: 'line' | 'bar'
  series: string[]
  data: ChartDataPoint[]
  createdByAgentId: string | null
  createdAt: string
}
