import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNavigate, useParams } from 'react-router-dom'
import { useNote } from '../hooks/useContent'

export default function NotePage() {
  const { noteId } = useParams<{ noteId: string }>()
  const navigate = useNavigate()
  const { data: note, isLoading } = useNote(noteId ?? '')

  if (isLoading) return <div className="p-4 text-text-secondary">載入中…</div>
  if (!note) return <div className="p-4 text-text-secondary">找不到這篇筆記</div>

  return (
    <div className="min-h-screen pb-12">
      <header className="flex items-center justify-between px-4 py-4">
        <button onClick={() => navigate(-1)} className="text-sm text-link">
          {'< 返回'}
        </button>
        <div className="flex items-center gap-4 text-text-secondary">
          <span>↺</span>
          <span>☆</span>
          <span>...</span>
        </div>
      </header>
      <main className="prose prose-invert prose-sm max-w-none px-4">
        <h1 className="mb-4 text-xl font-semibold">{note.title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
      </main>
    </div>
  )
}
