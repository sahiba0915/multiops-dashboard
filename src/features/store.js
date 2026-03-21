import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import dashboardReducer from './dashboard/dashboardSlice'
import usersReducer from './users/usersSlice'
import ordersReducer from './orders/ordersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    orders: ordersReducer,
  },
})
