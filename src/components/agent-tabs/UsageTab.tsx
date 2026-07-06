import { useAgentUsageStats } from '../../hooks/useAgents'
import { formatTokens } from '../../lib/format'

/**
 * Usage is monitoring-only: there is no monthly limit, no credits, and
 * nothing here ever blocks an Agent from running (see docs/PRD.md section 10).
 */
export function UsageTab({ agentId }: { agentId: string }) {
  const { data: stats } = useAgentUsageStats(agentId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-card bg-surface p-4">
        <div>
          <div className="text-xs text-text-secondary">累計 Tokens</div>
          <div className="text-2xl font-bold">{formatTokens(stats?.tokensUsedTotal ?? 0)}</div>
        </div>
        <div>
          <div className="text-xs text-text-secondary">累計執行次數</div>
          <div className="text-2xl font-bold">{stats?.executionsCount ?? 0}</div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-card bg-surface p-4">
        <span className="text-sm text-text-secondary">過去 7 天平均消耗</span>
        <span className="text-sm font-medium">{formatTokens(stats?.last7DaysAvgTokens ?? 0)} tokens / 天</span>
      </div>

      <p className="text-xs text-text-secondary">
        本頁僅供參考，不設用量上限，也不會因用量而限制或中斷 Agent 執行。
      </p>
    </div>
  )
}
