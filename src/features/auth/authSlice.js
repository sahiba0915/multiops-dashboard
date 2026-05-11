import { createSlice } from '@reduxjs/toolkit'
import { ROLE_PERMISSIONS, ROLES } from '../../config/constants'

const AUTH_STORAGE_KEY = 'multiops_auth'

const fallbackUser = {
  id: '',
  name: '',
  email: '',
  tenantId: '',
  role: ROLES.USER,
}

const readPersistedAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.token || !parsed?.currentUser) return null
    return parsed
  } catch {
    return null
  }
}

const initialState = {
  currentUser: fallbackUser,
  token: null,
  isAuthenticated: false,
}

const persistedAuth = readPersistedAuth()
if (persistedAuth) {
  initialState.currentUser = persistedAuth.currentUser
  initialState.token = persistedAuth.token
  initialState.isAuthenticated = true
}

const persistAuth = (state) => {
  try {
    if (!state.isAuthenticated || !state.token) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        currentUser: state.currentUser,
        token: state.token,
      }),
    )
  } catch {
    // Ignore storage errors (private mode, quota, etc.)
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { email, role, tenantId, token } = action.payload
      state.currentUser = {
        id: `${tenantId}-${role}-${email}`,
        name: email.split('@')[0],
        email,
        tenantId,
        role,
      }
      state.token = token
      state.isAuthenticated = true
      persistAuth(state)
    },
    logout(state) {
      state.currentUser = fallbackUser
      state.token = null
      state.isAuthenticated = false
      persistAuth(state)
    },
    switchContext(state, action) {
      state.currentUser = action.payload
      if (state.isAuthenticated) {
        persistAuth(state)
      }
    },
  },
})

export const { switchContext, loginSuccess, logout } = authSlice.actions

export const selectCurrentUser = (state) => state.auth.currentUser
export const selectTenantId = (state) => state.auth.currentUser?.tenantId
export const selectRole = (state) => state.auth.currentUser?.role
export const selectAuthToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectPermissions = (state) => {
  if (!state.auth.isAuthenticated) return []
  const role = selectRole(state)
  return ROLE_PERMISSIONS[role] ?? []
}

export default authSlice.reducer
