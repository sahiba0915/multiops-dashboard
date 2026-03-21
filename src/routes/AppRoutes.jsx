import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DashboardLayout from '../layouts/DashboardLayout'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import UsersPage from '../pages/UsersPage'
import OrdersPage from '../pages/OrdersPage'
import NotFoundPage from '../pages/NotFoundPage'
import { selectIsAuthenticated } from '../features/auth/authSlice'

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/orders" element={<OrdersPage />} />
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
