import './security.css'

import { useEffect, useMemo, useRef, useState } from 'react'

import Highcharts from 'highcharts/es-modules/masters/highmaps.src.js'
import { usePreferences } from '@/app/PreferencesProvider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { highchartsTokens } from '@/lib/highchartsTheme'

type Continent = 'all' | 'asia' | 'europe' | 'africa' | 'americas' | 'oceania'
type Severity = 'medium' | 'high' | 'critical'

export type SecurityRiskPoint = {
  label: string
  labelEn: string
  likelihood: number
  impact: number
  severity: Severity
  lat: number
  lon: number
  continents: Exclude<Continent, 'all'>[]
}

const continentOptions: Array<{ value: Continent; fa: string; en: string }> = [
  { value: 'all', fa: 'همه قاره‌ها', en: 'All continents' },
  { value: 'asia', fa: 'آسیا', en: 'Asia' },
  { value: 'europe', fa: 'اروپا', en: 'Europe' },
  { value: 'africa', fa: 'آفریقا', en: 'Africa' },
  { value: 'americas', fa: 'آمریکا', en: 'Americas' },
  { value: 'oceania', fa: 'اقیانوسیه', en: 'Oceania' },
]

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

export function SecurityWorldMap({ items }: { items: SecurityRiskPoint[] }) {
  const { locale } = usePreferences()
  const theme = highchartsTokens
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [continent, setContinent] = useState<Continent>('all')
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
    const points = visibleItems.map((item) => ({
      name: locale === 'fa' ? item.label : item.labelEn,
      lat: item.lat,
      lon: item.lon,
      color: severityColor(item.severity),
      marker: {
        radius: 7 + Math.round(item.impact / 18),
        fillColor: severityColor(item.severity),
        lineColor: theme.surface,
        lineWidth: 2,
      },
      custom: {
        impact: item.impact,
        likelihood: item.likelihood,
        severity: item.severity,
      },
    }))

    try {
      const chart = Highcharts.mapChart(containerRef.current, {
        chart: {
          animation: false,
          backgroundColor: theme.water,
          height: 520,
          margin: [0, 0, 0, 0],
          spacing: [0, 0, 0, 0],
          style: { fontFamily: 'inherit' },
        },
        credits: { enabled: false },
        legend: { enabled: false },
        mapNavigation: {
          enabled: true,
          enableDoubleClickZoom: true,
          enableMouseWheelZoom: true,
          buttonOptions: {
            align: 'left',
            verticalAlign: 'bottom',
            theme: {
              fill: theme.surface,
              stroke: theme.border,
              'stroke-width': 1,
              r: 8,
              style: { color: theme.foreground, fontSize: '14px' },
            },
          },
        },
        mapView: {
          projection: { name: 'EqualEarth' },
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
            if (!point.custom) return false

            const likelihood = numberFormatter.format(point.custom.likelihood)
            const impact = numberFormatter.format(point.custom.impact)
            const percent = locale === 'fa' ? '٪' : '%'
            const dir = locale === 'fa' ? 'rtl' : 'ltr'
            const align = locale === 'fa' ? 'right' : 'left'

            return `<div dir="${dir}" style="min-width:176px;text-align:${align};font-size:14px"><strong>${point.name ?? ''}</strong><br/><span style="color:${theme.muted}">${local(locale, 'احتمال', 'Likelihood')}</span> · ${likelihood}${percent}<br/><span style="color:${theme.muted}">${local(locale, 'پیامد', 'Impact')}</span> · ${impact}${percent}<br/><span style="color:${theme.muted}">${local(locale, 'شدت', 'Severity')}</span> · ${severityLabel(locale, point.custom.severity)}</div>`
          },
        },
        plotOptions: {
          mappoint: {
            animation: false,
            dataLabels: {
              allowOverlap: false,
              enabled: true,
              useHTML: true,
              formatter() {
                const point = this.point as Highcharts.Point & {
                  custom?: { impact: number; likelihood: number }
                }
                const zoom = this.series.chart.mapView?.zoom ?? 0
                if (!point.name) return ''
                if (zoom < 1.65 || !point.custom) return point.name

                const likelihood = numberFormatter.format(point.custom.likelihood)
                const impact = numberFormatter.format(point.custom.impact)
                const percent = locale === 'fa' ? '٪' : '%'
                return `<span class="security-map-label-title">${point.name}</span><br/><span class="security-map-label-meta">${local(locale, 'احتمال', 'Likelihood')} ${likelihood}${percent} · ${local(locale, 'پیامد', 'Impact')} ${impact}${percent}</span>`
              },
              style: {
                color: theme.foreground,
                fontSize: '12px',
                fontWeight: '500',
                textOutline: 'none',
              },
            },
          },
        },
        series: [
          {
            type: 'map',
            name: local(locale, 'نقشه جهان', 'World map'),
            mapData: topology as never,
            data: [],
            allAreas: true,
            nullColor: theme.land,
            borderColor: theme.border,
            borderWidth: 0.6,
            enableMouseTracking: false,
            showInLegend: false,
          },
          {
            type: 'mappoint',
            name: local(locale, 'کانون تنش', 'Tension area'),
            data: points as never,
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
      <div className="security-map-toolbar">
        <div className="security-map-scope">
          <strong>{local(locale, 'نمای جغرافیایی تنش‌ها', 'Geographic tension view')}</strong>
          <span>
            {numberFormatter.format(visibleItems.length)}{' '}
            {local(locale, 'کانون در محدوده فعلی', 'areas in the current scope')}
          </span>
        </div>

        <label className="security-continent-filter">
          <span>{local(locale, 'قاره', 'Continent')}</span>
          <Select value={continent} onValueChange={(value) => setContinent(value as Continent)}>
            <SelectTrigger aria-label={local(locale, 'فیلتر بر اساس قاره', 'Filter by continent')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {continentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {local(locale, option.fa, option.en)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      <div className="security-map-legend" aria-label={local(locale, 'راهنمای شدت', 'Severity legend')}>
        {(['critical', 'high', 'medium'] as Severity[]).map((severity) => (
          <span key={severity}>
            <i className={`security-map-dot severity-${severity}`} />
            {severityLabel(locale, severity)}
          </span>
        ))}
        <small>{local(locale, 'اندازه نقطه = پیامد', 'Point size = impact')}</small>
      </div>

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
          <>
            <div ref={containerRef} className="security-world-map" />
            {visibleItems.length === 0 ? (
              <div className="security-map-empty">
                {local(
                  locale,
                  'در دادهٔ نمونه برای این قاره کانونی ثبت نشده است.',
                  'No tension areas are available for this continent in the sample data.',
                )}
              </div>
            ) : null}
          </>
        )}
      </div>

      <p className="security-map-hint">
        {local(
          locale,
          'برای جزئیات بیشتر زوم کنید یا روی هر کانون بروید؛ احتمال و پیامد از همان دادهٔ ماتریس قبلی استفاده می‌کنند.',
          'Zoom in or hover a tension area for detail; likelihood and impact use the same data as the previous matrix.',
        )}
      </p>
    </div>
  )
}
