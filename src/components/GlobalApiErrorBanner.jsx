import { useDispatch, useSelector } from 'react-redux'
import {
  dismissGlobalApiError,
  selectGlobalApiError,
} from '../features/globalApiError/globalApiErrorSlice'

export default function GlobalApiErrorBanner() {
  const dispatch = useDispatch()
  const { open, message, status, method, url } = useSelector(selectGlobalApiError)

  if (!open) return null

  const detailParts = [method && status != null && `${method} ${status}`, url].filter(Boolean)
  const detail = detailParts.join(' · ')

  return (
    <div
      role="alert"
      className="shrink-0 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-medium">Request failed</p>
          <p className="mt-0.5 break-words text-amber-900/90">{message}</p>
          {detail ? (
            <p className="mt-1 truncate text-xs text-amber-800/80" title={detail}>
              {detail}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            className="rounded-md bg-amber-900 px-3 py-1.5 text-xs font-medium text-amber-50 hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-50"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
          <button
            type="button"
            className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-50"
            onClick={() => dispatch(dismissGlobalApiError())}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
