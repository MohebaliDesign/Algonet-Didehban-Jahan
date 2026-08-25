import { useMemo, useState, type ReactNode } from 'react'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { BarChart, LineChart, MatrixChart, Sparkline } from '@/components/product/Charts'
import { ModuleFrame } from '@/components/product/ModuleFrame'
import { KpiStrip, PageHeader } from '@/components/product/PageHeader'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import {
  corridors,
  countries,
  events,
  forecasts,
  markets,
  reports,
  reportTitlesEn,
  sources,
} from '@/data/mock/visualMvpData'
import { useProductCopy } from '@/localization/productCopy'
import type { DataState } from '@/types/domain'

function PageGrid({ children }: { children: ReactNode }) {
  return <div className="module-grid product-page-grid">{children}</div>
}
function local<T>(locale: 'fa' | 'en', fa: T, en: T): T {
  return locale === 'fa' ? fa : en
}

export function DevelopmentsPage() {
  const { locale } = usePreferences()
  const { openInspector } = useWorkspace()
  const [horizon, setHorizon] = useState('7d')
  const forecast = forecasts[horizon === '7d' ? 0 : 1]
  return (
    <div className="page-view">
      <PageHeader
        title={local(locale, 'تحولات و پیش‌بینی', 'Developments & Forecasts')}
        summary={local(
          locale,
          'مرز روشن میان آنچه مشاهده شده و آنچه ممکن است در افق پیش‌رو رخ دهد.',
          'A clear boundary between what has been observed and what may happen next.',
        )}
      />
      <div
        className="segmented-control horizon-control"
        role="group"
        aria-label={local(locale, 'افق پیش‌بینی', 'Forecast horizon')}
      >
        {[
          ['24h', '۲۴ ساعت', '24 hours'],
          ['7d', '۷ روز', '7 days'],
          ['30d', '۳۰ روز', '30 days'],
        ].map(([key, fa, en]) => (
          <button
            key={key}
            className={horizon === key ? 'active' : ''}
            onClick={() => setHorizon(key)}
          >
            {local(locale, fa, en)}
          </button>
        ))}
      </div>
      <KpiStrip
        items={[
          {
            label: local(locale, 'سیگنال نوظهور', 'Emerging signals'),
            value: '۹',
            change: local(locale, '۳ مورد تقویت‌شده', '3 strengthened'),
            icon: 'flash',
            tone: 'warning',
          },
          {
            label: local(locale, 'پیش‌بینی فعال', 'Active forecasts'),
            value: '۶',
            change: local(locale, 'افق ۲۴ ساعت تا ۳۰ روز', '24h–30d horizon'),
            icon: 'magic-star',
          },
          {
            label: local(locale, 'میانگین اطمینان', 'Average confidence'),
            value: '۷۱٪',
            change: local(locale, 'جدا از احتمال سناریو', 'Separate from probability'),
            icon: 'shield-tick',
            tone: 'positive',
          },
          {
            label: local(locale, 'فرض باز', 'Open assumptions'),
            value: '۴',
            change: local(locale, 'نیازمند پایش', 'Requires monitoring'),
            icon: 'note',
          },
        ]}
      />
      <PageGrid>
        <ModuleFrame
          id="forecast-trend"
          title={local(locale, 'مشاهده در برابر پیش‌بینی', 'Observed versus forecast')}
          description={`${forecast.horizon[locale]} · ${local(locale, 'واحد: شاخص فشار', 'unit: pressure index')}`}
          size="large"
          state="fresh"
          sourceCount={14}
          confidence={forecast.confidence}
        >
          <LineChart
            title={forecast.title[locale]}
            labels={local(
              locale,
              ['۲۰ مرداد', '۲۱', '۲۲', '۲۳', 'امروز', '+۱', '+۲', '+۳', '+۴'],
              ['Aug 20', '21', '22', '23', 'Today', '+1', '+2', '+3', '+4'],
            )}
            unit={local(locale, 'شاخص', 'index')}
            series={[
              {
                label: local(locale, 'مشاهده‌شده', 'Observed'),
                values: [
                  ...forecast.observed,
                  forecast.observed.at(-1)!,
                  forecast.observed.at(-1)!,
                  forecast.observed.at(-1)!,
                  forecast.observed.at(-1)!,
                ],
                kind: 'observed',
              },
              {
                label: local(locale, 'پیش‌بینی AI', 'AI forecast'),
                values: [...Array(4).fill(forecast.observed.at(-1)!), ...forecast.projected],
                kind: 'forecast',
              },
            ]}
          />
          <div className="chart-annotation">
            <Icon name="info-circle" />
            {local(
              locale,
              'خط پیوسته دادهٔ مشاهده‌شده و خط چین پیش‌بینی ساختگی است.',
              'Solid line is observed data; dashed line is a simulated forecast.',
            )}
          </div>
        </ModuleFrame>
        <ModuleFrame
          id="scenarios"
          title={local(locale, 'مقایسه سناریوها', 'Scenario comparison')}
          description={local(
            locale,
            'احتمال مدل با اطمینان تحلیل یکسان نیست.',
            'Model probability is not the same as analysis confidence.',
          )}
          size="medium"
          state="partial"
          sourceCount={11}
          confidence={forecast.confidence}
        >
          <BarChart
            title={local(locale, 'احتمال سناریوها', 'Scenario probabilities')}
            items={[
              { label: local(locale, 'تداوم فشار', 'Sustained pressure'), value: 54 },
              { label: local(locale, 'کاهش تدریجی', 'Gradual easing'), value: 29 },
              { label: local(locale, 'تشدید ناگهانی', 'Rapid escalation'), value: 17 },
            ]}
          />
          <p className="module-note warning">
            <Icon name="warning-2" />
            {local(
              locale,
              'پوشش دو بندر ناقص است؛ احتمال‌ها قطعی نیستند.',
              'Two ports have partial coverage; probabilities are not certain.',
            )}
          </p>
        </ModuleFrame>
        <ModuleFrame
          id="signals"
          title={local(locale, 'سیگنال‌های نوظهور', 'Emerging signals')}
          description={local(
            locale,
            'تغییرات معنادار نسبت به خط پایه',
            'Meaningful deviations from baseline',
          )}
          size="medium"
          state="fresh"
          eventCount={8}
        >
          {events.slice(0, 4).map((event) => (
            <button
              className="signal-row"
              key={event.id}
              onClick={() =>
                openInspector({
                  kind: 'signal',
                  id: event.id,
                  title: event.title,
                  titleEn: event.titleEn,
                })
              }
            >
              <span className={`signal-icon severity-${event.severity}`}>
                <Icon name="flash" />
              </span>
              <span>
                <strong>{locale === 'fa' ? event.title : event.titleEn}</strong>
                <small>
                  {local(locale, 'مشاهده‌شده ·', 'Observed ·')} {event.sourceCount}{' '}
                  {local(locale, 'منبع', 'sources')}
                </small>
              </span>
              <b>{event.confidence}%</b>
            </button>
          ))}
        </ModuleFrame>
        <ModuleFrame
          id="assumptions"
          title={local(locale, 'فرض‌ها و محدودیت‌ها', 'Assumptions & limitations')}
          description={local(
            locale,
            'شرایطی که می‌تواند خروجی را تغییر دهد',
            'Conditions that may change the output',
          )}
          size="medium"
          state="cached"
        >
          <div className="assumption-list">
            <section>
              <h3>
                <Icon name="tick-circle" />
                {local(locale, 'فرض فعال', 'Active assumption')}
              </h3>
              <p>{forecast.assumptions[0][locale]}</p>
            </section>
            <section>
              <h3>
                <Icon name="danger" />
                {local(locale, 'محدودیت شناخته‌شده', 'Known limitation')}
              </h3>
              <p>{forecast.limitations[locale]}</p>
            </section>
            <section>
              <h3>
                <Icon name="clock" />
                {local(locale, 'زمان تولید', 'Generated')}
              </h3>
              <code dir="ltr">2026-08-24 12:20 UTC · MODEL-MOCK-1.4</code>
            </section>
          </div>
        </ModuleFrame>
      </PageGrid>
    </div>
  )
}

export function SecurityPage() {
  const { locale } = usePreferences()
  const { openInspector } = useWorkspace()
  const riskItems = [
    { label: local(locale, 'اوکراین', 'Ukraine'), x: 84, y: 91, severity: 'critical' },
    { label: local(locale, 'دریای سرخ', 'Red Sea'), x: 71, y: 76, severity: 'high' },
    { label: local(locale, 'قفقاز', 'Caucasus'), x: 58, y: 62, severity: 'medium' },
    { label: local(locale, 'شرق آسیا', 'East Asia'), x: 47, y: 69, severity: 'high' },
  ]
  return (
    <div className="page-view">
      <PageHeader
        title={local(locale, 'امنیت و ژئوپلیتیک', 'Security & Geopolitics')}
        summary={local(
          locale,
          'مقایسهٔ تنش‌ها، وضعیت راهبردی و شواهد پشت ارزیابی‌های منطقه‌ای.',
          'Compare tensions, strategic posture, and the evidence behind regional assessments.',
        )}
      />
      <KpiStrip
        items={[
          {
            label: local(locale, 'کانون تنش فعال', 'Active tension areas'),
            value: '۱۴',
            change: local(locale, '۲ مورد بحرانی', '2 critical'),
            icon: 'shield-cross',
            tone: 'critical',
          },
          {
            label: local(locale, 'رویداد نظامی', 'Military events'),
            value: '۲۷',
            change: local(locale, '۲۴ ساعت گذشته', 'Past 24 hours'),
            icon: 'radar-2',
          },
          {
            label: local(locale, 'تحریم تازه', 'New sanctions'),
            value: '۳',
            change: local(locale, '۲ حوزه', '2 domains'),
            icon: 'document-filter',
          },
          {
            label: local(locale, 'پوشش شواهد', 'Evidence coverage'),
            value: '۸۷٪',
            change: local(locale, '۴۱ منبع مستقل', '41 independent sources'),
            icon: 'shield-tick',
            tone: 'positive',
          },
        ]}
      />
      <PageGrid>
        <ModuleFrame
          id="security-matrix"
          title={local(locale, 'ماتریس تنش منطقه‌ای', 'Regional tension matrix')}
          description={local(
            locale,
            'محور افقی: پیامد · محور عمودی: احتمال',
            'Horizontal: impact · vertical: likelihood',
          )}
          size="large"
          state="fresh"
          sourceCount={41}
        >
          <MatrixChart items={riskItems} />
        </ModuleFrame>
        <ModuleFrame
          id="posture"
          title={local(locale, 'جمع‌بندی وضعیت راهبردی', 'Strategic posture summary')}
          description={local(
            locale,
            'ارزیابی AI با شواهد پیوندخورده',
            'Evidence-linked AI assessment',
          )}
          size="medium"
          state="partial"
          confidence={74}
        >
          <div className="daily-brief">
            <span className="ai-generated-label">
              <Icon name="magic-star" />
              {local(locale, 'تولیدشده با AI', 'AI-generated')}
            </span>
            <p>
              {local(
                locale,
                'افزایش فعالیت مشاهده‌شده در شرق آسیا با اعلان رسمی رزمایش هم‌خوان است. در قفقاز، شواهد برای نتیجه‌گیری دربارهٔ علت اختلال کافی نیست.',
                'Observed activity in East Asia aligns with an announced exercise. In the Caucasus, evidence is insufficient to conclude the cause of disruption.',
              )}
            </p>
            <button
              className="text-action"
              onClick={() =>
                openInspector({
                  kind: 'ai',
                  id: 'security-assessment',
                  title: local(locale, 'ارزیابی امنیت منطقه‌ای', 'Regional security assessment'),
                })
              }
            >
              {local(locale, 'بازکردن شواهد و تناقض‌ها', 'Open evidence and contradictions')}
              <Icon name="arrow-left-01" className="directional-icon" />
            </button>
          </div>
        </ModuleFrame>
        <ModuleFrame
          id="regional-bars"
          title={local(locale, 'مقایسه ریسک منطقه‌ای', 'Regional risk comparison')}
          description={local(
            locale,
            'شاخص ترکیبی نمونه · از ۱۰۰',
            'Prototype composite index · out of 100',
          )}
          size="medium"
          state="cached"
        >
          <BarChart
            title={local(locale, 'مقایسه ریسک', 'Risk comparison')}
            items={[
              { label: local(locale, 'اروپای شرقی', 'Eastern Europe'), value: 88 },
              { label: local(locale, 'غرب آسیا', 'West Asia'), value: 73 },
              { label: local(locale, 'شرق آفریقا', 'East Africa'), value: 61 },
              { label: local(locale, 'شرق آسیا', 'East Asia'), value: 54 },
            ]}
          />
        </ModuleFrame>
        <ModuleFrame
          id="threat-timeline"
          title={local(locale, 'خط زمانی تهدید', 'Threat timeline')}
          description={local(
            locale,
            'رویدادهای ژئوپلیتیک و نظامی اخیر',
            'Recent geopolitical and military events',
          )}
          size="medium"
          state="fresh"
          eventCount={6}
        >
          <ol className="vertical-timeline">
            {events.slice(0, 5).map((event) => (
              <li key={event.id}>
                <time dir="ltr">{event.occurredAt.slice(11, 16)} UTC</time>
                <button
                  onClick={() =>
                    openInspector({
                      kind: 'event',
                      id: event.id,
                      title: event.title,
                      titleEn: event.titleEn,
                    })
                  }
                >
                  {locale === 'fa' ? event.title : event.titleEn}
                </button>
                <span className={`event-severity ${event.severity}`} />
              </li>
            ))}
          </ol>
        </ModuleFrame>
      </PageGrid>
    </div>
  )
}

export function MarketsPage() {
  const { locale } = usePreferences()
  const { openInspector } = useWorkspace()
  const [selected, setSelected] = useState(markets[0])
  const [view, setView] = useState<'chart' | 'table'>('chart')
  return (
    <div className="page-view">
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
          value: item.value,
          change: `${item.change > 0 ? '+' : ''}${item.change}%`,
          icon: item.symbol === 'BTC-USD' ? 'bitcoin-card' : 'chart-2',
          tone: item.change > 0 ? 'positive' : 'critical',
        }))}
      />
      <PageGrid>
        <ModuleFrame
          id="watchlist"
          title={local(locale, 'فهرست پایش', 'Watchlist')}
          description={local(
            locale,
            'انتخاب برای مشاهده جزئیات',
            'Select an instrument for detail',
          )}
          size="small"
          state="fresh"
        >
          <div className="market-watchlist">
            {markets.map((item) => (
              <button
                key={item.id}
                className={selected.id === item.id ? 'selected' : ''}
                onClick={() => setSelected(item)}
              >
                <span>
                  <strong>{item.name[locale]}</strong>
                  <code dir="ltr">{item.symbol}</code>
                </span>
                <Sparkline values={item.series} positive={item.change > 0} />
                <b className={item.change > 0 ? 'up' : 'down'} dir="ltr">
                  {item.change > 0 ? '+' : ''}
                  {item.change}%
                </b>
              </button>
            ))}
          </div>
        </ModuleFrame>
        <ModuleFrame
          id="market-detail"
          title={`${selected.name[locale]} · ${selected.symbol}`}
          description={local(locale, '۷ روز · واحد شاخص نرمال‌شده', '7 days · normalized index')}
          size="large"
          state={selected.id === 'm2' ? 'stale' : 'fresh'}
          sourceCount={7}
        >
          <div className="chart-view-header">
            <div className="segmented-control">
              <button className={view === 'chart' ? 'active' : ''} onClick={() => setView('chart')}>
                {local(locale, 'نمودار', 'Chart')}
              </button>
              <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>
                {local(locale, 'جدول', 'Table')}
              </button>
            </div>
            <strong dir="ltr">{selected.value}</strong>
          </div>
          {view === 'chart' ? (
            <LineChart
              title={selected.name[locale]}
              labels={local(
                locale,
                ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج', 'امروز'],
                ['S', 'M', 'T', 'W', 'T', 'F', 'S', 'Today'],
              )}
              unit=""
              series={[{ label: selected.symbol, values: selected.series, kind: 'observed' }]}
            />
          ) : (
            <DenseTable
              headers={[
                local(locale, 'زمان', 'Time'),
                local(locale, 'مقدار', 'Value'),
                local(locale, 'تغییر', 'Change'),
              ]}
              rows={selected.series.map((value, index) => [
                String(index + 1),
                String(value),
                `${index ? value - selected.series[index - 1] : 0}`,
              ])}
            />
          )}
        </ModuleFrame>
        <ModuleFrame
          id="market-comparison"
          title={local(locale, 'مقایسه بازارها', 'Market comparison')}
          description={local(locale, 'تغییر روزانه · درصد', 'Daily change · percent')}
          size="medium"
          state="cached"
        >
          <BarChart
            title={local(locale, 'تغییر روزانه بازارها', 'Daily market change')}
            unit="%"
            items={markets.map((item) => ({
              label: item.symbol,
              value: Math.max(4, 50 + item.change * 22),
              secondary: 50,
            }))}
          />
        </ModuleFrame>
        <ModuleFrame
          id="market-ai"
          title={local(locale, 'پیامدهای هوشمند', 'AI implications')}
          description={local(
            locale,
            'تفسیر ساختگی و پیوندخورده با رویدادها',
            'Simulated interpretation linked to events',
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
            <button
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
            </button>
          </div>
        </ModuleFrame>
      </PageGrid>
    </div>
  )
}

export function CountriesPage() {
  const { locale } = usePreferences()
  const { openInspector } = useWorkspace()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(countries[0])
  const filtered = countries.filter((item) => item.name[locale].includes(query))
  return (
    <div className="page-view">
      <PageHeader
        title={local(locale, 'کشورها و مسیرها', 'Countries & Routes')}
        summary={local(
          locale,
          'نمای چندحوزه‌ای کشورها و وضعیت مسیرها، گلوگاه‌ها و اختلال‌ها.',
          'A cross-domain view of countries, routes, chokepoints, and disruptions.',
        )}
      />
      <PageGrid>
        <ModuleFrame
          id="country-directory"
          title={local(locale, 'کشورها', 'Countries')}
          description={local(
            locale,
            'جست‌وجو و انتخاب فضای کاری کشور',
            'Search and select a country workspace',
          )}
          size="small"
          state="fresh"
        >
          <label className="inline-search">
            <Icon name="search-normal" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={local(locale, 'جست‌وجوی کشور…', 'Search countries…')}
            />
          </label>
          <div className="country-list">
            {filtered.map((country) => (
              <button
                key={country.id}
                className={selected.id === country.id ? 'selected' : ''}
                onClick={() => setSelected(country)}
              >
                <span>
                  <strong>{country.name[locale]}</strong>
                  <small>
                    {country.region[locale]} · {country.events} {local(locale, 'رویداد', 'events')}
                  </small>
                </span>
                <b className={`trend-${country.trend}`}>{country.risk}</b>
              </button>
            ))}
          </div>
        </ModuleFrame>
        <ModuleFrame
          id="country-profile"
          title={selected.name[locale]}
          description={`${selected.region[locale]} · ${local(locale, 'پروفایل ریسک کشور', 'Country risk profile')}`}
          size="large"
          state="fresh"
          eventCount={selected.events}
          confidence={79}
        >
          <div className="country-hero">
            <div className="risk-gauge">
              <span style={{ '--risk': `${selected.risk}%` } as React.CSSProperties} />
              <strong>{selected.risk}</strong>
              <small>{local(locale, 'ریسک ترکیبی', 'Composite risk')}</small>
            </div>
            <div className="indicator-grid">
              {selected.indicators.map((item) => (
                <div key={item.label.fa}>
                  <small>{item.label[locale]}</small>
                  <strong>{item.value}</strong>
                </div>
              ))}
              <div>
                <small>{local(locale, 'روند', 'Trend')}</small>
                <strong>
                  {local(
                    locale,
                    selected.trend === 'rising'
                      ? 'افزایشی'
                      : selected.trend === 'falling'
                        ? 'کاهشی'
                        : 'باثبات',
                    selected.trend,
                  )}
                </strong>
              </div>
            </div>
          </div>
          <button
            className="text-action"
            onClick={() =>
              openInspector({
                kind: 'country',
                id: selected.id,
                title: selected.name.fa,
                titleEn: selected.name.en,
              })
            }
          >
            {local(locale, 'بازکردن بازرس کشور', 'Open country Inspector')}
            <Icon name="arrow-left-01" className="directional-icon" />
          </button>
        </ModuleFrame>
        <ModuleFrame
          id="corridors"
          title={local(locale, 'مسیرهای راهبردی', 'Strategic corridors')}
          description={local(
            locale,
            'وضعیت، تأخیر و گلوگاه‌های کلیدی',
            'Status, delay, and major chokepoints',
          )}
          size="large"
          state="partial"
        >
          <div className="corridor-list">
            {corridors.map((corridor) => (
              <button
                key={corridor.id}
                onClick={() =>
                  openInspector({
                    kind: 'route',
                    id: corridor.id,
                    title: corridor.name.fa,
                    titleEn: corridor.name.en,
                  })
                }
              >
                <span className={`route-status ${corridor.status}`}>
                  <Icon name="routing-2" />
                </span>
                <span>
                  <strong>{corridor.name[locale]}</strong>
                  <small>
                    {corridor.from[locale]} ← {corridor.to[locale]}
                  </small>
                </span>
                <span>
                  <b>{corridor.delayHours}h</b>
                  <small>
                    {local(
                      locale,
                      corridor.status === 'open'
                        ? 'باز'
                        : corridor.status === 'delayed'
                          ? 'با تأخیر'
                          : 'مختل',
                      corridor.status,
                    )}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </ModuleFrame>
        <ModuleFrame
          id="country-compare"
          title={local(locale, 'مقایسه کشورها', 'Country comparison')}
          description={local(
            locale,
            'ریسک ترکیبی نمونه · از ۱۰۰',
            'Prototype composite risk · out of 100',
          )}
          size="medium"
          state="cached"
        >
          <BarChart
            title={local(locale, 'ریسک کشورها', 'Country risk')}
            items={countries.map((country) => ({
              label: country.name[locale],
              value: country.risk,
            }))}
          />
        </ModuleFrame>
      </PageGrid>
    </div>
  )
}

export function ReportsPage() {
  const { locale } = usePreferences()
  const { openInspector, notify } = useWorkspace()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(reports[0])
  const visible = reports.filter((report) =>
    (locale === 'fa' ? report.title : reportTitlesEn[report.id])
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  return (
    <div className="page-view">
      <PageHeader
        title={local(locale, 'گزارش‌ها و تحلیل‌ها', 'Reports & Analysis')}
        summary={local(
          locale,
          'کتابخانهٔ گزارش‌های نسخه‌دار با شواهد، منابع و سابقهٔ تغییر.',
          'A versioned report library with evidence, sources, and change history.',
        )}
      />
      <div className="report-toolbar">
        <label className="inline-search">
          <Icon name="search-normal" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={local(locale, 'جست‌وجوی گزارش…', 'Search reports…')}
          />
        </label>
        <select>
          <option>{local(locale, 'همه انواع گزارش', 'All report types')}</option>
          <option>{local(locale, 'جمع‌بندی روزانه', 'Daily brief')}</option>
        </select>
        <select>
          <option>{local(locale, 'همه محدوده‌ها', 'All geographies')}</option>
          <option>{local(locale, 'جهانی', 'Global')}</option>
        </select>
      </div>
      <PageGrid>
        <ModuleFrame
          id="report-library"
          title={local(locale, 'کتابخانه گزارش', 'Report library')}
          description={`${visible.length} ${local(locale, 'گزارش نمایشی', 'prototype reports')}`}
          size="medium"
          state={visible.length ? 'fresh' : 'empty'}
        >
          <div className="report-list">
            {visible.map((report) => (
              <button
                key={report.id}
                className={selected.id === report.id ? 'selected' : ''}
                onClick={() => setSelected(report)}
              >
                <span className="report-type">
                  <Icon name="document-text" />
                </span>
                <span>
                  <strong>{locale === 'fa' ? report.title : reportTitlesEn[report.id]}</strong>
                  <small>
                    {local(locale, 'گزارش اطلاعاتی', 'Intelligence report')} · v{report.version} ·
                    ۱۸ {local(locale, 'منبع', 'sources')}
                  </small>
                </span>
                <time dir="ltr">{report.updatedAt.slice(0, 10)}</time>
              </button>
            ))}
          </div>
        </ModuleFrame>
        <ModuleFrame
          id="report-detail"
          title={locale === 'fa' ? selected.title : reportTitlesEn[selected.id]}
          description={`${local(locale, 'گزارش تولیدشده با AI', 'AI-generated report')} · v${selected.version}`}
          size="large"
          state="cached"
          sourceCount={18}
          confidence={81}
        >
          <article className="report-detail">
            <span className="ai-generated-label">
              <Icon name="magic-star" />
              {local(locale, 'محتوای تولیدشده با هوش مصنوعی', 'AI-generated content')}
            </span>
            <h3>{local(locale, 'خلاصه مدیریتی', 'Executive summary')}</h3>
            <p>
              {local(
                locale,
                'سه تحول مسیرهای راهبردی نیازمند پایش نزدیک هستند. شواهد مستقل از افزایش زمان عبور پشتیبانی می‌کنند، اما دامنه و دوام اثر هنوز روشن نیست.',
                'Three strategic-route developments require close monitoring. Independent evidence supports higher transit times, but the scope and persistence of impact remain unclear.',
              )}
            </p>
            <div className="report-facts">
              <span>
                <small>{local(locale, 'محدوده', 'Scope')}</small>
                {local(locale, 'جهانی', 'Global')}
              </span>
              <span>
                <small>{local(locale, 'تازگی', 'Freshness')}</small>
                {local(locale, '۲ ساعت', '2 hours')}
              </span>
              <span>
                <small>{local(locale, 'نسخه', 'Version')}</small>v{selected.version}
              </span>
            </div>
            <div className="report-actions">
              <Button
                variant="outline"
                onClick={() =>
                  openInspector({
                    kind: 'report',
                    id: selected.id,
                    title: selected.title,
                    titleEn: reportTitlesEn[selected.id],
                  })
                }
              >
                <Icon name="document-text" />
                {local(locale, 'جزئیات و شواهد', 'Details & evidence')}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  notify(
                    local(
                      locale,
                      'خروجی PDF فقط یک رفتار نمایشی است.',
                      'PDF export is a prototype-only action.',
                    ),
                  )
                }
              >
                <Icon name="document-download" />
                PDF
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  notify(
                    local(
                      locale,
                      'گزارش در فهرست ذخیره‌شده‌ها قرار گرفت.',
                      'Report added to saved items.',
                    ),
                  )
                }
              >
                <Icon name="bookmark" />
                {local(locale, 'ذخیره', 'Save')}
              </Button>
            </div>
          </article>
        </ModuleFrame>
        <ModuleFrame
          id="version-history"
          title={local(locale, 'تاریخچه نسخه‌ها', 'Version history')}
          description={local(
            locale,
            'ردیابی تغییر گزارش و شواهد',
            'Track report and evidence changes',
          )}
          size="small"
          state="fresh"
        >
          <ol className="version-list">
            {[selected.version, selected.version - 1, selected.version - 2]
              .filter((v) => v > 0)
              .map((version, index) => (
                <li key={version}>
                  <span>v{version}</span>
                  <div>
                    <strong>
                      {local(
                        locale,
                        index === 0 ? 'نسخه کنونی' : 'نسخه پیشین',
                        index === 0 ? 'Current version' : 'Previous version',
                      )}
                    </strong>
                    <small dir="ltr">
                      2026-08-{24 - index} · {12 - index}:20 UTC
                    </small>
                  </div>
                </li>
              ))}
          </ol>
        </ModuleFrame>
      </PageGrid>
    </div>
  )
}

export function DataManagementPage() {
  const { locale } = usePreferences()
  const copy = useProductCopy()
  const { role, openInspector, notify } = useWorkspace()
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const filtered = useMemo(
    () =>
      sources.filter(
        (source) =>
          (stateFilter === 'all' || source.state === stateFilter) &&
          (locale === 'fa' ? source.name : (source.nameEn ?? ''))
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [locale, query, stateFilter],
  )
  if (role !== 'data-manager')
    return (
      <div className="page-view restricted-page">
        <PageHeader
          title={local(locale, 'مدیریت داده', 'Data Management')}
          summary={local(
            locale,
            'منابع، ورود داده، تازگی و کیفیت برای نقش‌های مجاز.',
            'Sources, ingestion, freshness, and quality for authorized roles.',
          )}
        />
        <section className="restricted-panel">
          <span>
            <Icon name="lock" size={32} />
          </span>
          <h2>{copy.restrictedTitle}</h2>
          <p>{copy.restrictedBody}</p>
          <div>
            <code dir="ltr">ROLE: {role}</code>
            <code dir="ltr">REQUIRED: data-manager</code>
          </div>
        </section>
      </div>
    )
  return (
    <div className="page-view">
      <PageHeader
        title={local(locale, 'مدیریت داده', 'Data Management')}
        summary={local(
          locale,
          'سلامت منابع، وضعیت ورود داده، تازگی و کیفیت پوشش نمایشی.',
          'Prototype source health, ingestion, freshness, and coverage quality.',
        )}
      />
      <KpiStrip
        items={[
          {
            label: local(locale, 'منبع سالم', 'Healthy sources'),
            value: '۲۴',
            change: local(locale, 'از ۳۲ منبع', 'of 32 sources'),
            icon: 'tick-circle',
            tone: 'positive',
          },
          {
            label: local(locale, 'پوشش ناقص', 'Partial coverage'),
            value: '۴',
            change: local(locale, 'نیازمند بررسی', 'Requires review'),
            icon: 'warning-2',
            tone: 'warning',
          },
          {
            label: local(locale, 'خطای فعال', 'Active errors'),
            value: '۲',
            change: local(locale, 'بدون اقدام واقعی', 'No live action'),
            icon: 'close-circle',
            tone: 'critical',
          },
          {
            label: local(locale, 'میانگین تأخیر', 'Average latency'),
            value: '۸۴۰ ms',
            change: local(locale, 'نمونه محلی', 'Local demo'),
            icon: 'timer',
          },
        ]}
      />
      <div className="data-toolbar">
        <label className="inline-search">
          <Icon name="search-normal" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={local(locale, 'جست‌وجوی منبع…', 'Search sources…')}
          />
        </label>
        <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
          <option value="all">{local(locale, 'همه وضعیت‌ها', 'All states')}</option>
          {(['fresh', 'cached', 'stale', 'partial', 'empty', 'error'] as DataState[]).map(
            (state) => (
              <option key={state} value={state}>
                {copy[state === 'empty' ? 'empty' : state]}
              </option>
            ),
          )}
        </select>
        <Button
          onClick={() =>
            notify(
              local(
                locale,
                'ایجاد منبع در این نمونه فعال نیست.',
                'Source creation is unavailable in this prototype.',
              ),
            )
          }
        >
          <Icon name="add" />
          {local(locale, 'افزودن منبع نمایشی', 'Add prototype source')}
        </Button>
      </div>
      <PageGrid>
        <ModuleFrame
          id="sources"
          title={local(locale, 'فهرست منابع', 'Source directory')}
          description={`${filtered.length} ${local(locale, 'نتیجه', 'results')}`}
          size="large"
          state="partial"
        >
          <div className="dense-table-wrap">
            <table className="dense-table">
              <thead>
                <tr>
                  <th>{local(locale, 'منبع', 'Source')}</th>
                  <th>{local(locale, 'نوع', 'Type')}</th>
                  <th>{local(locale, 'وضعیت', 'State')}</th>
                  <th>{local(locale, 'آخرین موفقیت', 'Last success')}</th>
                  <th>{local(locale, 'تأخیر', 'Latency')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((source) => (
                  <tr key={source.id}>
                    <td>
                      <strong>{locale === 'fa' ? source.name : source.nameEn}</strong>
                      <code dir="ltr">{source.id.toUpperCase()}</code>
                    </td>
                    <td dir="ltr">{source.kind.toUpperCase()}</td>
                    <td>
                      <span className={`state-badge state-${source.state}`}>
                        <i />
                        {copy[source.state === 'empty' ? 'empty' : source.state]}
                      </span>
                    </td>
                    <td dir="ltr">{source.lastSuccess?.slice(0, 16).replace('T', ' ')}</td>
                    <td dir="ltr">{source.latencyMs || '—'} ms</td>
                    <td>
                      <button
                        onClick={() =>
                          openInspector({
                            kind: 'source',
                            id: source.id,
                            title: source.name,
                            titleEn: source.nameEn,
                          })
                        }
                      >
                        <Icon name="arrow-left-01" className="directional-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModuleFrame>
        <ModuleFrame
          id="ingestion"
          title={local(locale, 'کارهای ورود داده', 'Ingestion jobs')}
          description={local(
            locale,
            'همه رفتارها محلی و ثابت هستند',
            'All behaviors are local and deterministic',
          )}
          size="medium"
          state="loading"
        >
          <div className="job-list">
            {[
              ['JOB-2841', 'running', '68%'],
              ['JOB-2840', 'partial', '92%'],
              ['JOB-2839', 'completed', '100%'],
              ['JOB-2838', 'failed', '41%'],
            ].map(([id, state, progress]) => (
              <article key={id}>
                <span className={`job-icon ${state}`}>
                  <Icon
                    name={
                      state === 'running'
                        ? 'refresh-circle'
                        : state === 'completed'
                          ? 'tick-circle'
                          : 'warning-2'
                    }
                  />
                </span>
                <div>
                  <strong dir="ltr">{id}</strong>
                  <small>
                    {local(
                      locale,
                      state === 'running'
                        ? 'در حال اجرا'
                        : state === 'partial'
                          ? 'پوشش ناقص'
                          : state === 'completed'
                            ? 'تکمیل‌شده'
                            : 'ناموفق',
                      state,
                    )}
                  </small>
                </div>
                <div className="job-progress">
                  <i style={{ inlineSize: progress }} />
                  <span dir="ltr">{progress}</span>
                </div>
              </article>
            ))}
          </div>
        </ModuleFrame>
        <ModuleFrame
          id="states"
          title={local(locale, 'حالت‌های کیفیت داده', 'Data-quality states')}
          description={local(
            locale,
            'نمونهٔ صریح همه حالت‌های مهم',
            'Explicit examples of important states',
          )}
          size="medium"
          state="error"
        >
          <div className="state-showcase">
            {(
              [
                'loading',
                'empty',
                'error',
                'partial',
                'stale',
                'cached',
                'restricted',
              ] as DataState[]
            ).map((state) => (
              <article key={state} className={`showcase-${state}`}>
                <Icon
                  name={
                    state === 'loading'
                      ? 'refresh-circle'
                      : state === 'error'
                        ? 'close-circle'
                        : state === 'restricted'
                          ? 'lock'
                          : 'info-circle'
                  }
                />
                <span>
                  <strong>{copy[state === 'empty' ? 'empty' : state]}</strong>
                  <small>
                    {local(
                      locale,
                      state === 'loading'
                        ? 'در انتظار پاسخ منبع'
                        : state === 'empty'
                          ? 'داده‌ای در بازه انتخابی نیست'
                          : state === 'error'
                            ? 'بازیابی ناموفق؛ تلاش دوباره نمایشی است'
                            : state === 'partial'
                              ? 'بخشی از پوشش در دسترس نیست'
                              : state === 'stale'
                                ? 'آخرین داده از آستانه تازگی گذشته است'
                                : state === 'cached'
                                  ? 'نسخه ذخیره‌شده نمایش داده می‌شود'
                                  : 'این داده برای نقش فعلی محدود است',
                      state,
                    )}
                  </small>
                </span>
              </article>
            ))}
          </div>
        </ModuleFrame>
      </PageGrid>
    </div>
  )
}

function DenseTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="dense-table-wrap">
      <table className="dense-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} dir={j ? 'ltr' : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
