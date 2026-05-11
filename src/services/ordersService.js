import { httpClient } from './httpClient'
import { buildListQueryParams } from '../utils/query'

/**
 * @param {{ tenantId: string; page: number; perPage: number; search?: string; status?: string; sortBy?: string; order?: string }} args
 */
export async function getOrders(args) {
  const { tenantId, page, perPage, search, status, sortBy = 'createdAt', order = 'desc' } = args
  const params = {
    tenantId,
    ...buildListQueryParams({
      page,
      perPage,
      search,
      searchContainsField: 'customerName',
      status,
      sortBy,
      order,
    }),
  }
  const { data } = await httpClient.get('/orders', { params })
  const items = data?.data ?? data
  const total = Number(data?.items ?? (Array.isArray(items) ? items.length : 0))
  return { items: Array.isArray(items) ? items : [], total }
}

export async function getOrdersByTenant(tenantId) {
  const { data } = await httpClient.get('/orders', { params: { tenantId } })
  return Array.isArray(data) ? data : data?.data ?? []
}
