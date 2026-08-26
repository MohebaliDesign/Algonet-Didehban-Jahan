import './markets.css'
import { useEffect, useMemo, useState } from 'react'

import { Chart, type ChartOptions } from '@highcharts/react'
import { StockChart } from '@highcharts/react/Stock'
import { Accessibility } from '@highcharts/react/modules/Accessibility'
import { usePreferences } from '@/app/PreferencesProvider'
import { baseChartOptions, chartAxisOptions, highchartsTokens } from '@/lib/highchartsTheme'

type OhlcPoint = [number, number, number, number, number]

const LIVE_CANDLESTICK_SEED: OhlcPoint[] = [
  [1317893940000, 376.38, 378.75, 376.25, 378.5],
  [1317894000000, 378.54, 378.63, 376.75, 376.87],
  [1317894060000, 376.8664, 377.62, 376.64, 376.908],
  [1317894120000, 376.8336, 377.88, 376.8289, 377.55],
  [1317894180000, 377.36, 377.9, 376.52, 376.75],
  [1317894240000, 376.83, 377.73, 376.71, 376.98],
  [1317894300000, 377, 377.69, 376.87, 377.1212],
  [1317894360000, 377.225, 377.33, 376.01, 376.26],
  [1317894420000, 376.42, 376.64, 375.55, 375.5534],
  [1317894480000, 375.74, 375.94, 374.77, 375.3],
  [1317894540000, 375.3313, 376, 374.92, 375.06],
  [1317894600000, 375.11, 375.46, 374.82, 374.92],
  [1317894660000, 374.82, 375.68, 374.64, 375.668],
  [1317894720000, 375.62, 376.13, 375.46, 376.13],
  [1317894780000, 376.14, 376.6, 375.89, 376.34],
  [1317894840000, 376.39, 376.39, 375.55, 375.99],
  [1317894900000, 376, 376.28, 375.42, 376.21],
  [1317894960000, 376, 377.38, 375.7, 376.591],
  [1317895020000, 376.59, 377.46, 376.57, 376.9348],
  [1317895080000, 376.9481, 377.749, 376.84, 377.563],
  [1317895140000, 377.452, 377.65, 376.43, 376.78],
  [1317895200000, 376.94, 377.01, 375.75, 375.98],
  [1317895260000, 376.27, 377.29, 375.95, 376.98],
  [1317895320000, 376.9962, 377.3, 376.69, 376.71],
  [1317895380000, 376.75, 377.5, 376.75, 377.41],
  [1317895440000, 377.26, 377.49, 376.89, 377.368],
  [1317895500000, 377.345, 378, 377.17, 378],
  [1317895560000, 377.97, 378.3199, 377.68, 377.97],
  [1317895620000, 378.01, 378.07, 377.25, 377.37],
  [1317895680000, 377.37, 377.75, 377.05, 377.12],
  [1317895740000, 377.16, 377.79, 377.01, 377.4512],
]

function getNextLiveCandle(data: OhlcPoint[], iteration: number): OhlcPoint[] {
  const next = data.map((point) => [...point] as OhlcPoint)
  const last = next.at(-1)
  if (!last) return next

  if (iteration > 0 && iteration % 8 === 0) {
    const open = last[4]
    return [...next.slice(-59), [last[0] + 60000, open, open, open, open]]
  }

  const movement = Math.round((Math.random() - 0.5) * 60) / 100
  const close = Math.round((last[4] + movement) * 10000) / 10000
  next[next.length - 1] = [
    last[0],
    last[1],
    Math.max(last[2], close),
    Math.min(last[3], close),
    close,
  ]
  return next
}

export function MarketTrendChart({
  description,
  labels,
  name,
  values,
}: {
  description: string
  labels: string[]
  name: string
  values: number[]
}) {
  const { locale } = usePreferences()
  const theme = highchartsTokens
  const isGold = name === 'XAU/USD'
  const seriesColor = isGold ? theme.amber : theme.primary
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
        maximumFractionDigits: 2,
      }),
    [locale],
  )

  const options = useMemo<ChartOptions>(
    () => ({
      ...baseChartOptions(description, 300),
      chart: {
        ...baseChartOptions(description, 300).chart,
        type: isGold ? 'area' : 'line',
      },
      plotOptions: {
        series: {
          animation: false,
          states: {
            hover: { lineWidthPlus: 1 },
          },
        },
      },
      series: [
        {
          color: seriesColor,
          data: values,
          fillColor: isGold
            ? {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1,
                },
                stops: [
                  [0, `color-mix(in srgb, ${seriesColor} 28%, transparent)`],
                  [1, `color-mix(in srgb, ${seriesColor} 2%, transparent)`],
                ],
              }
            : undefined,
          lineWidth: isGold ? 2 : 3,
          marker: { enabled: false },
          name,
          threshold: isGold ? null : undefined,
          type: isGold ? 'area' : 'line',
        },
      ],
      tooltip: {
        ...baseChartOptions(description).tooltip,
        followPointer: false,
        formatter() {
          const index = typeof this.x === 'number' ? this.x : -1
          const label = labels[index] ?? String(this.key ?? '')
          const value = typeof this.y === 'number' ? numberFormatter.format(this.y) : '—'
          const direction = locale === 'fa' ? 'rtl' : 'ltr'
          const alignment = locale === 'fa' ? 'right' : 'left'

          return `<div dir="${direction}" style="min-width:112px;text-align:${alignment}"><span style="color:${theme.muted};font-size:12px">${label}</span><br/><strong>${name}</strong><span> · ${value}</span></div>`
        },
        useHTML: true,
      },
      xAxis: {
        categories: labels,
        ...chartAxisOptions(),
        crosshair: {
          color: theme.border,
          dashStyle: 'Dash',
          width: 1,
        },
        gridLineWidth: 0,
        lineWidth: 0,
        tickLength: 0,
      },
      yAxis: {
        ...chartAxisOptions(),
        gridLineWidth: 1,
        labels: {
          ...chartAxisOptions().labels,
          formatter() {
            return typeof this.value === 'number'
              ? numberFormatter.format(this.value)
              : String(this.value)
          },
        },
        lineWidth: 0,
        opposite: false,
        tickWidth: 0,
        title: { text: undefined },
      },
    }),
    [description, isGold, labels, locale, name, numberFormatter, seriesColor, theme, values],
  )

  return (
    <Chart options={options} containerProps={{ className: 'markets-highchart' }}>
      <Accessibility />
    </Chart>
  )
}

export function MarketComparisonChart({
  description,
  items,
}: {
  description: string
  items: { label: string; value: number }[]
}) {
  const theme = highchartsTokens
  const [data, setData] = useState<OhlcPoint[]>(LIVE_CANDLESTICK_SEED)

  useEffect(() => {
    let iteration = 0
    const interval = window.setInterval(() => {
      setData((current) => getNextLiveCandle(current, iteration))
      iteration += 1
    }, 1200)

    return () => window.clearInterval(interval)
  }, [])

  const options = useMemo<ChartOptions>(
    () => ({
      ...baseChartOptions(`${description} · ${items.length} instruments in scope`, 340),
      chart: {
        ...baseChartOptions(description, 340).chart,
        panning: { enabled: true, type: 'x' },
        zooming: { type: 'x' },
      },
      navigator: {
        enabled: true,
        maskFill: 'color-mix(in srgb, var(--temp-viz-blue) 10%, transparent)',
        outlineColor: theme.border,
        series: {
          color: theme.primary,
          lineColor: theme.primary,
        },
        xAxis: {
          gridLineColor: theme.border,
          labels: { style: { color: theme.muted, fontSize: '12px' } },
        },
      },
      rangeSelector: {
        buttonPosition: { align: 'left' },
        buttons: [
          { type: 'minute', count: 15, text: '15m' },
          { type: 'hour', count: 1, text: '1h' },
          { type: 'all', text: 'All' },
        ],
        buttonTheme: {
          fill: theme.surface,
          stroke: theme.border,
          style: { color: theme.foreground, fontSize: '12px' },
          states: {
            hover: {
              fill: 'var(--accent)',
              style: { color: theme.foreground },
            },
            select: {
              fill: 'color-mix(in srgb, var(--temp-viz-blue) 10%, var(--surface))',
              stroke: theme.primary,
              style: { color: theme.primary },
            },
          },
        },
        inputEnabled: false,
        selected: 1,
      },
      scrollbar: { enabled: false },
      series: [
        {
          color: theme.negative,
          data,
          lineColor: theme.negative,
          name: 'OHLC',
          type: 'candlestick',
          upColor: theme.positive,
          upLineColor: theme.positive,
          lastPrice: {
            color: theme.primary,
            enabled: true,
            label: {
              backgroundColor: theme.primary,
              enabled: true,
              style: { color: 'var(--primary-foreground)' },
            },
          },
        },
      ],
      tooltip: {
        ...baseChartOptions(description).tooltip,
        split: false,
        valueDecimals: 2,
      },
      xAxis: {
        ...chartAxisOptions(),
        gridLineColor: theme.border,
        gridLineWidth: 1,
        overscroll: 500000,
        range: 4 * 200000,
        type: 'datetime',
      },
      yAxis: {
        ...chartAxisOptions(),
        opposite: false,
        title: { text: undefined },
      },
    }),
    [data, description, items.length, theme],
  )

  return (
    <StockChart options={options} containerProps={{ className: 'markets-highchart markets-stock-chart' }}>
      <Accessibility />
    </StockChart>
  )
}

export function MarketSparkline({
  description,
  positive,
  values,
}: {
  description: string
  positive: boolean
  values: number[]
}) {
  const theme = highchartsTokens
  const options = useMemo<ChartOptions>(
    () => ({
      ...baseChartOptions(description, 56),
      accessibility: { description },
      chart: {
        animation: false,
        backgroundColor: 'transparent',
        height: 56,
        margin: [4, 0, 4, 0],
        type: 'line',
      },
      series: [
        {
          color: positive ? theme.positive : theme.negative,
          data: values,
          enableMouseTracking: false,
          lineWidth: 2,
          marker: { enabled: false },
          type: 'line',
        },
      ],
      tooltip: { enabled: false },
      xAxis: { visible: false },
      yAxis: { endOnTick: false, startOnTick: false, title: { text: undefined }, visible: false },
    }),
    [description, positive, theme, values],
  )

  return (
    <Chart options={options} containerProps={{ className: 'markets-sparkline' }}>
      <Accessibility />
    </Chart>
  )
}
