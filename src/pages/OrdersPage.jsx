import { useEffect } from 'react'
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

const columns = [
  { key: 'id', label: 'Order ID' },
  { key: 'customerName', label: 'Customer' },
  {
    key: 'amount',
    label: 'Amount',
    render: (row) => `$${Number(row.amount).toLocaleString()}`,
  },
  { key: 'status', label: 'Status' },
]

export const OrdersPage = () => {
  const dispatch = useDispatch()
  const tenantId = useSelector(selectTenantId)
  const { items, total, page, perPage, search, status, isLoading, error } = useSelector(selectOrders)

  useEffect(() => {
    if (tenantId) {
      dispatch(fetchOrders({ tenantId, page, perPage, search, status }))
    }
  }, [dispatch, tenantId, page, perPage, search, status])

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Orders</h2>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => dispatch(setOrdersSearch(e.target.value))}
            placeholder="Search orders"
            className="w-56 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <select
            value={status}
            onChange={(e) => dispatch(setOrdersStatus(e.target.value))}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      {error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
      ) : (
        <>
          <DataTable columns={columns} rows={items} isLoading={isLoading} emptyLabel="No orders for this tenant." />
          <Pagination page={page} perPage={perPage} total={total} onPageChange={(nextPage) => dispatch(setOrdersPage(nextPage))} />
        </>
      )}
    </section>
  )
}
