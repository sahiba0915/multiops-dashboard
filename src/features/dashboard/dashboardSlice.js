import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getOrdersByTenant } from '../../services/ordersService'
import { getUsersByTenant } from '../../services/usersService'

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
        usersCount: users.length,
        ordersCount: orders.length,
        pendingOrders,
        totalRevenue,
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
