import { useMemo } from 'react'

import { Chart, type ChartOptions } from '@highcharts/react'
import { Accessibility } from '@highcharts/react/modules/Accessibility'
import { usePreferences } from '@/app/PreferencesProvider'
import { baseChartOptions, chartAxisOptions, highchartsTokens } from '@/lib/highchartsTheme'

function localeCode(locale: 'fa' | 'en') {
  return locale === 'fa' ? 'fa-IR' : 'en-US'
}

export function CountryRiskSemiDonut({
  value,
  label,
}: {
  value: number
  label: string
}) {
  const { locale } = usePreferences()
  const theme = highchartsTokens
  const formatter = useMemo(
    () => new Intl.NumberFormat(localeCode(locale), { maximumFractionDigits: 0 }),
    [locale],
  )
  const safeValue = Math.max(0, Math.min(100, value))

  const options = useMemo<ChartOptions>(
    () => ({
      ...baseChartOptions(label, 220),
      chart: {
        ...baseChartOptions(label, 220).chart,
        margin: [0, 0, 0, 0],
        plotBackgroundColor: 'transparent',
        plotBorderWidth: 0,
        plotShadow: false,
        spacing: [0, 0, 0, 0],
        type: 'pie',
      },
      title: {
        align: 'center',
        floating: true,
        text: `<span class="country-risk-number">${formatter.format(safeValue)}</span><br/><span class="country-risk-label">${label}</span>`,
        useHTML: true,
        verticalAlign: 'middle',
        y: 54,
      },
      plotOptions: {
        pie: {
          borderWidth: 0,
          center: ['50%', '72%'],
          dataLabels: { enabled: false },
          endAngle: 90,
          innerSize: '62%',
          size: '112%',
          startAngle: -90,
        },
      },
      series: [
        {
          name: label,
          type: 'pie',
          data: [
            {
              color: theme.primary,
              name: label,
              y: safeValue,
            },
            {
              color: 'color-mix(in srgb, var(--border) 52%, transparent)',
              enableMouseTracking: false,
              name: locale === 'fa' ? 'باقی‌مانده' : 'Remaining',
              y: 100 - safeValue,
            },
          ],
        },
      ],
      tooltip: {
        ...baseChartOptions(label).tooltip,
        formatter() {
          if (this.point.index === 1) return false
          return `<strong>${label}</strong><br/><span>${formatter.format(safeValue)}${locale === 'fa' ? '٪' : '%'}</span>`
        },
        useHTML: true,
      },
    }),
    [formatter, label, locale, safeValue, theme.primary],
  )

  return (
    <Chart options={options} containerProps={{ className: 'countries-risk-chart' }}>
      <Accessibility />
    </Chart>
  )
}

export function CountryComparisonRaceChart({
  description,
  items,
}: {
  description: string
  items: { label: string; value: number }[]
}) {
  const { locale } = usePreferences()
  const theme = highchartsTokens
  const formatter = useMemo(
    () => new Intl.NumberFormat(localeCode(locale), { maximumFractionDigits: 0 }),
    [locale],
  )
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.value - a.value),
    [items],
  )

  const options = useMemo<ChartOptions>(
    () => ({
      ...baseChartOptions(description, 340),
      chart: {
        ...baseChartOptions(description, 340).chart,
        marginRight: 56,
        type: 'bar',
      },
      plotOptions: {
        series: {
          animation: false,
          borderRadius: 8,
          borderWidth: 0,
          color: theme.primary,
          dataLabels: {
            enabled: true,
            formatter() {
              return typeof this.y === 'number'
                ? `${formatter.format(this.y)}${locale === 'fa' ? '٪' : '%'}`
                : ''
            },
            style: {
              color: theme.foreground,
              fontSize: '14px',
              fontWeight: '600',
              textOutline: 'none',
            },
          },
          dataSorting: {
            enabled: true,
            matchByName: true,
            sortKey: 'y',
          },
          groupPadding: 0.08,
          pointPadding: 0.14,
        },
      },
      series: [
        {
          name: locale === 'fa' ? 'ریسک ترکیبی' : 'Composite risk',
          type: 'bar',
          color: theme.primary,
          data: sortedItems.map((item) => ({
            color: theme.primary,
            name: item.label,
            y: item.value,
          })),
        },
      ],
      tooltip: {
        ...baseChartOptions(description).tooltip,
        formatter() {
          const value = typeof this.y === 'number' ? formatter.format(this.y) : '—'
          const direction = locale === 'fa' ? 'rtl' : 'ltr'
          return `<div dir="${direction}"><strong>${String(this.key ?? '')}</strong><br/><span>${locale === 'fa' ? 'ریسک ترکیبی' : 'Composite risk'} · ${value}/100</span></div>`
        },
        useHTML: true,
      },
      xAxis: {
        categories: sortedItems.map((item) => item.label),
        ...chartAxisOptions(),
        gridLineWidth: 0,
        lineWidth: 0,
        tickLength: 0,
        title: { text: undefined },
      },
      yAxis: {
        ...chartAxisOptions(),
        gridLineColor: theme.border,
        gridLineWidth: 1,
        labels: {
          ...chartAxisOptions().labels,
          formatter() {
            return typeof this.value === 'number'
              ? `${formatter.format(this.value)}${locale === 'fa' ? '٪' : '%'}`
              : String(this.value)
          },
        },
        max: 100,
        min: 0,
        title: { text: undefined },
      },
    }),
    [description, formatter, locale, sortedItems, theme],
  )

  return (
    <Chart options={options} containerProps={{ className: 'countries-comparison-chart' }}>
      <Accessibility />
    </Chart>
  )
}
