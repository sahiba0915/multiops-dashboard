export const buildQueryParams = ({ page, perPage, search, status, sortBy, order }) => {
  const params = {
    _page: page,
    _per_page: perPage,
    _sort: sortBy,
    _order: order,
  }

  if (search) params.q = search
  if (status && status !== 'all') params.status = status

  return params
}
