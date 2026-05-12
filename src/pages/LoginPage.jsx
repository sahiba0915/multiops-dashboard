import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { loginSuccess, selectIsAuthenticated } from '../features/auth/authSlice'
import { ROLE_LABELS, ROLES, TENANTS } from '../config/constants'
import ThemeToggle from '../components/ThemeToggle'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [email, setEmail] = useState('')
  const [role, setRole] = useState(ROLES.USER)
  const [tenantId, setTenantId] = useState('t1')

  // Stable submit handler keeps future memoized form children from re-rendering each keystroke.
  const onSubmit = useCallback(
    (event) => {
      event.preventDefault()
      const token = `token-${Date.now()}`
      dispatch(
        loginSuccess({
          email: email.trim(),
          role,
          tenantId,
          token,
        }),
      )
      navigate('/dashboard', { replace: true })
    },
    [dispatch, navigate, email, role, tenantId],
  )

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-sm place-items-center">
        <div className="w-full rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-black/40 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to your workspace</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email
              </span>
              <input
                required
                type="email"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Role
              </span>
              <select
                className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                {Object.entries(ROLE_LABELS).map(([roleKey, roleLabel]) => (
                  <option key={roleKey} value={roleKey}>
                    {roleLabel}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Workspace
              </span>
              <select
                className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400"
                value={tenantId}
                onChange={(event) => setTenantId(event.target.value)}
              >
                {TENANTS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} ({t.id})
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
