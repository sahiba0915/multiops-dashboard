import { memo } from 'react'
import { ROLE_LABELS, ROLES } from '../config/constants'

const toneByRole = {
  [ROLES.ADMIN]:
    'bg-rose-500/15 text-rose-700 ring-rose-500/25 dark:bg-rose-500/20 dark:text-rose-200 dark:ring-rose-400/30',
  [ROLES.MANAGER]:
    'bg-amber-500/15 text-amber-800 ring-amber-500/25 dark:bg-amber-500/20 dark:text-amber-100 dark:ring-amber-400/30',
  [ROLES.USER]:
    'bg-sky-500/15 text-sky-800 ring-sky-500/20 dark:bg-sky-500/20 dark:text-sky-100 dark:ring-sky-400/30',
}

const defaultTone =
  'bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:bg-slate-500/20 dark:text-slate-200 dark:ring-slate-400/25'

function RoleBadgeComponent({ role, className = '' }) {
  const label = role ? ROLE_LABELS[role] ?? role : '—'
  const tone = role ? toneByRole[role] ?? defaultTone : defaultTone

  return (
    <span
      className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tone} ${className}`}
    >
      {label}
    </span>
  )
}

export const RoleBadge = memo(RoleBadgeComponent)
