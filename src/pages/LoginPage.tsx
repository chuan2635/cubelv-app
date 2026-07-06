import { FormEvent, useState } from 'react'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    await signInWithEmail(email)
    setSent(true)
  }

  return (
    <div className="flex h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-semibold">CubeLV</h1>
        <p className="mb-8 text-sm text-text-secondary">打造你的一人 AI 團隊 — 完全免費使用</p>

        {sent && !import.meta.env.VITE_SUPABASE_URL ? (
          <p className="text-sm text-success">登入成功，正在載入…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-card border border-divider bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              className="w-full rounded-card bg-brand py-3 text-sm font-semibold text-white"
            >
              登入 / 註冊
            </button>
            <p className="text-xs text-text-secondary">
              免訂閱、免付費，登入後所有功能立即開放使用。
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
