import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { resolveRegionFromDevice } from '../../services/deviceRegionService'
import { getBrowserLocale, getRegionFromLocale } from '../../utils/localeCurrency'

export const detectDeviceRegion = createAsyncThunk('deviceLocale/detect', async () => {
  return resolveRegionFromDevice()
})

const deviceLocaleSlice = createSlice({
  name: 'deviceLocale',
  initialState: {
    region: null,
    source: null,
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(detectDeviceRegion.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(detectDeviceRegion.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.region = action.payload.region
        state.source = action.payload.source
      })
      .addCase(detectDeviceRegion.rejected, (state) => {
        state.status = 'failed'
        state.region = getRegionFromLocale(getBrowserLocale())
        state.source = 'locale'
      })
  },
})

export const selectDeviceLocale = (state) => state.deviceLocale

/** Region used for currency: network-derived when available, else browser locale region. */
export const selectCurrencyRegion = (state) =>
  state.deviceLocale.region ?? getRegionFromLocale(getBrowserLocale())

export default deviceLocaleSlice.reducer
