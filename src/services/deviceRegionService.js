import { getBrowserLocale, getKnownRegions, getRegionFromLocale } from '../utils/localeCurrency'

const VALID = new Set(getKnownRegions())

function normalizeRegion(code) {
  const r = String(code || '')
    .trim()
    .toUpperCase()
  return VALID.has(r) ? r : null
}

function localeFallbackRegion() {
  return getRegionFromLocale(getBrowserLocale())
}

async function tryIpWho(signal) {
  const res = await fetch('https://ipwho.is/', {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) return null
  const data = await res.json()
  if (data?.success === false) return null
  return normalizeRegion(data?.country_code)
}

async function tryGeoJs(signal) {
  const res = await fetch('https://get.geojs.io/v1/ip/country.json', {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) return null
  const data = await res.json()
  return normalizeRegion(data?.country ?? data?.country_code)
}

/**
 * Country/region from the device’s network path (IP geolocation). Silent — no permission prompts.
 * If lookup fails or the country is not in our currency map, falls back to the browser locale region.
 * @param {number} [timeoutMs]
 * @returns {Promise<{ region: string; source: 'network' | 'locale' }>}
 */
export async function resolveRegionFromDevice(timeoutMs = 4500) {
  const fallback = () => ({ region: localeFallbackRegion(), source: 'locale' })

  if (typeof fetch === 'undefined') {
    return fallback()
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    let code = null
    try {
      code = await tryIpWho(controller.signal)
    } catch {
      // try next provider
    }
    if (!code) {
      try {
        code = await tryGeoJs(controller.signal)
      } catch {
        // use locale fallback below
      }
    }
    if (code) return { region: code, source: 'network' }
  } finally {
    clearTimeout(timer)
  }

  return fallback()
}
