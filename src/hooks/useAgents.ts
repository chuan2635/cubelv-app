import { useQuery } from '@tanstack/react-query'
import * as repo from '../lib/repository'

export function useFolders() {
  return useQuery({ queryKey: ['folders'], queryFn: repo.listFolders })
}

export function useAgents(folderId: string) {
  return useQuery({ queryKey: ['agents', folderId], queryFn: () => repo.listAgents(folderId) })
}

export function useAgent(agentId: string) {
  return useQuery({ queryKey: ['agent', agentId], queryFn: () => repo.getAgent(agentId) })
}

export function useAgentMemory(agentId: string) {
  return useQuery({ queryKey: ['agent-memory', agentId], queryFn: () => repo.getAgentMemory(agentId) })
}

export function useAgentSkills(agentId: string) {
  return useQuery({ queryKey: ['agent-skills', agentId], queryFn: () => repo.listAgentSkills(agentId) })
}

export function useAgentUsageStats(agentId: string) {
  return useQuery({ queryKey: ['agent-usage', agentId], queryFn: () => repo.getAgentUsageStats(agentId) })
}

export function useExecutionLogs(agentId: string) {
  return useQuery({ queryKey: ['execution-logs', agentId], queryFn: () => repo.listExecutionLogs(agentId) })
}
