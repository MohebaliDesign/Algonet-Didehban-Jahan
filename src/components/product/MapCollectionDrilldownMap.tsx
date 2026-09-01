import { useEffect, useMemo, useRef, useState } from 'react'

import Highcharts from 'highcharts/es-modules/masters/highmaps.src.js'

import { usePreferences } from '@/app/PreferencesProvider'

export type MapTensionDatum = {
  hcKey?: string
  isoA3?: string
  nameFa?: string
  nameEn?: string
  score: number
  eventCount?: number
}

export type MapCollectionView = {
  center?: [number, number]
  zoom?: number
}

type MapProperties = Record<string, string | number | null | undefined>

type MapGeometry = {
  properties?: MapProperties
}

type MapCollectionTopology = {
  type: 'Topology'
  objects: {
    default: {
      geometries: MapGeometry[]
    }
  }
  title?: string
  version?: string
  copyright?: string
  copyrightShort?: string
  copyrightUrl?: string
}

type MapPointCustom = {
  level: 'country' | 'subdivision'
  score: number | null
  eventCount?: number
  synthetic?: boolean
  nameFa?: string
  nameEn?: string
  isoA2?: string
  isoA3?: string
}

type MapIndex = {
  version: string
  maps: Record<string, { topojson?: string }>
}

const MAP_COLLECTION_VERSION = '2.3.3'
const MAP_COLLECTION_BASE = `https://code.highcharts.com/mapdata/${MAP_COLLECTION_VERSION}`
const WORLD_TOPOLOGY_URL = '/world.topo.json'
const DRILLDOWN_DURATION = 680

let modulesPromise: Promise<unknown> | null = null
let mapIndexPromise: Promise<MapIndex> | null = null

function loadModules() {
  modulesPromise ??= Promise.all([
    import('highcharts/es-modules/masters/modules/accessibility.src.js'),
    import('highcharts/es-modules/masters/modules/drilldown.src.js'),
  ])
  return modulesPromise
}

function cssToken(name: string, fallback: string) {
  if (typeof document === 'undefined') return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

function pointProperties(point: Highcharts.Point) {
  return (point as Highcharts.Point & { properties?: MapProperties }).properties
}

function stringProperty(properties: MapProperties | undefined, key: string) {
  const value = properties?.[key]
  return value == null ? '' : String(value)
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

function stableOffset(key: string) {
  let hash = 0
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0
  }
  return (hash % 29) - 14
}

function derivedSubdivisionScore(parentScore: number | null, key: string) {
  if (parentScore == null) return null
  return clamp(Math.round(parentScore + stableOffset(key)))
}

function regionName(language: 'fa' | 'en', isoA2: string, fallback: string) {
  if (!isoA2 || isoA2 === '-99') return fallback
  try {
    return new Intl.DisplayNames([language], { type: 'region' }).of(isoA2) ?? fallback
  } catch {
    return fallback
  }
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

async function loadMapIndex() {
  mapIndexPromise ??= fetch(`${MAP_COLLECTION_BASE}/map-index.json`).then((response) => {
    if (!response.ok) throw new Error(`Map index request failed: ${response.status}`)
    return response.json() as Promise<MapIndex>
  })
  return mapIndexPromise
}

async function resolveCountryTopologyUrl(point: Highcharts.Point) {
  const properties = pointProperties(point)
  const hcKey = stringProperty(properties, 'hc-key').toLowerCase()
  const countryName = String(point.name ?? '')

  try {
    const index = await loadMapIndex()
    const exact = index.maps[`Countries/${countryName}`]
    if (exact?.topojson) return exact.topojson

    const prefixed = Object.entries(index.maps).find(
      ([name, value]) =>
        name.startsWith(`Countries/${countryName}`) &&
        !name.toLowerCase().includes('admin2') &&
        Boolean(value.topojson),
    )
    if (prefixed?.[1].topojson) return prefixed[1].topojson
  } catch {
    // Fall through to the canonical hc-key URL used by the collection.
  }

  if (!hcKey) return null
  return `${MAP_COLLECTION_BASE}/countries/${hcKey}/${hcKey}-all.topo.json`
}

async function fetchCountryTopology(point: Highcharts.Point) {
  const url = await resolveCountryTopologyUrl(point)
  if (!url) return null
  const response = await fetch(url)
  if (!response.ok) return null
  return (await response.json()) as MapCollectionTopology
}

function getCountryDatum(
  properties: MapProperties | undefined,
  byIsoA3: Map<string, MapTensionDatum>,
  byHcKey: Map<string, MapTensionDatum>,
) {
  const isoA3 = stringProperty(properties, 'iso-a3').toUpperCase()
  const hcKey = stringProperty(properties, 'hc-key').toLowerCase()
  return byIsoA3.get(isoA3) ?? byHcKey.get(hcKey) ?? null
}

function worldLabel(point: Highcharts.Point) {
  const properties = pointProperties(point)
  return stringProperty(properties, 'hc-a2') || stringProperty(properties, 'iso-a2')
}

function subdivisionLabel(point: Highcharts.Point, parentHcKey: string) {
  if (parentHcKey === 'us') {
    const properties = pointProperties(point)
    return (
      stringProperty(properties, 'hc-a2') ||
      stringProperty(properties, 'postal-code') ||
      String(point.name ?? '')
    )
  }
  return String(point.name ?? '')
}

export function MapCollectionDrilldownMap({
  tensionData,
  height = 600,
  view,
  className,
}: {
  tensionData: MapTensionDatum[]
  height?: number
  view?: MapCollectionView
  className?: string
}) {
  const { locale, theme } = usePreferences()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [topology, setTopology] = useState<MapCollectionTopology | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const isFa = locale === 'fa'

  const reducedMotion = useMemo(
    () =>
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const palette = useMemo(
    () => ({
      surface: cssToken('--surface', theme === 'dark' ? '#161616' : '#ffffff'),
      foreground: cssToken('--foreground', theme === 'dark' ? '#f3f5f7' : '#172033'),
      muted: cssToken('--muted-foreground', theme === 'dark' ? '#9aa4b2' : '#667085'),
      border: cssToken('--map-country-border', theme === 'dark' ? '#3a424d' : '#c2c8d0'),
      hoverBorder: cssToken('--primary', theme === 'dark' ? '#7193ff' : '#416dff'),
      noData: cssToken('--map-neutral-country', theme === 'dark' ? '#222832' : '#f1f3f5'),
      low: cssToken('--temp-viz-low', '#0e7490'),
      medium: cssToken('--temp-viz-medium', '#b46b0b'),
      high: cssToken('--temp-viz-high', '#d05a31'),
      critical: cssToken('--temp-viz-critical', '#c33b42'),
    }),
    [theme],
  )

  const byIsoA3 = useMemo(
    () =>
      new Map(
        tensionData
          .filter((item) => item.isoA3)
          .map((item) => [item.isoA3!.toUpperCase(), item] as const),
      ),
    [tensionData],
  )
  const byHcKey = useMemo(
    () =>
      new Map(
        tensionData
          .filter((item) => item.hcKey)
          .map((item) => [item.hcKey!.toLowerCase(), item] as const),
      ),
    [tensionData],
  )

  useEffect(() => {
    const controller = new AbortController()
    setLoadState('loading')

    Promise.all([
      loadModules(),
      fetch(WORLD_TOPOLOGY_URL, { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error(`World topology request failed: ${response.status}`)
        return response.json() as Promise<MapCollectionTopology>
      }),
    ])
      .then(([, worldTopology]) => {
        setTopology(worldTopology)
        setLoadState('ready')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setLoadState('error')
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (loadState !== 'ready' || !topology || !containerRef.current) return

    const worldData = topology.objects.default.geometries.map((geometry) => {
      const properties = geometry.properties
      const datum = getCountryDatum(properties, byIsoA3, byHcKey)
      const key = stringProperty(properties, 'hc-key')
      const isoA2 = stringProperty(properties, 'iso-a2').toUpperCase()
      const isoA3 = stringProperty(properties, 'iso-a3').toUpperCase()
      const nameEn = stringProperty(properties, 'name') || key.toUpperCase()

      return {
        key,
        drilldown: key || undefined,
        value: datum?.score ?? null,
        custom: {
          level: 'country',
          score: datum?.score ?? null,
          eventCount: datum?.eventCount,
          nameFa: datum?.nameFa ?? regionName('fa', isoA2, nameEn),
          nameEn: datum?.nameEn ?? nameEn,
          isoA2,
          isoA3,
        } satisfies MapPointCustom,
      }
    })

    const chart = Highcharts.mapChart(containerRef.current, {
      accessibility: {
        enabled: true,
        description: isFa
          ? 'نقشهٔ تعاملی جهان با رنگ‌بندی شدت تنش و امکان ورود به تقسیمات کشوری.'
          : 'Interactive world map colored by tension intensity with country subdivision drilldown.',
        series: {
          descriptionFormat: '{series.name}, map with {series.points.length} areas.',
          pointDescriptionEnabledThreshold: 50,
        },
      },
      chart: {
        animation: reducedMotion ? false : { duration: DRILLDOWN_DURATION },
        backgroundColor: palette.surface,
        height,
        map: topology as unknown as Highcharts.TopoJSON,
        spacing: [12, 12, 12, 12],
        style: {
          fontFamily: isFa ? 'var(--font-sans-fa)' : 'var(--font-sans-en)',
        },
        events: {
          async drilldown(event) {
            if (event.seriesOptions) return

            const point = event.point as Highcharts.Point
            const options = point.options as { custom?: MapPointCustom }
            const parentScore = options.custom?.score ?? null
            const parentHcKey = stringProperty(pointProperties(point), 'hc-key').toLowerCase()

            this.showLoading(
              isFa ? 'در حال بارگذاری تقسیمات کشوری…' : 'Loading country subdivisions…',
            )

            try {
              const countryTopology = await fetchCountryTopology(point)
              if (!countryTopology) {
                this.showLoading(
                  isFa
                    ? 'نقشهٔ جزئیات این کشور در مجموعهٔ Highcharts موجود نیست.'
                    : 'A detailed map is not available for this country in the Highcharts collection.',
                )
                window.setTimeout(() => this.hideLoading(), 1200)
                return
              }

              const subdivisions = countryTopology.objects.default.geometries.map((geometry) => {
                const properties = geometry.properties
                const key = stringProperty(properties, 'hc-key')
                const score = derivedSubdivisionScore(parentScore, key)
                return {
                  key,
                  value: score,
                  custom: {
                    level: 'subdivision',
                    score,
                    synthetic: score != null,
                  } satisfies MapPointCustom,
                }
              })

              this.hideLoading()
              this.addSeriesAsDrilldown(
                point,
                {
                  type: 'map',
                  name: String(point.name ?? countryTopology.title ?? 'Country'),
                  mapData: countryTopology as unknown as Highcharts.TopoJSON,
                  data: subdivisions as never,
                  joinBy: ['hc-key', 'key'],
                  nullColor: palette.noData,
                  borderColor: palette.border,
                  borderWidth: 0.72,
                  dataLabels: {
                    allowOverlap: false,
                    enabled: true,
                    formatter() {
                      return subdivisionLabel(this.point as Highcharts.Point, parentHcKey)
                    },
                    style: {
                      color: palette.foreground,
                      fontFamily: 'var(--font-sans-en)',
                      fontSize: '11px',
                      fontWeight: '500',
                      textOutline: `2px ${palette.surface}`,
                    },
                  },
                  custom: {
                    mapName: countryTopology.title ?? String(point.name ?? ''),
                    mapVersion: countryTopology.version ?? MAP_COLLECTION_VERSION,
                    parentScore,
                  },
                } as never,
              )
              this.credits?.update()
            } catch {
              this.showLoading(
                isFa ? 'بارگذاری جزئیات نقشه ناموفق بود.' : 'Failed to load detailed map.',
              )
              window.setTimeout(() => this.hideLoading(), 1200)
            }
          },
          afterDrilldown() {
            this.credits?.update()
          },
          afterDrillUp() {
            this.credits?.update()
          },
        },
      },
      colorAxis: {
        min: 0,
        max: 100,
        stops: [
          [0, palette.low],
          [0.35, palette.medium],
          [0.7, palette.high],
          [1, palette.critical],
        ],
        tickPositions: [0, 25, 50, 75, 100],
        labels: {
          style: {
            color: palette.muted,
            fontFamily: 'var(--font-sans-en)',
            fontSize: '10px',
          },
        },
      },
      credits: {
        enabled: true,
        style: { color: palette.muted, fontSize: '10px' },
      },
      drilldown: {
        mapZooming: true,
        animation: reducedMotion ? false : { duration: DRILLDOWN_DURATION },
        activeDataLabelStyle: {
          color: palette.foreground,
          fontWeight: '500',
          textDecoration: 'none',
        },
        breadcrumbs: {
          buttonTheme: {
            fill: palette.surface,
            stroke: palette.border,
            'stroke-width': 1,
            r: 8,
            style: {
              color: palette.foreground,
              fontFamily: isFa ? 'var(--font-sans-fa)' : 'var(--font-sans-en)',
              fontSize: '12px',
              fontWeight: '500',
            },
            states: {
              hover: { fill: cssToken('--accent', theme === 'dark' ? '#20242b' : '#f2f4f7') },
            },
          },
          position: {
            align: 'left',
            x: 10,
            y: 10,
          },
          showFullPath: false,
        },
      },
      legend: {
        enabled: true,
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'bottom',
        floating: true,
        x: 8,
        y: -8,
        padding: 8,
        backgroundColor: palette.surface,
        borderColor: palette.border,
        borderWidth: 1,
        borderRadius: 8,
        itemStyle: {
          color: palette.foreground,
          fontFamily: 'var(--font-sans-en)',
          fontSize: '11px',
          fontWeight: '500',
        },
      },
      mapNavigation: {
        enabled: true,
        enableButtons: true,
        enableDoubleClickZoom: true,
        enableMouseWheelZoom: true,
        enableTouchZoom: true,
        buttonOptions: {
          align: 'left',
          alignTo: 'spacingBox',
          verticalAlign: 'top',
          width: 32,
          height: 32,
          x: 10,
          y: 10,
          theme: {
            fill: palette.surface,
            stroke: palette.border,
            'stroke-width': 1,
            r: 8,
            style: { color: palette.foreground, fontSize: '14px' },
            states: {
              hover: { fill: cssToken('--accent', theme === 'dark' ? '#20242b' : '#f2f4f7') },
            },
          },
        },
      },
      mapView: {
        padding: 18,
        ...(view?.center ? { center: view.center } : {}),
        ...(view?.zoom != null ? { zoom: view.zoom } : {}),
      },
      plotOptions: {
        map: {
          animation: reducedMotion ? false : { duration: DRILLDOWN_DURATION },
          borderColor: palette.border,
          borderWidth: 0.72,
          nullColor: palette.noData,
          states: {
            hover: {
              borderColor: palette.hoverBorder,
              borderWidth: 1.2,
              brightness: theme === 'dark' ? 0.08 : -0.04,
            },
          },
        },
      },
      responsive: {
        rules: [
          {
            condition: { maxWidth: 752 },
            chartOptions: {
              colorAxis: { layout: 'horizontal' },
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                x: 0,
              },
              mapNavigation: {
                buttonOptions: { verticalAlign: 'top' },
              },
            },
          },
        ],
      },
      series: [
        {
          type: 'map',
          name: isFa ? 'شاخص تنش کشورها' : 'Country tension index',
          mapData: topology as unknown as Highcharts.TopoJSON,
          data: worldData as never,
          joinBy: ['hc-key', 'key'],
          nullColor: palette.noData,
          borderColor: palette.border,
          borderWidth: 0.72,
          dataLabels: {
            allowOverlap: false,
            enabled: true,
            formatter() {
              return worldLabel(this.point as Highcharts.Point)
            },
            style: {
              color: palette.foreground,
              fontFamily: 'var(--font-sans-en)',
              fontSize: '10px',
              fontWeight: '500',
              textOutline: `2px ${palette.surface}`,
            },
          },
          custom: {
            mapName: topology.title ?? 'World, medium resolution',
            mapVersion: topology.version ?? MAP_COLLECTION_VERSION,
          },
        },
      ],
      title: { text: undefined },
      tooltip: {
        useHTML: true,
        backgroundColor: palette.surface,
        borderColor: palette.border,
        borderRadius: 8,
        padding: 10,
        shadow: false,
        style: {
          color: palette.foreground,
          fontFamily: isFa ? 'var(--font-sans-fa)' : 'var(--font-sans-en)',
          fontSize: '13px',
        },
        formatter() {
          const point = this as Highcharts.Point
          const options = point.options as { custom?: MapPointCustom }
          const custom = options.custom
          if (!custom) return escapeHtml(point.name ?? '')

          if (custom.level === 'country') {
            const englishName = custom.nameEn ?? String(point.name ?? '')
            const persianName = custom.nameFa ?? englishName
            const identity = isFa
              ? `<strong><span dir="ltr" class="map-label-en">${escapeHtml(englishName)}</span><span>${escapeHtml(persianName)}</span></strong>`
              : `<strong><span dir="ltr" class="map-label-en">${escapeHtml(englishName)}</span></strong>`
            const scoreRow =
              custom.score == null
                ? `<span>${isFa ? 'دادهٔ تنش این کشور در نمونهٔ فعلی موجود نیست' : 'No local tension fixture for this country'}</span>`
                : `<span>${isFa ? 'شاخص تنش' : 'Tension index'}: <bdi dir="ltr">${custom.score}/100</bdi></span>`
            const eventRow =
              custom.eventCount == null
                ? ''
                : `<span>${isFa ? 'رویدادهای این نمای زمانی' : 'Events in this time view'}: <bdi dir="ltr">${custom.eventCount}</bdi></span>`
            return `<div class="map-collection-tooltip" dir="${isFa ? 'rtl' : 'ltr'}">${identity}${scoreRow}${eventRow}<small>${isFa ? 'برای مشاهده تقسیمات کشوری کلیک کنید' : 'Click to explore subdivisions'}</small></div>`
          }

          const scoreRow =
            custom.score == null
              ? `<span>${isFa ? 'دادهٔ تنش استانی متصل نیست' : 'No subdivision tension data connected'}</span>`
              : `<span>${isFa ? 'شاخص تنش نمونه' : 'Prototype tension index'}: <bdi dir="ltr">${custom.score}/100</bdi></span>`
          const prototypeNotice = custom.synthetic
            ? `<small>${isFa ? 'مقدار نمایشی مشتق‌شده از شاخص کشور؛ دادهٔ واقعی استان متصل نیست.' : 'Prototype value derived from the country index; no live subdivision data is connected.'}</small>`
            : ''
          return `<div class="map-collection-tooltip" dir="${isFa ? 'rtl' : 'ltr'}"><strong><span dir="ltr" class="map-label-en">${escapeHtml(point.name ?? '')}</span></strong>${scoreRow}${prototypeNotice}</div>`
        },
      },
    } as Highcharts.Options)

    return () => chart.destroy()
  }, [
    byHcKey,
    byIsoA3,
    height,
    isFa,
    loadState,
    palette,
    reducedMotion,
    theme,
    topology,
    view?.center,
    view?.zoom,
  ])

  if (loadState === 'loading') {
    return (
      <div className={`map-collection-state ${className ?? ''}`} style={{ minHeight: height }}>
        <strong>{isFa ? 'در حال بارگذاری نقشه جهان…' : 'Loading world map…'}</strong>
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <div className={`map-collection-state ${className ?? ''}`} style={{ minHeight: height }}>
        <strong>{isFa ? 'بارگذاری نقشه جهان ناموفق بود' : 'World map failed to load'}</strong>
        <span>
          {isFa
            ? 'هندسهٔ محلی نقشه در دسترس نیست؛ صفحه را دوباره بارگذاری کنید.'
            : 'The local map geometry is unavailable; reload the page.'}
        </span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`map-collection-chart ${className ?? ''}`}
      style={{ height }}
      dir={isFa ? 'rtl' : 'ltr'}
    />
  )
}
