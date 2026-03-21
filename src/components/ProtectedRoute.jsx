import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import {
  selectIsAuthenticated,
  selectRole,
} from '../features/auth/authSlice'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const role = useSelector(selectRole)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
