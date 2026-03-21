import { NavLink, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ROLE_LABELS, ROLES } from '../../config/constants'
import { selectCurrentUser, switchContext } from '../../features/auth/authSlice'

const contexts = [
  {
    id: 'u1',
    name: 'Aarav Admin',
    email: 'admin@alphacorp.com',
    tenantId: 't1',
    role: ROLES.ADMIN,
  },
  {
    id: 'u2',
    name: 'Meera Manager',
    email: 'manager@alphacorp.com',
    tenantId: 't1',
    role: ROLES.MANAGER,
  },
  {
    id: 'u3',
    name: 'Rohan User',
    email: 'user@betaware.com',
    tenantId: 't2',
    role: ROLES.USER,
  },
]

const navClassName = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200'
  }`

export const AppLayout = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">MultiOps Admin</h1>
            <p className="text-xs text-slate-500">Tenant-aware SaaS control plane</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
              {currentUser.tenantId} - {ROLE_LABELS[currentUser.role]}
            </span>
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              value={currentUser.id}
              onChange={(event) => {
                const next = contexts.find((ctx) => ctx.id === event.target.value)
                if (next) dispatch(switchContext(next))
              }}
            >
              {contexts.map((ctx) => (
                <option key={ctx.id} value={ctx.id}>
                  {ctx.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-[220px_1fr] gap-6 px-6 py-6">
        <aside className="rounded-lg border border-slate-200 bg-white p-3">
          <nav className="flex flex-col gap-1">
            <NavLink to="/" end className={navClassName}>
              Overview
            </NavLink>
            <NavLink to="/users" className={navClassName}>
              Users
            </NavLink>
            <NavLink to="/orders" className={navClassName}>
              Orders
            </NavLink>
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
