import { memo, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectRole } from '../features/auth/authSlice'
import { ROLE_ROUTE_ACCESS } from '../config/constants'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/orders', label: 'Orders' },
]

function Sidebar() {
  const role = useSelector(selectRole)

  // Recompute the nav list only when role changes — avoids refiltering on every render.
  const visibleLinks = useMemo(() => {
    const allowedRoutes = ROLE_ROUTE_ACCESS[role] ?? []
    return links.filter((link) => allowedRoutes.includes(link.to))
  }, [role])

  return (
    <aside className="w-full shrink-0 border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-3 text-slate-100 sm:p-4 md:w-64 md:border-b-0 md:border-r md:border-slate-800/80">
      <div className="mb-3 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-lg font-bold tracking-tight text-transparent sm:mb-4 sm:text-xl md:mb-8 md:text-xl">
        MultiOps
      </div>
      <nav className="flex flex-row flex-wrap gap-1.5 md:flex-col md:gap-2">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex min-h-[44px] min-w-[44px] flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition md:min-h-0 md:flex-none md:justify-start ${
                isActive
                  ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/15'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
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

// Sidebar only depends on role from the store; memo limits re-renders when unrelated
// global state updates (e.g. API error banner) while role is unchanged.
export default memo(Sidebar)
