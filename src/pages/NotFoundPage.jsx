import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 px-4">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-slate-800">404</h2>
        <p className="text-slate-600 mt-2 mb-4">Page not found.</p>
        <Link to="/dashboard" className="text-slate-900 font-medium hover:underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
