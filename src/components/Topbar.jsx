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
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-slate-800">Admin Panel</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          {currentUser.email} | {ROLE_LABELS[currentUser.role]} | {currentUser.tenantId}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
