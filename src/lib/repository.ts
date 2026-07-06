import { isSupabaseConfigured, supabase } from './supabase'
import { mockStore } from '../mock/store'
import type {
  Agent,
  AgentMemory,
  AgentSkill,
  AgentUsageStats,
  Chart,
  ExecutionLog,
  Folder,
  Note,
  Todo,
} from '../types'

/**
 * Data access layer. Falls back to the in-memory mock store until a real
 * Supabase project is configured (see .env.example) — swap each branch below
 * for a `supabase.from(...)` query without touching call sites in hooks/*.
 */

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 150))
}

export async function listFolders(): Promise<Folder[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('folders').select('*')
    if (error) throw error
    return data as Folder[]
  }
  return delay(mockStore.getFolders())
}

export async function listAgents(folderId: string): Promise<Agent[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agents').select('*').eq('folder_id', folderId)
    if (error) throw error
    return data as Agent[]
  }
  return delay(mockStore.getAgents(folderId))
}

export async function getAgent(agentId: string): Promise<Agent | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agents').select('*').eq('id', agentId).single()
    if (error) throw error
    return data as Agent
  }
  return delay(mockStore.getAgent(agentId))
}

export async function createAgent(folderId: string, name: string): Promise<Agent> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agents').insert({ folder_id: folderId, name }).select().single()
    if (error) throw error
    return data as Agent
  }
  return delay(mockStore.createAgent(folderId, name))
}

export async function updateAgent(agentId: string, patch: Partial<Agent>): Promise<Agent> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agents').update(patch).eq('id', agentId).select().single()
    if (error) throw error
    return data as Agent
  }
  return delay(mockStore.updateAgent(agentId, patch))
}

export async function getAgentMemory(agentId: string): Promise<AgentMemory | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agent_memories').select('*').eq('agent_id', agentId).single()
    if (error) throw error
    return data as AgentMemory
  }
  return delay(mockStore.getAgentMemory(agentId))
}

export async function updateAgentMemory(agentId: string, content: string): Promise<AgentMemory> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('agent_memories')
      .upsert({ agent_id: agentId, content, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return data as AgentMemory
  }
  return delay(mockStore.updateAgentMemory(agentId, content))
}

export async function listAgentSkills(agentId: string): Promise<AgentSkill[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agent_skills').select('*').eq('agent_id', agentId)
    if (error) throw error
    return data as AgentSkill[]
  }
  return delay(mockStore.getAgentSkills(agentId))
}

export async function updateAgentSkill(agentId: string, skillId: string, enabled: boolean): Promise<AgentSkill> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agent_skills').update({ enabled }).eq('id', skillId).select().single()
    if (error) throw error
    return data as AgentSkill
  }
  return delay(mockStore.updateAgentSkill(agentId, skillId, enabled))
}

/** Monitoring-only usage stats — no limits, no billing (see docs/PRD.md section 10). */
export async function getAgentUsageStats(agentId: string): Promise<AgentUsageStats | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agent_usage_stats').select('*').eq('agent_id', agentId).single()
    if (error) throw error
    return data as AgentUsageStats
  }
  return delay(mockStore.getUsageStats(agentId))
}

export async function listExecutionLogs(agentId: string): Promise<ExecutionLog[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('execution_logs')
      .select('*')
      .eq('agent_id', agentId)
      .order('started_at', { ascending: false })
    if (error) throw error
    return data as ExecutionLog[]
  }
  return delay(mockStore.getExecutionLogs(agentId))
}

export async function listNotes(folderId: string): Promise<Note[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('notes').select('*').eq('folder_id', folderId)
    if (error) throw error
    return data as Note[]
  }
  return delay(mockStore.getNotes(folderId))
}

export async function getNote(noteId: string): Promise<Note | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('notes').select('*').eq('id', noteId).single()
    if (error) throw error
    return data as Note
  }
  return delay(mockStore.getNote(noteId))
}

export async function listCharts(folderId: string): Promise<Chart[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('charts').select('*').eq('folder_id', folderId)
    if (error) throw error
    return data as Chart[]
  }
  return delay(mockStore.getCharts(folderId))
}

export async function getChart(chartId: string): Promise<Chart | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('charts').select('*').eq('id', chartId).single()
    if (error) throw error
    return data as Chart
  }
  return delay(mockStore.getChart(chartId))
}

export async function listTodos(folderId: string): Promise<Todo[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('todos').select('*').eq('folder_id', folderId)
    if (error) throw error
    return data as Todo[]
  }
  return delay(mockStore.getTodos(folderId))
}

/**
 * Manually trigger an Agent run. No budget/credit checks — every logged-in
 * user can run any Agent as many times as they want.
 */
export async function triggerAgentRun(agentId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.functions.invoke('run-agent', { body: { agentId } })
    if (error) throw error
    return
  }
  // No backend configured: simulate a quick successful run so the UI's
  // execution log and usage stats behave the same as the real thing.
  const startedAt = new Date()
  await delay(undefined)
  const durationSeconds = 3 + Math.floor(Math.random() * 8)
  const tokensUsed = 20_000 + Math.floor(Math.random() * 200_000)
  mockStore.appendExecutionLog(agentId, {
    id: mockStore.newId(),
    agentId,
    triggeredBy: '手動',
    status: 'success',
    durationSeconds,
    tokensUsed,
    startedAt: startedAt.toISOString(),
    endedAt: new Date(startedAt.getTime() + durationSeconds * 1000).toISOString(),
  })
}
