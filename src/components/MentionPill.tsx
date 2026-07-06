export function MentionPill({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-badge bg-divider px-2 py-0.5 text-sm">
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}
