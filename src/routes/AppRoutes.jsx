import { lazy, Suspense, useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DashboardLayout from '../layouts/DashboardLayout'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import ProtectedRoute from '../components/ProtectedRoute'
import { ROLES } from '../config/constants'

// Route-level code splitting: each `lazy()` chunk loads only when the user navigates
// to that page, shrinking the initial JS bundle and speeding up first paint.
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'))
const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx'))
const UsersPage = lazy(() => import('../pages/UsersPage.jsx'))
const OrdersPage = lazy(() => import('../pages/OrdersPage.jsx'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'))
const UnauthorizedPage = lazy(() =>
  import('../pages/UnauthorizedPage.jsx').then((m) => ({ default: m.UnauthorizedPage })),
)

/** Lightweight placeholder while lazy chunks resolve — keeps layout stable. */
function RouteFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500"
      role="status"
      aria-live="polite"
    >
      Loading page…
    </div>
  )
}

export default function AppRoutes() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // Stable element reference for the root redirect: avoids re-creating `<Navigate />`
  // when `AppRoutes` re-renders for unrelated reasons (same pattern as memoized children).
  const homeRedirect = useMemo(
    () => <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />,
    [isAuthenticated],
  )

  return (
    <Suspense fallback={<RouteFallback />}>
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

        <Route path="/" element={homeRedirect} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
