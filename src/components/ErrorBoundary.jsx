import { Component } from 'react'

function resetKeysEqual(a, b) {
  if (a === b) return true
  if (!a || !b || a.length !== b.length) return false
  return a.every((key, i) => key === b[i])
}

function DefaultFallback({ error, onRetry }) {
  return (
    <div className="min-h-[60vh] grid place-items-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-600">
          The UI hit an unexpected error. You can try again or refresh the page.
        </p>
        {import.meta.env.DEV && error?.message ? (
          <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-slate-50 p-3 text-left text-xs text-red-800">
            {error.message}
          </pre>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            onClick={onRetry}
          >
            Try again
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Catches render errors in child components and shows fallback UI.
 * Pass `resetKeys` (e.g. `[location.pathname]`) so a route change clears the error state.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary:', error, errorInfo)
  }

  componentDidUpdate(prevProps) {
    const { resetKeys } = this.props
    if (
      resetKeys &&
      !resetKeysEqual(prevProps.resetKeys, resetKeys) &&
      this.state.hasError
    ) {
      this.setState({ hasError: false, error: null })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback ?? DefaultFallback
      return <Fallback error={this.state.error} onRetry={this.handleRetry} />
    }
    return this.props.children
  }
}
