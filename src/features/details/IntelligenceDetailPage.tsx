import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'

import { usePreferences } from '@/app/PreferencesProvider'
import type { InspectorItem } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { InternalPageToolbar, InternalSection } from '@/components/product/InternalPage'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { corridors, countries, events, reports, sources } from '@/data/mock/visualMvpData'
import { ResponsiveTabsNav } from '@/components/product/ResponsiveTabsNav'

import './details.css'

function local<T>(locale: 'fa' | 'en', fa: T, en: T): T {
  return locale === 'fa' ? fa : en
}

function formatNumber(value: number | undefined, locale: 'fa' | 'en') {
  if (value == null) return '—'
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(value)
}

const fallbackOrigins: Record<string, { path: string; fa: string; en: string }> = {
  event: { path: '/developments', fa: 'تحولات و پیش‌بینی‌ها', en: 'Developments & forecasts' },
  signal: { path: '/developments', fa: 'تحولات و پیش‌بینی‌ها', en: 'Developments & forecasts' },
  country: { path: '/countries', fa: 'کشورها و مسیرها', en: 'Countries & routes' },
  route: { path: '/countries', fa: 'کشورها و مسیرها', en: 'Countries & routes' },
  report: { path: '/reports', fa: 'گزارش‌ها و تحلیل‌ها', en: 'Reports & analysis' },
  source: { path: '/world', fa: 'رصد جهان', en: 'World monitor' },
  ai: { path: '/reports', fa: 'گزارش‌ها و تحلیل‌ها', en: 'Reports & analysis' },
}

export function IntelligenceDetailPage() {
  const { locale } = usePreferences()
  const navigate = useNavigate()
  const location = useLocation()
  const { kind = 'event', id = '' } = useParams()
  const [searchParams] = useSearchParams()
  const [copied, setCopied] = useState(false)
  const state = location.state as InspectorItem | undefined
  const activeTab = searchParams.get('tab') ?? 'overview'

  const event = events.find((item) => item.id === id)
  const country = countries.find((item) => item.id === id)
  const corridor = corridors.find((item) => item.id === id)
  const source = sources.find((item) => item.id === id)
  const report = reports.find((item) => item.id === id)

  const resolved = useMemo(() => {
    if (kind === 'event' || kind === 'signal') return event
    if (kind === 'country') return country
    if (kind === 'route') return corridor
    if (kind === 'source') return source
    if (kind === 'report') return report
    return undefined
  }, [corridor, country, event, kind, report, source])

  const title =
    state?.[locale === 'fa' ? 'title' : 'titleEn'] ??
    (event ? (locale === 'fa' ? event.title : event.titleEn) : undefined) ??
    (country ? country.name[locale] : undefined) ??
    (corridor ? corridor.name[locale] : undefined) ??
    (source ? (locale === 'fa' ? source.name : source.nameEn) : undefined) ??
    report?.title ??
    local(locale, 'جزئیات تحلیل', 'Analysis detail')

  const titleEn =
    state?.titleEn ??
    event?.titleEn ??
    country?.name.en ??
    corridor?.name.en ??
    source?.nameEn ??
    report?.title ??
    'Analysis detail'

  const entityDomain = event?.domain ?? source?.domain
  const scopedSources = sources.filter((item) => !entityDomain || item.domain === entityDomain).slice(0, 4)
  const relatedEvents = events
    .filter((item) => item.id !== event?.id && (!entityDomain || item.domain === entityDomain))
    .slice(0, 4)

  const kindLabel =
    kind === 'event' || kind === 'signal'
      ? local(locale, 'رویداد', 'Event')
      : kind === 'country'
        ? local(locale, 'کشور', 'Country')
        : kind === 'route'
          ? local(locale, 'مسیر', 'Route')
          : kind === 'source'
            ? local(locale, 'منبع', 'Source')
            : kind === 'report'
              ? local(locale, 'گزارش', 'Report')
              : local(locale, 'تحلیل', 'Analysis')

  const heroSummary = event
    ? locale === 'fa'
      ? event.summary
      : event.summaryEn
    : country
      ? local(
          locale,
          `این نما وضعیت ${country.name.fa} را با ریسک ترکیبی ${formatNumber(country.risk, locale)} از ۱۰۰ و ${formatNumber(country.events, locale)} رویداد ثبت‌شده جمع‌بندی می‌کند.`,
          `This view summarizes ${country.name.en} with a composite risk of ${country.risk}/100 and ${country.events} recorded events.`,
        )
      : corridor
        ? local(
            locale,
            `وضعیت مسیر ${corridor.from.fa} تا ${corridor.to.fa}، میزان تأخیر و داده‌های مرتبط را در یک نمای واحد بررسی کنید.`,
            `Review the ${corridor.from.en} to ${corridor.to.en} route status, delay, and related evidence in one place.`,
          )
        : source
          ? local(
              locale,
              'وضعیت منبع، حوزه پوشش، آخرین موفقیت و کیفیت پاسخ آن را بدون نیاز به خواندن داده خام بررسی کنید.',
              'Review source status, coverage, last success, and response quality without having to interpret raw data.',
            )
          : report
            ? local(
                locale,
                'نسخه گزارش و ارزیابی‌های مرتبط را همراه با منابع و داده‌های پشتیبان بررسی کنید.',
                'Review the report version, linked assessments, sources, and supporting data.',
              )
            : local(
                locale,
                'اطلاعات اصلی، شواهد و ارتباط‌های این مورد در یک صفحه مستقل نمایش داده می‌شوند.',
                'Core information, evidence, and relationships for this item are shown on a dedicated page.',
              )

  const score = event?.confidence ?? country?.risk
  const scoreLabel = event
    ? local(locale, 'اطمینان تحلیل', 'Confidence')
    : country
      ? local(locale, 'ریسک ترکیبی', 'Composite risk')
      : undefined
  const secondaryMetricLabel = event
    ? undefined
    : country
      ? local(locale, 'رویدادهای ثبت‌شده', 'Recorded events')
      : source
        ? local(locale, 'تأخیر پاسخ', 'Latency')
        : corridor
          ? local(locale, 'تأخیر مسیر', 'Route delay')
          : report
            ? local(locale, 'نسخه گزارش', 'Report version')
            : undefined
  const secondaryMetricValue = event
    ? undefined
    : country
      ? formatNumber(country.events, locale)
      : source
        ? `${formatNumber(source.latencyMs, locale)} ms`
        : corridor
          ? `${formatNumber(corridor.delayHours, locale)} ${local(locale, 'ساعت', 'hours')}`
          : report
            ? formatNumber(report.version, locale)
            : undefined

  const technicalFields = useMemo(() => {
    const fields: { label: string; value: string }[] = [
      { label: local(locale, 'شناسه', 'ID'), value: id },
      { label: local(locale, 'نوع داده', 'Data type'), value: kindLabel },
    ]

    if (event) {
      fields.push(
        { label: local(locale, 'منطقه', 'Region'), value: locale === 'fa' ? event.region : event.regionEn },
        { label: local(locale, 'حوزه', 'Domain'), value: event.domain ?? '—' },
        { label: local(locale, 'اطمینان', 'Confidence'), value: `${formatNumber(event.confidence, locale)}٪` },
        { label: local(locale, 'تعداد منابع', 'Source count'), value: formatNumber(event.sourceCount, locale) },
      )
    }

    if (country) {
      fields.push(
        { label: local(locale, 'منطقه', 'Region'), value: country.region[locale] },
        { label: local(locale, 'ریسک ترکیبی', 'Composite risk'), value: `${formatNumber(country.risk, locale)}/100` },
        { label: local(locale, 'رویدادها', 'Events'), value: formatNumber(country.events, locale) },
      )
    }

    if (corridor) {
      fields.push(
        { label: local(locale, 'مبدأ', 'From'), value: corridor.from[locale] },
        { label: local(locale, 'مقصد', 'To'), value: corridor.to[locale] },
        { label: local(locale, 'وضعیت', 'Status'), value: corridor.status },
        { label: local(locale, 'تأخیر', 'Delay'), value: `${formatNumber(corridor.delayHours, locale)} ${local(locale, 'ساعت', 'hours')}` },
      )
    }

    if (source) {
      fields.push(
        { label: local(locale, 'نوع منبع', 'Source type'), value: source.kind },
        { label: local(locale, 'وضعیت', 'State'), value: source.state },
        { label: local(locale, 'حوزه', 'Domain'), value: source.domain ?? '—' },
        { label: local(locale, 'تأخیر پاسخ', 'Latency'), value: `${formatNumber(source.latencyMs, locale)} ms` },
        { label: local(locale, 'آخرین موفقیت', 'Last success'), value: source.lastSuccess ?? '—' },
      )
    }

    if (report) {
      fields.push(
        { label: local(locale, 'نسخه', 'Version'), value: formatNumber(report.version, locale) },
        { label: local(locale, 'ارزیابی‌های مرتبط', 'Linked assessments'), value: formatNumber(report.assessmentIds.length, locale) },
      )
    }

    return fields
  }, [corridor, country, event, id, kindLabel, locale, report, source])

  const fallbackOrigin = fallbackOrigins[kind] ?? fallbackOrigins.event
  const parentPath = state?.fromPath ?? fallbackOrigin.path
  const parentLabel =
    locale === 'fa'
      ? state?.fromLabel ?? fallbackOrigin.fa
      : state?.fromLabelEn ?? fallbackOrigin.en

  const rawJson = useMemo(
    () => JSON.stringify(resolved ?? state ?? { kind, id }, null, 2),
    [id, kind, resolved, state],
  )

  const setTab = (value: string) => {
    const search = value === 'overview' ? '' : `?tab=${value}`
    navigate({ pathname: location.pathname, search }, { replace: true, state })
  }

  const tabItems = [
    { value: 'overview', label: local(locale, 'نمای کلی', 'Overview') },
    { value: 'sources', label: local(locale, 'منابع و شواهد', 'Sources & evidence') },
    { value: 'related', label: local(locale, 'موارد مرتبط', 'Related') },
    { value: 'raw', label: local(locale, 'داده خام', 'Raw data') },
  ]
  const copyRawJson = async (eventObject: React.MouseEvent<HTMLButtonElement>) => {
    eventObject.preventDefault()
    eventObject.stopPropagation()
    try {
      await navigator.clipboard.writeText(rawJson)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const openNested = (nextKind: InspectorItem['kind'], nextId: string, nextTitle: string, nextTitleEn?: string) => {
    navigate(`/details/${nextKind}/${encodeURIComponent(nextId)}`, {
      state: {
        kind: nextKind,
        id: nextId,
        title: nextTitle,
        titleEn: nextTitleEn,
        fromPath: `${location.pathname}${location.search}`,
        fromLabel: title ?? id,
        fromLabelEn: titleEn,
      } satisfies InspectorItem,
    })
  }

  return (
    <div
      className={`page-view internal-page-shell intelligence-detail-page detail-kind-${kind}`}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
    >
      <InternalPageToolbar
        backLabel={local(locale, 'بازگشت به صفحه قبل', 'Back to previous page')}
        onBack={() => navigate(-1)}
        pageLabel={local(locale, 'جزئیات', 'Details')}
        breadcrumbLabel={local(locale, 'مسیر صفحه', 'Breadcrumb')}
        direction={locale === 'fa' ? 'rtl' : 'ltr'}
        breadcrumbs={[
          { label: parentLabel, onSelect: () => navigate(parentPath) },
          { label: title ?? id },
        ]}
        actions={
          event ? (
            <button
              type="button"
              className="internal-page-source-badge"
              onClick={() => setTab('sources')}
              aria-label={local(locale, 'مشاهده منابع این رویداد', 'View sources for this event')}
              title={local(locale, 'مشاهده منابع', 'View sources')}
            >
              <Icon name="document" size={14} />
              {local(
                locale,
                `${formatNumber(event.sourceCount, locale)} منبع`,
                `${formatNumber(event.sourceCount, locale)} sources`,
              )}
            </button>
          ) : undefined
        }
      />

      <header className="detail-page-hero">
        <div className="detail-page-heading">
          <span className="detail-page-kicker">
            <Icon name="document-text" size={16} />
            {kindLabel}
          </span>
          <h1>{title ?? id}</h1>
          <p>{heroSummary}</p>
        </div>

        {(score != null || secondaryMetricValue) && (
          <div className="detail-hero-metrics" aria-label={local(locale, 'شاخص‌های کلیدی', 'Key metrics')}>
            {score != null && scoreLabel ? (
              <div className="detail-score-card">
                <div>
                  <span>{scoreLabel}</span>
                  <strong>{formatNumber(score, locale)}{event ? '٪' : '/100'}</strong>
                </div>
                <div className="detail-score-track" aria-hidden="true">
                  <span style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
                </div>
              </div>
            ) : null}
            {secondaryMetricValue && secondaryMetricLabel ? (
              <div className="detail-metric-card">
                <Icon name="chart-square" size={20} />
                <span>
                  <small>{secondaryMetricLabel}</small>
                  <strong>{secondaryMetricValue}</strong>
                </span>
              </div>
            ) : null}
          </div>
        )}
      </header>

      <Tabs value={activeTab} onValueChange={setTab} className="detail-tabs">
        <ResponsiveTabsNav
          value={activeTab}
          onValueChange={setTab}
          items={tabItems}
          ariaLabel={local(locale, 'بخش جزئیات تحلیل', 'Analysis detail section')}
          className="detail-tabs-list"
        />

        <TabsContent value="overview" className="detail-tab-content">
          <div className="detail-overview-stack">
            <InternalSection
              title={local(locale, 'خلاصه وضعیت', 'Status summary')}
              description={local(
                locale,
                'مهم‌ترین اطلاعات این مورد برای بررسی سریع، بدون ورود به جزئیات فنی.',
                'The most useful information for a quick review, without technical detail.',
              )}
            >
              <div className="detail-copy-stack">
                <p>{heroSummary}</p>

                <dl className="detail-facts">
                  {event ? (
                    <>
                      <div>
                        <dt>{local(locale, 'منطقه', 'Region')}</dt>
                        <dd>{locale === 'fa' ? event.region : event.regionEn}</dd>
                      </div>
                      <div>
                        <dt>{local(locale, 'حوزه', 'Domain')}</dt>
                        <dd>{event.domain ?? '—'}</dd>
                      </div>
                      <div>
                        <dt>{local(locale, 'اطمینان', 'Confidence')}</dt>
                        <dd>{formatNumber(event.confidence, locale)}٪</dd>
                      </div>
                      <div>
                        <dt>{local(locale, 'منابع', 'Sources')}</dt>
                        <dd>{formatNumber(event.sourceCount, locale)}</dd>
                      </div>
                    </>
                  ) : null}

                  {country ? (
                    <>
                      <div>
                        <dt>{local(locale, 'منطقه', 'Region')}</dt>
                        <dd>{country.region[locale]}</dd>
                      </div>
                      <div>
                        <dt>{local(locale, 'ریسک ترکیبی', 'Composite risk')}</dt>
                        <dd>{formatNumber(country.risk, locale)}/100</dd>
                      </div>
                      {country.indicators.map((indicator) => (
                        <div key={indicator.label.en}>
                          <dt>{indicator.label[locale]}</dt>
                          <dd>{indicator.value}</dd>
                        </div>
                      ))}
                    </>
                  ) : null}

                  {corridor ? (
                    <>
                      <div>
                        <dt>{local(locale, 'مبدأ', 'From')}</dt>
                        <dd>{corridor.from[locale]}</dd>
                      </div>
                      <div>
                        <dt>{local(locale, 'مقصد', 'To')}</dt>
                        <dd>{corridor.to[locale]}</dd>
                      </div>
                      <div>
                        <dt>{local(locale, 'وضعیت', 'Status')}</dt>
                        <dd>{corridor.status}</dd>
                      </div>
                      <div>
                        <dt>{local(locale, 'تأخیر', 'Delay')}</dt>
                        <dd>{formatNumber(corridor.delayHours, locale)} {local(locale, 'ساعت', 'hours')}</dd>
                      </div>
                    </>
                  ) : null}

                  {source ? (
                    <>
                      <div>
                        <dt>{local(locale, 'نوع منبع', 'Source type')}</dt>
                        <dd>{source.kind}</dd>
                      </div>
                      <div>
                        <dt>{local(locale, 'وضعیت', 'State')}</dt>
                        <dd>{source.state}</dd>
                      </div>
                      <div>
                        <dt>{local(locale, 'حوزه', 'Domain')}</dt>
                        <dd>{source.domain ?? '—'}</dd>
                      </div>
                      <div>
                        <dt>{local(locale, 'آخرین موفقیت', 'Last success')}</dt>
                        <dd dir="auto">{source.lastSuccess ?? '—'}</dd>
                      </div>
                    </>
                  ) : null}

                  {report ? (
                    <>
                      <div>
                        <dt>{local(locale, 'نسخه', 'Version')}</dt>
                        <dd>{formatNumber(report.version, locale)}</dd>
                      </div>
                      <div>
                        <dt>{local(locale, 'ارزیابی‌های مرتبط', 'Linked assessments')}</dt>
                        <dd>{formatNumber(report.assessmentIds.length, locale)}</dd>
                      </div>
                    </>
                  ) : null}
                </dl>
              </div>
            </InternalSection>

            <InternalSection
              title={local(locale, 'مسیرهای بررسی بعدی', 'Continue your review')}
              description={local(
                locale,
                'برای بررسی عمیق‌تر، مستقیماً به شواهد یا موارد مرتبط بروید.',
                'Continue directly to evidence or linked items for a deeper review.',
              )}
            >
              <div className="detail-quick-links">
                <button type="button" onClick={() => setTab('sources')}>
                  <span className="detail-link-icon sources"><Icon name="document" size={22} /></span>
                  <span>
                    <strong>{local(locale, 'منابع و شواهد', 'Sources & evidence')}</strong>
                    <small>{local(locale, `${scopedSources.length || Math.min(4, sources.length)} منبع برای بررسی`, `${scopedSources.length || Math.min(4, sources.length)} sources to review`)}</small>
                  </span>
                  <Icon name="arrow-left-01" size={18} className="directional-icon detail-link-arrow" />
                </button>
                <button type="button" onClick={() => setTab('related')}>
                  <span className="detail-link-icon related"><Icon name="link-2" size={22} /></span>
                  <span>
                    <strong>{local(locale, 'موارد مرتبط', 'Related items')}</strong>
                    <small>{local(locale, `${relatedEvents.length || Math.min(4, events.length)} رویداد مرتبط`, `${relatedEvents.length || Math.min(4, events.length)} related events`)}</small>
                  </span>
                  <Icon name="arrow-left-01" size={18} className="directional-icon detail-link-arrow" />
                </button>
              </div>
            </InternalSection>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="detail-tab-content">
          <InternalSection
            title={local(locale, 'منابع این بررسی', 'Sources for this review')}
            description={local(
              locale,
              'هر ردیف یک منبع مستقل است. برای دیدن وضعیت و جزئیات آن، ردیف را انتخاب کنید.',
              'Each row is an independent source. Select a row to review its status and details.',
            )}
            footer={local(locale, 'منبع انتخاب‌شده در صفحه جزئیات مستقل باز می‌شود.', 'The selected source opens in its own detail page.')}
          >
            <div className="detail-source-list">
              {(scopedSources.length ? scopedSources : sources.slice(0, 4)).map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="detail-linked-row"
                  onClick={() => openNested('source', item.id, item.name, item.nameEn)}
                >
                  <span className="detail-linked-icon"><Icon name="document" size={20} /></span>
                  <span className="detail-linked-copy">
                    <strong>{locale === 'fa' ? item.name : item.nameEn}</strong>
                    <small>{item.kind} · {item.domain ?? local(locale, 'عمومی', 'General')}</small>
                  </span>
                  <Badge variant="outline">{item.state}</Badge>
                </button>
              ))}
            </div>
          </InternalSection>
        </TabsContent>

        <TabsContent value="related" className="detail-tab-content">
          <InternalSection
            title={local(locale, 'موارد مرتبط با این تحلیل', 'Linked items')}
            description={local(
              locale,
              'این موارد از همان حوزه یا زمینه تحلیلی هستند و برای ادامه بررسی قابل انتخاب‌اند.',
              'These items share the same domain or analytical context and can be opened for further review.',
            )}
            footer={local(locale, 'انتخاب هر مورد، مسیر جزئیات آن را باز می‌کند و این صفحه در مسیر بازگشت حفظ می‌شود.', 'Selecting an item opens its detail view while preserving this page in the return path.')}
          >
            <div className="detail-related-list">
              {(relatedEvents.length ? relatedEvents : events.slice(0, 4)).map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="detail-linked-row"
                  onClick={() => openNested('event', item.id, item.title, item.titleEn)}
                >
                  <span className="detail-linked-icon related"><Icon name="radar-2" size={20} /></span>
                  <span className="detail-linked-copy">
                    <strong>{locale === 'fa' ? item.title : item.titleEn}</strong>
                    <small>{locale === 'fa' ? item.region : item.regionEn}</small>
                  </span>
                  <span className="detail-linked-value">{formatNumber(item.confidence, locale)}٪</span>
                </button>
              ))}
            </div>
          </InternalSection>
        </TabsContent>

        <TabsContent value="raw" className="detail-tab-content">
          <InternalSection title={local(locale, 'جزئیات داده', 'Data details')}>
            <dl className="detail-technical-list">
              {technicalFields.map((field) => (
                <div key={field.label}>
                  <dt>{field.label}</dt>
                  <dd dir="auto">{field.value}</dd>
                </div>
              ))}
            </dl>

            <details className="detail-raw-disclosure">
              <summary>
                <span className="detail-raw-summary-title">
                  <Icon name="code" size={18} />
                  {local(locale, 'نمایش JSON', 'Show JSON')}
                </span>
                <span className="detail-raw-summary-actions">
                  <button
                    type="button"
                    className="detail-json-copy"
                    onClick={copyRawJson}
                    aria-label={local(locale, 'کپی JSON', 'Copy JSON')}
                    title={copied ? local(locale, 'کپی شد', 'Copied') : local(locale, 'کپی JSON', 'Copy JSON')}
                  >
                    <Icon name={copied ? 'tick-circle' : 'copy'} size={18} />
                  </button>
                  <Icon name="arrow-down-01" size={18} className="detail-raw-chevron" />
                </span>
              </summary>
              <p>
                {local(
                  locale,
                  'نسخه ساختاریافته داده برای بررسی فنی و تطبیق با ورودی اصلی در دسترس است؛ برای استفاده روزمره نیازی به باز کردن این بخش نیست.',
                  'Structured JSON is available for technical inspection and comparison with the original input; it is not required for everyday review.',
                )}
              </p>
              <pre className="detail-raw-data" dir="ltr">{rawJson}</pre>
            </details>
          </InternalSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
