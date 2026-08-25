import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { countries, events, reportTitlesEn, reports, sources } from '@/data/mock/visualMvpData'
import { useProductCopy } from '@/localization/productCopy'
import type { IntelligenceDomain, Role } from '@/types/domain'

const navigation = [
  { path: '/world', key: 'world', icon: 'global' },
  { path: '/developments', key: 'developments', icon: 'trend-up' },
  { path: '/security', key: 'security', icon: 'shield-security' },
  { path: '/markets', key: 'markets', icon: 'chart' },
  { path: '/countries', key: 'countries', icon: 'routing-2' },
  { path: '/reports', key: 'reports', icon: 'document-text' },
  { path: '/data', key: 'data', icon: 'data' },
] as const

const domains: { value: IntelligenceDomain | 'all'; fa: string; en: string }[] = [
  { value: 'all', fa: 'همه حوزه‌ها', en: 'All domains' },
  { value: 'conflict', fa: 'درگیری', en: 'Conflict' },
  { value: 'military', fa: 'نظامی', en: 'Military' },
  { value: 'economic', fa: 'اقتصاد', en: 'Economy' },
  { value: 'hazard', fa: 'مخاطرات', en: 'Hazards' },
  { value: 'infrastructure', fa: 'زیرساخت', en: 'Infrastructure' },
  { value: 'maritime', fa: 'مسیرها', en: 'Routes' },
  { value: 'cyber', fa: 'سایبری', en: 'Cyber' },
]

export function AppShell() {
  const copy = useProductCopy()
  const { locale, setLocale, theme, setTheme } = usePreferences()
  const {
    role,
    setRole,
    filters,
    setFilter,
    resetFilters,
    setSearchOpen,
    inspector,
    closeInspector,
    toast,
  } = useWorkspace()
  const [collapsed, setCollapsed] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setFiltersOpen(false), [location.pathname])

  return (
    <div className={`app-shell ${collapsed ? 'nav-collapsed' : ''}`}>
      <aside
        className="primary-nav"
        aria-label={locale === 'fa' ? 'ناوبری اصلی' : 'Primary navigation'}
      >
        <div className="product-lockup">
          <span className="product-symbol">
            <Icon name="eye" size={22} type="bulk" />
          </span>
          {!collapsed && (
            <span>
              <strong>{copy.product}</strong>
              <small dir="ltr">INTELLIGENCE WORKSPACE</small>
            </span>
          )}
        </div>
        <nav>
          {navigation.map((item) => {
            const restricted = item.key === 'data' && role !== 'data-manager'
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''} ${restricted ? 'restricted' : ''}`
                }
                title={copy[item.key]}
              >
                <Icon
                  name={item.icon}
                  size={21}
                  type={location.pathname === item.path ? 'bulk' : 'linear'}
                />
                {!collapsed && <span>{copy[item.key]}</span>}
                {restricted && !collapsed && <Icon name="lock" size={14} />}
              </NavLink>
            )
          })}
        </nav>
        <button
          className="nav-collapse"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <Icon name="arrow-left-02" className="directional-icon" />
          {!collapsed && <span>{locale === 'fa' ? 'جمع‌کردن منو' : 'Collapse menu'}</span>}
        </button>
      </aside>

      <div className="shell-main">
        <header className="global-topbar">
          <div className="organization-control">
            <span className="org-avatar">ا</span>
            <span>
              <small>{locale === 'fa' ? 'سازمان فعال' : 'Active organization'}</small>
              <strong>{copy.organization}</strong>
            </span>
            <Icon name="arrow-down-01" size={14} />
          </div>
          <button className="global-search-trigger" onClick={() => setSearchOpen(true)}>
            <Icon name="search-normal" />
            <span>{copy.searchHint}</span>
            <kbd dir="ltr">Ctrl K</kbd>
          </button>
          <div className="topbar-actions">
            <span className="sync-status">
              <i />
              {copy.sync}
            </span>
            <button className="icon-button" title={copy.watchlist}>
              <Icon name="bookmark" />
            </button>
            <button className="icon-button has-notification" title={copy.notifications}>
              <Icon name="notification" />
            </button>
            <button
              className="icon-button"
              title={theme === 'light' ? 'Dark' : 'Light'}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
            <button
              className="language-button"
              onClick={() => setLocale(locale === 'fa' ? 'en' : 'fa')}
              dir="ltr"
            >
              {locale === 'fa' ? 'EN' : 'فا'}
            </button>
            <button className="profile-button">
              <span>م‌ن</span>
              <Icon name="arrow-down-01" size={14} />
            </button>
          </div>
        </header>

        <div className={`context-bar ${filtersOpen ? 'open' : ''}`}>
          <button
            className="compact-filter-toggle"
            onClick={() => setFiltersOpen((value) => !value)}
          >
            <Icon name="filter" />
            {locale === 'fa' ? 'فیلترها' : 'Filters'}
          </button>
          <Filter
            label={copy.geography}
            value={filters.geography}
            onChange={(value) => setFilter('geography', value)}
            options={[
              ['global', copy.global],
              ['mena', locale === 'fa' ? 'خاورمیانه' : 'Middle East'],
              ['europe', locale === 'fa' ? 'اروپا' : 'Europe'],
              ['asia', locale === 'fa' ? 'آسیا' : 'Asia'],
            ]}
          />
          <Filter
            label={copy.time}
            value={filters.timeRange}
            onChange={(value) => setFilter('timeRange', value)}
            options={[
              ['24h', locale === 'fa' ? '۲۴ ساعت' : '24 hours'],
              ['7d', locale === 'fa' ? '۷ روز' : '7 days'],
              ['30d', locale === 'fa' ? '۳۰ روز' : '30 days'],
            ]}
          />
          <Filter
            label={copy.domain}
            value={filters.domain}
            onChange={(value) => setFilter('domain', value as IntelligenceDomain | 'all')}
            options={domains.map((item) => [item.value, locale === 'fa' ? item.fa : item.en])}
          />
          <Filter
            label={copy.sources}
            value={filters.sourceSet}
            onChange={(value) => setFilter('sourceSet', value)}
            options={[
              ['verified', copy.verifiedSources],
              ['all', locale === 'fa' ? 'همه منابع' : 'All sources'],
              ['watch', locale === 'fa' ? 'مجموعه پایش' : 'Watch set'],
            ]}
            meta={copy.sourceCount}
          />
          <Filter
            label={copy.savedView}
            value={filters.savedView}
            onChange={(value) => setFilter('savedView', value)}
            options={[
              ['daily', copy.dailyView],
              ['routes', locale === 'fa' ? 'ریسک مسیرها' : 'Route risk'],
              ['markets', locale === 'fa' ? 'پایش بازار' : 'Market watch'],
            ]}
          />
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <Icon name="refresh-circle" size={16} />
            {copy.reset}
          </Button>
        </div>

        <div className="prototype-strip">
          <span>
            <Icon name="info-circle" size={14} />
            {copy.prototype}
          </span>
          <label>
            <span>{copy.role}</span>
            <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
              <option value="viewer">{copy.viewer}</option>
              <option value="org-admin">{copy.orgAdmin}</option>
              <option value="data-manager">{copy.dataManager}</option>
            </select>
            <small>{copy.devOnly}</small>
          </label>
        </div>

        <main className="product-canvas">
          <Outlet />
        </main>
      </div>

      <GlobalSearch />
      {inspector && <Inspector onClose={closeInspector} />}
      {toast && (
        <div className="prototype-toast" role="status">
          <Icon name="tick-circle" />
          {toast}
        </div>
      )}
    </div>
  )
}

function Filter({
  label,
  value,
  onChange,
  options,
  meta,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[][]
  meta?: string
}) {
  return (
    <label className="context-filter">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
      {meta && <small>{meta}</small>}
    </label>
  )
}

function GlobalSearch() {
  const { locale } = usePreferences()
  const copy = useProductCopy()
  const { searchOpen, setSearchOpen, openInspector } = useWorkspace()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase()
    if (!q) return []
    return [
      ...events.map((item) => ({
        id: item.id,
        kind: 'event' as const,
        title: locale === 'fa' ? item.title : (item.titleEn ?? item.title),
        meta: locale === 'fa' ? 'رویداد' : 'Event',
      })),
      ...reports.map((item) => ({
        id: item.id,
        kind: 'report' as const,
        title: locale === 'fa' ? item.title : reportTitlesEn[item.id],
        meta: locale === 'fa' ? 'گزارش' : 'Report',
      })),
      ...countries.map((item) => ({
        id: item.id,
        kind: 'country' as const,
        title: item.name[locale],
        meta: locale === 'fa' ? 'کشور' : 'Country',
      })),
      ...sources.map((item) => ({
        id: item.id,
        kind: 'source' as const,
        title: locale === 'fa' ? item.name : (item.nameEn ?? item.name),
        meta: locale === 'fa' ? 'منبع' : 'Source',
      })),
    ]
      .filter((item) => item.title.toLocaleLowerCase().includes(q))
      .slice(0, 8)
  }, [locale, query])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setSearchOpen])
  if (!searchOpen) return null
  return (
    <div className="modal-backdrop" onMouseDown={() => setSearchOpen(false)}>
      <section
        className="search-palette"
        role="dialog"
        aria-modal="true"
        aria-label={copy.search}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="search-input">
          <Icon name="search-normal" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchHint}
          />
          <button onClick={() => setSearchOpen(false)}>
            <Icon name="close-circle" />
          </button>
        </div>
        <div className="search-results">
          {query && results.length === 0 && <p>{copy.noResults}</p>}
          {results.map((item) => (
            <button
              key={`${item.kind}-${item.id}`}
              onClick={() => {
                if (item.kind === 'country') navigate('/countries')
                if (item.kind === 'report') navigate('/reports')
                openInspector({ kind: item.kind, id: item.id, title: item.title })
                setSearchOpen(false)
                setQuery('')
              }}
            >
              <span className={`result-icon ${item.kind}`}>
                <Icon
                  name={
                    item.kind === 'event'
                      ? 'radar-2'
                      : item.kind === 'report'
                        ? 'document-text'
                        : item.kind === 'country'
                          ? 'global'
                          : 'link-2'
                  }
                />
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </span>
              <Icon name="arrow-left-01" className="directional-icon" />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function Inspector({ onClose }: { onClose: () => void }) {
  const { locale } = usePreferences()
  const copy = useProductCopy()
  const { inspector, notify } = useWorkspace()
  const [tab, setTab] = useState('overview')
  if (!inspector) return null
  const event = events.find((item) => item.id === inspector.id)
  const title = locale === 'fa' ? inspector.title : (inspector.titleEn ?? inspector.title)
  const tabs = [
    ['overview', copy.overview],
    ['evidence', copy.evidence],
    ['ai', copy.aiAnalysis],
    ['timeline', copy.timeline],
    ['sources', copy.inspectorSources],
  ]
  return (
    <>
      <button className="inspector-scrim" aria-label={copy.close} onClick={onClose} />
      <aside className="inspector" aria-label={title}>
        <header>
          <div>
            <span className="inspector-kind">
              <Icon name={inspector.kind === 'ai' ? 'magic-star' : 'radar-2'} size={15} />
              {inspector.kind === 'ai' ? copy.generated : copy.overview}
            </span>
            <h2>{title}</h2>
            <p>
              {event
                ? locale === 'fa'
                  ? event.region
                  : event.regionEn
                : locale === 'fa'
                  ? 'جزئیات مرتبط با نمای فعلی'
                  : 'Details related to the current view'}
            </p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label={copy.close}>
            <Icon name="close-circle" />
          </button>
        </header>
        <div className="inspector-tabs" role="tablist">
          {tabs.map(([key, label]) => (
            <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>
        <div className="inspector-body">
          {tab === 'overview' && <InspectorOverview event={event} />}
          {tab === 'evidence' && <EvidencePanel />}
          {tab === 'ai' && <AIAnalysis />}
          {tab === 'timeline' && <TimelinePanel />}
          {tab === 'sources' && <SourcePanel />}
        </div>
        <footer>
          <Button
            variant="outline"
            onClick={() =>
              notify(
                locale === 'fa' ? 'به گزارش نمایشی افزوده شد.' : 'Added to the prototype report.',
              )
            }
          >
            <Icon name="document-download" />
            {copy.addToReport}
          </Button>
          <Button onClick={() => setTab('ai')}>
            <Icon name="magic-star" />
            {copy.analyze}
          </Button>
        </footer>
      </aside>
    </>
  )
}

function InspectorOverview({ event }: { event?: (typeof events)[number] }) {
  const { locale } = usePreferences()
  const copy = useProductCopy()
  return (
    <div className="inspector-stack">
      <section className="narrative-callout">
        <span>{locale === 'fa' ? 'آنچه مشاهده شده' : 'Observed'}</span>
        <p>
          {event
            ? locale === 'fa'
              ? event.summary
              : event.summaryEn
            : locale === 'fa'
              ? 'این جزئیات از دادهٔ قطعی نمونه و تحلیل ساختگی تشکیل شده است.'
              : 'These details combine deterministic demo data and simulated analysis.'}
        </p>
      </section>
      <div className="trust-grid">
        <Metric label={copy.confidence} value={`${event?.confidence ?? 78}%`} />
        <Metric label={copy.sourcesLabel} value={String(event?.sourceCount ?? 7)} />
        <Metric label={copy.freshness} value={copy.fresh} />
      </div>
      <section>
        <h3>{locale === 'fa' ? 'چرا مهم است؟' : 'Why it matters'}</h3>
        <p>
          {locale === 'fa'
            ? 'این تحول می‌تواند بر زمان‌بندی مسیرها و ارزیابی ریسک منطقه‌ای اثر بگذارد؛ اثر نهایی هنوز قطعی نیست.'
            : 'This development may affect route timing and regional risk; the final impact is not yet certain.'}
        </p>
      </section>
      <section>
        <h3>{locale === 'fa' ? 'محدوده و زمان' : 'Scope and time'}</h3>
        <code dir="ltr">2026-08-24 11:42 UTC · 26.56 N, 56.25 E</code>
      </section>
    </div>
  )
}
function EvidencePanel() {
  const { locale } = usePreferences()
  return (
    <div className="evidence-list">
      {[1, 2, 3].map((n) => (
        <article key={n}>
          <span>{n}</span>
          <div>
            <strong>
              {locale === 'fa'
                ? ['گزارش مستقل تردد دریایی', 'اطلاعیه اپراتور بندری', 'تصویر ماهواره‌ای باز'][
                    n - 1
                  ]
                : ['Independent maritime report', 'Port operator notice', 'Open satellite imagery'][
                    n - 1
                  ]}
            </strong>
            <p>
              {locale === 'fa'
                ? 'شاهد پشتیبان · بازیابی‌شده در نمونهٔ محلی'
                : 'Supporting evidence · retrieved in the local prototype'}
            </p>
            <code dir="ltr">
              SRC-00{n} · 2026-08-24T11:{40 + n}:00Z
            </code>
          </div>
        </article>
      ))}
    </div>
  )
}
function AIAnalysis() {
  const { locale } = usePreferences()
  const copy = useProductCopy()
  const { notify } = useWorkspace()
  return (
    <div className="ai-analysis">
      <div className="ai-label">
        <Icon name="magic-star" />
        {copy.generated}
        <span>v1.4</span>
      </div>
      <section>
        <h3>{copy.executiveSummary}</h3>
        <p>
          {locale === 'fa'
            ? 'هم‌گرایی چند منبع مستقل از افزایش فشار عملیاتی خبر می‌دهد، اما برای نتیجه‌گیری دربارهٔ تداوم آن دادهٔ بیشتری لازم است.'
            : 'Multiple independent sources indicate increased operational pressure, but more data is needed to conclude that it will persist.'}
        </p>
      </section>
      <section>
        <h3>{copy.keyFindings}</h3>
        <ul>
          <li>
            {locale === 'fa'
              ? 'افزایش زمان عبور در دو نقطه مشاهده شده است.'
              : 'Transit time increased at two observed points.'}
          </li>
          <li>
            {locale === 'fa'
              ? 'تنوع منابع متوسط رو به بالاست.'
              : 'Source diversity is medium-high.'}
          </li>
        </ul>
      </section>
      <div className="analysis-facts">
        <Metric label={copy.confidence} value="76%" />
        <Metric label={copy.diversity} value={locale === 'fa' ? '۵ نوع' : '5 types'} />
        <Metric label={copy.freshness} value={locale === 'fa' ? '۲ دقیقه' : '2 min'} />
      </div>
      <section className="contradiction">
        <h3>{copy.contradictory}</h3>
        <p>
          {locale === 'fa'
            ? 'یک منبع محلی کاهش تأخیر را گزارش کرده؛ استقلال آن هنوز تأیید نشده است.'
            : 'One local source reports declining delays; its independence is not confirmed.'}
        </p>
      </section>
      <section>
        <h3>{copy.assumptions}</h3>
        <p>
          {locale === 'fa'
            ? 'الگوی تردد گزارش‌شده با عملیات تجاری عادی قابل مقایسه فرض شده است.'
            : 'Reported traffic patterns are assumed comparable with normal commercial operation.'}
        </p>
      </section>
      <section>
        <h3>{copy.limitations}</h3>
        <p>
          {locale === 'fa'
            ? 'دادهٔ دو بندر با تأخیر رسیده و این تحلیل پیش‌بینی قطعی نیست.'
            : 'Data from two ports is delayed; this analysis is not a certain forecast.'}
        </p>
      </section>
      <Button
        variant="outline"
        onClick={() =>
          notify(
            locale === 'fa'
              ? 'تحلیل نمایشی دوباره اجرا شد؛ خروجی ثابت است.'
              : 'Prototype analysis re-run; output is deterministic.',
          )
        }
      >
        <Icon name="refresh-circle" />
        {copy.rerun}
      </Button>
    </div>
  )
}
function TimelinePanel() {
  const { locale } = usePreferences()
  return (
    <ol className="detail-timeline">
      {['11:42', '10:56', '09:20'].map((time, index) => (
        <li key={time}>
          <time dir="ltr">{time} UTC</time>
          <span>
            {locale === 'fa'
              ? ['ثبت تغییر زمان عبور', 'تأیید دومین منبع مستقل', 'شروع پایش الگوی تردد'][index]
              : [
                  'Transit-time change recorded',
                  'Second independent source confirmed',
                  'Traffic-pattern watch started',
                ][index]}
          </span>
        </li>
      ))}
    </ol>
  )
}
function SourcePanel() {
  const { locale } = usePreferences()
  return (
    <div className="source-mini-list">
      {sources.slice(0, 4).map((source) => (
        <article key={source.id}>
          <span className={`state-dot ${source.state}`} />
          <div>
            <strong>{locale === 'fa' ? source.name : source.nameEn}</strong>
            <code dir="ltr">
              {source.kind.toUpperCase()} · {source.latencyMs} ms
            </code>
          </div>
        </article>
      ))}
    </div>
  )
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-cell">
      <small>{label}</small>
      <strong dir="auto">{value}</strong>
    </div>
  )
}
