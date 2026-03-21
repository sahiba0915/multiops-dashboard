import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiClient } from '../../api/client'
import { buildQueryParams } from '../../utils/query'
import { PAGINATION } from '../../config/constants'

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ tenantId, page, perPage, search }, { rejectWithValue }) => {
    try {
      const params = {
        tenantId,
        ...buildQueryParams({
          page,
          perPage,
          search,
          sortBy: 'name',
          order: 'asc',
        }),
      }

      const response = await apiClient.get('/users', { params })
      return {
        items: response.data.data ?? response.data,
        total: Number(response.data.items ?? response.data.length ?? 0),
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load users')
    }
  },
)

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    total: 0,
    page: PAGINATION.DEFAULT_PAGE,
    perPage: PAGINATION.DEFAULT_PER_PAGE,
    search: '',
    isLoading: false,
    error: null,
  },
  reducers: {
    setUsersPage(state, action) {
      state.page = action.payload
    },
    setUsersSearch(state, action) {
      state.search = action.payload
      state.page = PAGINATION.DEFAULT_PAGE
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items
        state.total = action.payload.total
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Unable to load users'
      })
  },
})

export const { setUsersPage, setUsersSearch } = usersSlice.actions
export const selectUsers = (state) => state.users

export default usersSlice.reducer
