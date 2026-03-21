import { createSlice } from '@reduxjs/toolkit'
import { ROLE_PERMISSIONS, ROLES } from '../../config/constants'

const initialState = {
  currentUser: {
    id: 'u1',
    name: 'Aarav Admin',
    email: 'admin@alphacorp.com',
    tenantId: 't1',
    role: ROLES.ADMIN,
  },
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    switchContext(state, action) {
      state.currentUser = action.payload
    },
  },
})

export const { switchContext } = authSlice.actions

export const selectCurrentUser = (state) => state.auth.currentUser
export const selectTenantId = (state) => state.auth.currentUser?.tenantId
export const selectRole = (state) => state.auth.currentUser?.role
export const selectPermissions = (state) => {
  const role = selectRole(state)
  return ROLE_PERMISSIONS[role] ?? []
}

export default authSlice.reducer
