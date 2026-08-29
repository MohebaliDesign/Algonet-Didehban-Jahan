import Highcharts from 'highcharts'
import type { ChartOptions } from '@highcharts/react'

export const highchartsTokens = {
  amber: 'var(--chart-secondary, var(--temp-viz-amber))',
  border: 'var(--border)',
  critical: 'var(--chart-critical, var(--temp-viz-critical))',
  foreground: 'var(--foreground)',
  forecast: 'var(--chart-forecast, var(--temp-viz-forecast))',
  grid: 'var(--chart-grid, var(--border))',
  high: 'var(--chart-warning, var(--temp-viz-high))',
  land: 'var(--temp-viz-land)',
  low: 'var(--chart-positive, var(--temp-viz-low))',
  medium: 'var(--chart-secondary, var(--temp-viz-medium))',
  muted: 'var(--muted-foreground)',
  negative: 'var(--chart-critical, var(--destructive))',
  positive: 'var(--chart-positive, var(--temp-viz-teal))',
  primary: 'var(--chart-primary, var(--temp-viz-blue))',
  surface: 'var(--surface)',
  water: 'var(--temp-viz-water)',
} as const

const configuredInstances = new WeakSet<object>()

type ThemeableHighcharts = { setOptions: (options: never) => unknown }

export function configureHighcharts(instance: ThemeableHighcharts = Highcharts) {
  if (configuredInstances.has(instance)) return
  instance.setOptions({
    chart: { animation: false, backgroundColor: 'transparent', style: { fontFamily: 'inherit' } },
    colors: [
      highchartsTokens.primary,
      highchartsTokens.forecast,
      highchartsTokens.positive,
      highchartsTokens.amber,
      highchartsTokens.critical,
    ],
    credits: { enabled: false },
    lang: { thousandsSep: '٬' },
    legend: {
      itemStyle: { color: highchartsTokens.foreground, fontSize: '12px', fontWeight: '500' },
      itemHoverStyle: { color: highchartsTokens.foreground },
    },
    title: { style: { color: highchartsTokens.foreground } },
    tooltip: {
      backgroundColor: highchartsTokens.surface,
      borderColor: highchartsTokens.border,
      borderRadius: 8,
      padding: 12,
      shadow: false,
      style: { color: highchartsTokens.foreground, fontSize: '14px' },
    },
  } as never)
  configuredInstances.add(instance)
}

configureHighcharts()

export function baseChartOptions(description: string, height = 300): ChartOptions {
  return {
    accessibility: { description },
    chart: { animation: false, backgroundColor: 'transparent', height, spacing: [16, 16, 12, 8] },
    credits: { enabled: false },
    legend: { enabled: false },
    title: { text: undefined },
    tooltip: {
      backgroundColor: highchartsTokens.surface,
      borderColor: highchartsTokens.border,
      borderRadius: 8,
      padding: 12,
      shadow: false,
      style: { color: highchartsTokens.foreground, fontSize: '14px' },
    },
  }
}

export function chartAxisOptions() {
  return {
    gridLineColor: highchartsTokens.grid,
    labels: { style: { color: highchartsTokens.muted, fontSize: '12px' } },
    lineColor: highchartsTokens.border,
    tickColor: highchartsTokens.border,
    title: { style: { color: highchartsTokens.muted, fontSize: '12px' } },
  }
}
