import { useQuery } from '@tanstack/react-query'
import * as repo from '../lib/repository'

export function useNotes(folderId: string) {
  return useQuery({ queryKey: ['notes', folderId], queryFn: () => repo.listNotes(folderId) })
}

export function useNote(noteId: string) {
  return useQuery({ queryKey: ['note', noteId], queryFn: () => repo.getNote(noteId) })
}

export function useCharts(folderId: string) {
  return useQuery({ queryKey: ['charts', folderId], queryFn: () => repo.listCharts(folderId) })
}

export function useChart(chartId: string) {
  return useQuery({ queryKey: ['chart', chartId], queryFn: () => repo.getChart(chartId) })
}

export function useTodos(folderId: string) {
  return useQuery({ queryKey: ['todos', folderId], queryFn: () => repo.listTodos(folderId) })
}
