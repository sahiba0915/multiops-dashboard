import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ErrorBoundary from './components/ErrorBoundary'
import GlobalApiErrorBanner from './components/GlobalApiErrorBanner'

function App() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen flex-col">
      <GlobalApiErrorBanner />
      <ErrorBoundary resetKeys={[location.pathname, location.search]}>
        <AppRoutes />
      </ErrorBoundary>
    </div>
  )
}

export default App
