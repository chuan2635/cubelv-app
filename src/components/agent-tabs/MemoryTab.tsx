import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAgentMemory, useUpdateAgentMemory } from '../../hooks/useAgents'

export function MemoryTab({ agentId }: { agentId: string }) {
  const { data: memory, isLoading } = useAgentMemory(agentId)
  const updateMemory = useUpdateAgentMemory(agentId)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (memory) setDraft(memory.content)
  }, [memory])

  if (isLoading) return <p className="text-text-secondary">載入中…</p>
  if (!memory) return <p className="text-text-secondary">尚無長期記憶</p>

  function handleSave() {
    updateMemory.mutate(draft, { onSuccess: () => setIsEditing(false) })
  }

  if (isEditing) {
    return (
      <div className="space-y-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={16}
          className="w-full rounded-card border border-divider bg-surface p-4 font-mono text-sm outline-none focus:border-brand"
        />
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={updateMemory.isPending}
            className="rounded-card bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            儲存記憶
          </button>
          <button
            onClick={() => {
              setDraft(memory.content)
              setIsEditing(false)
            }}
            className="rounded-card border border-divider px-5 py-2.5 text-sm text-text-secondary"
          >
            取消
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="prose prose-invert prose-sm max-w-none rounded-card bg-surface p-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{memory.content}</ReactMarkdown>
      </div>
      <button onClick={() => setIsEditing(true)} className="text-sm text-link">
        編輯記憶
      </button>
    </div>
  )
}
