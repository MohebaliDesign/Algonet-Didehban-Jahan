import './security.css'

import { useNavigate } from 'react-router'

import { usePreferences } from '@/app/PreferencesProvider'
import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/product/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function local<T>(locale: 'fa' | 'en', fa: T, en: T): T {
  return locale === 'fa' ? fa : en
}

export function SecurityAssessmentPage() {
  const { locale } = usePreferences()
  const navigate = useNavigate()

  return (
    <div className="page-view security-assessment-page">
      <div className="security-assessment-back">
        <Button variant="ghost" onClick={() => navigate('/security')}>
          <Icon name="arrow-right-01" className="directional-icon" />
          {local(locale, 'بازگشت به امنیت و ژئوپلیتیک', 'Back to Security & Geopolitics')}
        </Button>
      </div>

      <PageHeader
        eyebrow={local(locale, 'تحلیل شواهد', 'Evidence review')}
        title={local(locale, 'شواهد و تناقض‌های ارزیابی راهبردی', 'Strategic assessment evidence')}
        summary={local(
          locale,
          'شواهد همسو، تناقض‌ها و نقاط دارای دادهٔ ناکافی را جداگانه بررسی کنید تا حجم اطلاعات به‌صورت مرحله‌ای و قابل کنترل نمایش داده شود.',
          'Review supporting evidence, contradictions, and insufficient-data areas separately so the information remains progressive and manageable.',
        )}
      />

      <div className="security-assessment-meta" aria-label={local(locale, 'دامنه تحلیل', 'Assessment scope')}>
        <span>{local(locale, 'حوزه: امنیت و ژئوپلیتیک', 'Domain: Security & Geopolitics')}</span>
        <span>{local(locale, '۴۱ منبع مستقل در دامنه فعلی', '41 independent sources in current scope')}</span>
        <span>{local(locale, 'اطمینان ارزیابی: ۷۴٪', 'Assessment confidence: 74%')}</span>
      </div>

      <div className="security-assessment-grid">
        <Card className="security-assessment-overview">
          <CardHeader>
            <h2>{local(locale, 'جمع‌بندی ارزیابی', 'Assessment summary')}</h2>
          </CardHeader>
          <CardContent>
            <p>
              {local(
                locale,
                'در دادهٔ نمونه، افزایش فعالیت مشاهده‌شده در شرق آسیا با اعلان رسمی رزمایش هم‌خوان است. این هم‌زمانی می‌تواند بخشی از تغییرات ثبت‌شده را توضیح دهد، اما برای نتیجه‌گیری قطعی باید زمان‌بندی رویدادها، دامنه منابع و شواهد مستقل در کنار هم بررسی شوند.',
                'In the sample data, increased activity observed in East Asia aligns with an announced exercise. This timing may explain part of the recorded change, but event timing, source scope, and independent evidence should be reviewed together before drawing a definitive conclusion.',
              )}
            </p>
            <p>
              {local(
                locale,
                'در قفقاز، شواهد موجود برای نسبت‌دادن علت اختلال کافی نیست. این وضعیت به‌عنوان عدم قطعیت حفظ شده تا کاربر بتواند تفاوت بین شواهد همسو و نقاط بدون پشتوانه کافی را به‌وضوح ببیند.',
                'In the Caucasus, the available evidence is insufficient to attribute a cause to the disruption. This uncertainty is preserved so supporting evidence and weakly supported areas remain clearly distinguishable.',
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2>{local(locale, 'شواهد همسو', 'Supporting evidence')}</h2>
          </CardHeader>
          <CardContent>
            <div className="security-evidence-list">
              <article>
                <span className="security-evidence-status supporting">
                  <Icon name="tick-circle" size={20} />
                  {local(locale, 'همسو', 'Supporting')}
                </span>
                <strong>{local(locale, 'شرق آسیا', 'East Asia')}</strong>
                <p>
                  {local(
                    locale,
                    'افزایش فعالیت مشاهده‌شده با اعلان رسمی رزمایش هم‌زمان است. این مورد یک قرینه همسو است، نه اثبات علت.',
                    'Observed activity increases coincide with an announced exercise. This is supporting context, not proof of causation.',
                  )}
                </p>
              </article>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2>{local(locale, 'تناقض‌ها و عدم قطعیت', 'Contradictions & uncertainty')}</h2>
          </CardHeader>
          <CardContent>
            <div className="security-evidence-list">
              <article>
                <span className="security-evidence-status uncertain">
                  <Icon name="info-circle" size={20} />
                  {local(locale, 'شواهد ناکافی', 'Insufficient evidence')}
                </span>
                <strong>{local(locale, 'قفقاز', 'Caucasus')}</strong>
                <p>
                  {local(
                    locale,
                    'دادهٔ فعلی برای نسبت‌دادن علت اختلال کافی نیست و نتیجه باید در حالت باز باقی بماند تا شواهد بیشتری اضافه شود.',
                    'The current data is insufficient to attribute a cause to the disruption, so the conclusion should remain open until more evidence is available.',
                  )}
                </p>
              </article>
            </div>
          </CardContent>
        </Card>

        <Card className="security-assessment-scope-card">
          <CardHeader>
            <h2>{local(locale, 'نحوه خواندن این تحلیل', 'How to read this assessment')}</h2>
          </CardHeader>
          <CardContent>
            <ul>
              <li>{local(locale, 'شواهد همسو از نتیجه قطعی جدا نگه داشته شده‌اند.', 'Supporting evidence is kept separate from definitive conclusions.')}</li>
              <li>{local(locale, 'موارد متناقض یا دارای داده ناکافی در بخش مستقل نمایش داده می‌شوند.', 'Contradictory or insufficient-data items are shown in a separate section.')}</li>
              <li>{local(locale, 'دامنه و تعداد منابع در بالای صفحه ثابت می‌ماند تا زمینه تحلیل از دست نرود.', 'Scope and source count remain visible so analytical context is preserved.')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
