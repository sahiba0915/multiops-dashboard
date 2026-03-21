import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppLayout } from '../components/layout/AppLayout'
import { OverviewPage } from '../pages/OverviewPage'
import { UsersPage } from '../pages/UsersPage'
import { OrdersPage } from '../pages/OrdersPage'
import { UnauthorizedPage } from '../pages/UnauthorizedPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { selectPermissions } from '../features/auth/authSlice'
import { PERMISSIONS } from '../config/constants'

const ProtectedRoute = ({ permission, children }) => {
  const permissions = useSelector(selectPermissions)
  const canAccess = permissions.includes(permission)

  if (!canAccess) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<OverviewPage />} />
        <Route
          path="users"
          element={
            <ProtectedRoute permission={PERMISSIONS.VIEW_USERS}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute permission={PERMISSIONS.VIEW_ORDERS}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
