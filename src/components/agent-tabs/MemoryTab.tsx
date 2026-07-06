import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAgentMemory } from '../../hooks/useAgents'

export function MemoryTab({ agentId }: { agentId: string }) {
  const { data: memory, isLoading } = useAgentMemory(agentId)

  if (isLoading) return <p className="text-text-secondary">載入中…</p>
  if (!memory) return <p className="text-text-secondary">尚無長期記憶</p>

  return (
    <div className="prose prose-invert prose-sm max-w-none rounded-card bg-surface p-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{memory.content}</ReactMarkdown>
    </div>
  )
}
