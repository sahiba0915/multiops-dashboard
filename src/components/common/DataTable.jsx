import { memo } from 'react'

const DataTableRow = memo(function DataTableRow({ row, columns }) {
  return (
    <tr className="border-t border-slate-100">
      {columns.map((column) => (
        <td key={column.key} className="px-4 py-3">
          {column.render ? column.render(row) : row[column.key]}
        </td>
      ))}
    </tr>
  )
})

function DataTableComponent({ columns, rows, isLoading, emptyLabel = 'No data found.' }) {
  if (isLoading) {
    return <div className="rounded-lg bg-white p-4 text-sm text-slate-500">Loading...</div>
  }

  if (!rows.length) {
    return <div className="rounded-lg bg-white p-4 text-sm text-slate-500">{emptyLabel}</div>
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="max-h-[520px] overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs uppercase text-slate-500 shadow-sm">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {rows.map((row) => (
              <DataTableRow key={row.id} row={row} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const DataTable = memo(DataTableComponent)
