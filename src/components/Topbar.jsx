import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout, selectCurrentUser } from '../features/auth/authSlice'
import { TENANTS } from '../config/constants'
import TenantSwitcher from './TenantSwitcher'
import ThemeToggle from './ThemeToggle'
import { RoleBadge } from './RoleBadge'

function Topbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  const onLogout = useCallback(() => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }, [dispatch, navigate])

  const tenantName = TENANTS.find((t) => t.id === currentUser.tenantId)?.label

  return (
    <header className="flex min-h-[3.5rem] flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/90 sm:min-h-16 sm:px-6 sm:py-2.5">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-5">
        <h1 className="shrink-0 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg">
          Admin Panel
        </h1>
        <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-600 sm:block" aria-hidden />
        <TenantSwitcher />
      </div>

      <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-3">
        <ThemeToggle />
        <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-600 md:block" aria-hidden />
        <div className="flex min-w-0 max-w-full flex-col items-end gap-1 text-right md:flex-row md:items-center md:gap-2">
          <span className="min-w-0 truncate text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
            <span className="hidden font-medium text-slate-800 dark:text-slate-100 sm:inline">
              {currentUser.email}
            </span>
            <span className="hidden sm:inline"> · </span>
            <span className="sm:hidden">{tenantName ?? currentUser.tenantId}</span>
          </span>
          <RoleBadge role={currentUser.role} className="shrink-0 uppercase tracking-wide" />
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700 sm:py-1.5"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default memo(Topbar)
