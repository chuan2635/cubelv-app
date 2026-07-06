import type { ExecutionStatus } from '../types'

const LABELS: Record<ExecutionStatus, string> = {
  success: '成功',
  cancelled: '已取消',
  failed: '失敗',
  running: '執行中',
}

const COLORS: Record<ExecutionStatus, string> = {
  success: 'bg-success/20 text-success',
  cancelled: 'bg-cancelled/20 text-cancelled',
  failed: 'bg-red-500/20 text-red-400',
  running: 'bg-brand/20 text-brand',
}

export function StatusBadge({ status }: { status: ExecutionStatus }) {
  const icon = status === 'success' ? '✅' : status === 'cancelled' ? '⬜' : status === 'failed' ? '❌' : '⏳'
  return (
    <span className={`inline-flex items-center gap-1 rounded-badge px-2 py-0.5 text-xs font-medium ${COLORS[status]}`}>
      {icon} {LABELS[status]}
    </span>
  )
}
