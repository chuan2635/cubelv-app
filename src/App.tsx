import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import WorkspacePage from './pages/WorkspacePage'
import AgentDetailPage from './pages/AgentDetailPage'
import NotePage from './pages/NotePage'
import ChartPage from './pages/ChartPage'

export default function App() {
  const { userEmail, isLoading, init } = useAuthStore()

  useEffect(() => {
    init()
  }, [init])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-text-secondary">載入中…</div>
  }

  if (!userEmail) {
    return <LoginPage />
  }

  return (
    <Routes>
      <Route path="/" element={<WorkspacePage />} />
      <Route path="/agents/:agentId" element={<AgentDetailPage />} />
      <Route path="/notes/:noteId" element={<NotePage />} />
      <Route path="/charts/:chartId" element={<ChartPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
