import { httpClient } from './httpClient'
import { buildListQueryParams } from '../utils/query'

/**
 * @param {{ tenantId: string; page: number; perPage: number; search?: string; role?: string; sortBy?: string; order?: string }} args
 */
export async function getUsers(args) {
  const { tenantId, page, perPage, search, role, sortBy = 'name', order = 'asc' } = args
  const params = {
    tenantId,
    ...buildListQueryParams({
      page,
      perPage,
      search,
      searchContainsField: 'name',
      role,
      sortBy,
      order,
    }),
  }
  const { data } = await httpClient.get('/users', { params })
  const items = data?.data ?? data
  const total = Number(data?.items ?? (Array.isArray(items) ? items.length : 0))
  return { items: Array.isArray(items) ? items : [], total }
}

/** Unpaginated list for dashboard stats (JSON Server returns a plain array when _page is omitted). */
export async function getUsersByTenant(tenantId) {
  const { data } = await httpClient.get('/users', { params: { tenantId } })
  return Array.isArray(data) ? data : data?.data ?? []
}
