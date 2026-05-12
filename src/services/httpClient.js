import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

const MAX_RETRIES = 2
const RETRY_BASE_DELAY_MS = 300

let getAuthToken = () => null

/** @type {(info: { message: string; status?: number; method?: string; url?: string }) => void} */
let onApiError = () => {}

/** Call once at app bootstrap so requests include the persisted Redux token. */
export function setAuthTokenGetter(fn) {
  getAuthToken = typeof fn === 'function' ? fn : () => null
}

/** Call once at app bootstrap for global API error UI (e.g. Redux dispatch). */
export function setApiErrorHandler(handler) {
  onApiError = typeof handler === 'function' ? handler : () => {}
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function getErrorMessage(error) {
  const data = error.response?.data
  if (data && typeof data === 'object' && typeof data.error === 'string') {
    return data.error
  }
  if (typeof data === 'string' && data) return data
  return error.message || 'Request failed'
}

function shouldRetryRequest(error, config) {
  if (config?.suppressRetry) return false
  const method = (config?.method || 'get').toLowerCase()
  if (method !== 'get' && method !== 'head') return false

  const retryCount = config?.__retryCount ?? 0
  if (retryCount >= MAX_RETRIES) return false

  if (!error.response) {
    return (
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      error.message?.toLowerCase().includes('network')
    )
  }

  const status = error.response.status
  return status === 408 || status === 429 || (status >= 500 && status <= 599)
}

export class ApiHttpError extends Error {
  /**
   * @param {string} message
   * @param {{ status?: number; original?: unknown }} [meta]
   */
  constructor(message, meta = {}) {
    super(message)
    this.name = 'ApiHttpError'
    this.status = meta.status
    this.original = meta.original
  }
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
  async (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const config = error.config
    if (config && shouldRetryRequest(error, config)) {
      const nextCount = (config.__retryCount ?? 0) + 1
      config.__retryCount = nextCount
      const delay = RETRY_BASE_DELAY_MS * 2 ** (nextCount - 1)
      await sleep(delay)
      return httpClient(config)
    }

    const message = getErrorMessage(error)
    const status = error.response?.status
    const method = config?.method?.toUpperCase?.() ?? ''
    const url =
      typeof config?.url === 'string'
        ? `${config.baseURL ?? ''}${config.url}`
        : ''

    if (config && !config.suppressGlobalError) {
      onApiError({ message, status, method, url })
    }

    const apiError = new ApiHttpError(message, { status, original: error })
    return Promise.reject(apiError)
  },
)
