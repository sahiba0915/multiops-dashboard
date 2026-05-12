import { memo, useMemo } from 'react'

function PaginationComponent({ page, perPage, total, onPageChange }) {
  // Derived value: recompute only when pagination inputs change (not on every parent render).
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / perPage)),
    [total, perPage],
  )

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-slate-600">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// Props are mostly primitives; memo helps when the parent re-renders but `onPageChange`
// stays stable (e.g. from `useCallback` in the page component).
export const Pagination = memo(PaginationComponent)
