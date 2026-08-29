import './security.css'

import { useEffect, useMemo, useRef, useState } from 'react'

import Highcharts from 'highcharts/es-modules/masters/highmaps.src.js'
import { usePreferences } from '@/app/PreferencesProvider'
import { highchartsTokens } from '@/lib/highchartsTheme'

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

const PULSE_THRESHOLD = 85
const BASE_COUNTRY_COLOR = '#F1F3F5'
const MAP_BACKGROUND = '#FFFFFF'
const COUNTRY_BORDER = '#FFFFFF'

const continentViews: Record<Continent, { center?: [number, number]; zoom?: number }> = {
  all: {},
  asia: { center: [88, 34], zoom: 1.45 },
  europe: { center: [18, 51], zoom: 2.05 },
  africa: { center: [20, 4], zoom: 1.7 },
  americas: { center: [-82, 13], zoom: 1.35 },
  oceania: { center: [138, -25], zoom: 2.05 },
}

function local<T>(locale: 'fa' | 'en', fa: T, en: T): T {
  return locale === 'fa' ? fa : en
}

function severityLabel(locale: 'fa' | 'en', severity: Severity) {
  if (severity === 'critical') return local(locale, 'بحرانی', 'Critical')
  if (severity === 'high') return local(locale, 'بالا', 'High')
  return local(locale, 'متوسط', 'Medium')
}

function severityColor(severity: Severity) {
  if (severity === 'critical') return 'var(--temp-viz-critical)'
  if (severity === 'high') return 'var(--temp-viz-high)'
  return 'var(--temp-viz-medium)'
}

export function SecurityWorldMap({
  items,
  continent,
}: {
  items: SecurityRiskPoint[]
  continent: Continent
}) {
  const { locale } = usePreferences()
  const theme = highchartsTokens
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [topology, setTopology] = useState<object | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
        maximumFractionDigits: 0,
      }),
    [locale],
  )

  useEffect(() => {
    const controller = new AbortController()

    fetch('https://code.highcharts.com/mapdata/custom/world.topo.json', {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('World map failed to load')
        return response.json()
      })
      .then((data) => {
        setTopology(data)
        setLoadState('ready')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setLoadState('error')
      })

    return () => controller.abort()
  }, [])

  const visibleItems = useMemo(
    () =>
      continent === 'all'
        ? items
        : items.filter((item) => item.continents.includes(continent)),
    [continent, items],
  )

  useEffect(() => {
    if (loadState !== 'ready' || !topology || !containerRef.current) return

    const view = continentViews[continent]
    const countryData = visibleItems.map((item) => ({
      'hc-key': item.hcKey,
      color: severityColor(item.severity),
      custom: {
        impact: item.impact,
        likelihood: item.likelihood,
        severity: item.severity,
      },
      name: locale === 'fa' ? item.label : item.labelEn,
      value: item.impact,
    }))

    const alertDots = visibleItems.map((item) => ({
      name: locale === 'fa' ? item.label : item.labelEn,
      lat: item.lat,
      lon: item.lon,
      color: severityColor(item.severity),
      marker: {
        radius: item.severity === 'critical' ? 6 : 5,
        fillColor: severityColor(item.severity),
        lineColor: MAP_BACKGROUND,
        lineWidth: 2,
      },
      custom: {
        impact: item.impact,
        likelihood: item.likelihood,
        severity: item.severity,
      },
    }))

    const pulsePoints = visibleItems
      .filter((item) => item.severity === 'critical' || item.likelihood >= PULSE_THRESHOLD)
      .map((item) => ({
        name: locale === 'fa' ? item.label : item.labelEn,
        lat: item.lat,
        lon: item.lon,
        className: 'security-map-pulse-point',
        marker: {
          radius: 18 + Math.round(item.impact / 18),
          fillColor: 'transparent',
          lineColor: 'var(--temp-viz-critical)',
          lineWidth: 2,
        },
      }))

    try {
      const chart = Highcharts.mapChart(containerRef.current, {
        chart: {
          animation: false,
          backgroundColor: MAP_BACKGROUND,
          height: 600,
          map: topology as never,
          margin: [0, 0, 0, 0],
          panning: { enabled: true, type: 'xy' },
          spacing: [0, 0, 0, 0],
          style: { fontFamily: 'inherit' },
        },
        credits: { enabled: false },
        legend: { enabled: false },
        title: { text: null },
        subtitle: { text: null },
        mapNavigation: {
          enabled: true,
          enableButtons: true,
          enableDoubleClickZoom: true,
          enableMouseWheelZoom: true,
          enableTouchZoom: true,
          buttonOptions: {
            align: 'left',
            verticalAlign: 'bottom',
            x: 12,
            y: -12,
            theme: {
              fill: MAP_BACKGROUND,
              stroke: '#E5E7EB',
              'stroke-width': 1,
              r: 8,
              style: { color: theme.foreground, fontSize: '14px' },
            },
          },
        },
        mapView: {
          padding: 16,
          ...(view.center ? { center: view.center } : {}),
          ...(view.zoom != null ? { zoom: view.zoom } : {}),
        },
        tooltip: {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: 8,
          padding: 12,
          shadow: false,
          useHTML: true,
          formatter() {
            const point = this.point as Highcharts.Point & {
              custom?: { impact: number; likelihood: number; severity: Severity }
            }
            const dir = locale === 'fa' ? 'rtl' : 'ltr'
            const align = locale === 'fa' ? 'right' : 'left'

            if (!point.custom) {
              return `<div dir="${dir}" style="min-width:120px;text-align:${align};font-size:14px"><strong>${point.name ?? ''}</strong></div>`
            }

            const likelihood = numberFormatter.format(point.custom.likelihood)
            const impact = numberFormatter.format(point.custom.impact)
            const percent = locale === 'fa' ? '٪' : '%'

            return `<div dir="${dir}" style="min-width:176px;text-align:${align};font-size:14px"><strong>${point.name ?? ''}</strong><br/><span style="color:${theme.muted}">${local(locale, 'احتمال', 'Likelihood')}</span> · ${likelihood}${percent}<br/><span style="color:${theme.muted}">${local(locale, 'پیامد', 'Impact')}</span> · ${impact}${percent}<br/><span style="color:${theme.muted}">${local(locale, 'شدت', 'Severity')}</span> · ${severityLabel(locale, point.custom.severity)}</div>`
          },
        },
        plotOptions: {
          map: {
            borderWidth: 1,
            states: {
              hover: {
                brightness: -0.03,
                borderColor: COUNTRY_BORDER,
                borderWidth: 1,
              },
            },
          },
          mappoint: {
            animation: false,
            dataLabels: { enabled: false },
          },
        },
        series: [
          {
            type: 'map',
            name: local(locale, 'نقشه جهان', 'World map'),
            data: countryData as never,
            joinBy: 'hc-key',
            allAreas: true,
            nullColor: BASE_COUNTRY_COLOR,
            borderColor: COUNTRY_BORDER,
            borderWidth: 1,
            enableMouseTracking: true,
            showInLegend: false,
            dataLabels: {
              allowOverlap: false,
              enabled: true,
              formatter() {
                const point = this.point as Highcharts.Point & {
                  properties?: { labelrank?: string | number; 'country-abbrev'?: string }
                }
                const zoom = this.series.chart.mapView?.zoom ?? 0
                const labelRank = Number(point.properties?.labelrank ?? 9)

                if (!point.name || zoom < 1.55) return ''
                if (zoom < 2.2 && labelRank > 4) return ''

                return point.properties?.['country-abbrev'] || point.name
              },
              style: {
                color: '#667085',
                fontSize: '10px',
                fontWeight: '500',
                textOutline: '2px #FFFFFF',
              },
            },
          },
          {
            type: 'mappoint',
            name: local(locale, 'تنش شدید', 'High tension'),
            className: 'security-map-pulse-series',
            data: pulsePoints as never,
            dataLabels: { enabled: false },
            enableMouseTracking: false,
            zIndex: 4,
          },
          {
            type: 'mappoint',
            name: local(locale, 'کانون تنش', 'Tension area'),
            data: alertDots as never,
            zIndex: 5,
          },
        ],
      } as Highcharts.Options)

      return () => chart.destroy()
    } catch {
      setLoadState('error')
      return undefined
    }
  }, [continent, loadState, locale, numberFormatter, theme, topology, visibleItems])

  return (
    <div className="security-map-workspace" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <div className="security-map-shell">
        {loadState === 'loading' ? (
          <div className="security-map-state">
            <strong>{local(locale, 'در حال بارگذاری نقشه جهان…', 'Loading world map…')}</strong>
          </div>
        ) : loadState === 'error' ? (
          <div className="security-map-state">
            <strong>{local(locale, 'بارگذاری نقشه ناموفق بود', 'World map failed to load')}</strong>
            <span>
              {local(
                locale,
                'نقشه نتوانست اجرا شود؛ صفحه را یک‌بار بازخوانی کنید.',
                'The map could not start; reload the page once.',
              )}
            </span>
          </div>
        ) : (
          <div ref={containerRef} className="security-world-map" />
        )}
      </div>
    </div>
  )
}
