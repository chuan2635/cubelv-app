import {
  mockAgentMemories,
  mockAgents,
  mockAgentSkills,
  mockCharts,
  mockExecutionLogs,
  mockFolders,
  mockNotes,
  mockTodos,
  mockUsageStats,
} from './data'
import type { Agent, AgentMemory, AgentSkill, ExecutionLog } from '../types'

/**
 * In-memory mutable copy of the mock dataset. Lets the UI run fully
 * interactively (create/update/trigger) with no backend. State resets on
 * page reload — that's expected until a real Supabase project is wired up.
 */

const folders = structuredClone(mockFolders)
const agents = structuredClone(mockAgents)
const agentMemories = structuredClone(mockAgentMemories)
const agentSkills = structuredClone(mockAgentSkills)
const usageStats = structuredClone(mockUsageStats)
const executionLogs = structuredClone(mockExecutionLogs)
const notes = structuredClone(mockNotes)
const charts = structuredClone(mockCharts)
const todos = structuredClone(mockTodos)

function id(): string {
  return crypto.randomUUID()
}

export const mockStore = {
  getFolders(): typeof folders {
    return folders
  },

  getAgents(folderId: string): Agent[] {
    return agents.filter((a) => a.folderId === folderId)
  },

  getAgent(agentId: string): Agent | undefined {
    return agents.find((a) => a.id === agentId)
  },

  createAgent(folderId: string, name: string): Agent {
    const now = new Date().toISOString()
    const agent: Agent = {
      id: id(),
      folderId,
      name,
      instructions: '',
      aiModel: 'Auto',
      maxRounds: 30,
      scheduleCron: [],
      scheduleEnabled: false,
      notificationsEnabled: true,
      avatarIcon: '🤖',
      statusLabel: '開置',
      createdAt: now,
      updatedAt: now,
    }
    agents.push(agent)
    agentMemories[agent.id] = { id: id(), agentId: agent.id, content: '', updatedAt: now }
    agentSkills[agent.id] = []
    usageStats[agent.id] = { agentId: agent.id, tokensUsedTotal: 0, executionsCount: 0, last7DaysAvgTokens: 0 }
    executionLogs[agent.id] = []
    return agent
  },

  updateAgent(agentId: string, patch: Partial<Agent>): Agent {
    const agent = agents.find((a) => a.id === agentId)
    if (!agent) throw new Error(`Agent not found: ${agentId}`)
    Object.assign(agent, patch, { updatedAt: new Date().toISOString() })
    return agent
  },

  getAgentMemory(agentId: string): AgentMemory | undefined {
    return agentMemories[agentId]
  },

  updateAgentMemory(agentId: string, content: string): AgentMemory {
    const memory = agentMemories[agentId]
    const now = new Date().toISOString()
    if (memory) {
      memory.content = content
      memory.updatedAt = now
      return memory
    }
    const created = { id: id(), agentId, content, updatedAt: now }
    agentMemories[agentId] = created
    return created
  },

  getAgentSkills(agentId: string): AgentSkill[] {
    return agentSkills[agentId] ?? []
  },

  updateAgentSkill(agentId: string, skillId: string, enabled: boolean): AgentSkill {
    const skill = (agentSkills[agentId] ?? []).find((s) => s.id === skillId)
    if (!skill) throw new Error(`Skill not found: ${skillId}`)
    skill.enabled = enabled
    return skill
  },

  getUsageStats(agentId: string) {
    return usageStats[agentId]
  },

  getExecutionLogs(agentId: string): ExecutionLog[] {
    return [...(executionLogs[agentId] ?? [])].sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
  },

  appendExecutionLog(agentId: string, log: ExecutionLog): void {
    if (!executionLogs[agentId]) executionLogs[agentId] = []
    executionLogs[agentId].push(log)
    const stats = usageStats[agentId]
    if (stats) {
      stats.tokensUsedTotal += log.tokensUsed
      stats.executionsCount += 1
    }
  },

  getNotes(folderId: string) {
    return notes.filter((n) => n.folderId === folderId)
  },

  getNote(noteId: string) {
    return notes.find((n) => n.id === noteId)
  },

  getCharts(folderId: string) {
    return charts.filter((c) => c.folderId === folderId)
  },

  getChart(chartId: string) {
    return charts.find((c) => c.id === chartId)
  },

  getTodos(folderId: string) {
    return todos.filter((t) => t.folderId === folderId)
  },

  newId: id,
}
