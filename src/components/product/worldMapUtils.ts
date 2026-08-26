import type { CountryMapDatum, IntelligenceDomain, IntelligenceMapEvent } from '@/types/domain'

export function normalizeCountryValue(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function toCountrySeriesData(countries: CountryMapDatum[], timelineHour: number) {
  const timeFactor = 0.78 + Math.max(0, Math.min(24, timelineHour)) / 110
  return countries.map((country) => ({
    ...country,
    value: normalizeCountryValue(country.value * timeFactor),
  }))
}

export function filterMapEvents(
  events: IntelligenceMapEvent[],
  layers: ReadonlySet<IntelligenceDomain>,
  timelineHour: number,
  domain: IntelligenceDomain | 'all',
) {
  return events.filter((event) => {
    const eventHour = Number(event.occurredAt.slice(11, 13))
    return (
      eventHour <= timelineHour &&
      layers.has(event.domain) &&
      (domain === 'all' || event.domain === domain)
    )
  })
}

export function hasIsoAlpha3Join(country: CountryMapDatum) {
  return /^[A-Z]{3}$/.test(country.countryCode)
}
