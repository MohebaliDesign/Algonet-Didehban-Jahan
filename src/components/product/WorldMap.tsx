import { useMemo, useState } from 'react'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import {
  MapCollectionDrilldownMap,
  type MapTensionDatum,
} from '@/components/product/MapCollectionDrilldownMap'
import {
  MapOverlayControls,
  type MapLayerControlOption,
} from '@/components/product/MapOverlayControls'
import { WorldMapDetailPanel } from '@/components/product/WorldMapDetailPanel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { countryMapData, intelligenceMapEvents } from '@/data/mock/worldMapData'
import { layerLabels } from '@/data/mock/visualMvpData'
import { useIsMobile } from '@/hooks/use-mobile'
import type { IntelligenceDomain } from '@/types/domain'
import { filterMapEvents } from './worldMapUtils'

const allDomains = new Set(Object.keys(layerLabels) as IntelligenceDomain[])

const layerColorClasses: Record<IntelligenceDomain, string> = {
  conflict: 'layer-conflict',
  political: 'layer-political',
  military: 'layer-military',
  economic: 'layer-economic',
  hazard: 'layer-hazard',
  infrastructure: 'layer-infrastructure',
  maritime: 'layer-maritime',
  cyber: 'layer-cyber',
}

function eventWeight(severity: 'low' | 'medium' | 'high' | 'critical') {
  if (severity === 'critical') return 10
  if (severity === 'high') return 7
  if (severity === 'medium') return 4
  return 2
}

export function WorldMap() {
  const { locale } = usePreferences()
  const { filters } = useWorkspace()
  const isMobile = useIsMobile()
  const [view, setView] = useState<'map' | 'list'>('map')
  const [selectedLayers, setSelectedLayers] = useState<Set<IntelligenceDomain>>(
    () => new Set(allDomains),
  )
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const isFa = locale === 'fa'

  const visibleEvents = useMemo(
    () => filterMapEvents(intelligenceMapEvents, selectedLayers, filters.timeRange, filters.domain),
    [filters.domain, filters.timeRange, selectedLayers],
  )

  const tensionData = useMemo<MapTensionDatum[]>(
    () =>
      countryMapData.map((country) => {
        const countryEvents = visibleEvents.filter((event) => event.countryCode === country.countryCode)
        const eventPressure = countryEvents.reduce((sum, event) => sum + eventWeight(event.severity), 0)

        return {
          isoA3: country.countryCode,
          nameFa: country.countryNameFa,
          nameEn: country.countryNameEn,
          score: Math.min(100, Math.round(country.value * 0.92 + eventPressure)),
          eventCount: countryEvents.length,
        }
      }),
    [visibleEvents],
  )

  const layerOptions = useMemo<MapLayerControlOption[]>(
    () =>
      (Object.keys(layerLabels) as IntelligenceDomain[]).map((domain) => ({
        id: domain,
        label: layerLabels[domain][locale],
        colorClass: layerColorClasses[domain],
        count: intelligenceMapEvents.filter((event) => event.domain === domain).length,
      })),
    [locale],
  )

  const selectedCountry = useMemo(
    () => countryMapData.find((country) => country.countryCode === selectedCountryCode) ?? null,
    [selectedCountryCode],
  )
  const selectedEvent = useMemo(
    () => visibleEvents.find((event) => event.id === selectedEventId) ?? null,
    [selectedEventId, visibleEvents],
  )

  const toggleLayer = (id: string, checked: boolean) => {
    setSelectedLayers((current) => {
      const next = new Set(current)
      const domain = id as IntelligenceDomain
      if (checked) next.add(domain)
      else next.delete(domain)
      return next
    })
  }

  const closeDetails = () => {
    setSelectedCountryCode(null)
    setSelectedEventId(null)
  }

  return (
    <div className="map-workspace map-collection-workspace" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="map-view-switcher">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(next) => next && setView(next as 'map' | 'list')}
          aria-label={isFa ? 'شیوه نمایش نقشه' : 'Map display mode'}
        >
          <ToggleGroupItem value="map">{isFa ? 'نقشه' : 'Map'}</ToggleGroupItem>
          <ToggleGroupItem value="list">{isFa ? 'فهرست' : 'List'}</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <MapOverlayControls
        isFa={isFa}
        layers={layerOptions}
        selectedLayerIds={selectedLayers}
        onLayerToggle={toggleLayer}
      />

      {view === 'map' ? (
        <MapCollectionDrilldownMap
          tensionData={tensionData}
          height={isMobile ? 520 : 560}
          className="world-map-collection"
        />
      ) : (
        <div
          className="map-accessible-list"
          aria-label={isFa ? 'فهرست جایگزین نقشه' : 'Alternative map list'}
        >
          {visibleEvents.length ? (
            visibleEvents.map((event) => (
              <Button
                key={event.id}
                type="button"
                variant="ghost"
                className="map-accessible-list-item"
                onClick={() => {
                  setSelectedCountryCode(event.countryCode)
                  setSelectedEventId(event.id)
                }}
              >
                <span>
                  <strong>{isFa ? event.titleFa : event.titleEn}</strong>
                  <small>
                    {event.sourceCount} {isFa ? 'منبع' : 'sources'} · {event.confidence}%
                  </small>
                </span>
                <Badge variant="outline" className={`risk-badge risk-${event.severity}`}>
                  {isFa
                    ? event.severity === 'critical'
                      ? 'بحرانی'
                      : event.severity === 'high'
                        ? 'بالا'
                        : event.severity === 'medium'
                          ? 'متوسط'
                          : 'کم'
                    : event.severity}
                </Badge>
              </Button>
            ))
          ) : (
            <p>{isFa ? 'رویدادی در این بازه و لایه‌ها وجود ندارد.' : 'No events match this time range and layer selection.'}</p>
          )}
        </div>
      )}

      <WorldMapDetailPanel
        country={selectedCountry}
        event={selectedEvent}
        events={visibleEvents}
        timelineNotice={false}
        onBackToCountry={() => setSelectedEventId(null)}
        onClose={closeDetails}
      />
    </div>
  )
}
