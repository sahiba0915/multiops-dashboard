import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, switchContext } from '../features/auth/authSlice'
import { TENANTS } from '../config/constants'

function TenantSwitcher() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)

  const onChange = useCallback(
    (e) => {
      const tenantId = e.target.value
      if (!tenantId || tenantId === user.tenantId) return
      dispatch(
        switchContext({
          id: `${tenantId}-${user.role}-${user.email}`,
          name: user.name,
          email: user.email,
          tenantId,
          role: user.role,
        }),
      )
    },
    [dispatch, user.email, user.name, user.role, user.tenantId],
  )

  return (
    <label className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Workspace
      </span>
      <div className="relative min-w-[8.5rem] max-w-[14rem] sm:min-w-[10rem]">
        <select
          value={user.tenantId || ''}
          onChange={onChange}
          className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25"
          aria-label="Switch workspace"
        >
          {TENANTS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label} ({t.id})
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          aria-hidden
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </label>
  )
}

export default memo(TenantSwitcher)
