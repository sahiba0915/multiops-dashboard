import { memo, useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency, getRegionalCurrencyMeta } from '../utils/localeCurrency'

function formatMonthKey(key) {
  const [y, m] = key.split('-').map(Number)
  if (!y || !m) return key
  return new Date(y, m - 1).toLocaleString(undefined, { month: 'short', year: 'numeric' })
}

function statusLabel(status) {
  if (!status) return '—'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function DashboardChartsComponent({ ordersByStatus, revenueByMonth, currencyRegion, isDark }) {
  const palette = useMemo(
    () =>
      isDark
        ? {
            grid: '#334155',
            tick: '#94a3b8',
            bar: '#818cf8',
            gradientFrom: '#6366f1',
            gradientTo: '#6366f1',
            tooltipBg: '#1e293b',
            tooltipBorder: '#475569',
            tooltipText: '#f1f5f9',
          }
        : {
            grid: '#e2e8f0',
            tick: '#64748b',
            bar: '#4f46e5',
            gradientFrom: '#6366f1',
            gradientTo: '#a5b4fc',
            tooltipBg: '#ffffff',
            tooltipBorder: '#e2e8f0',
            tooltipText: '#0f172a',
          },
    [isDark],
  )

  const statusData = useMemo(
    () =>
      (ordersByStatus ?? []).map((row) => ({
        ...row,
        label: statusLabel(row.status),
      })),
    [ordersByStatus],
  )

  const revenueData = useMemo(
    () =>
      (revenueByMonth ?? []).map((row) => ({
        ...row,
        label: formatMonthKey(row.month),
      })),
    [revenueByMonth],
  )

  const compactCurrency = useMemo(() => {
    const { locale, currency } = getRegionalCurrencyMeta({ region: currencyRegion })
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    })
  }, [currencyRegion])

  const revenueTooltip = useMemo(
    () =>
      function RevenueTooltip({ active, payload, label }) {
        if (!active || !payload?.length) return null
        const v = payload[0]?.value
        const n = typeof v === 'number' ? v : Number(v)
        return (
          <div
            className="rounded-lg border px-3 py-2 text-xs shadow-lg"
            style={{
              backgroundColor: palette.tooltipBg,
              borderColor: palette.tooltipBorder,
              color: palette.tooltipText,
            }}
          >
            <p className="font-medium opacity-90">{label}</p>
            <p className="mt-0.5 tabular-nums font-semibold">
              {formatCurrency(Number.isFinite(n) ? n : 0, { region: currencyRegion })}
            </p>
          </div>
        )
      },
    [currencyRegion, palette.tooltipBg, palette.tooltipBorder, palette.tooltipText],
  )

  const countTooltip = useMemo(
    () =>
      function CountTooltip({ active, payload, label }) {
        if (!active || !payload?.length) return null
        const v = payload[0]?.value
        return (
          <div
            className="rounded-lg border px-3 py-2 text-xs shadow-lg"
            style={{
              backgroundColor: palette.tooltipBg,
              borderColor: palette.tooltipBorder,
              color: palette.tooltipText,
            }}
          >
            <p className="font-medium opacity-90">{label}</p>
            <p className="mt-0.5 tabular-nums font-semibold">{v} orders</p>
          </div>
        )
      },
    [palette.tooltipBg, palette.tooltipBorder, palette.tooltipText],
  )

  if (!statusData.length && !revenueData.length) return null

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2 lg:gap-6">
      <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/60 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Orders by status</h3>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Distribution for this workspace</p>
        <div className="mt-4 h-56 w-full min-w-0 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: palette.tick, fontSize: 12 }} axisLine={{ stroke: palette.grid }} />
              <YAxis
                allowDecimals={false}
                width={36}
                tick={{ fill: palette.tick, fontSize: 12 }}
                axisLine={{ stroke: palette.grid }}
              />
              <Tooltip content={countTooltip} cursor={{ fill: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.06)' }} />
              <Bar dataKey="count" name="Orders" fill={palette.bar} radius={[6, 6, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/60 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Revenue trend</h3>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Last six months (order amounts)</p>
        <div className="mt-4 h-56 w-full min-w-0 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.gradientFrom} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={palette.gradientTo} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: palette.tick, fontSize: 11 }} axisLine={{ stroke: palette.grid }} />
              <YAxis
                width={44}
                tick={{ fill: palette.tick, fontSize: 11 }}
                axisLine={{ stroke: palette.grid }}
                tickFormatter={(v) => compactCurrency.format(Number(v) || 0)}
              />
              <Tooltip content={revenueTooltip} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={palette.bar}
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export const DashboardCharts = memo(DashboardChartsComponent)
