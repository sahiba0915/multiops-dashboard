import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getOrders } from '../../services/ordersService'
import { PAGINATION } from '../../config/constants'

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ tenantId, page, perPage, search, status }, { rejectWithValue }) => {
    try {
      return await getOrders({
        tenantId,
        page,
        perPage,
        search,
        status,
        sortBy: 'createdAt',
        order: 'desc',
      })
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load orders')
    }
  },
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    total: 0,
    page: PAGINATION.DEFAULT_PAGE,
    perPage: PAGINATION.DEFAULT_PER_PAGE,
    search: '',
    status: 'all',
    isLoading: false,
    error: null,
  },
  reducers: {
    setOrdersPage(state, action) {
      state.page = action.payload
    },
    setOrdersSearch(state, action) {
      state.search = action.payload
      state.page = PAGINATION.DEFAULT_PAGE
    },
    setOrdersStatus(state, action) {
      state.status = action.payload
      state.page = PAGINATION.DEFAULT_PAGE
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items
        state.total = action.payload.total
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Unable to load orders'
      })
  },
})

export const { setOrdersPage, setOrdersSearch, setOrdersStatus } = ordersSlice.actions
export const selectOrders = (state) => state.orders

/** Shallow-friendly view for list UI (use with `shallowEqual` in useSelector). */
export const selectOrdersView = (state) => {
  const o = state.orders
  return {
    items: o.items,
    total: o.total,
    page: o.page,
    perPage: o.perPage,
    search: o.search,
    status: o.status,
    isLoading: o.isLoading,
    error: o.error,
  }
}

export default ordersSlice.reducer
