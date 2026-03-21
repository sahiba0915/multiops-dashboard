import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTable } from '../components/common/DataTable'
import { Pagination } from '../components/common/Pagination'
import { selectTenantId } from '../features/auth/authSlice'
import { fetchUsers, selectUsers, setUsersPage, setUsersSearch } from '../features/users/usersSlice'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
]

export const UsersPage = () => {
  const dispatch = useDispatch()
  const tenantId = useSelector(selectTenantId)
  const { items, total, page, perPage, search, isLoading, error } = useSelector(selectUsers)

  useEffect(() => {
    if (tenantId) {
      dispatch(fetchUsers({ tenantId, page, perPage, search }))
    }
  }, [dispatch, tenantId, page, perPage, search])

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Users</h2>
        <input
          value={search}
          onChange={(e) => dispatch(setUsersSearch(e.target.value))}
          placeholder="Search users"
          className="w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      </div>
      {error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
      ) : (
        <>
          <DataTable columns={columns} rows={items} isLoading={isLoading} emptyLabel="No users for this tenant." />
          <Pagination page={page} perPage={perPage} total={total} onPageChange={(nextPage) => dispatch(setUsersPage(nextPage))} />
        </>
      )}
    </section>
  )
}
