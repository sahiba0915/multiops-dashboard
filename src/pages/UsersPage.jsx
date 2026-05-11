import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTable } from '../components/common/DataTable'
import { Pagination } from '../components/common/Pagination'
import { selectTenantId } from '../features/auth/authSlice'
import { fetchUsers, selectUsers, setUsersPage, setUsersSearch } from '../features/users/usersSlice'

export default function UsersPage() {
  const dispatch = useDispatch()
  const tenantId = useSelector(selectTenantId)
  const { items, total, page, perPage, search, isLoading, error } = useSelector(selectUsers)
  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    if (!tenantId) return
    dispatch(fetchUsers({ tenantId, page, perPage, search }))
  }, [dispatch, tenantId, page, perPage, search])

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'tenantId', label: 'Tenant' },
  ]

  return (
    <section>
      <h2 className="text-2xl font-semibold text-slate-800">Users</h2>
      <p className="mt-2 text-slate-600">Showing users for tenant {tenantId} (mock API).</p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block min-w-[200px]">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Search name</span>
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                dispatch(setUsersSearch(localSearch.trim()))
              }
            }}
            placeholder="Contains…"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => dispatch(setUsersSearch(localSearch.trim()))}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Apply
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="mt-4">
        <DataTable columns={columns} rows={items} isLoading={isLoading} />
        <Pagination page={page} perPage={perPage} total={total} onPageChange={(p) => dispatch(setUsersPage(p))} />
      </div>
    </section>
  )
}
