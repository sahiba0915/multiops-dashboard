import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900">Page not found</h2>
      <p className="mt-2 text-sm text-slate-600">The page you requested does not exist.</p>
      <Link className="mt-4 inline-block text-sm font-medium text-slate-900 underline" to="/">
        Back to dashboard
      </Link>
    </div>
  )
}
