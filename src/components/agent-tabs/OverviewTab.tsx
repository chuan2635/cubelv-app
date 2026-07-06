import { useExecutionLogs } from '../../hooks/useAgents'
import { formatDuration, formatLogDate, formatTokens } from '../../lib/format'
import { StatusBadge } from '../StatusBadge'

function average(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

export function OverviewTab({ agentId }: { agentId: string }) {
  const { data: logs = [] } = useExecutionLogs(agentId)

  const avgTokens = average(logs.map((l) => l.tokensUsed))
  const avgDuration = average(logs.map((l) => l.durationSeconds))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="執行次數" sub="累計" value={`${logs.length}`} />
        <StatCard label="平均 Tokens" sub="每次執行" value={formatTokens(avgTokens)} />
        <StatCard label="平均執行時長" sub="每次執行" value={formatDuration(Math.round(avgDuration))} />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-text-secondary">執行紀錄</h3>
        <div className="overflow-hidden rounded-card border border-divider">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-text-secondary">
              <tr>
                <th className="px-3 py-2 font-medium">日期</th>
                <th className="px-3 py-2 font-medium">觸發原因</th>
                <th className="px-3 py-2 font-medium">狀態</th>
                <th className="px-3 py-2 font-medium">時長</th>
                <th className="px-3 py-2 font-medium">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-divider">
                  <td className="px-3 py-2">{formatLogDate(log.startedAt)}</td>
                  <td className="px-3 py-2">{log.triggeredBy}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-3 py-2">{formatDuration(log.durationSeconds)}</td>
                  <td className="px-3 py-2">{formatTokens(log.tokensUsed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, sub, value }: { label: string; sub: string; value: string }) {
  return (
    <div className="rounded-card bg-surface p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-text-secondary">{label}</div>
      <div className="text-xs text-text-secondary">{sub}</div>
    </div>
  )
}
