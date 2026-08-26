import { useId, useMemo, useState } from 'react'
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  PolarGrid,
  RadialBar,
  RadialBarChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'

import { usePreferences } from '@/app/PreferencesProvider'
import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Series {
  label: string
  values: number[]
  kind?: 'observed' | 'forecast' | 'secondary'
}

const seriesColor = (kind?: Series['kind']) =>
  kind === 'forecast'
    ? 'var(--temp-viz-forecast)'
    : kind === 'secondary'
      ? 'var(--temp-viz-amber)'
      : 'var(--temp-viz-blue)'

export function LineChart({
  title,
  labels,
  series,
  unit,
  table = true,
}: {
  title: string
  labels: string[]
  series: Series[]
  unit: string
  table?: boolean
}) {
  const { locale } = usePreferences()
  const id = useId()
  const data = useMemo(
    () =>
      labels.map((label, index) => ({
        label,
        ...Object.fromEntries(
          series.map((item, seriesIndex) => [`series${seriesIndex}`, item.values[index]]),
        ),
      })),
    [labels, series],
  )
  const config = Object.fromEntries(
    series.map((item, index) => [
      `series${index}`,
      { label: item.label, color: seriesColor(item.kind) },
    ]),
  ) satisfies ChartConfig

  return (
    <figure className="chart-figure" aria-labelledby={id}>
      <figcaption id={id} className="sr-only">
        {title}
      </figcaption>
      <ChartContainer config={config} className="product-chart product-line-chart" dir="ltr">
        <RechartsLineChart
          accessibilityLayer
          data={data}
          margin={{ top: 16, right: 12, left: 0, bottom: 6 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={12} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={38}
            unit={unit ? ` ${unit}` : undefined}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" valueSuffix={unit} />}
          />
          {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
          {series.map((item, index) => (
            <Line
              key={item.label}
              dataKey={`series${index}`}
              type="monotone"
              stroke={`var(--color-series${index})`}
              strokeWidth={2}
              strokeDasharray={
                item.kind === 'forecast' ? '7 5' : item.kind === 'secondary' ? '3 4' : undefined
              }
              dot={{ r: 3, fill: `var(--color-series${index})` }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </RechartsLineChart>
      </ChartContainer>
      {table && <ChartDataTable labels={labels} series={series} unit={unit} locale={locale} />}
    </figure>
  )
}

export function BarChart({
  title,
  items,
  unit = '%',
}: {
  title: string
  items: { label: string; value: number; secondary?: number }[]
  unit?: string
}) {
  const { locale } = usePreferences()
  const hasSecondary = items.some((item) => item.secondary != null)
  const config = {
    value: { label: title, color: 'var(--temp-viz-blue)' },
    secondary: { label: locale === 'fa' ? 'مقایسه' : 'Comparison', color: 'var(--temp-viz-amber)' },
  } satisfies ChartConfig

  return (
    <figure className="bar-chart">
      <figcaption className="sr-only">{title}</figcaption>
      <ChartContainer config={config} className="product-chart product-bar-chart" dir="ltr">
        <RechartsBarChart
          accessibilityLayer
          data={items}
          layout="vertical"
          margin={{ left: 8, right: 24 }}
        >
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 'dataMax + 10']}
            tickLine={false}
            axisLine={false}
            unit={unit}
          />
          <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={104} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent valueSuffix={unit} />} />
          {hasSecondary && <ChartLegend content={<ChartLegendContent />} />}
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
          {hasSecondary && <Bar dataKey="secondary" fill="var(--color-secondary)" radius={4} />}
        </RechartsBarChart>
      </ChartContainer>
      <SimpleDataTable
        headers={[locale === 'fa' ? 'دسته' : 'Category', locale === 'fa' ? 'مقدار' : 'Value']}
        rows={items.map((item) => [item.label, `${item.value}${unit}`])}
      />
    </figure>
  )
}

export function MatrixChart({
  items,
}: {
  items: { label: string; x: number; y: number; severity: string }[]
}) {
  const { locale } = usePreferences()
  const data = items.map((item) => ({
    ...item,
    z: item.severity === 'critical' ? 180 : item.severity === 'high' ? 140 : 100,
  }))
  const config = {
    risk: { label: locale === 'fa' ? 'ریسک' : 'Risk', color: 'var(--temp-viz-red)' },
  } satisfies ChartConfig
  const severityColor: Record<string, string> = {
    critical: 'var(--temp-viz-critical)',
    high: 'var(--temp-viz-high)',
    medium: 'var(--temp-viz-medium)',
    low: 'var(--temp-viz-low)',
  }

  return (
    <figure className="matrix-chart">
      <ChartContainer config={config} className="product-chart product-matrix-chart" dir="ltr">
        <ScatterChart accessibilityLayer margin={{ top: 18, right: 24, bottom: 20, left: 8 }}>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="x"
            name={locale === 'fa' ? 'پیامد' : 'Impact'}
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={locale === 'fa' ? 'احتمال' : 'Likelihood'}
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
          />
          <ZAxis type="number" dataKey="z" range={[80, 180]} />
          <ChartTooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={<ChartTooltipContent valueSuffix=" / 100" />}
          />
          <Scatter name={locale === 'fa' ? 'ریسک منطقه‌ای' : 'Regional risk'} data={data}>
            {data.map((item) => (
              <Cell key={item.label} fill={severityColor[item.severity]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>
      <SimpleDataTable
        headers={[
          locale === 'fa' ? 'منطقه' : 'Region',
          locale === 'fa' ? 'پیامد' : 'Impact',
          locale === 'fa' ? 'احتمال' : 'Likelihood',
        ]}
        rows={items.map((item) => [item.label, String(item.x), String(item.y)])}
      />
    </figure>
  )
}

export function Sparkline({ values, positive }: { values: number[]; positive?: boolean }) {
  const { locale } = usePreferences()
  const data = values.map((value, index) => ({ index: index + 1, value }))
  const config = {
    value: {
      label: locale === 'fa' ? 'مقدار' : 'Value',
      color: positive ? 'var(--temp-viz-teal)' : 'var(--temp-viz-red)',
    },
  } satisfies ChartConfig
  return (
    <ChartContainer
      config={config}
      className="sparkline-chart"
      aria-label={locale === 'fa' ? 'روند فشرده بازار' : 'Compact market trend'}
      dir="ltr"
    >
      <RechartsLineChart
        accessibilityLayer
        data={data}
        margin={{ top: 3, right: 2, bottom: 3, left: 2 }}
      >
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              hideIndicator
              valueSuffix={locale === 'fa' ? ' شاخص' : ' index'}
            />
          }
        />
        <Line
          dataKey="value"
          type="monotone"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3 }}
        />
      </RechartsLineChart>
    </ChartContainer>
  )
}

export function RadialKpi({ value, label }: { value: number; label: string }) {
  const config = {
    value: { label, color: 'var(--temp-viz-high)' },
  } satisfies ChartConfig
  const data = [{ label, value, fill: 'var(--color-value)' }]

  return (
    <figure className="risk-gauge" aria-label={`${label}: ${value} از ۱۰۰`}>
      <ChartContainer config={config} className="radial-kpi-chart" dir="ltr">
        <RadialBarChart
          accessibilityLayer
          data={data}
          startAngle={90}
          endAngle={90 - (value / 100) * 360}
          innerRadius={40}
          outerRadius={54}
        >
          <PolarGrid gridType="circle" radialLines={false} stroke="none" />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel valueSuffix=" / 100" />}
          />
          <RadialBar dataKey="value" background={{ fill: 'var(--accent)' }} cornerRadius={6} />
        </RadialBarChart>
      </ChartContainer>
      <span className="radial-kpi-label">
        <strong dir="ltr">{value}</strong>
        <small>{label}</small>
      </span>
    </figure>
  )
}

function ChartDataTable({
  labels,
  series,
  unit,
  locale,
}: {
  labels: string[]
  series: Series[]
  unit: string
  locale: 'fa' | 'en'
}) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="chart-table">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" aria-expanded={open}>
          {locale === 'fa' ? 'جدول دادهٔ نمودار' : 'Chart data table'}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{locale === 'fa' ? 'زمان' : 'Time'}</TableHead>
              {series.map((item) => (
                <TableHead key={item.label}>{item.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {labels.map((label, index) => (
              <TableRow key={`${label}-${index}`}>
                <TableHead>{label}</TableHead>
                {series.map((item) => (
                  <TableCell key={item.label} dir="ltr">
                    {item.values[index]} {unit}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  )
}

function SimpleDataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  const { locale } = usePreferences()
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="chart-table">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" aria-expanded={open}>
          {locale === 'fa' ? 'جدول دادهٔ نمودار' : 'Chart data table'}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} dir={cellIndex ? 'ltr' : undefined}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  )
}
