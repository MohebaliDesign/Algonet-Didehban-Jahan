import './security.css'

import { useMemo } from 'react'

import {
  MapCollectionDrilldownMap,
  type MapCollectionView,
  type MapTensionDatum,
} from '@/components/product/MapCollectionDrilldownMap'

export type Continent = 'all' | 'asia' | 'europe' | 'africa' | 'americas' | 'oceania'
export type Severity = 'medium' | 'high' | 'critical'

export type SecurityRiskPoint = {
  label: string
  labelEn: string
  hcKey: string
  likelihood: number
  impact: number
  severity: Severity
  lat: number
  lon: number
  continents: Exclude<Continent, 'all'>[]
}

const continentViews: Record<Continent, MapCollectionView> = {
  all: {},
  asia: { center: [88, 34], zoom: 1.45 },
  europe: { center: [18, 51], zoom: 2.05 },
  africa: { center: [20, 4], zoom: 1.7 },
  americas: { center: [-82, 13], zoom: 1.35 },
  oceania: { center: [138, -25], zoom: 2.05 },
}

export function SecurityWorldMap({
  items,
  continent,
}: {
  items: SecurityRiskPoint[]
  continent: Continent
}) {
  const tensionData = useMemo<MapTensionDatum[]>(
    () =>
      items
        .filter((item) => continent === 'all' || item.continents.includes(continent))
        .map((item) => ({
          hcKey: item.hcKey.toLowerCase(),
          nameFa: item.label,
          nameEn: item.labelEn,
          score: Math.min(100, Math.round((item.likelihood + item.impact) / 2)),
        })),
    [continent, items],
  )

  return (
    <div className="security-map-workspace">
      <div className="security-map-shell">
        <MapCollectionDrilldownMap
          tensionData={tensionData}
          height={600}
          view={continentViews[continent]}
          className="security-world-map"
        />
      </div>
    </div>
  )
}
