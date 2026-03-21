import { Link } from 'react-router-dom'

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Login</h2>
        <p className="text-sm text-slate-600 mb-6">
          This is a starter login screen.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
