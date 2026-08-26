import './markets.css'
import { useMemo } from 'react'

import { Chart, type ChartOptions } from '@highcharts/react'
import { Accessibility } from '@highcharts/react/modules/Accessibility'
import { usePreferences } from '@/app/PreferencesProvider'
import { baseChartOptions, chartAxisOptions, highchartsTokens } from '@/lib/highchartsTheme'

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
  const seriesColor =
    name === 'XAU/USD'
      ? theme.amber
      : name === 'XAG/USD'
        ? 'var(--muted-foreground)'
        : theme.primary
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
        maximumFractionDigits: 2,
      }),
    [locale],
  )

  const options = useMemo<ChartOptions>(
    () => ({
      ...baseChartOptions(description, 340),
      chart: {
        ...baseChartOptions(description, 340).chart,
        type: 'area',
      },
      plotOptions: {
        area: {
          lineWidth: 2,
          marker: { enabled: false },
          threshold: null,
          states: {
            hover: { lineWidth: 2 },
          },
        },
        series: {
          animation: false,
        },
      },
      series: [
        {
          color: seriesColor,
          data: values,
          fillColor: {
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
          },
          lineWidth: 2,
          marker: { enabled: false },
          name,
          threshold: null,
          type: 'area',
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
    [description, labels, locale, name, numberFormatter, seriesColor, theme, values],
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
  const { locale } = usePreferences()
  const theme = highchartsTokens
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }),
    [locale],
  )

  const options = useMemo<ChartOptions>(
    () => ({
      ...baseChartOptions(description, 300),
      chart: {
        ...baseChartOptions(description, 300).chart,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          borderWidth: 0,
          groupPadding: 0.12,
          pointPadding: 0.16,
          dataLabels: {
            enabled: true,
            formatter() {
              return typeof this.y === 'number' ? `${numberFormatter.format(this.y)}٪` : ''
            },
            style: {
              color: theme.foreground,
              fontSize: '12px',
              fontWeight: '600',
              textOutline: 'none',
            },
          },
        },
      },
      series: [
        {
          name: locale === 'fa' ? 'تغییر روزانه' : 'Daily change',
          type: 'bar',
          data: items.map((item) => ({
            color: item.value < 0 ? theme.negative : theme.primary,
            name: item.label,
            y: item.value,
          })),
        },
      ],
      tooltip: {
        ...baseChartOptions(description).tooltip,
        formatter() {
          const value = typeof this.y === 'number' ? numberFormatter.format(this.y) : '—'
          const direction = locale === 'fa' ? 'rtl' : 'ltr'
          const alignment = locale === 'fa' ? 'right' : 'left'
          const label = String(this.key ?? '')
          const metric = locale === 'fa' ? 'تغییر روزانه' : 'Daily change'

          return `<div dir="${direction}" style="min-width:120px;text-align:${alignment}"><strong>${label}</strong><br/><span style="color:${theme.muted}">${metric}</span><span> · ${value}%</span></div>`
        },
        useHTML: true,
      },
      xAxis: {
        categories: items.map((item) => item.label),
        ...chartAxisOptions(),
        gridLineColor: theme.border,
        gridLineWidth: 1,
        lineWidth: 0,
        tickLength: 0,
        title: { text: undefined },
      },
      yAxis: {
        ...chartAxisOptions(),
        gridLineWidth: 0,
        labels: {
          ...chartAxisOptions().labels,
          formatter() {
            return typeof this.value === 'number'
              ? `${numberFormatter.format(this.value)}٪`
              : String(this.value)
          },
        },
        plotLines: [
          {
            color: theme.border,
            value: 0,
            width: 1,
            zIndex: 2,
          },
        ],
        title: { text: undefined },
      },
    }),
    [description, items, locale, numberFormatter, theme],
  )

  return (
    <Chart options={options} containerProps={{ className: 'markets-highchart markets-comparison-chart' }}>
      <Accessibility />
    </Chart>
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
  const { locale } = usePreferences()
  const theme = highchartsTokens
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
        maximumFractionDigits: 2,
      }),
    [locale],
  )
  const options = useMemo<ChartOptions>(
    () => ({
      ...baseChartOptions(description, 32),
      accessibility: {
        description: `${description} ${positive ? '+' : '−'}`,
      },
      chart: {
        animation: false,
        backgroundColor: 'transparent',
        borderWidth: 0,
        height: 32,
        margin: [2, 0, 2, 0],
        spacing: [0, 0, 0, 0],
        type: 'area',
      },
      plotOptions: {
        area: {
          fillOpacity: 0.14,
          lineWidth: 2,
          marker: {
            enabled: false,
            radius: 1,
            states: {
              hover: {
                enabled: true,
                radius: 2,
              },
            },
          },
          states: {
            hover: {
              lineWidth: 2,
            },
          },
          threshold: null,
        },
      },
      series: [
        {
          color: theme.primary,
          data: values,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, `color-mix(in srgb, ${theme.primary} 18%, transparent)`],
              [1, `color-mix(in srgb, ${theme.primary} 2%, transparent)`],
            ],
          },
          name: description,
          type: 'area',
        },
      ],
      tooltip: {
        ...baseChartOptions(description).tooltip,
        hideDelay: 0,
        outside: true,
        formatter() {
          const value = typeof this.y === 'number' ? numberFormatter.format(this.y) : '—'
          return `<strong>${value}</strong>`
        },
        useHTML: true,
      },
      xAxis: {
        endOnTick: false,
        labels: { enabled: false },
        lineWidth: 0,
        startOnTick: false,
        tickPositions: [],
        title: { text: undefined },
      },
      yAxis: {
        endOnTick: false,
        gridLineWidth: 0,
        labels: { enabled: false },
        lineWidth: 0,
        startOnTick: false,
        tickPositions: [],
        title: { text: undefined },
      },
    }),
    [description, locale, numberFormatter, positive, theme, values],
  )

  return (
    <Chart options={options} containerProps={{ className: 'markets-sparkline' }}>
      <Accessibility />
    </Chart>
  )
}
