import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectRole } from '../features/auth/authSlice'
import { ROLE_ROUTE_ACCESS } from '../config/constants'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/orders', label: 'Orders' },
]

export default function Sidebar() {
  const role = useSelector(selectRole)
  const allowedRoutes = ROLE_ROUTE_ACCESS[role] ?? []
  const visibleLinks = links.filter((link) => allowedRoutes.includes(link.to))

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 p-4">
      <div className="mb-8 text-xl font-semibold">MultiOps</div>
      <nav className="space-y-2">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm ${
                isActive ? 'bg-slate-700' : 'hover:bg-slate-800'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
