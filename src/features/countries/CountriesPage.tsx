import './countries.css'

import { useMemo, useState } from 'react'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { ModuleFrame } from '@/components/product/ModuleFrame'
import { PageHeader } from '@/components/product/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { corridors, countries } from '@/data/mock/visualMvpData'
import { CountryComparisonRaceChart, CountryRiskSemiDonut } from './CountriesCharts'

function local<T>(locale: 'fa' | 'en', fa: T, en: T): T {
  return locale === 'fa' ? fa : en
}

function localizeDigits(value: string | number, locale: 'fa' | 'en') {
  const text = String(value)
  if (locale === 'en') return text
  const digits: Record<string, string> = {
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
  }
  return text.replace(/[0-9]/g, (digit) => digits[digit] ?? digit).replaceAll('%', '٪')
}

function trendLabel(trend: string, locale: 'fa' | 'en') {
  if (trend === 'rising') return local(locale, 'افزایشی', 'Rising')
  if (trend === 'falling') return local(locale, 'کاهشی', 'Falling')
  return local(locale, 'پایدار', 'Stable')
}

function trendClass(trend: string) {
  if (trend === 'rising') return 'country-trend-up'
  if (trend === 'falling') return 'country-trend-down'
  return 'country-trend-stable'
}

function corridorStatus(status: string, locale: 'fa' | 'en') {
  if (status === 'open') return local(locale, 'باز', 'Open')
  if (status === 'delayed') return local(locale, 'دارای تأخیر', 'Delayed')
  return local(locale, 'مختل', 'Disrupted')
}

export function CountriesPage() {
  const { locale } = usePreferences()
  const { openInspector } = useWorkspace()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(countries[0])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale === 'fa' ? 'fa' : 'en')
    if (!normalized) return countries
    return countries.filter((country) =>
      `${country.name.fa} ${country.name.en} ${country.region.fa} ${country.region.en}`
        .toLocaleLowerCase(locale === 'fa' ? 'fa' : 'en')
        .includes(normalized),
    )
  }, [locale, query])

  const comparisonItems = countries.map((country) => ({
    label: country.name[locale],
    value: country.risk,
  }))

  return (
    <div className="page-view countries-page-v2" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <PageHeader
        title={local(locale, 'کشورها و مسیرها', 'Countries & Routes')}
        summary={local(
          locale,
          'نمای چندحوزه‌ای کشورها و وضعیت مسیرها، گلوگاه‌ها و اختلال‌ها.',
          'A cross-domain view of countries, routes, chokepoints, and disruptions.',
        )}
      />

      <ModuleFrame
        id="country-overview-v2"
        title={local(locale, 'کشورها', 'Countries')}
        description={local(
          locale,
          'یک کشور را انتخاب کنید تا پروفایل ریسک آن را در کنار فهرست ببینید.',
          'Select a country to view its risk profile beside the directory.',
        )}
        size="wide"
        state="fresh"
        eventCount={selected.events}
        confidence={79}
      >
        <div className="country-overview-layout">
          <div className="country-directory-pane">
            <label className="country-search">
              <span>{local(locale, 'جست‌وجوی کشور', 'Search countries')}</span>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={local(locale, 'نام کشور یا منطقه…', 'Country or region…')}
              />
            </label>

            <div className="country-list-v2">
              {filtered.map((country) => (
                <Button
                  key={country.id}
                  variant="ghost"
                  className={selected.id === country.id ? 'selected' : ''}
                  onClick={() => setSelected(country)}
                >
                  <span className="country-list-copy">
                    <strong>{country.name[locale]}</strong>
                    <small>{country.region[locale]}</small>
                  </span>
                  <span className="country-list-risk" dir="auto">
                    {localizeDigits(`${country.risk}/100`, locale)}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <section className="country-profile-pane" aria-label={selected.name[locale]}>
            <header className="country-profile-heading">
              <div>
                <h3>{selected.name[locale]}</h3>
                <p>
                  {selected.region[locale]} · {local(locale, 'پروفایل ریسک کشور', 'Country risk profile')}
                </p>
              </div>
              <span className="country-fresh-badge">
                <i />
                {local(locale, 'تازه', 'Fresh')}
              </span>
            </header>

            <div className="country-profile-layout">
              <div className="country-risk-pane">
                <CountryRiskSemiDonut
                  value={selected.risk}
                  label={local(locale, 'ریسک ترکیبی', 'Composite risk')}
                />
              </div>

              <div className="country-profile-content">
                <div className="country-indicator-grid">
                  {selected.indicators.map((indicator) => (
                    <div className="country-indicator-card" key={indicator.label.en}>
                      <span>{indicator.label[locale]}</span>
                      <strong dir="auto">{localizeDigits(indicator.value, locale)}</strong>
                    </div>
                  ))}
                  <div className="country-indicator-card">
                    <span>{local(locale, 'روند', 'Trend')}</span>
                    <strong className={trendClass(selected.trend)}>
                      {trendLabel(selected.trend, locale)}
                    </strong>
                  </div>
                </div>

                <Button
                  variant="link"
                  className="country-profile-action"
                  onClick={() =>
                    openInspector({
                      kind: 'country',
                      id: selected.id,
                      title: selected.name.fa,
                      titleEn: selected.name.en,
                    })
                  }
                >
                  {local(locale, 'بازکردن بازرس کشور', 'Open country inspector')}
                  <Icon name="arrow-left-01" className="directional-icon" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      </ModuleFrame>

      <div className="countries-secondary-grid">
        <ModuleFrame
          id="corridors-v2"
          title={local(locale, 'مسیرهای راهبردی', 'Strategic corridors')}
          description={local(
            locale,
            'وضعیت، تأخیر و گلوگاه‌های کلیدی',
            'Status, delay, and major chokepoints',
          )}
          size="medium"
          state="partial"
        >
          <div className="corridor-list-v2">
            {corridors.map((corridor) => (
              <button
                type="button"
                className="corridor-row-v2"
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
                <span className="corridor-icon">
                  <Icon name="routing-2" size={20} />
                </span>
                <span className="corridor-copy">
                  <strong>{corridor.name[locale]}</strong>
                  <small>
                    {corridor.from[locale]} → {corridor.to[locale]}
                  </small>
                </span>
                <span className={`corridor-status ${corridor.status}`}>
                  {corridorStatus(corridor.status, locale)}
                </span>
                <span className="corridor-delay">
                  {local(
                    locale,
                    `${localizeDigits(corridor.delayHours, locale)} ساعت تأخیر`,
                    `${corridor.delayHours}h delay`,
                  )}
                </span>
              </button>
            ))}
          </div>
        </ModuleFrame>

        <ModuleFrame
          id="country-compare-v2"
          title={local(locale, 'مقایسه کشورها', 'Country comparison')}
          description={local(
            locale,
            'رتبه‌بندی ریسک ترکیبی نمونه · از ۱۰۰',
            'Prototype composite-risk ranking · out of 100',
          )}
          size="large"
          state="cached"
        >
          <CountryComparisonRaceChart
            description={local(
              locale,
              'رتبه‌بندی ریسک ترکیبی کشورها',
              'Composite risk ranking by country',
            )}
            items={comparisonItems}
          />
          <p className="country-compare-note">
            {local(
              locale,
              'چیدمان بر اساس بیشترین ریسک مرتب می‌شود؛ این نما snapshot است و کنترل زمانی ندارد.',
              'Bars are sorted by highest risk; this is a snapshot view without timeline controls.',
            )}
          </p>
        </ModuleFrame>
      </div>
    </div>
  )
}
