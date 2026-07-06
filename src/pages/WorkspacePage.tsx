import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgents, useCreateAgent, useFolders } from '../hooks/useAgents'
import { useAuthStore } from '../store/authStore'

function AgentCard({ id, name, statusLabel, avatarIcon }: { id: string; name: string; statusLabel: string; avatarIcon: string }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(`/agents/${id}`)}
      className="flex flex-col items-start gap-3 rounded-card bg-surface p-4 text-left transition hover:bg-divider"
    >
      <span className="text-2xl">{avatarIcon}</span>
      <span className="text-lg font-semibold">{name}</span>
      <span className="rounded-badge bg-divider px-2 py-0.5 text-xs text-text-secondary">{statusLabel}</span>
    </button>
  )
}

function NewAgentForm({ folderId, onDone }: { folderId: string; onDone: (agentId: string) => void }) {
  const [name, setName] = useState('')
  const createAgent = useCreateAgent()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const agent = await createAgent.mutateAsync({ folderId, name: name.trim() })
    onDone(agent.id)
  }

  return (
    <form onSubmit={handleSubmit} className="col-span-2 flex gap-2 rounded-card border border-divider bg-surface p-3">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="新員工名稱"
        className="flex-1 rounded-badge bg-bg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand"
      />
      <button
        type="submit"
        disabled={createAgent.isPending}
        className="rounded-badge bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        建立
      </button>
    </form>
  )
}

export default function WorkspacePage() {
  const { data: folders } = useFolders()
  const folder = folders?.[0]
  const { data: agents } = useAgents(folder?.id ?? '')
  const signOut = useAuthStore((s) => s.signOut)
  const userEmail = useAuthStore((s) => s.userEmail)
  const navigate = useNavigate()
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">☰</span>
          <h1 className="text-lg font-semibold">{folder?.name ?? '投資研究部'}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <span>{userEmail}</span>
          <button onClick={() => signOut()} className="text-link">
            登出
          </button>
        </div>
      </header>

      <main className="grid grid-cols-2 gap-3 px-4">
        {agents?.map((agent) => (
          <AgentCard key={agent.id} id={agent.id} name={agent.name} statusLabel={agent.statusLabel} avatarIcon={agent.avatarIcon} />
        ))}

        {isAdding && folder ? (
          <NewAgentForm folderId={folder.id} onDone={(agentId) => navigate(`/agents/${agentId}`)} />
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="col-span-2 rounded-card border border-dashed border-divider py-6 text-sm text-text-secondary"
          >
            ＋ 新增員工
          </button>
        )}
      </main>

      <button
        aria-label="快速操作"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-bg shadow-lg"
      >
        ⬡
      </button>
    </div>
  )
}
