import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAgent } from '../hooks/useAgents'
import { OverviewTab } from '../components/agent-tabs/OverviewTab'
import { SettingsTab } from '../components/agent-tabs/SettingsTab'
import { MemoryTab } from '../components/agent-tabs/MemoryTab'
import { SkillsTab } from '../components/agent-tabs/SkillsTab'
import { UsageTab } from '../components/agent-tabs/UsageTab'

const TABS = ['總覽', '設定', '記憶', '技能', '用量'] as const
type Tab = (typeof TABS)[number]

export default function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>()
  const navigate = useNavigate()
  const { data: agent, isLoading } = useAgent(agentId ?? '')
  const [activeTab, setActiveTab] = useState<Tab>('總覽')

  if (isLoading) return <div className="p-4 text-text-secondary">載入中…</div>
  if (!agent) return <div className="p-4 text-text-secondary">找不到這個 Agent</div>

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-10 bg-bg">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{agent.avatarIcon}</span>
            <h1 className="text-lg font-semibold">{agent.name}</h1>
          </div>
          <div className="flex items-center gap-4 text-text-secondary">
            <span>...</span>
            <button onClick={() => navigate('/')}>×</button>
          </div>
        </div>
        <nav className="flex gap-6 border-b border-divider px-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-sm ${
                activeTab === tab ? 'font-semibold text-text-primary' : 'text-text-secondary'
              }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand" />}
            </button>
          ))}
        </nav>
      </header>

      <main className="px-4 py-6">
        {activeTab === '總覽' && <OverviewTab agentId={agent.id} />}
        {activeTab === '設定' && <SettingsTab agent={agent} />}
        {activeTab === '記憶' && <MemoryTab agentId={agent.id} />}
        {activeTab === '技能' && <SkillsTab agentId={agent.id} />}
        {activeTab === '用量' && <UsageTab agentId={agent.id} />}
      </main>
    </div>
  )
}
