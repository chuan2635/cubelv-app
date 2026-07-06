import { useAgentSkills, useUpdateAgentSkill } from '../../hooks/useAgents'
import { Toggle } from '../Toggle'

export function SkillsTab({ agentId }: { agentId: string }) {
  const { data: skills = [] } = useAgentSkills(agentId)
  const updateSkill = useUpdateAgentSkill(agentId)

  if (skills.length === 0) {
    return <p className="text-text-secondary">尚未設定任何技能</p>
  }

  return (
    <div className="space-y-2">
      {skills.map((skill) => (
        <div key={skill.id} className="flex items-center justify-between rounded-card bg-surface p-4">
          <div>
            <div className="text-sm font-medium">{skill.label}</div>
            <div className="text-xs text-text-secondary">{skill.skillType}</div>
          </div>
          <Toggle
            checked={skill.enabled}
            onChange={(checked) => updateSkill.mutate({ skillId: skill.id, enabled: checked })}
          />
        </div>
      ))}
    </div>
  )
}
