import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MapsChart, { type HighchartsReactRefObject } from '@highcharts/react/Maps'
import type Highcharts from 'highcharts/es-modules/masters/highmaps.src.js'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { WorldMapDetailPanel } from '@/components/product/WorldMapDetailPanel'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  countryMapData,
  intelligenceMapEvents,
  intelligenceMapRoutes,
} from '@/data/mock/worldMapData'
import { layerLabels } from '@/data/mock/visualMvpData'
import type { CountryRiskLevel, IntelligenceDomain, IntelligenceMapEvent } from '@/types/domain'
import { filterMapEvents, toCountrySeriesData } from './worldMapUtils'

type WorldTopology = Highcharts.GeoJSON | Highcharts.TopoJSON

interface WorldMapProps {
  topologyLoader?: (signal: AbortSignal) => Promise<WorldTopology>
}

const riskOrder: CountryRiskLevel[] = ['low', 'medium', 'high', 'critical']
let highchartsModulesPromise: Promise<unknown> | null = null

function loadHighchartsMapModules() {
  highchartsModulesPromise ??= Promise.all([
    import('highcharts/es-modules/masters/modules/accessibility.src.js'),
    import('highcharts/es-modules/masters/modules/marker-clusters.src.js'),
  ])
  return highchartsModulesPromise
}

export async function loadWorldTopology(signal: AbortSignal): Promise<WorldTopology> {
  const response = await fetch('/world.topo.json', { signal })
  if (!response.ok) throw new Error(`World topology request failed: ${response.status}`)
  return (await response.json()) as WorldTopology
}

function cssToken(name: string, fallback: string) {
  if (typeof document === 'undefined') return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function WorldMap({ topologyLoader = loadWorldTopology }: WorldMapProps) {
  const { locale, theme } = usePreferences()
  const { filters } = useWorkspace()
  const chartRef = useRef<HighchartsReactRefObject | null>(null)
  const selectionTriggerRef = useRef<HTMLElement | null>(null)
  const [topology, setTopology] = useState<WorldTopology | null>(null)
  const [topologyError, setTopologyError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [layerSearch, setLayerSearch] = useState('')
  const [layers, setLayers] = useState<Set<IntelligenceDomain>>(
    new Set(Object.keys(layerLabels) as IntelligenceDomain[]),
  )
  const [listView, setListView] = useState(false)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [timelineNotice, setTimelineNotice] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const isFa = locale === 'fa'
  const reducedMotion = useMemo(
    () =>
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const controller = new AbortController()
    setTopology(null)
    setTopologyError(false)
    Promise.all([loadHighchartsMapModules(), topologyLoader(controller.signal)])
      .then(([, result]) => setTopology(result))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setTopologyError(true)
      })
    return () => controller.abort()
  }, [retryCount, topologyLoader])

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const countries = useMemo(() => toCountrySeriesData(countryMapData), [])
  const visibleEvents = useMemo(
    () => filterMapEvents(intelligenceMapEvents, layers, filters.timeRange, filters.domain),
    [filters.domain, filters.timeRange, layers],
  )
  const selectedCountry = useMemo(
    () => countries.find((item) => item.countryCode === selectedCountryCode) ?? null,
    [countries, selectedCountryCode],
  )
  const selectedEvent = useMemo(
    () => visibleEvents.find((item) => item.id === selectedEventId) ?? null,
    [selectedEventId, visibleEvents],
  )
  const hasVisibleRoutes = useMemo(
    () =>
      intelligenceMapRoutes.some(
        (route) =>
          layers.has(route.category) &&
          (filters.domain === 'all' || route.category === filters.domain),
      ),
    [filters.domain, layers],
  )

  useEffect(() => {
    if (selectedEventId && !visibleEvents.some((item) => item.id === selectedEventId)) {
      setSelectedEventId(null)
      setTimelineNotice(true)
    }
  }, [selectedEventId, visibleEvents])

  const selectCountry = useCallback((code: string, trigger?: HTMLElement | null) => {
    selectionTriggerRef.current = trigger ?? null
    setSelectedCountryCode(code)
    setSelectedEventId(null)
    setTimelineNotice(false)
  }, [])

  const selectEvent = useCallback((event: IntelligenceMapEvent, trigger?: HTMLElement | null) => {
    selectionTriggerRef.current = trigger ?? null
    setSelectedCountryCode(event.countryCode)
    setSelectedEventId(event.id)
    setTimelineNotice(false)
  }, [])

  const closeDetails = useCallback(() => {
    setSelectedCountryCode(null)
    setSelectedEventId(null)
    setTimelineNotice(false)
    requestAnimationFrame(() => selectionTriggerRef.current?.focus())
  }, [])

  const palette = useMemo(
    () => ({
      water: cssToken('--temp-viz-water', theme === 'dark' ? '#101722' : '#f3f7fb'),
      land: cssToken('--temp-viz-land', theme === 'dark' ? '#273242' : '#dce5ee'),
      border: cssToken('--border', theme === 'dark' ? '#465268' : '#aab8c8'),
      foreground: cssToken('--foreground', theme === 'dark' ? '#f5f7fa' : '#172033'),
      muted: cssToken('--muted-foreground', '#657086'),
      surface: cssToken('--surface', theme === 'dark' ? '#171f2d' : '#ffffff'),
      primary: cssToken('--brand-primary-600', '#315efb'),
      route: cssToken('--temp-viz-route', '#f47b45'),
      low: cssToken('--temp-viz-low', '#278c77'),
      medium: cssToken('--temp-viz-medium', '#b87709'),
      high: cssToken('--temp-viz-high', '#d65d38'),
      critical: cssToken('--temp-viz-critical', '#c84555'),
    }),
    [theme],
  )

  const riskLabels = useMemo(
    () => ({
      low: isFa ? 'کم' : 'Low',
      medium: isFa ? 'متوسط' : 'Medium',
      high: isFa ? 'بالا' : 'High',
      critical: isFa ? 'بحرانی' : 'Critical',
    }),
    [isFa],
  )

  const mapClock = useMemo(() => {
    const date = new Intl.DateTimeFormat(isFa ? 'fa-IR-u-ca-gregory' : 'en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(now)
    const time = new Intl.DateTimeFormat(isFa ? 'fa-IR' : 'en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }).format(now)
    return { date, time }
  }, [isFa, now])

  const chartOptions = useMemo<Highcharts.Options | null>(() => {
    if (!topology) return null
    const countryByCode = new Map(countries.map((country) => [country.countryCode, country]))
    const formatDate = (value: string) =>
      new Intl.DateTimeFormat(isFa ? 'fa-IR-u-ca-gregory' : 'en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC',
      }).format(new Date(value))

    const series: Highcharts.SeriesOptionsType[] = [
      {
        type: 'map',
        name: isFa ? 'کشورها' : 'Countries',
        mapData: topology,
        data: countries.map((country) => ({ ...country, color: palette.land })),
        joinBy: ['iso-a3', 'countryCode'],
        allAreas: true,
        color: palette.land,
        nullColor: palette.land,
        borderColor: palette.border,
        borderWidth: 0.7,
        allowPointSelect: true,
        animation: !reducedMotion,
        showInLegend: false,
        states: {
          hover: { color: palette.land, borderColor: palette.primary, borderWidth: 1.5, brightness: 0.08 },
          select: { color: palette.primary, borderColor: palette.foreground, borderWidth: 2 },
        },
        dataLabels: {
          enabled: true,
          format: '{point.countryCode}',
          filter: { property: 'value', operator: '>', value: 68 },
          style: {
            color: palette.foreground,
            fontFamily: isFa ? 'var(--font-sans-fa)' : 'var(--font-sans-en)',
            fontSize: '12px',
            fontWeight: '400',
            textOutline: 'none',
          },
        },
        point: {
          events: {
            click() {
              const code = String((this.options as { countryCode?: string }).countryCode ?? '')
              if (code) {
                selectCountry(code)
                if ('zoomTo' in this && typeof this.zoomTo === 'function') this.zoomTo()
              }
            },
          },
        },
      },
      {
        type: 'mapline',
        name: isFa ? 'مسیرهای پایش‌شده' : 'Monitored routes',
        color: palette.route,
        lineWidth: 1.5,
        dashStyle: 'ShortDash',
        enableMouseTracking: true,
        animation: !reducedMotion,
        showInLegend: false,
        data: intelligenceMapRoutes
          .filter(
            (route) =>
              layers.has(route.category) &&
              (filters.domain === 'all' || route.category === filters.domain),
          )
          .map((route) => ({
            name: isFa ? route.title.fa : route.title.en,
            geometry: { type: 'LineString', coordinates: route.coordinates },
          })),
      },
      {
        type: 'mappoint',
        name: isFa ? 'رویدادهای اطلاعاتی' : 'Intelligence events',
        animation: !reducedMotion,
        showInLegend: false,
        data: visibleEvents.map((event) => ({
          id: event.id,
          name: isFa ? event.titleFa : event.titleEn,
          lat: event.latitude,
          lon: event.longitude,
          color: palette[event.severity],
          marker: { radius: event.severity === 'critical' ? 8 : event.severity === 'high' ? 7 : 6 },
          custom: event,
        })),
        cluster: {
          enabled: true,
          allowOverlap: false,
          animation: !reducedMotion,
          drillToCluster: true,
          minimumClusterSize: 2,
          marker: {
            fillColor: palette.primary,
            lineColor: palette.surface,
            lineWidth: 2,
            radius: 16,
          },
        },
        marker: { lineColor: palette.surface, lineWidth: 2, symbol: 'circle' },
        states: { hover: { halo: { size: 8, opacity: 0.22 } }, select: { lineWidth: 3 } },
        point: {
          events: {
            click() {
              const event = (this.options as { custom?: IntelligenceMapEvent }).custom
              if (event) selectEvent(event)
            },
          },
        },
      },
    ]

    return {
      chart: {
        map: topology,
        backgroundColor: palette.water,
        animation: !reducedMotion,
        height: 560,
        spacing: [16, 16, 16, 16],
      },
      title: { text: undefined },
      mapView: { projection: { name: 'EqualEarth' }, padding: [32, 24, 32, 24] },
      credits: {
        enabled: true,
        text: 'Highcharts Maps · Natural Earth',
        href: 'https://www.highcharts.com/docs/maps/map-collection',
        style: { color: palette.muted, fontSize: '12px' },
      },
      lang: {
        zoomIn: isFa ? 'بزرگ‌نمایی نقشه' : 'Zoom in map',
        zoomOut: isFa ? 'کوچک‌نمایی نقشه' : 'Zoom out map',
        resetZoom: isFa ? 'بازنشانی نما' : 'Reset view',
      },
      mapNavigation: {
        enabled: true,
        enableMouseWheelZoom: true,
        buttonOptions: {
          verticalAlign: 'bottom',
          align: isFa ? 'left' : 'right',
          alignTo: 'spacingBox',
          width: 32,
          height: 32,
          x: 0,
          theme: {
            fill: palette.surface,
            stroke: palette.border,
            'stroke-width': 1,
            r: 6,
            style: { color: palette.foreground, fontSize: '16px' },
            states: {
              hover: { fill: cssToken('--accent', theme === 'dark' ? '#202b3b' : '#eef3f8') },
            },
          },
        },
      },
      legend: { enabled: false },
      tooltip: {
        useHTML: true,
        outside: false,
        backgroundColor: palette.surface,
        borderColor: palette.border,
        borderRadius: 8,
        shadow: true,
        style: { color: palette.foreground, fontSize: '14px' },
        formatter() {
          const options = this.options as {
            countryCode?: string
            custom?: IntelligenceMapEvent
          }
          if (options.custom) {
            const event = options.custom
            return `<div class="highcharts-map-tooltip" dir="${isFa ? 'rtl' : 'ltr'}"><strong>${escapeHtml(isFa ? event.titleFa : event.titleEn)}</strong><span>${escapeHtml(riskLabels[event.severity])} · ${event.sourceCount} ${isFa ? 'منبع' : 'sources'}</span><span dir="ltr">${escapeHtml(formatDate(event.occurredAt))} UTC</span></div>`
          }
          const country = countryByCode.get(String(options.countryCode ?? ''))
          if (!country) return escapeHtml(this.name ?? '')
          const trend =
            country.trend === 'up'
              ? isFa
                ? 'افزایشی'
                : 'Rising'
              : country.trend === 'down'
                ? isFa
                  ? 'کاهشی'
                  : 'Falling'
                : isFa
                  ? 'پایدار'
                  : 'Stable'
          return `<div class="highcharts-map-tooltip" dir="${isFa ? 'rtl' : 'ltr'}"><strong>${escapeHtml(isFa ? country.countryNameFa : country.countryNameEn)} <bdi dir="ltr">${country.countryCode}</bdi></strong><span>${isFa ? 'امتیاز ریسک' : 'Risk score'}: <bdi dir="ltr">${country.value}/100</bdi></span><span>${country.eventCount} ${isFa ? 'رویداد' : 'events'} · ${escapeHtml(riskLabels[country.riskLevel])}</span><span>${isFa ? 'روند' : 'Trend'}: ${escapeHtml(trend)} · ${isFa ? 'اطمینان' : 'Confidence'} <bdi dir="ltr">${country.confidence}%</bdi></span><span>${isFa ? 'به‌روزرسانی' : 'Updated'}: <bdi dir="ltr">${escapeHtml(formatDate(country.updatedAt))} UTC</bdi></span></div>`
        },
      },
      accessibility: {
        enabled: true,
        description: isFa
          ? 'نقشه تعاملی رویدادهای جهان با خوشه‌بندی نقاط، مسیرهای پایش‌شده و نمای فهرست جایگزین.'
          : 'Interactive world event map with marker clustering, monitored routes, and an alternative list view.',
        keyboardNavigation: { enabled: true },
      },
      plotOptions: { series: { animation: !reducedMotion } },
      series,
    }
  }, [
    countries,
    filters.domain,
    isFa,
    layers,
    palette,
    reducedMotion,
    riskLabels,
    selectCountry,
    selectEvent,
    theme,
    topology,
    visibleEvents,
  ])

  const toggleLayer = (domain: IntelligenceDomain) =>
    setLayers((current) => {
      const next = new Set(current)
      if (next.has(domain)) next.delete(domain)
      else next.add(domain)
      return next
    })

  const resetView = () => {
    const chart = chartRef.current?.chart as Highcharts.MapChart | undefined
    chart?.mapView?.setView(undefined, 0, true, !reducedMotion)
  }

  return (
    <div className="map-workspace" dir={isFa ? 'rtl' : 'ltr'}>
      

      {!listView && (
        <div className="map-stage">
          {topologyError ? (
            <div className="map-state-surface">
              <Alert variant="destructive">
                <Icon name="warning-2" />
                <AlertTitle>
                  {isFa ? 'نقشه جهان بارگیری نشد' : 'World map could not load'}
                </AlertTitle>
                <AlertDescription>
                  {isFa
                    ? 'نسخهٔ محلی هندسهٔ جغرافیایی در دسترس نیست. فهرست داده‌ها همچنان قابل استفاده است.'
                    : 'The local geographic topology is unavailable. The data list remains usable.'}
                </AlertDescription>
              </Alert>
              <div>
                <Button onClick={() => setRetryCount((value) => value + 1)}>
                  {isFa ? 'تلاش دوباره' : 'Retry'}
                </Button>
                <Button variant="outline" onClick={() => setListView(true)}>
                  {isFa ? 'نمایش فهرست' : 'Open list view'}
                </Button>
              </div>
            </div>
          ) : !chartOptions ? (
            <div
              className="map-loading"
              aria-label={isFa ? 'در حال بارگیری نقشه جهان' : 'Loading world map'}
            >
              <Skeleton className="map-loading-geometry" />
              <Skeleton className="map-loading-control" />
              <Skeleton className="map-loading-legend" />
            </div>
          ) : (
            <div data-testid="highcharts-world-map" className="highcharts-world-map-shell">
              <MapsChart
                ref={chartRef}
                options={chartOptions}
                chartConstructor="mapChart"
                containerProps={{
                  className: 'highcharts-map-container',
                  dir: isFa ? 'rtl' : 'ltr',
                }}
              />
            </div>
          )}

          <Card className="map-clock" aria-label={isFa ? 'زمان جاری نقشه' : 'Current map time'}>
            <Icon name="clock" size={16} />
            <time dateTime={now.toISOString()}>
              <span>{mapClock.date}</span>
              <bdi dir="ltr">{mapClock.time} UTC</bdi>
            </time>
          </Card>

          {chartOptions && (
            <>
              <Card className="layer-panel">
                <header>
                  <div>
                    <strong>{isFa ? 'لایه‌های اطلاعاتی' : 'Intelligence layers'}</strong>
                    <small>{isFa ? 'نمایش داده روی نقشه' : 'Data shown on the map'}</small>
                  </div>
                  <Badge variant="outline">
                    {layers.size} {isFa ? 'فعال' : 'active'}
                  </Badge>
                </header>
                <InputGroup className="layer-search">
                  <InputGroupInput
                    value={layerSearch}
                    onChange={(event) => setLayerSearch(event.target.value)}
                    placeholder={isFa ? 'جست‌وجو در لایه‌ها…' : 'Search layers…'}
                    aria-label={isFa ? 'جست‌وجو در لایه‌های اطلاعاتی' : 'Search intelligence layers'}
                  />
                  <InputGroupAddon align="inline-start">
                    <Icon name="search-normal" size={16} />
                  </InputGroupAddon>
                </InputGroup>
                <div className="layer-panel-list">
                  {(Object.keys(layerLabels) as IntelligenceDomain[])
                    .filter((key) =>
                      (isFa ? layerLabels[key].fa : layerLabels[key].en)
                        .toLocaleLowerCase(locale)
                        .includes(layerSearch.toLocaleLowerCase(locale)),
                    )
                    .map((key) => (
                      <label key={key} className={layers.has(key) ? 'selected' : ''}>
                        <span className={`legend-symbol layer-${key}`} />
                        <span>{isFa ? layerLabels[key].fa : layerLabels[key].en}</span>
                        <Checkbox
                          checked={layers.has(key)}
                          onCheckedChange={() => toggleLayer(key)}
                        />
                      </label>
                    ))}
                </div>
              </Card>

              <Card className="map-legend" aria-label={isFa ? 'راهنمای نقشه' : 'Map legend'}>
                <strong>{isFa ? 'راهنما' : 'Legend'}</strong>
                <div>
                  {riskOrder.map((risk) => (
                    <Badge variant="outline" className="map-legend-item" key={risk}>
                      <i className={risk} />
                      {riskLabels[risk]}
                    </Badge>
                  ))}
                  {hasVisibleRoutes && (
                    <Badge variant="outline" className="map-legend-item">
                      <i className="route" />
                      {isFa ? 'مسیر پایش' : 'Monitored route'}
                    </Badge>
                  )}
                </div>
              </Card>
            </>
          )}

          {visibleEvents.length === 0 && topology && (
            <Alert className="map-empty-overlay">
              <Icon name="info-circle" />
              <AlertTitle>{isFa ? 'رویداد منطبقی وجود ندارد' : 'No matching events'}</AlertTitle>
              <AlertDescription>
                {isFa
                  ? 'جغرافیای جهان برای حفظ زمینه نمایش داده می‌شود.'
                  : 'Neutral world geography remains visible for context.'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {listView && (
        <div
          className="map-list-alternative"
          aria-label={isFa ? 'فهرست جایگزین نقشه' : 'Map list alternative'}
        >
          <section>
            <h3>{isFa ? 'کشورها' : 'Countries'}</h3>
            {countries.map((country) => (
              <Button
                variant="ghost"
                key={country.countryCode}
                onClick={(event) => selectCountry(country.countryCode, event.currentTarget)}
              >
                <span className={`event-severity ${country.riskLevel}`} />
                <span>
                  <strong>{isFa ? country.countryNameFa : country.countryNameEn}</strong>
                  <small>
                    <bdi dir="ltr">{country.countryCode}</bdi> · {country.eventCount}{' '}
                    {isFa ? 'رویداد' : 'events'}
                  </small>
                </span>
                <bdi dir="ltr">{country.value}/100</bdi>
              </Button>
            ))}
          </section>
          <section>
            <h3>{isFa ? 'رویدادها' : 'Events'}</h3>
            {visibleEvents.length ? (
              visibleEvents.map((item) => (
                <Button
                  variant="ghost"
                  key={item.id}
                  onClick={(event) => selectEvent(item, event.currentTarget)}
                >
                  <span className={`event-severity ${item.severity}`} />
                  <span>
                    <strong>{isFa ? item.titleFa : item.titleEn}</strong>
                    <small>
                      {item.sourceCount} {isFa ? 'منبع' : 'sources'} ·{' '}
                      <bdi dir="ltr">{item.countryCode}</bdi>
                    </small>
                  </span>
                  <time dir="ltr">{item.occurredAt.slice(11, 16)} UTC</time>
                </Button>
              ))
            ) : (
              <p>{isFa ? 'رویداد منطبقی وجود ندارد.' : 'No matching events.'}</p>
            )}
          </section>
        </div>
      )}

      <WorldMapDetailPanel
        country={selectedCountry}
        event={selectedEvent}
        events={visibleEvents}
        timelineNotice={timelineNotice}
        onBackToCountry={() => setSelectedEventId(null)}
        onClose={closeDetails}
      />
    </div>
  )
}
