import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  open: false,
  message: '',
  status: null,
  method: '',
  url: '',
  /** Increments on each report so consumers can detect new errors while the message is unchanged. */
  incidentId: 0,
}

const globalApiErrorSlice = createSlice({
  name: 'globalApiError',
  initialState,
  reducers: {
    reportApiError(state, action) {
      const { message, status, method, url } = action.payload
      state.open = true
      state.message = message || 'Request failed'
      state.status = status ?? null
      state.method = method ?? ''
      state.url = url ?? ''
      state.incidentId += 1
    },
    dismissGlobalApiError(state) {
      state.open = false
      state.message = ''
      state.status = null
      state.method = ''
      state.url = ''
    },
  },
})

export const { reportApiError, dismissGlobalApiError } = globalApiErrorSlice.actions

export const selectGlobalApiError = (state) => state.globalApiError

export default globalApiErrorSlice.reducer
