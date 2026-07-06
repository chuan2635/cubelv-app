import { isSupabaseConfigured, supabase } from './supabase'
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
} from '../mock/data'
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
 * Data access layer. Falls back to the in-memory mock dataset until a real
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
  return delay(mockFolders)
}

export async function listAgents(folderId: string): Promise<Agent[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agents').select('*').eq('folder_id', folderId)
    if (error) throw error
    return data as Agent[]
  }
  return delay(mockAgents.filter((a) => a.folderId === folderId))
}

export async function getAgent(agentId: string): Promise<Agent | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agents').select('*').eq('id', agentId).single()
    if (error) throw error
    return data as Agent
  }
  return delay(mockAgents.find((a) => a.id === agentId))
}

export async function getAgentMemory(agentId: string): Promise<AgentMemory | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agent_memories').select('*').eq('agent_id', agentId).single()
    if (error) throw error
    return data as AgentMemory
  }
  return delay(mockAgentMemories[agentId])
}

export async function listAgentSkills(agentId: string): Promise<AgentSkill[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agent_skills').select('*').eq('agent_id', agentId)
    if (error) throw error
    return data as AgentSkill[]
  }
  return delay(mockAgentSkills[agentId] ?? [])
}

/** Monitoring-only usage stats — no limits, no billing (see docs/PRD.md section 10). */
export async function getAgentUsageStats(agentId: string): Promise<AgentUsageStats | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('agent_usage_stats').select('*').eq('agent_id', agentId).single()
    if (error) throw error
    return data as AgentUsageStats
  }
  return delay(mockUsageStats[agentId])
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
  return delay(mockExecutionLogs[agentId] ?? [])
}

export async function listNotes(folderId: string): Promise<Note[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('notes').select('*').eq('folder_id', folderId)
    if (error) throw error
    return data as Note[]
  }
  return delay(mockNotes.filter((n) => n.folderId === folderId))
}

export async function getNote(noteId: string): Promise<Note | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('notes').select('*').eq('id', noteId).single()
    if (error) throw error
    return data as Note
  }
  return delay(mockNotes.find((n) => n.id === noteId))
}

export async function listCharts(folderId: string): Promise<Chart[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('charts').select('*').eq('folder_id', folderId)
    if (error) throw error
    return data as Chart[]
  }
  return delay(mockCharts.filter((c) => c.folderId === folderId))
}

export async function getChart(chartId: string): Promise<Chart | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('charts').select('*').eq('id', chartId).single()
    if (error) throw error
    return data as Chart
  }
  return delay(mockCharts.find((c) => c.id === chartId))
}

export async function listTodos(folderId: string): Promise<Todo[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('todos').select('*').eq('folder_id', folderId)
    if (error) throw error
    return data as Todo[]
  }
  return delay(mockTodos.filter((t) => t.folderId === folderId))
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
  await delay(undefined)
}
