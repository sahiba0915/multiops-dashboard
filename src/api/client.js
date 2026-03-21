import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
})

export const withTenant = (tenantId) => ({
  params: { tenantId },
})
