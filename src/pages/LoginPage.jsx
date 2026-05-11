import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { loginSuccess, selectIsAuthenticated } from '../features/auth/authSlice'
import { ROLE_LABELS, ROLES } from '../config/constants'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [email, setEmail] = useState('')
  const [role, setRole] = useState(ROLES.USER)
  const [tenantId, setTenantId] = useState('t1')

  const onSubmit = (event) => {
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
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Login</h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Email</span>
            <input
              required
              type="email"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Role</span>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
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
            <span className="mb-1 block text-sm text-slate-600">Tenant</span>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              value={tenantId}
              onChange={(event) => setTenantId(event.target.value)}
            >
              <option value="t1">Tenant t1</option>
              <option value="t2">Tenant t2</option>
              <option value="t3">Tenant t3</option>
            </select>
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
