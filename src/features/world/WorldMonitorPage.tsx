import { useState } from 'react'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { BarChart, LineChart } from '@/components/product/Charts'
import { ModuleFrame, usePersistentLayout, type LayoutItem } from '@/components/product/ModuleFrame'
import { KpiStrip, PageHeader } from '@/components/product/PageHeader'
import { WorldMap } from '@/components/product/WorldMap'
import { Icon } from '@/components/Icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { countries, events } from '@/data/mock/visualMvpData'

const defaults: LayoutItem[] = [
  { id: 'map', size: 'wide', collapsed: false },
  { id: 'priority', size: 'medium', collapsed: false },
  { id: 'brief', size: 'medium', collapsed: false },
  { id: 'feed', size: 'medium', collapsed: false },
  { id: 'risk', size: 'medium', collapsed: false },
  { id: 'watch', size: 'small', collapsed: false },
  { id: 'freshness', size: 'small', collapsed: false },
]

export function WorldMonitorPage() {
  const { locale } = usePreferences()
  const { role, filters, openInspector } = useWorkspace()
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const layout = usePersistentLayout('world', role, defaults)
  const filteredEvents = events.filter(
    (item) => filters.domain === 'all' || item.domain === filters.domain,
  )
  const content: Record<string, React.ReactNode> = {
    map: <WorldMap />,
    priority: (
      <ItemGroup className="priority-list">
        {filteredEvents.slice(0, 4).map((event, index) => (
          <Item asChild size="sm" className="product-list-item" key={event.id}>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                openInspector({
                  kind: 'event',
                  id: event.id,
                  title: event.title,
                  titleEn: event.titleEn,
                })
              }
            >
              <ItemMedia>
                <span className={`priority-rank severity-${event.severity}`}>{index + 1}</span>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{locale === 'fa' ? event.title : event.titleEn}</ItemTitle>
                <ItemDescription>
                  {locale === 'fa' ? event.region : event.regionEn} · {event.sourceCount}{' '}
                  {locale === 'fa' ? 'منبع' : 'sources'}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <span className="confidence-mini">{event.confidence}%</span>
              </ItemActions>
            </Button>
          </Item>
        ))}
      </ItemGroup>
    ),
    brief: (
      <div className="daily-brief">
        <span className="ai-generated-label">
          <Icon name="magic-star" />
          {locale === 'fa' ? 'تولیدشده با هوش مصنوعی · نسخه ۱.۴' : 'AI-generated · version 1.4'}
        </span>
        <p>
          {locale === 'fa'
            ? 'تمرکز امروز بر اختلال مسیرهای راهبردی، فشار عملیاتی در خلیج فارس و افزایش ریسک آب‌وهوایی در شرق آفریقاست. دو سیگنال هنوز پوشش ناقص دارند و نباید قطعی تفسیر شوند.'
            : 'Today’s focus is on strategic-route disruption, operational pressure in the Persian Gulf, and weather risk in East Africa. Two signals still have partial coverage and should not be treated as certain.'}
        </p>
        <ul>
          <li>
            {locale === 'fa' ? '۵ تحول نیازمند بررسی نزدیک' : '5 developments require close review'}
          </li>
          <li>{locale === 'fa' ? '۱ شاهد متناقض ثبت شده است' : '1 contradictory item recorded'}</li>
        </ul>
      </div>
    ),
    feed: (
      <ItemGroup className="live-feed">
        {filteredEvents.map((event) => (
          <Item asChild size="sm" className="product-list-item" key={event.id}>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                openInspector({
                  kind: 'event',
                  id: event.id,
                  title: event.title,
                  titleEn: event.titleEn,
                })
              }
            >
              <ItemContent>
                <ItemTitle>{locale === 'fa' ? event.title : event.titleEn}</ItemTitle>
                <ItemDescription>
                  <time dir="ltr">{event.occurredAt.slice(11, 16)} UTC</time>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="outline" className={`state-badge state-${event.state}`}>
                  <i />
                  {event.state}
                </Badge>
              </ItemActions>
            </Button>
          </Item>
        ))}
      </ItemGroup>
    ),
    risk: (
      <LineChart
        title={
          locale === 'fa'
            ? 'روند سیگنال‌های پرریسک در هفت روز'
            : 'High-risk signal trend over seven days'
        }
        labels={
          locale === 'fa'
            ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
            : ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        }
        unit={locale === 'fa' ? 'سیگنال' : 'signals'}
        series={[
          {
            label: locale === 'fa' ? 'مشاهده‌شده' : 'Observed',
            values: [28, 31, 29, 35, 38, 42, 47],
            kind: 'observed',
          },
          {
            label: locale === 'fa' ? 'آستانه پایش' : 'Watch threshold',
            values: [40, 40, 40, 40, 40, 40, 40],
            kind: 'secondary',
          },
        ]}
      />
    ),
    watch: (
      <ItemGroup className="watchlist">
        {countries.map((country) => (
          <Item asChild size="sm" className="product-list-item" key={country.id}>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                openInspector({
                  kind: 'country',
                  id: country.id,
                  title: country.name.fa,
                  titleEn: country.name.en,
                })
              }
            >
              <ItemContent>
                <ItemTitle>{country.name[locale]}</ItemTitle>
                <ItemDescription>{country.region[locale]}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <b className={`trend-${country.trend}`}>{country.risk}</b>
              </ItemActions>
            </Button>
          </Item>
        ))}
      </ItemGroup>
    ),
    freshness: (
      <BarChart
        title={locale === 'fa' ? 'پوشش و تازگی داده' : 'Data coverage and freshness'}
        unit="%"
        items={[
          { label: locale === 'fa' ? 'تازه' : 'Fresh', value: 76 },
          { label: locale === 'fa' ? 'ذخیره‌شده' : 'Cached', value: 14 },
          { label: locale === 'fa' ? 'ناقص' : 'Partial', value: 7 },
          { label: locale === 'fa' ? 'قدیمی' : 'Stale', value: 3 },
        ]}
      />
    ),
  }
  const meta: Record<
    string,
    {
      titleFa: string
      titleEn: string
      descFa: string
      descEn: string
      state?: 'fresh' | 'partial' | 'cached'
    }
  > = {
    map: {
      titleFa: 'تصویر عملیاتی جهان',
      titleEn: 'Global operating picture',
      descFa: 'لایه‌های منتخب و رویدادهای ۲۴ ساعت گذشته',
      descEn: 'Selected layers and events from the past 24 hours',
    },
    priority: {
      titleFa: 'تحولات اولویت‌دار',
      titleEn: 'Priority developments',
      descFa: 'بر اساس اهمیت، تازگی و پوشش مستقل',
      descEn: 'Ranked by importance, freshness, and independent coverage',
    },
    brief: {
      titleFa: 'جمع‌بندی روزانه',
      titleEn: 'Daily intelligence brief',
      descFa: 'خلاصهٔ ساختاریافته و پیوندخورده با شواهد',
      descEn: 'Structured summary linked to evidence',
    },
    feed: {
      titleFa: 'جریان زنده رویدادها',
      titleEn: 'Live event stream',
      descFa: 'آخرین تغییرات از منابع منتخب',
      descEn: 'Latest changes from selected sources',
    },
    risk: {
      titleFa: 'نمای سیگنال‌های پرریسک',
      titleEn: 'High-risk signal overview',
      descFa: 'روند هفت‌روزه · واحد: تعداد سیگنال',
      descEn: 'Seven-day trend · unit: signals',
    },
    watch: {
      titleFa: 'جغرافیاهای تحت پایش',
      titleEn: 'Monitored geographies',
      descFa: 'ریسک ترکیبی نمونه',
      descEn: 'Prototype composite risk',
    },
    freshness: {
      titleFa: 'تازگی و پوشش داده',
      titleEn: 'Data freshness & coverage',
      descFa: 'درصد منابع منتخب',
      descEn: 'Percentage of selected sources',
      state: 'partial',
    },
  }
  return (
    <div className="page-view world-page">
      <PageHeader
        title={locale === 'fa' ? 'رصد جهان' : 'World Monitor'}
        summary={
          locale === 'fa'
            ? 'تصویر فشرده‌ای از مهم‌ترین تحولات، محل وقوع، اعتبار و مسیر بررسی بعدی.'
            : 'A focused view of major developments, location, reliability, and what to inspect next.'
        }
        editing={editing}
        onEditing={() => setEditing((v) => !v)}
        onReset={layout.reset}
      />
      <KpiStrip
        items={
          locale === 'fa'
            ? [
                {
                  label: 'رویداد فعال',
                  value: String(filteredEvents.length),
                  change: '۲ مورد اولویت بالا',
                  tone: 'critical',
                  icon: 'radar-2',
                },
                {
                  label: 'سیگنال مهم',
                  value: '۱۲',
                  change: '۳ مورد جدید',
                  tone: 'warning',
                  icon: 'danger',
                },
                {
                  label: 'پوشش مستقل',
                  value: '۸۴٪',
                  change: '۳۲ منبع',
                  tone: 'positive',
                  icon: 'shield-tick',
                },
                {
                  label: 'آخرین همگام‌سازی',
                  value: '۲ دقیقه',
                  change: 'پوشش ناقص ۷٪',
                  icon: 'refresh-circle',
                },
              ]
            : [
                {
                  label: 'Active events',
                  value: String(filteredEvents.length),
                  change: '2 high priority',
                  tone: 'critical',
                  icon: 'radar-2',
                },
                {
                  label: 'Material signals',
                  value: '12',
                  change: '3 new',
                  tone: 'warning',
                  icon: 'danger',
                },
                {
                  label: 'Independent coverage',
                  value: '84%',
                  change: '32 sources',
                  tone: 'positive',
                  icon: 'shield-tick',
                },
                {
                  label: 'Last sync',
                  value: '2 min',
                  change: '7% partial',
                  icon: 'refresh-circle',
                },
              ]
        }
      />
      <div className={`module-grid ${editing ? 'layout-editing' : ''}`}>
        {layout.items.map((item) => {
          const m = meta[item.id]
          return (
            <ModuleFrame
              key={item.id}
              id={item.id}
              title={locale === 'fa' ? m.titleFa : m.titleEn}
              description={locale === 'fa' ? m.descFa : m.descEn}
              state={m.state ?? 'fresh'}
              size={item.size}
              collapsed={item.collapsed}
              expanded={expanded === item.id}
              editing={editing}
              onMove={(d) => layout.move(item.id, d)}
              onResize={() => layout.resize(item.id)}
              onCollapse={() => layout.collapse(item.id)}
              onExpand={() => setExpanded(expanded === item.id ? null : item.id)}
              sourceCount={item.id === 'map' ? 32 : item.id === 'priority' ? 18 : undefined}
              confidence={item.id === 'brief' ? 78 : undefined}
            >
              {content[item.id]}
            </ModuleFrame>
          )
        })}
      </div>
    </div>
  )
}
