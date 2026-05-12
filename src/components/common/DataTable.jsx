import { memo } from 'react'

// Row-level memo: when the parent adds/removes/reorders rows, unchanged rows keep
// the same `row` reference and skip reconciling every `<td>` cell.
const DataTableRow = memo(function DataTableRow({ row, columns }) {
  return (
    <tr className="border-t border-slate-100 transition dark:border-slate-700/80 dark:hover:bg-slate-800/40">
      {columns.map((column) => (
        <td key={column.key} className="px-4 py-3 text-slate-800 dark:text-slate-200">
          {column.render ? column.render(row) : row[column.key]}
        </td>
      ))}
    </tr>
  )
})

function DataTableComponent({ columns, rows, isLoading, emptyLabel = 'No data found.' }) {
  if (isLoading) {
    return <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-sm text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/50 dark:text-slate-400">Loading...</div>
  }

  if (!rows.length) {
    return <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-sm text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/50 dark:text-slate-400">{emptyLabel}</div>
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-900/50">
      <div className="max-h-[520px] overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm dark:bg-slate-800/95 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 dark:text-slate-300">
            {rows.map((row) => (
              <DataTableRow key={row.id} row={row} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Whole table memo: skips diffing the loading/empty/table branches if props are referentially stable
// (callers should pass `columns` from `useMemo` and stable handlers for best results).
export const DataTable = memo(DataTableComponent)
