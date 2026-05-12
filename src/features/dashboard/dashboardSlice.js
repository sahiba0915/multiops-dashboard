import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getOrdersByTenant } from '../../services/ordersService'
import { getUsersByTenant } from '../../services/usersService'

const STATUS_ORDER = ['pending', 'completed', 'cancelled']

function buildOrdersByStatus(orders) {
  return STATUS_ORDER.map((status) => ({
    status,
    count: orders.filter((o) => (o.status || 'unknown') === status).length,
  }))
}

function buildRevenueByMonth(orders) {
  const now = new Date()
  const keys = []
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  const sums = Object.fromEntries(keys.map((k) => [k, 0]))
  for (const o of orders) {
    if (!o.createdAt) continue
    const dt = new Date(o.createdAt)
    const k = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
    if (Object.prototype.hasOwnProperty.call(sums, k)) {
      sums[k] += Number(o.amount || 0)
    }
  }
  return keys.map((month) => ({ month, revenue: sums[month] }))
}

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (tenantId, { rejectWithValue }) => {
    try {
      const [users, orders] = await Promise.all([
        getUsersByTenant(tenantId),
        getOrdersByTenant(tenantId),
      ])
      const totalRevenue = orders.reduce((acc, order) => acc + Number(order.amount || 0), 0)
      const pendingOrders = orders.filter((order) => order.status === 'pending').length

      return {
        tenantId,
        usersCount: users.length,
        ordersCount: orders.length,
        pendingOrders,
        totalRevenue,
        ordersByStatus: buildOrdersByStatus(orders),
        revenueByMonth: buildRevenueByMonth(orders),
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load dashboard stats')
    }
  },
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Unable to load dashboard stats'
      })
  },
})

export const selectDashboard = (state) => state.dashboard

export default dashboardSlice.reducer
