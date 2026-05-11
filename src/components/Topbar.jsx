import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout, selectCurrentUser } from '../features/auth/authSlice'
import { ROLE_LABELS } from '../config/constants'

export default function Topbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  const onLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex min-h-[3.5rem] flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2 sm:min-h-16 sm:px-6 sm:py-0">
      <h1 className="shrink-0 text-base font-semibold text-slate-800 sm:text-lg">Admin Panel</h1>
      <div className="flex min-w-0 max-w-full flex-1 basis-[100%] flex-wrap items-center justify-end gap-2 sm:basis-auto sm:gap-3">
        <span className="min-w-0 truncate text-right text-xs text-slate-500 sm:text-sm">
          <span className="hidden sm:inline">
            {currentUser.email} · {ROLE_LABELS[currentUser.role]} · {currentUser.tenantId}
          </span>
          <span className="sm:hidden">{currentUser.tenantId}</span>
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 sm:py-1.5"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
