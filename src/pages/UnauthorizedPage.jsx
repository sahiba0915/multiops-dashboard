import { Link } from 'react-router-dom'

export const UnauthorizedPage = () => {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
      <h2 className="text-xl font-semibold text-amber-900">Access denied</h2>
      <p className="mt-2 text-sm text-amber-700">
        Your role does not have permission to view this route.
      </p>
      <Link className="mt-4 inline-block text-sm font-medium text-amber-900 underline" to="/">
        Go back to overview
      </Link>
    </div>
  )
}
