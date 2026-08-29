import { useMemo } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'

import { usePreferences } from '@/app/PreferencesProvider'
import type { InspectorItem } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/product/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { corridors, countries, events, reports, sources } from '@/data/mock/visualMvpData'

import './details.css'

function local<T>(locale: 'fa' | 'en', fa: T, en: T): T {
  return locale === 'fa' ? fa : en
}

function formatNumber(value: number | undefined, locale: 'fa' | 'en') {
  if (value == null) return '—'
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(value)
}

export function IntelligenceDetailPage() {
  const { locale } = usePreferences()
  const navigate = useNavigate()
  const location = useLocation()
  const { kind = 'event', id = '' } = useParams()
  const [searchParams] = useSearchParams()
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

  const entityDomain = event?.domain ?? source?.domain
  const scopedSources = sources
    .filter((item) => !entityDomain || item.domain === entityDomain)
    .slice(0, 4)
  const relatedEvents = events
    .filter((item) => item.id !== event?.id && (!entityDomain || item.domain === entityDomain))
    .slice(0, 4)

  const setTab = (value: string) => {
    const search = value === 'overview' ? '' : `?tab=${value}`
    navigate({ pathname: location.pathname, search }, { replace: true, state })
  }

  return (
    <div className="page-view intelligence-detail-page" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <div className="detail-back-row">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <Icon name="arrow-right-01" className="directional-icon" />
          {local(locale, 'بازگشت', 'Back')}
        </Button>
      </div>

      <PageHeader
        eyebrow={local(locale, 'نمای جزئیات', 'Detail view')}
        title={title ?? id}
        summary={local(
          locale,
          'اطلاعات اصلی، منابع و داده‌های مرتبط در یک صفحه مستقل نمایش داده می‌شوند تا بررسی جزئیات بدون محدودیت فضای مدال انجام شود.',
          'Core information, sources, and related data are shown on a dedicated page so detailed review is not constrained by a modal.',
        )}
      />

      <Tabs value={activeTab} onValueChange={setTab} className="detail-tabs">
        <TabsList variant="line" className="detail-tabs-list">
          <TabsTrigger value="overview">{local(locale, 'نمای کلی', 'Overview')}</TabsTrigger>
          <TabsTrigger value="sources">{local(locale, 'منابع و شواهد', 'Sources & evidence')}</TabsTrigger>
          <TabsTrigger value="related">{local(locale, 'موارد مرتبط', 'Related')}</TabsTrigger>
          <TabsTrigger value="raw">{local(locale, 'داده خام', 'Raw data')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="detail-tab-content">
          <div className="detail-overview-grid">
            <Card className="detail-primary-card">
              <CardHeader>
                <h2>{local(locale, 'آنچه اکنون می‌دانیم', 'What we know')}</h2>
              </CardHeader>
              <CardContent>
                {event && (
                  <div className="detail-copy-stack">
                    <p>{locale === 'fa' ? event.summary : event.summaryEn}</p>
                    <dl className="detail-facts">
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
                        <dt>{local(locale, 'تعداد منابع', 'Sources')}</dt>
                        <dd>{formatNumber(event.sourceCount, locale)}</dd>
                      </div>
                    </dl>
                  </div>
                )}

                {country && (
                  <div className="detail-copy-stack">
                    <p>
                      {local(
                        locale,
                        `${country.name.fa} در این نمونه با ریسک ترکیبی ${formatNumber(country.risk, locale)} از ۱۰۰ و ${formatNumber(country.events, locale)} رویداد ثبت‌شده نمایش داده می‌شود.`,
                        `${country.name.en} is shown in this prototype with a composite risk of ${country.risk}/100 and ${country.events} recorded events.`,
                      )}
                    </p>
                    <dl className="detail-facts">
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
                    </dl>
                  </div>
                )}

                {corridor && (
                  <dl className="detail-facts">
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
                  </dl>
                )}

                {source && (
                  <dl className="detail-facts">
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
                      <dt>{local(locale, 'تأخیر پاسخ', 'Latency')}</dt>
                      <dd>{formatNumber(source.latencyMs, locale)} ms</dd>
                    </div>
                  </dl>
                )}

                {report && (
                  <dl className="detail-facts">
                    <div>
                      <dt>{local(locale, 'نسخه', 'Version')}</dt>
                      <dd>{formatNumber(report.version, locale)}</dd>
                    </div>
                    <div>
                      <dt>{local(locale, 'ارزیابی‌های مرتبط', 'Linked assessments')}</dt>
                      <dd>{formatNumber(report.assessmentIds.length, locale)}</dd>
                    </div>
                  </dl>
                )}

                {!resolved && (
                  <p>
                    {local(
                      locale,
                      'این نما برای بازکردن تحلیل‌های حجیم از محیط اصلی استفاده می‌شود. دادهٔ اصلی این مورد از همان دامنه‌ای می‌آید که کاربر در صفحه قبلی انتخاب کرده است.',
                      'This view is used for high-volume analytical drill-down. The item keeps the scope selected on the previous screen.',
                    )}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="detail-context-card">
              <CardHeader>
                <h2>{local(locale, 'زمینه بررسی', 'Review context')}</h2>
              </CardHeader>
              <CardContent>
                <div className="detail-context-list">
                  <span>
                    <Icon name="document" size={18} />
                    {local(locale, 'منابع و شواهد در تب مستقل', 'Sources and evidence in a dedicated tab')}
                  </span>
                  <span>
                    <Icon name="link-2" size={18} />
                    {local(locale, 'موارد مرتبط بدون خروج از این صفحه', 'Related items without leaving this page')}
                  </span>
                  <span>
                    <Icon name="data" size={18} />
                    {local(locale, 'داده خام برای بررسی دقیق‌تر', 'Raw data for deeper inspection')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="detail-tab-content">
          <Card>
            <CardHeader>
              <h2>{local(locale, 'منابع مرتبط با دامنه فعلی', 'Sources in the current domain')}</h2>
            </CardHeader>
            <CardContent>
              <div className="detail-source-list">
                {(scopedSources.length ? scopedSources : sources.slice(0, 4)).map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="detail-source-row"
                    onClick={() =>
                      navigate(`/details/source/${item.id}`, {
                        state: {
                          kind: 'source',
                          id: item.id,
                          title: item.name,
                          titleEn: item.nameEn,
                        } satisfies InspectorItem,
                      })
                    }
                  >
                    <span>
                      <strong>{locale === 'fa' ? item.name : item.nameEn}</strong>
                      <small>{item.kind} · {item.domain ?? local(locale, 'عمومی', 'General')}</small>
                    </span>
                    <Badge variant="outline">{item.state}</Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="detail-tab-content">
          <Card>
            <CardHeader>
              <h2>{local(locale, 'رویدادهای مرتبط', 'Related events')}</h2>
            </CardHeader>
            <CardContent>
              <div className="detail-related-list">
                {(relatedEvents.length ? relatedEvents : events.slice(0, 4)).map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="detail-related-row"
                    onClick={() =>
                      navigate(`/details/event/${item.id}`, {
                        state: {
                          kind: 'event',
                          id: item.id,
                          title: item.title,
                          titleEn: item.titleEn,
                        } satisfies InspectorItem,
                      })
                    }
                  >
                    <span>
                      <strong>{locale === 'fa' ? item.title : item.titleEn}</strong>
                      <small>{locale === 'fa' ? item.region : item.regionEn}</small>
                    </span>
                    <span>{formatNumber(item.confidence, locale)}٪</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raw" className="detail-tab-content">
          <Card>
            <CardHeader>
              <h2>{local(locale, 'داده خام این مورد', 'Raw item data')}</h2>
            </CardHeader>
            <CardContent>
              <pre className="detail-raw-data" dir="ltr">
                {JSON.stringify(resolved ?? state ?? { kind, id }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
