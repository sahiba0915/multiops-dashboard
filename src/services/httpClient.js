import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

let getAuthToken = () => null

/** Call once at app bootstrap so requests include the persisted Redux token. */
export function setAuthTokenGetter(fn) {
  getAuthToken = typeof fn === 'function' ? fn : () => null
}

export const httpClient = axios.create({
  baseURL,
  timeout: 15000,
})

httpClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error ?? error.message ?? 'Request failed'
    return Promise.reject(new Error(message))
  },
)
