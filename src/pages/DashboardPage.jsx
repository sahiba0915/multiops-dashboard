import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardStats, selectDashboard } from '../features/dashboard/dashboardSlice'
import { selectCurrentUser, selectTenantId } from '../features/auth/authSlice'
import { selectCurrencyRegion, selectDeviceLocale } from '../features/deviceLocale/deviceLocaleSlice'
import { ROLE_LABELS } from '../config/constants'
import { formatCurrency, getRegionalCurrencyMeta } from '../utils/localeCurrency'

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
      <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-8 w-20 animate-pulse rounded bg-slate-200 sm:h-9" />
      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-100" />
    </div>
  )
}

function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconOrders(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function IconBuilding(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12h4M14 12h4M6 16h4M14 16h4M10 6h4M10 22v-4h4v4" />
    </svg>
  )
}

function IconTrending(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
      <path d="M16 7h6v6" />
    </svg>
  )
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function StatCard({ label, value, hint, icon, accent }) {
  const Icon = icon
  const accentRing = {
    indigo: 'ring-indigo-500/10',
    emerald: 'ring-emerald-500/10',
    amber: 'ring-amber-500/10',
    violet: 'ring-violet-500/10',
  }[accent]
  const iconBg = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
  }[accent]

  return (
    <div
      className={`group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 sm:p-6 ${accentRing} transition hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
          <p className="mt-1.5 break-words text-2xl font-semibold tracking-tight text-slate-900 tabular-nums sm:mt-2 sm:text-3xl">
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const dispatch = useDispatch()
  const tenantId = useSelector(selectTenantId)
  const currentUser = useSelector(selectCurrentUser)
  const currencyRegion = useSelector(selectCurrencyRegion)
  const deviceLocale = useSelector(selectDeviceLocale)
  const { stats, isLoading, error } = useSelector(selectDashboard)

  useEffect(() => {
    if (!tenantId) return
    dispatch(fetchDashboardStats(tenantId))
  }, [dispatch, tenantId])

  const statsMatchTenant = stats?.tenantId === tenantId
  /** Covers first paint, pending fetch, and tenant switch while in flight */
  const showSkeleton = !statsMatchTenant && (isLoading || (!error && !stats))
  const roleLabel = currentUser?.role ? ROLE_LABELS[currentUser.role] ?? currentUser.role : '—'

  const { currency: regionalCurrency, region: regionalRegion } = getRegionalCurrencyMeta({
    region: currencyRegion,
  })

  const revenueFormatted = useMemo(() => {
    const n = statsMatchTenant ? Number(stats.totalRevenue ?? 0) : 0
    return formatCurrency(n, { region: currencyRegion, maximumFractionDigits: 0 })
  }, [stats, statsMatchTenant, currencyRegion])

  const revenueHintSuffix =
    deviceLocale.source === 'network'
      ? ' · from network location'
      : deviceLocale.status === 'loading'
        ? ' · detecting…'
        : ' · from browser locale'

  const onRetry = () => {
    if (tenantId) dispatch(fetchDashboardStats(tenantId))
  }

  if (!tenantId) {
    return (
      <section className="mx-auto w-full max-w-6xl min-w-0">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 sm:px-5">
          No tenant is selected for this session. Sign in again to load dashboard metrics.
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl min-w-0 space-y-6 sm:space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">Dashboard</h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Live metrics for your workspace, loaded from the API.
        </p>
      </header>

      {error ? (
        <div
          className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          role="alert"
        >
          <p className="min-w-0 text-sm leading-relaxed text-red-800">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-lg bg-red-900 px-4 text-sm font-medium text-white hover:bg-red-800 sm:h-auto sm:w-auto sm:py-2"
          >
            Try again
          </button>
        </div>
      ) : null}

      <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-lg sm:p-6 lg:col-span-1">
          <div className="flex items-center gap-2 text-slate-300">
            <IconBuilding className="h-5 w-5 shrink-0 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Tenant</span>
          </div>
          <p className="mt-3 break-all font-mono text-base font-semibold tracking-wide text-white sm:text-lg">
            {tenantId}
          </p>
          <dl className="mt-5 space-y-4 border-t border-white/10 pt-5 text-sm sm:mt-6 sm:pt-6">
            <div className="min-w-0">
              <dt className="text-slate-400">Signed in as</dt>
              <dd className="mt-0.5 break-words font-medium text-slate-100">{currentUser?.email || '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Role</dt>
              <dd className="mt-0.5 font-medium text-slate-100">{roleLabel}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Scope</dt>
              <dd className="mt-0.5 leading-relaxed text-slate-300">
                All counts below are filtered to this tenant only.
              </dd>
            </div>
          </dl>
        </div>

        <div className="min-w-0 space-y-3 sm:space-y-4 lg:col-span-2">
          {isLoading && statsMatchTenant ? (
            <p className="text-xs font-medium text-slate-500" aria-live="polite">
              Refreshing…
            </p>
          ) : null}
          <div className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4">
            {showSkeleton ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : statsMatchTenant ? (
              <>
                <StatCard
                  label="Total users"
                  value={stats.usersCount.toLocaleString()}
                  hint="People in this tenant"
                  icon={IconUsers}
                  accent="indigo"
                />
                <StatCard
                  label="Total orders"
                  value={stats.ordersCount.toLocaleString()}
                  hint="All order records"
                  icon={IconOrders}
                  accent="emerald"
                />
                <StatCard
                  label="Pending orders"
                  value={stats.pendingOrders.toLocaleString()}
                  hint="Awaiting fulfillment"
                  icon={IconClock}
                  accent="amber"
                />
                <StatCard
                  label="Tenant revenue"
                  value={revenueFormatted}
                  hint={`Sum of order amounts · ${regionalCurrency} (${regionalRegion})${revenueHintSuffix}`}
                  icon={IconTrending}
                  accent="violet"
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
