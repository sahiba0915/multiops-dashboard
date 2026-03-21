import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardStats, selectDashboard } from '../features/dashboard/dashboardSlice'
import { selectTenantId } from '../features/auth/authSlice'

export const OverviewPage = () => {
  const dispatch = useDispatch()
  const tenantId = useSelector(selectTenantId)
  const { stats, isLoading, error } = useSelector(selectDashboard)

  useEffect(() => {
    if (tenantId) {
      dispatch(fetchDashboardStats(tenantId))
    }
  }, [dispatch, tenantId])

  if (isLoading) return <div className="rounded-lg bg-white p-4">Loading dashboard...</div>
  if (error) return <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>

  const cards = [
    { label: 'Users', value: stats?.usersCount ?? 0 },
    { label: 'Orders', value: stats?.ordersCount ?? 0 },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0 },
    { label: 'Revenue', value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}` },
  ]

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
