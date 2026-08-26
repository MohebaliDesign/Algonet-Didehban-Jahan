import { useEffect, useRef, useState } from 'react'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CountryMapDatum, IntelligenceMapEvent } from '@/types/domain'

interface WorldMapDetailPanelProps {
  country: CountryMapDatum | null
  event: IntelligenceMapEvent | null
  events: IntelligenceMapEvent[]
  timelineNotice: boolean
  onBackToCountry: () => void
  onClose: () => void
}

export function WorldMapDetailPanel({
  country,
  event,
  events,
  timelineNotice,
  onBackToCountry,
  onClose,
}: WorldMapDetailPanelProps) {
  const { locale } = usePreferences()
  const { notify } = useWorkspace()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [tab, setTab] = useState('overview')
  const isFa = locale === 'fa'
  const riskLabels = {
    low: isFa ? 'کم' : 'Low',
    medium: isFa ? 'متوسط' : 'Medium',
    high: isFa ? 'بالا' : 'High',
    critical: isFa ? 'بحرانی' : 'Critical',
  }
  const trendLabels = {
    up: isFa ? 'افزایشی' : 'Rising',
    stable: isFa ? 'پایدار' : 'Stable',
    down: isFa ? 'کاهشی' : 'Falling',
  }

  useEffect(() => setTab(event ? 'events' : 'overview'), [event])
  if (!country) return null

  const title = event
    ? isFa
      ? event.titleFa
      : event.titleEn
    : isFa
      ? country.countryNameFa
      : country.countryNameEn
  const countryEvents = events.filter((item) => item.countryCode === country.countryCode)

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={isFa ? 'left' : 'right'}
        className="map-detail-sheet"
        aria-label={title}
        onOpenAutoFocus={(interactionEvent) => {
          interactionEvent.preventDefault()
          titleRef.current?.focus()
        }}
      >
        <SheetHeader className="map-detail-header">
          <div>
            <Badge variant="outline" className={`risk-badge risk-${country.riskLevel}`}>
              {riskLabels[country.riskLevel]}
            </Badge>
            <SheetTitle ref={titleRef} tabIndex={-1}>
              {title}
            </SheetTitle>
            <SheetDescription>
              <code dir="ltr">{country.countryCode}</code> ·{' '}
              {new Intl.DateTimeFormat(isFa ? 'fa-IR' : 'en', {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: 'UTC',
              }).format(new Date(event?.occurredAt ?? country.updatedAt))}{' '}
              <span dir="ltr">UTC</span>
            </SheetDescription>
          </div>
        </SheetHeader>
        <ScrollArea className="map-detail-scroll">
          {timelineNotice && (
            <Alert>
              <Icon name="info-circle" />
              <AlertTitle>
                {isFa ? 'رویداد در این زمان نمایش داده نمی‌شود' : 'Event not visible at this time'}
              </AlertTitle>
              <AlertDescription>
                {isFa
                  ? 'نمای کشور حفظ شده و رویداد انتخاب‌شده خارج از بازهٔ فعلی است.'
                  : 'The country remains selected; the selected event is outside the current time snapshot.'}
              </AlertDescription>
            </Alert>
          )}
          {event ? (
            <EventDetail
              event={event}
              isFa={isFa}
              riskLabel={riskLabels[event.severity]}
              onBack={onBackToCountry}
              onAnalyze={() =>
                notify(
                  isFa
                    ? 'تحلیل نمایشی با داده‌های ساختگی آماده شد.'
                    : 'Prototype analysis prepared from mock data.',
                )
              }
            />
          ) : (
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="map-detail-tabs">
                <TabsTrigger value="overview">{isFa ? 'نمای کلی' : 'Overview'}</TabsTrigger>
                <TabsTrigger value="events">{isFa ? 'رویدادها' : 'Events'}</TabsTrigger>
                <TabsTrigger value="trends">{isFa ? 'روندها' : 'Trends'}</TabsTrigger>
                <TabsTrigger value="evidence">{isFa ? 'شواهد' : 'Evidence'}</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="map-detail-stack">
                <Alert className="prototype-map-alert">
                  <Icon name="info-circle" />
                  <AlertTitle>{isFa ? 'نمونهٔ نمایشی' : 'Demo prototype'}</AlertTitle>
                  <AlertDescription>
                    {isFa
                      ? 'این ارزیابی و داده‌ها واقعی نیستند.'
                      : 'This assessment and data are not real.'}
                  </AlertDescription>
                </Alert>
                <div className="map-detail-metrics">
                  <MapMetric
                    label={isFa ? 'امتیاز تجمیعی' : 'Aggregate score'}
                    value={`${country.value}/100`}
                  />
                  <MapMetric
                    label={isFa ? 'رویدادها' : 'Events'}
                    value={String(country.eventCount)}
                  />
                  <MapMetric label={isFa ? 'روند' : 'Trend'} value={trendLabels[country.trend]} />
                  <MapMetric
                    label={isFa ? 'اطمینان' : 'Confidence'}
                    value={`${country.confidence}%`}
                  />
                </div>
                <section>
                  <h3>{isFa ? 'ارزیابی کوتاه هوش مصنوعی' : 'Short AI assessment'}</h3>
                  <p>
                    {isFa
                      ? 'هم‌گرایی داده‌های نمونه، افزایش نیاز به پایش را نشان می‌دهد؛ این نتیجه قطعی نیست و باید همراه با شواهد بررسی شود.'
                      : 'Mock-data convergence indicates increased monitoring need; this is not certain and must be reviewed with evidence.'}
                  </p>
                </section>
              </TabsContent>
              <TabsContent value="events" className="map-panel-event-list">
                {countryEvents.length ? (
                  countryEvents.map((item) => (
                    <article key={item.id}>
                      <Badge variant="outline" className={`risk-badge risk-${item.severity}`}>
                        {riskLabels[item.severity]}
                      </Badge>
                      <strong>{isFa ? item.titleFa : item.titleEn}</strong>
                      <small>
                        {item.sourceCount} {isFa ? 'منبع' : 'sources'}
                      </small>
                    </article>
                  ))
                ) : (
                  <p>
                    {isFa
                      ? 'رویداد منطبق در این بازه وجود ندارد.'
                      : 'No matching events in this snapshot.'}
                  </p>
                )}
              </TabsContent>
              <TabsContent value="trends" className="map-detail-stack">
                <MapMetric
                  label={isFa ? 'جهت روند' : 'Trend direction'}
                  value={trendLabels[country.trend]}
                />
                <p>
                  {isFa
                    ? 'مقایسهٔ سه تصویر زمانی ساختگی.'
                    : 'Comparison across three mock time snapshots.'}
                </p>
              </TabsContent>
              <TabsContent value="evidence" className="map-detail-stack">
                <p>
                  {isFa
                    ? `${countryEvents.reduce((sum, item) => sum + item.sourceCount, 0)} اشارهٔ منبع در دادهٔ ساختگی این کشور ثبت شده است.`
                    : `${countryEvents.reduce((sum, item) => sum + item.sourceCount, 0)} mock source references are recorded for this country.`}
                </p>
              </TabsContent>
            </Tabs>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

function EventDetail({
  event,
  isFa,
  riskLabel,
  onBack,
  onAnalyze,
}: {
  event: IntelligenceMapEvent
  isFa: boolean
  riskLabel: string
  onBack: () => void
  onAnalyze: () => void
}) {
  return (
    <div className="map-detail-stack event-detail-mode">
      <Button variant="ghost" onClick={onBack}>
        <Icon name="arrow-left-01" className="directional-icon" />
        {isFa ? 'بازگشت به نمای کشور' : 'Back to country overview'}
      </Button>
      <div className="map-detail-metrics">
        <MapMetric
          label={isFa ? 'دسته' : 'Category'}
          value={event.category.replaceAll('-', ' ')}
          technical
        />
        <MapMetric label={isFa ? 'شدت' : 'Severity'} value={riskLabel} />
        <MapMetric label={isFa ? 'اطمینان' : 'Confidence'} value={`${event.confidence}%`} />
        <MapMetric label={isFa ? 'منابع' : 'Sources'} value={String(event.sourceCount)} />
      </div>
      <section>
        <h3>{isFa ? 'خلاصه' : 'Summary'}</h3>
        <p>{isFa ? event.summaryFa : event.summaryEn}</p>
      </section>
      <section>
        <h3>{isFa ? 'موقعیت و زمان' : 'Location and time'}</h3>
        <code dir="ltr">
          {event.latitude.toFixed(2)}, {event.longitude.toFixed(2)} · {event.occurredAt}
        </code>
      </section>
      <section>
        <h3>{isFa ? 'شواهد و منابع' : 'Evidence and sources'}</h3>
        <ul>
          {event.sourceIds.map((sourceId) => (
            <li key={sourceId}>
              <code dir="ltr">{sourceId}</code>
            </li>
          ))}
        </ul>
      </section>
      <Button onClick={onAnalyze}>
        <Icon name="magic-star" />
        {isFa ? 'تحلیل با هوش مصنوعی' : 'Analyze with AI'}
      </Button>
    </div>
  )
}

function MapMetric({
  label,
  value,
  technical = false,
}: {
  label: string
  value: string
  technical?: boolean
}) {
  return (
    <div>
      <small>{label}</small>
      <strong dir={technical ? 'ltr' : 'auto'}>{value}</strong>
    </div>
  )
}
