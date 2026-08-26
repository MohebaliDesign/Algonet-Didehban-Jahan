import type { CountryMapDatum, IntelligenceDomain, IntelligenceMapEvent } from '@/types/domain'

const timeRangeHours: Record<string, number> = {
  '24h': 24,
  '7d': 24 * 7,
  '30d': 24 * 30,
}

export function normalizeCountryValue(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function toCountrySeriesData(countries: CountryMapDatum[]) {
  return countries.map((country) => ({
    ...country,
    value: normalizeCountryValue(country.value),
  }))
}

export function filterMapEvents(
  events: IntelligenceMapEvent[],
  layers: ReadonlySet<IntelligenceDomain>,
  timeRange: string,
  domain: IntelligenceDomain | 'all',
) {
  const rangeHours = timeRangeHours[timeRange] ?? timeRangeHours['24h']
  const validTimes = events
    .map((event) => Date.parse(event.occurredAt))
    .filter((value) => Number.isFinite(value))
  const referenceTime = validTimes.length ? Math.max(...validTimes) : Number.POSITIVE_INFINITY
  const rangeStart = referenceTime - rangeHours * 60 * 60 * 1000

  return events.filter((event) => {
    const occurredAt = Date.parse(event.occurredAt)
    return (
      Number.isFinite(occurredAt) &&
      occurredAt >= rangeStart &&
      occurredAt <= referenceTime &&
      layers.has(event.domain) &&
      (domain === 'all' || event.domain === domain)
    )
  })
}

export function hasIsoAlpha3Join(country: CountryMapDatum) {
  return /^[A-Z]{3}$/.test(country.countryCode)
}
