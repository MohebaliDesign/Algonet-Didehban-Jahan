import { useState } from 'react'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { BarChart } from '@/components/product/Charts'
import { ModuleFrame } from '@/components/product/ModuleFrame'
import { KpiStrip, PageHeader } from '@/components/product/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { events } from '@/data/mock/visualMvpData'
import { SecurityWorldMap, type Continent, type SecurityRiskPoint } from './SecurityWorldMap'

function local<T>(locale: 'fa' | 'en', fa: T, en: T): T {
  return locale === 'fa' ? fa : en
}

const continentOptions: Array<{ value: Continent; fa: string; en: string }> = [
  { value: 'all', fa: 'همه قاره‌ها', en: 'All continents' },
  { value: 'asia', fa: 'آسیا', en: 'Asia' },
  { value: 'europe', fa: 'اروپا', en: 'Europe' },
  { value: 'africa', fa: 'آفریقا', en: 'Africa' },
  { value: 'americas', fa: 'آمریکا', en: 'Americas' },
  { value: 'oceania', fa: 'اقیانوسیه', en: 'Oceania' },
]

function PageGrid({ children }: { children: React.ReactNode }) {
  return <div className="module-grid product-page-grid">{children}</div>
}

export function SecurityPage() {
  const { locale } = usePreferences()
  const { openInspector } = useWorkspace()
  const [continent, setContinent] = useState<Continent>('all')

  const riskItems: SecurityRiskPoint[] = [
    {
      label: 'اوکراین',
      labelEn: 'Ukraine',
      hcKey: 'ua',
      impact: 84,
      likelihood: 91,
      severity: 'critical',
      lat: 49,
      lon: 32,
      continents: ['europe'],
    },
    {
      label: 'اسرائیل',
      labelEn: 'Israel',
      hcKey: 'il',
      impact: 82,
      likelihood: 88,
      severity: 'critical',
      lat: 31.5,
      lon: 34.8,
      continents: ['asia'],
    },
    {
      label: 'سودان',
      labelEn: 'Sudan',
      hcKey: 'sd',
      impact: 86,
      likelihood: 90,
      severity: 'critical',
      lat: 15.5,
      lon: 32.5,
      continents: ['africa'],
    },
    {
      label: 'میانمار',
      labelEn: 'Myanmar',
      hcKey: 'mm',
      impact: 70,
      likelihood: 78,
      severity: 'high',
      lat: 19.7,
      lon: 96.1,
      continents: ['asia'],
    },
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
            value: local(locale, '۱۴', '14'),
            change: local(locale, '۲ مورد بحرانی', '2 critical'),
            icon: 'shield-cross',
            tone: 'critical',
          },
          {
            label: local(locale, 'رویداد نظامی', 'Military events'),
            value: local(locale, '۲۷', '27'),
            change: local(locale, '۲۴ ساعت گذشته', 'Past 24 hours'),
            icon: 'radar-2',
          },
          {
            label: local(locale, 'تحریم تازه', 'New sanctions'),
            value: local(locale, '۳', '3'),
            change: local(locale, '۲ حوزه', '2 domains'),
            icon: 'document-filter',
          },
          {
            label: local(locale, 'پوشش شواهد', 'Evidence coverage'),
            value: local(locale, '۸۷٪', '87%'),
            change: local(locale, '۴۱ منبع مستقل', '41 independent sources'),
            icon: 'shield-tick',
            tone: 'positive',
          },
        ]}
      />

      <PageGrid>
        <ModuleFrame
          id="security-map"
          title={local(locale, 'نقشه تنش‌های منطقه‌ای', 'Regional tension map')}
          description={local(
            locale,
            'نمای جهانی · دادهٔ نمونهٔ تنش و درگیری',
            'Global view · sample conflict and tension data',
          )}
          size="wide"
          state="fresh"
          sourceCount={41}
          headerAccessory={
            <Select value={continent} onValueChange={(value) => setContinent(value as Continent)}>
              <SelectTrigger
                className="security-continent-toolbar-filter"
                aria-label={local(locale, 'فیلتر قاره', 'Filter by continent')}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {continentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {local(locale, option.fa, option.en)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        >
          <SecurityWorldMap items={riskItems} continent={continent} />
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
            <Button
              variant="link"
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
            </Button>
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
                <Button
                  variant="link"
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
                </Button>
                <span className={`event-severity ${event.severity}`} />
              </li>
            ))}
          </ol>
        </ModuleFrame>
      </PageGrid>
    </div>
  )
}
