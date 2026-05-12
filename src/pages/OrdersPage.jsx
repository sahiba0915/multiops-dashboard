import { useCallback, useEffect, useMemo, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { DataTable } from '../components/common/DataTable'
import { Pagination } from '../components/common/Pagination'
import { selectTenantId } from '../features/auth/authSlice'
import { selectCurrencyRegion } from '../features/deviceLocale/deviceLocaleSlice'
import {
  fetchOrders,
  selectOrdersView,
  setOrdersPage,
  setOrdersSearch,
  setOrdersStatus,
} from '../features/orders/ordersSlice'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { formatCurrency } from '../utils/localeCurrency'

const SEARCH_DEBOUNCE_MS = 350

export default function OrdersPage() {
  const dispatch = useDispatch()
  const tenantId = useSelector(selectTenantId)
  const currencyRegion = useSelector(selectCurrencyRegion)
  const { items, total, page, perPage, search, status, isLoading, error } = useSelector(
    selectOrdersView,
    shallowEqual,
  )
  const [localSearch, setLocalSearch] = useState(search)
  const debouncedLocalSearch = useDebouncedValue(localSearch, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  useEffect(() => {
    const next = debouncedLocalSearch.trim()
    if (next === search) return
    dispatch(setOrdersSearch(next))
  }, [debouncedLocalSearch, dispatch, search])

  useEffect(() => {
    if (!tenantId) return
    dispatch(fetchOrders({ tenantId, page, perPage, search, status }))
  }, [dispatch, tenantId, page, perPage, search, status])

  const columns = useMemo(
    () => [
      { key: 'id', label: 'Order' },
      { key: 'customerName', label: 'Customer' },
      {
        key: 'amount',
        label: 'Amount',
        render: (row) => formatCurrency(Number(row.amount), { region: currencyRegion }),
      },
      { key: 'status', label: 'Status' },
      {
        key: 'createdAt',
        label: 'Created',
        render: (row) => new Date(row.createdAt).toLocaleString(),
      },
      { key: 'tenantId', label: 'Tenant' },
    ],
    [currencyRegion],
  )

  const emptyLabel = useMemo(() => {
    if (search || status !== 'all') {
      return 'No orders match your filters. Try adjusting search or status.'
    }
    return 'No orders in this workspace yet.'
  }, [search, status])

  const handlePageChange = useCallback((p) => dispatch(setOrdersPage(p)), [dispatch])

  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key !== 'Enter') return
      e.preventDefault()
      dispatch(setOrdersSearch(localSearch.trim()))
    },
    [dispatch, localSearch],
  )

  const handleStatusChange = useCallback(
    (e) => dispatch(setOrdersStatus(e.target.value)),
    [dispatch],
  )

  if (!tenantId) {
    return (
      <section>
        <h2 className="text-2xl font-semibold text-slate-800">Orders</h2>
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Select a workspace to view orders.
        </p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-slate-800">Orders</h2>
      <p className="mt-2 text-slate-600">
        Paginated list with server-side search and status filters (mock API supports 1000+ rows per tenant).
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block min-w-[220px] flex-1 sm:max-w-sm">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Search customer</span>
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Type to search…"
            autoComplete="off"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            aria-busy={isLoading}
          />
        </label>
        <label className="block min-w-[160px]">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Status</span>
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <option value="all">All statuses</option>
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
        <DataTable columns={columns} rows={items} isLoading={isLoading} emptyLabel={emptyLabel} />
        <Pagination page={page} perPage={perPage} total={total} onPageChange={handlePageChange} />
      </div>
    </section>
  )
}
