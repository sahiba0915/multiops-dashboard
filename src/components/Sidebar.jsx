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
    <aside className="w-full shrink-0 border-b border-slate-800 bg-slate-900 p-3 text-slate-100 sm:p-4 md:w-64 md:border-b-0 md:border-r">
      <div className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl md:mb-8 md:text-xl">MultiOps</div>
      <nav className="flex flex-row flex-wrap gap-1.5 md:flex-col md:gap-2">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex min-h-[44px] min-w-[44px] flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm md:min-h-0 md:flex-none md:justify-start ${
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
