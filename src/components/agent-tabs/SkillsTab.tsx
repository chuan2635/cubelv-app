import { useState } from 'react'
import { useAgentSkills } from '../../hooks/useAgents'
import { Toggle } from '../Toggle'

export function SkillsTab({ agentId }: { agentId: string }) {
  const { data: skills = [] } = useAgentSkills(agentId)
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean> | null>(null)

  const resolved = enabledMap ?? Object.fromEntries(skills.map((s) => [s.id, s.enabled]))

  return (
    <div className="space-y-2">
      {skills.map((skill) => (
        <div key={skill.id} className="flex items-center justify-between rounded-card bg-surface p-4">
          <div>
            <div className="text-sm font-medium">{skill.label}</div>
            <div className="text-xs text-text-secondary">{skill.skillType}</div>
          </div>
          <Toggle
            checked={resolved[skill.id]}
            onChange={(checked) => setEnabledMap({ ...resolved, [skill.id]: checked })}
          />
        </div>
      ))}
    </div>
  )
}
