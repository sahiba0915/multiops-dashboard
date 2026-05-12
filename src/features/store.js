import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import deviceLocaleReducer from './deviceLocale/deviceLocaleSlice'
import dashboardReducer from './dashboard/dashboardSlice'
import usersReducer from './users/usersSlice'
import ordersReducer from './orders/ordersSlice'
import globalApiErrorReducer from './globalApiError/globalApiErrorSlice'
import themeReducer from './theme/themeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    deviceLocale: deviceLocaleReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    orders: ordersReducer,
    globalApiError: globalApiErrorReducer,
  },
})
