import { memo, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ErrorBoundary from './components/ErrorBoundary'
import GlobalApiErrorBanner from './components/GlobalApiErrorBanner'

function App() {
  const location = useLocation()

  // Same values as a fresh `[pathname, search]` array each render, but a stable
  // reference when the URL has not changed — fewer allocations and clearer intent
  // for `ErrorBoundary`’s `resetKeys` comparison.
  const errorBoundaryResetKeys = useMemo(
    () => [location.pathname, location.search],
    [location.pathname, location.search],
  )

  return (
    <div className="flex min-h-screen flex-col">
      <GlobalApiErrorBanner />
      <ErrorBoundary resetKeys={errorBoundaryResetKeys}>
        <AppRoutes />
      </ErrorBoundary>
    </div>
  )
}

// Top-level shell: avoids re-rendering when a future parent passes stable props
// or when React reconciles above this node without location-driven updates.
export default memo(App)
