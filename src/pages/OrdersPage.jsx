import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTable } from '../components/common/DataTable'
import { Pagination } from '../components/common/Pagination'
import { selectTenantId } from '../features/auth/authSlice'
import {
  fetchOrders,
  selectOrders,
  setOrdersPage,
  setOrdersSearch,
  setOrdersStatus,
} from '../features/orders/ordersSlice'

export default function OrdersPage() {
  const dispatch = useDispatch()
  const tenantId = useSelector(selectTenantId)
  const { items, total, page, perPage, search, status, isLoading, error } = useSelector(selectOrders)
  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    if (!tenantId) return
    dispatch(fetchOrders({ tenantId, page, perPage, search, status }))
  }, [dispatch, tenantId, page, perPage, search, status])

  const columns = [
    { key: 'id', label: 'Order' },
    { key: 'customerName', label: 'Customer' },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => `$${Number(row.amount).toLocaleString()}`,
    },
    { key: 'status', label: 'Status' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    { key: 'tenantId', label: 'Tenant' },
  ]

  return (
    <section>
      <h2 className="text-2xl font-semibold text-slate-800">Orders</h2>
      <p className="mt-2 text-slate-600">Showing orders for tenant {tenantId} (mock API).</p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block min-w-[200px]">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Search customer</span>
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                dispatch(setOrdersSearch(localSearch.trim()))
              }
            }}
            placeholder="Contains…"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => dispatch(setOrdersSearch(localSearch.trim()))}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Apply
        </button>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Status</span>
          <select
            value={status}
            onChange={(e) => dispatch(setOrdersStatus(e.target.value))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="mt-4">
        <DataTable columns={columns} rows={items} isLoading={isLoading} />
        <Pagination page={page} perPage={perPage} total={total} onPageChange={(p) => dispatch(setOrdersPage(p))} />
      </div>
    </section>
  )
}
