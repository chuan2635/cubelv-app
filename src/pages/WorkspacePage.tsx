import { useNavigate } from 'react-router-dom'
import { useAgents, useFolders } from '../hooks/useAgents'
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

export default function WorkspacePage() {
  const { data: folders } = useFolders()
  const folder = folders?.[0]
  const { data: agents } = useAgents(folder?.id ?? '')
  const signOut = useAuthStore((s) => s.signOut)
  const userEmail = useAuthStore((s) => s.userEmail)

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

        <button className="col-span-2 rounded-card border border-dashed border-divider py-6 text-sm text-text-secondary">
          ＋ 新增員工
        </button>
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
