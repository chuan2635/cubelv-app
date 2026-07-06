import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as repo from '../lib/repository'
import type { Agent } from '../types'

export function useFolders() {
  return useQuery({ queryKey: ['folders'], queryFn: repo.listFolders })
}

export function useAgents(folderId: string) {
  return useQuery({ queryKey: ['agents', folderId], queryFn: () => repo.listAgents(folderId) })
}

export function useAgent(agentId: string) {
  return useQuery({ queryKey: ['agent', agentId], queryFn: () => repo.getAgent(agentId) })
}

export function useCreateAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) => repo.createAgent(folderId, name),
    onSuccess: (agent) => {
      queryClient.invalidateQueries({ queryKey: ['agents', agent.folderId] })
    },
  })
}

export function useUpdateAgent(agentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<Agent>) => repo.updateAgent(agentId, patch),
    onSuccess: (agent) => {
      queryClient.setQueryData(['agent', agentId], agent)
    },
  })
}

export function useAgentMemory(agentId: string) {
  return useQuery({ queryKey: ['agent-memory', agentId], queryFn: () => repo.getAgentMemory(agentId) })
}

export function useUpdateAgentMemory(agentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => repo.updateAgentMemory(agentId, content),
    onSuccess: (memory) => {
      queryClient.setQueryData(['agent-memory', agentId], memory)
    },
  })
}

export function useAgentSkills(agentId: string) {
  return useQuery({ queryKey: ['agent-skills', agentId], queryFn: () => repo.listAgentSkills(agentId) })
}

export function useUpdateAgentSkill(agentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ skillId, enabled }: { skillId: string; enabled: boolean }) =>
      repo.updateAgentSkill(agentId, skillId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-skills', agentId] })
    },
  })
}

export function useAgentUsageStats(agentId: string) {
  return useQuery({ queryKey: ['agent-usage', agentId], queryFn: () => repo.getAgentUsageStats(agentId) })
}

export function useExecutionLogs(agentId: string) {
  return useQuery({ queryKey: ['execution-logs', agentId], queryFn: () => repo.listExecutionLogs(agentId) })
}

export function useTriggerAgentRun(agentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => repo.triggerAgentRun(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['execution-logs', agentId] })
      queryClient.invalidateQueries({ queryKey: ['agent-usage', agentId] })
    },
  })
}
