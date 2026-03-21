import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DashboardLayout from '../layouts/DashboardLayout'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import UsersPage from '../pages/UsersPage'
import OrdersPage from '../pages/OrdersPage'
import NotFoundPage from '../pages/NotFoundPage'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import { UnauthorizedPage } from '../pages/UnauthorizedPage'
import ProtectedRoute from '../components/ProtectedRoute'
import { ROLES } from '../config/constants'

export default function AppRoutes() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]}
            >
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
