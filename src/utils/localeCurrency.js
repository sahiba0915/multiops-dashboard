/** ISO 3166-1 alpha-2 region → ISO 4217 currency (common cases; unknown → USD). */
const REGION_TO_CURRENCY = (() => {
  const eur = [
    'AT',
    'BE',
    'CY',
    'DE',
    'EE',
    'ES',
    'FI',
    'FR',
    'GR',
    'HR',
    'IE',
    'IT',
    'LT',
    'LU',
    'LV',
    'MT',
    'NL',
    'PT',
    'SI',
    'SK',
    'AD',
    'MC',
    'SM',
    'VA',
    'XK',
  ]
  const map = Object.fromEntries(eur.map((r) => [r, 'EUR']))
  Object.assign(map, {
    US: 'USD',
    CA: 'CAD',
    MX: 'MXN',
    GB: 'GBP',
    CH: 'CHF',
    NO: 'NOK',
    SE: 'SEK',
    DK: 'DKK',
    IS: 'ISK',
    PL: 'PLN',
    CZ: 'CZK',
    HU: 'HUF',
    RO: 'RON',
    BG: 'BGN',
    JP: 'JPY',
    CN: 'CNY',
    KR: 'KRW',
    IN: 'INR',
    AU: 'AUD',
    NZ: 'NZD',
    BR: 'BRL',
    AR: 'ARS',
    CL: 'CLP',
    CO: 'COP',
    ZA: 'ZAR',
    AE: 'AED',
    SA: 'SAR',
    QA: 'QAR',
    KW: 'KWD',
    BH: 'BHD',
    OM: 'OMR',
    IL: 'ILS',
    TR: 'TRY',
    EG: 'EGP',
    NG: 'NGN',
    KE: 'KES',
    SG: 'SGD',
    MY: 'MYR',
    TH: 'THB',
    ID: 'IDR',
    PH: 'PHP',
    VN: 'VND',
    TW: 'TWD',
    HK: 'HKD',
    MO: 'MOP',
    PK: 'PKR',
    BD: 'BDT',
    LK: 'LKR',
    NP: 'NPR',
    RU: 'RUB',
    UA: 'UAH',
    BY: 'BYN',
    KZ: 'KZT',
    UZ: 'UZS',
    FJ: 'FJD',
    CR: 'CRC',
    PA: 'PAB',
    PE: 'PEN',
    UY: 'UYU',
    PY: 'PYG',
    BO: 'BOB',
    EC: 'USD',
    GT: 'GTQ',
    HN: 'HNL',
    NI: 'NIO',
    SV: 'USD',
    DO: 'DOP',
    JM: 'JMD',
    TT: 'TTD',
    BB: 'BBD',
    BS: 'BSD',
  })
  return map
})()

export function getBrowserLocale() {
  if (typeof navigator === 'undefined') return 'en-US'
  const fromList = navigator.languages?.find(Boolean)
  return fromList || navigator.language || 'en-US'
}

export function getRegionFromLocale(locale) {
  const s = String(locale || '').trim() || 'en-US'
  if (typeof Intl !== 'undefined' && typeof Intl.Locale !== 'undefined') {
    try {
      const loc = new Intl.Locale(s)
      if (loc.region) return loc.region
      const max = loc.maximize()
      if (max.region) return max.region
    } catch {
      // fall through
    }
  }
  const m = s.match(/[-_]([A-Za-z]{2})\s*$/)
  return m ? m[1].toUpperCase() : 'US'
}

export function getCurrencyForRegion(region) {
  const r = String(region || '').toUpperCase()
  return REGION_TO_CURRENCY[r] || 'USD'
}

export function getCurrencyForLocale(locale) {
  return getCurrencyForRegion(getRegionFromLocale(locale))
}

/** @returns {string[]} ISO region codes that have a mapped currency in this app */
export function getKnownRegions() {
  return Object.keys(REGION_TO_CURRENCY).sort()
}

/**
 * Builds a BCP 47 tag using the browser language + selected region (e.g. de + GB → de-GB).
 * @param {string} browserLocale
 * @param {string} region ISO 3166-1 alpha-2
 */
export function mergeLocaleWithRegion(browserLocale, region) {
  const r = String(region || '')
    .trim()
    .toUpperCase()
  if (!r) return getBrowserLocale()
  let lang = 'en'
  try {
    const loc = new Intl.Locale(String(browserLocale || 'en-US'))
    if (loc.language) lang = loc.language
  } catch {
    // keep en
  }
  return `${lang}-${r}`
}

/**
 * @param {number} amount
 * @param {{
 *   region?: string;
 *   locale?: string;
 *   currency?: string;
 *   maximumFractionDigits?: number;
 *   minimumFractionDigits?: number;
 * }} [options]
 * If `region` is set, currency and locale default from that region (plus browser language).
 */
export function formatCurrency(amount, options = {}) {
  const browserLocale = getBrowserLocale()
  let locale = options.locale
  let currency = options.currency

  if (options.region) {
    const r = String(options.region)
      .trim()
      .toUpperCase()
    currency = currency ?? getCurrencyForRegion(r)
    locale = locale ?? mergeLocaleWithRegion(browserLocale, r)
  }

  locale = locale ?? browserLocale
  currency = currency ?? getCurrencyForLocale(locale)

  const fmt = {
    style: 'currency',
    currency,
  }
  if (options.maximumFractionDigits !== undefined) {
    fmt.maximumFractionDigits = options.maximumFractionDigits
  }
  if (options.minimumFractionDigits !== undefined) {
    fmt.minimumFractionDigits = options.minimumFractionDigits
  }
  return new Intl.NumberFormat(locale, fmt).format(Number(amount) || 0)
}

/**
 * @param {{ region?: string }} [options] — pass `region` from the signed-in user for app-wide formatting
 */
export function getRegionalCurrencyMeta(options = {}) {
  const browserLocale = getBrowserLocale()
  const region = options.region
    ? String(options.region)
        .trim()
        .toUpperCase()
    : getRegionFromLocale(browserLocale)
  const currency = getCurrencyForRegion(region)
  const locale = options.region ? mergeLocaleWithRegion(browserLocale, region) : browserLocale
  return { locale, region, currency }
}
