import { useState } from 'react'
import type { Agent } from '../../types'
import { Toggle } from '../Toggle'
import { MentionPill } from '../MentionPill'
import { useUpdateAgent } from '../../hooks/useAgents'

const AI_MODELS = ['Auto', 'claude-sonnet-5', 'claude-opus-4-8', 'claude-haiku-4-5']
const MAX_ROUNDS_OPTIONS = [10, 20, 30, 50, 100]

const MENTION_PATTERN = /([📋🗃])\s*([^\n,，]+)/g

function renderMentions(text: string) {
  const matches = [...text.matchAll(MENTION_PATTERN)]
  if (matches.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {matches.map((m, i) => (
        <MentionPill key={i} icon={m[1]} label={m[2].trim()} />
      ))}
    </div>
  )
}

export function SettingsTab({ agent }: { agent: Agent }) {
  const [name, setName] = useState(agent.name)
  const [instructions, setInstructions] = useState(agent.instructions)
  const [aiModel, setAiModel] = useState(agent.aiModel)
  const [maxRounds, setMaxRounds] = useState(agent.maxRounds)
  const [scheduleEnabled, setScheduleEnabled] = useState(agent.scheduleEnabled)
  const [schedules, setSchedules] = useState(agent.scheduleCron)
  const [notificationsEnabled, setNotificationsEnabled] = useState(agent.notificationsEnabled)
  const updateAgent = useUpdateAgent(agent.id)

  function handleSave() {
    updateAgent.mutate({
      name,
      instructions,
      aiModel,
      maxRounds,
      scheduleEnabled,
      scheduleCron: schedules,
      notificationsEnabled,
    })
  }

  return (
    <div className="space-y-6">
      <Field label="員工名稱">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-card border border-divider bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </Field>

      <Field label="員工指令">
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={6}
          className="w-full rounded-card border border-divider bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        />
        {renderMentions(instructions)}
      </Field>

      <Field label="AI 模型">
        <select
          value={aiModel}
          onChange={(e) => setAiModel(e.target.value)}
          className="w-full rounded-card border border-divider bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        >
          {AI_MODELS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>

      <Field label="最大執行輪數">
        <select
          value={maxRounds}
          onChange={(e) => setMaxRounds(Number(e.target.value))}
          className="w-full rounded-card border border-divider bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        >
          {MAX_ROUNDS_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} 輪
            </option>
          ))}
        </select>
      </Field>

      <Field label="定期排程">
        <div className="flex items-center justify-between">
          <Toggle checked={scheduleEnabled} onChange={setScheduleEnabled} />
        </div>
        {scheduleEnabled && (
          <div className="mt-2 flex flex-wrap gap-2">
            {schedules.map((s, i) => (
              <span key={i} className="flex items-center gap-1 rounded-badge bg-divider px-2 py-1 text-sm">
                {s}
                <button
                  onClick={() => setSchedules(schedules.filter((_, idx) => idx !== i))}
                  className="text-text-secondary"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={() => setSchedules([...schedules, '每日 09:00'])}
              className="rounded-badge border border-dashed border-divider px-2 py-1 text-sm text-text-secondary"
            >
              + 新增排程
            </button>
          </div>
        )}
      </Field>

      <Field label="開啟通知">
        <Toggle checked={notificationsEnabled} onChange={setNotificationsEnabled} />
      </Field>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={updateAgent.isPending}
          className="rounded-card bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          儲存設定
        </button>
        {updateAgent.isSuccess && <span className="text-sm text-success">已儲存</span>}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-sm text-text-secondary">{label}</div>
      {children}
    </div>
  )
}
