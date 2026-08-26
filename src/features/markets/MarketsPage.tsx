import './markets-watchlist.css'

import { useMemo, useState } from 'react'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { ModuleFrame } from '@/components/product/ModuleFrame'
import { KpiStrip, PageHeader } from '@/components/product/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { markets } from '@/data/mock/visualMvpData'
import type { MarketInstrument } from '@/types/domain'
import { MarketComparisonChart, MarketTrendChart } from './MarketsCharts'

function local<T>(locale: 'fa' | 'en', fa: T, en: T): T {
  return locale === 'fa' ? fa : en
}

function marketIconName(symbol: string) {
  if (symbol === 'XAU/USD') return 'money-4'
  if (symbol === 'BRENT') return 'gas-station'
  if (symbol === 'BTC-USD') return 'bitcoin-card'
  if (symbol === 'EUR/USD') return 'moneys'
  return 'coin'
}

function getSeriesLabels(locale: 'fa' | 'en') {
  return local(
    locale,
    ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج', 'امروز'],
    ['S', 'M', 'T', 'W', 'T', 'F', 'S', 'Today'],
  )
}

function formatMarketValue(value: string, locale: 'fa' | 'en') {
  const normalized = Number(value.replaceAll(',', ''))
  if (!Number.isFinite(normalized)) return value
  const decimals = value.includes('.') ? value.split('.')[1]?.length ?? 0 : 0
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(normalized)
}

function formatNumber(value: number, locale: 'fa' | 'en', maximumFractionDigits = 2) {
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    maximumFractionDigits,
  }).format(value)
}

function formatChange(value: number, locale: 'fa' | 'en') {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  const formatted = formatNumber(Math.abs(value), locale, 2)
  return `${sign}${formatted}${locale === 'fa' ? '٪' : '%'}`
}

function MarketDataTable({
  locale,
  selected,
}: {
  locale: 'fa' | 'en'
  selected: MarketInstrument
}) {
  const labels = getSeriesLabels(locale)

  return (
    <div className="market-data-table" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{local(locale, 'زمان', 'Time')}</TableHead>
            <TableHead>{local(locale, 'مقدار', 'Value')}</TableHead>
            <TableHead>{local(locale, 'تغییر', 'Change')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selected.series.map((value, index) => {
            const previous = selected.series[index - 1]
            const delta = previous == null ? 0 : value - previous
            return (
              <TableRow key={`${selected.id}-${labels[index] ?? index}`}>
                <TableCell>{labels[index] ?? formatNumber(index + 1, locale, 0)}</TableCell>
                <TableCell>{formatNumber(value, locale)}</TableCell>
                <TableCell className={delta > 0 ? 'market-positive' : delta < 0 ? 'market-negative' : ''}>
                  {delta > 0 ? '+' : delta < 0 ? '−' : ''}
                  {formatNumber(Math.abs(delta), locale)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export function MarketsPage() {
  const { locale } = usePreferences()
  const { openInspector } = useWorkspace()
  const [selected, setSelected] = useState<MarketInstrument>(markets[0])
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const labels = useMemo(() => getSeriesLabels(locale), [locale])

  return (
    <div className="page-view markets-page markets-page-v2" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <PageHeader
        title={local(locale, 'اقتصاد و بازارها', 'Economy & Markets')}
        summary={local(
          locale,
          'حرکت بازارها و رویدادهایی که می‌توانند آن را توضیح دهند.',
          'Market movement and the events that may explain it.',
        )}
      />

      <KpiStrip
        items={markets.map((item) => ({
          label: item.name[locale],
          value: formatMarketValue(item.value, locale),
          change: formatChange(item.change, locale),
          icon: marketIconName(item.symbol),
          tone: item.change > 0 ? 'positive' : 'critical',
        }))}
      />

      <div className="markets-workspace markets-workspace-v2">
        <div className="markets-stack markets-main-stack">
          <ModuleFrame
            id="market-comparison"
            title={local(locale, 'مقایسه بازارها', 'Market comparison')}
            description={local(locale, 'تغییر روزانه · درصد', 'Daily change · percent')}
            size="large"
            state="cached"
          >
            <MarketComparisonChart
              description={local(locale, 'مقایسه تغییر روزانه بازارها', 'Daily market comparison')}
              items={markets.map((item) => ({ label: item.symbol, value: item.change }))}
            />
          </ModuleFrame>

          <ModuleFrame
            id="market-ai"
            title={local(locale, 'پیامدهای هوشمند', 'AI implications')}
            description={local(
              locale,
              'تفسیر پیوندخورده با رویدادها و شواهد',
              'Interpretation linked to events and evidence',
            )}
            size="medium"
            state="partial"
            confidence={68}
          >
            <div className="daily-brief">
              <span className="ai-generated-label">
                <Icon name="magic-star" />
                {local(locale, 'تحلیل تولیدشده', 'Generated analysis')}
              </span>
              <p>
                {local(
                  locale,
                  'حرکت طلا با افزایش تقاضای پوشش ریسک هم‌زمان است؛ رابطهٔ علّی اثبات نشده و دادهٔ جریان سرمایه ناقص است.',
                  'Gold moved alongside higher hedging demand; causality is not established and fund-flow data is partial.',
                )}
              </p>
              <Button
                variant="link"
                className="text-action"
                onClick={() =>
                  openInspector({
                    kind: 'ai',
                    id: 'market-ai',
                    title: local(locale, 'پیامدهای بازار', 'Market implications'),
                  })
                }
              >
                {local(locale, 'بررسی شواهد', 'Inspect evidence')}
                <Icon name="arrow-left-01" className="directional-icon" />
              </Button>
            </div>
          </ModuleFrame>
        </div>

        <div className="markets-stack markets-side-stack">
          <ModuleFrame
            id="watchlist"
            title={local(locale, 'فهرست پایش', 'Watchlist')}
            description={local(
              locale,
              'یک بازار را انتخاب کنید تا روند آن را ببینید.',
              'Select a market to view its trend.',
            )}
            size="medium"
            state="fresh"
          >
            <div className="market-selector-list" role="list">
              {markets.map((item) => {
                const isSelected = selected.id === item.id
                return (
                  <button
                    type="button"
                    role="listitem"
                    key={item.id}
                    className={`market-selector-row ${isSelected ? 'selected' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelected(item)}
                  >
                    <span className="market-asset-icon">
                      <Icon name={marketIconName(item.symbol)} size={24} type="bulk" />
                    </span>
                    <span className="market-selector-copy">
                      <strong>{item.name[locale]}</strong>
                      <code dir="ltr">{item.symbol}</code>
                    </span>
                    <span className={item.change > 0 ? 'market-positive' : 'market-negative'} dir="auto">
                      {formatChange(item.change, locale)}
                    </span>
                    <span className="market-selector-value" dir="auto">
                      {formatMarketValue(item.value, locale)}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="selected-market-panel">
              <div className="selected-market-summary">
                <div>
                  <strong>{selected.name[locale]}</strong>
                  <code dir="ltr">{selected.symbol}</code>
                </div>
                <div className="selected-market-metrics">
                  <b dir="auto">{formatMarketValue(selected.value, locale)}</b>
                  <span className={selected.change > 0 ? 'market-positive' : 'market-negative'} dir="auto">
                    {formatChange(selected.change, locale)}
                  </span>
                </div>
              </div>

              <Tabs
                value={view}
                onValueChange={(value) => setView(value as 'chart' | 'table')}
                className="market-view-tabs"
                dir={locale === 'fa' ? 'rtl' : 'ltr'}
              >
                <TabsList variant="line" className="market-view-tabs-list">
                  <TabsTrigger value="chart">{local(locale, 'نمودار', 'Chart')}</TabsTrigger>
                  <TabsTrigger value="table">{local(locale, 'جدول', 'Table')}</TabsTrigger>
                </TabsList>

                <TabsContent value="chart" className="market-view-content">
                  <MarketTrendChart
                    description={local(
                      locale,
                      `روند هفت‌روزه ${selected.name.fa}`,
                      `Seven-day trend for ${selected.name.en}`,
                    )}
                    labels={labels}
                    name={selected.symbol}
                    values={selected.series}
                  />
                </TabsContent>

                <TabsContent value="table" className="market-view-content">
                  <MarketDataTable locale={locale} selected={selected} />
                </TabsContent>
              </Tabs>
            </div>
          </ModuleFrame>
        </div>
      </div>
    </div>
  )
}
