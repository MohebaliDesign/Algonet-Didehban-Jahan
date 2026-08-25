import { useId, useState } from 'react'

import { usePreferences } from '@/app/PreferencesProvider'

interface Series {
  label: string
  values: number[]
  kind?: 'observed' | 'forecast' | 'secondary'
}

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
  const [point, setPoint] = useState<{ s: number; i: number } | null>(null)
  const id = useId()
  const all = series.flatMap((item) => item.values)
  const min = Math.min(...all) - 4
  const max = Math.max(...all) + 4
  const x = (index: number) => 24 + (index / Math.max(labels.length - 1, 1)) * 452
  const y = (value: number) => 166 - ((value - min) / (max - min)) * 132
  return (
    <figure className="chart-figure" aria-labelledby={id}>
      <figcaption id={id} className="sr-only">
        {title}
      </figcaption>
      <svg viewBox="0 0 500 190" role="img">
        <title>{title}</title>
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="24"
            x2="476"
            y1={32 + line * 42}
            y2={32 + line * 42}
            className="chart-grid"
          />
        ))}
        {series.map((item, s) => {
          const d = item.values.map((value, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(value)}`).join(' ')
          return (
            <g key={item.label} className={`chart-series ${item.kind ?? ''}`}>
              <path d={d} />
              <text x={locale === 'fa' ? 470 : 30} y={s * 17 + 18}>
                {item.label}
              </text>
              {item.values.map((value, i) => (
                <circle
                  key={i}
                  cx={x(i)}
                  cy={y(value)}
                  r="9"
                  className="chart-hit"
                  onMouseEnter={() => setPoint({ s, i })}
                  onMouseLeave={() => setPoint(null)}
                >
                  <title>
                    {labels[i]} · {value} {unit}
                  </title>
                </circle>
              ))}
            </g>
          )
        })}
        {point && (
          <g className="chart-tooltip">
            <rect
              x={Math.min(x(point.i), 388)}
              y={Math.max(y(series[point.s].values[point.i]) - 37, 3)}
              width="92"
              height="28"
              rx="5"
            />
            <text
              x={Math.min(x(point.i) + 46, 434)}
              y={Math.max(y(series[point.s].values[point.i]) - 19, 21)}
              textAnchor="middle"
            >
              {series[point.s].values[point.i]} {unit}
            </text>
          </g>
        )}
        {labels.map((label, i) => (
          <text
            className="chart-axis-label"
            key={`${label}-${i}`}
            x={x(i)}
            y="184"
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
      </svg>
      {table && (
        <details className="chart-table">
          <summary>{locale === 'fa' ? 'جدول دادهٔ نمودار' : 'Chart data table'}</summary>
          <table>
            <thead>
              <tr>
                <th>{locale === 'fa' ? 'زمان' : 'Time'}</th>
                {series.map((item) => (
                  <th key={item.label}>{item.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labels.map((label, i) => (
                <tr key={`${label}-${i}`}>
                  <th>{label}</th>
                  {series.map((item) => (
                    <td key={item.label}>
                      {item.values[i]} {unit}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
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
  return (
    <figure className="bar-chart">
      <figcaption className="sr-only">{title}</figcaption>
      {items.map((item) => (
        <div className="bar-row" key={item.label}>
          <div>
            <span>{item.label}</span>
            <strong dir="ltr">
              {item.value}
              {unit}
            </strong>
          </div>
          <div className="bar-track">
            <i style={{ inlineSize: `${item.value}%` }} />
            {item.secondary != null && (
              <b
                style={{ insetInlineStart: `${item.secondary}%` }}
                title={`${locale === 'fa' ? 'مقایسه' : 'Comparison'} ${item.secondary}${unit}`}
              />
            )}
          </div>
        </div>
      ))}
    </figure>
  )
}

export function MatrixChart({
  items,
}: {
  items: { label: string; x: number; y: number; severity: string }[]
}) {
  const { locale } = usePreferences()
  return (
    <figure className="matrix-chart">
      <div className="matrix-axis matrix-y">{locale === 'fa' ? 'احتمال ←' : 'Likelihood →'}</div>
      <div className="matrix-canvas">
        {items.map((item) => (
          <button
            key={item.label}
            style={{ insetInlineStart: `${item.x}%`, insetBlockEnd: `${item.y}%` }}
            className={`matrix-point severity-${item.severity}`}
            title={`${item.label}: ${item.x}/${item.y}`}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="matrix-axis matrix-x">{locale === 'fa' ? 'پیامد ←' : 'Impact →'}</div>
      <details className="chart-table">
        <summary>{locale === 'fa' ? 'جایگزین متنی' : 'Text alternative'}</summary>
        <ul>
          {items.map((item) => (
            <li key={item.label}>
              {item.label}: {item.x} / {item.y}
            </li>
          ))}
        </ul>
      </details>
    </figure>
  )
}

export function Sparkline({ values, positive }: { values: number[]; positive?: boolean }) {
  const min = Math.min(...values),
    max = Math.max(...values)
  const d = values
    .map(
      (v, i) =>
        `${i ? 'L' : 'M'} ${i * (90 / (values.length - 1))} ${28 - ((v - min) / (max - min || 1)) * 24}`,
    )
    .join(' ')
  return (
    <svg
      className={`sparkline ${positive ? 'positive' : 'negative'}`}
      viewBox="0 0 90 32"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}
