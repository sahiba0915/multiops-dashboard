/**
 * Query params compatible with json-server v1 (see README: _sort uses `-field` for desc).
 * @param {{ page: number; perPage: number; search?: string; searchContainsField?: string; status?: string; sortBy?: string; order?: 'asc' | 'desc' }} opts
 */
export const buildListQueryParams = ({
  page,
  perPage,
  search,
  searchContainsField,
  status,
  sortBy,
  order,
}) => {
  const params = {
    _page: page,
    _per_page: perPage,
  }

  if (sortBy) {
    params._sort = `${order === 'desc' ? '-' : ''}${sortBy}`
  }

  if (search && searchContainsField) {
    params[`${searchContainsField}:contains`] = search
  }

  if (status && status !== 'all') {
    params.status = status
  }

  return params
}
