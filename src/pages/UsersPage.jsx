import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTable } from '../components/common/DataTable'
import { Pagination } from '../components/common/Pagination'
import { ROLE_LABELS, ROLES } from '../config/constants'
import { selectTenantId } from '../features/auth/authSlice'
import { fetchUsers, selectUsers, setUsersPage, setUsersRole, setUsersSearch } from '../features/users/usersSlice'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

const SEARCH_DEBOUNCE_MS = 350

export default function UsersPage() {
  const dispatch = useDispatch()
  const tenantId = useSelector(selectTenantId)
  const { items, total, page, perPage, search, role, isLoading, error } = useSelector(selectUsers)
  const [localSearch, setLocalSearch] = useState(search)
  const debouncedLocalSearch = useDebouncedValue(localSearch, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  useEffect(() => {
    const next = debouncedLocalSearch.trim()
    if (next === search) return
    dispatch(setUsersSearch(next))
  }, [debouncedLocalSearch, dispatch, search])

  useEffect(() => {
    if (!tenantId) return
    dispatch(fetchUsers({ tenantId, page, perPage, search, role }))
  }, [dispatch, tenantId, page, perPage, search, role])

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      {
        key: 'role',
        label: 'Role',
        render: (row) => ROLE_LABELS[row.role] ?? row.role,
      },
    ],
    [],
  )

  const emptyLabel = useMemo(() => {
    if (search || role !== 'all') {
      return 'No users match your filters. Try adjusting search or role.'
    }
    return 'No users in this workspace yet.'
  }, [search, role])

  const handlePageChange = useCallback((p) => dispatch(setUsersPage(p)), [dispatch])

  // Same as inline `onChange`: stable reference so `select` and siblings don’t churn props unnecessarily.
  const handleRoleChange = useCallback(
    (e) => dispatch(setUsersRole(e.target.value)),
    [dispatch],
  )

  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key !== 'Enter') return
      e.preventDefault()
      const next = localSearch.trim()
      dispatch(setUsersSearch(next))
    },
    [dispatch, localSearch],
  )

  if (!tenantId) {
    return (
      <section>
        <h2 className="text-2xl font-semibold text-slate-800">Users</h2>
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Select a workspace to view users.
        </p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-slate-800">Users</h2>
      <p className="mt-2 text-slate-600">Users in your workspace ({tenantId}).</p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block min-w-[220px] flex-1 sm:max-w-sm">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Search by name</span>
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
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Role</span>
          <select
            value={role}
            onChange={handleRoleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <option value="all">All roles</option>
            <option value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</option>
            <option value={ROLES.MANAGER}>{ROLE_LABELS[ROLES.MANAGER]}</option>
            <option value={ROLES.USER}>{ROLE_LABELS[ROLES.USER]}</option>
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
