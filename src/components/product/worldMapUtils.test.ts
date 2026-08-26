import { describe, expect, it } from 'vitest'

import { countryMapData, intelligenceMapEvents } from '@/data/mock/worldMapData'
import {
  filterMapEvents,
  hasIsoAlpha3Join,
  normalizeCountryValue,
  toCountrySeriesData,
} from './worldMapUtils'

describe('world map data normalization', () => {
  it('uses valid ISO Alpha-3 country joins and clamps country values', () => {
    expect(countryMapData.every(hasIsoAlpha3Join)).toBe(true)
    expect(normalizeCountryValue(-8)).toBe(0)
    expect(normalizeCountryValue(108)).toBe(100)
    expect(
      toCountrySeriesData(countryMapData, 24).every((item) => item.value >= 0 && item.value <= 100),
    ).toBe(true)
  })

  it('filters layers, product domain, and timeline snapshots deterministically', () => {
    const layers = new Set(['maritime', 'infrastructure'] as const)
    const morning = filterMapEvents(intelligenceMapEvents, layers, 10, 'all')
    expect(morning.map((event) => event.id)).toEqual(['evt-caucasus'])
    expect(
      filterMapEvents(intelligenceMapEvents, layers, 24, 'maritime').map((event) => event.id),
    ).toEqual(['evt-hormuz'])
    expect(filterMapEvents(intelligenceMapEvents, new Set(), 24, 'all')).toEqual([])
  })
})
