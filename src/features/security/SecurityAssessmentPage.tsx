import './security.css'

import { useNavigate } from 'react-router'

import { usePreferences } from '@/app/PreferencesProvider'
import { Icon } from '@/components/Icon'
import { InternalPageToolbar, InternalSection } from '@/components/product/InternalPage'
import { Badge } from '@/components/ui/badge'

function local<T>(locale: 'fa' | 'en', fa: T, en: T): T {
  return locale === 'fa' ? fa : en
}

export function SecurityAssessmentPage() {
  const { locale } = usePreferences()
  const navigate = useNavigate()

  return (
    <div className="page-view internal-page-shell security-assessment-page" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <InternalPageToolbar
        backLabel={local(locale, 'بازگشت به امنیت و ژئوپلیتیک', 'Back to Security & Geopolitics')}
        onBack={() => navigate('/security')}
        pageLabel={local(locale, 'جزئیات تحلیل', 'Analysis details')}
        breadcrumbLabel={local(locale, 'مسیر صفحه', 'Breadcrumb')}
        direction={locale === 'fa' ? 'rtl' : 'ltr'}
        breadcrumbs={[
          {
            label: local(locale, 'امنیت و ژئوپلیتیک', 'Security & geopolitics'),
            onSelect: () => navigate('/security'),
          },
          { label: local(locale, 'شواهد ارزیابی راهبردی', 'Strategic assessment evidence') },
        ]}
        actions={
          <Badge variant="outline" className="internal-page-source-badge">
            <Icon name="document" size={14} />
            {local(locale, '۴۱ منبع', '41 sources')}
          </Badge>
        }
      />

      <header className="internal-page-heading security-assessment-heading">
        <span className="internal-page-kicker">
          <Icon name="shield-security" size={16} />
          {local(locale, 'تحلیل شواهد', 'Evidence review')}
        </span>
        <h1>{local(locale, 'شواهد و تناقض‌های ارزیابی راهبردی', 'Strategic assessment evidence')}</h1>
        <p>
          {local(
            locale,
            'شواهد همسو، تناقض‌ها و نقاط دارای داده ناکافی را جداگانه بررسی کنید تا نتیجه تحلیل و میزان عدم قطعیت آن روشن بماند.',
            'Review supporting evidence, contradictions, and insufficient-data areas separately so the conclusion and its uncertainty remain clear.',
          )}
        </p>
      </header>

      <div className="internal-page-meta-grid" aria-label={local(locale, 'دامنه تحلیل', 'Assessment scope')}>
        <div className="internal-page-meta-item info">
          <Icon name="shield-security" size={20} />
          <span>
            <small>{local(locale, 'حوزه', 'Domain')}</small>
            <strong>{local(locale, 'امنیت و ژئوپلیتیک', 'Security & geopolitics')}</strong>
          </span>
        </div>
        <div className="internal-page-meta-item confidence">
          <Icon name="chart-square" size={20} />
          <span>
            <small>{local(locale, 'اطمینان ارزیابی', 'Assessment confidence')}</small>
            <strong>{local(locale, '۷۴٪', '74%')}</strong>
          </span>
        </div>
      </div>

      <div className="security-assessment-grid internal-assessment-grid">
        <InternalSection
          title={local(locale, 'جمع‌بندی ارزیابی', 'Assessment summary')}
          description={local(
            locale,
            'برداشت فعلی بر اساس شواهد موجود؛ موارد قطعی و نقاط دارای عدم قطعیت از هم جدا نگه داشته شده‌اند.',
            'The current assessment based on available evidence, with supported findings kept separate from uncertainty.',
          )}
          className="security-assessment-overview"
          footer={local(locale, 'اطمینان فعلی ارزیابی: ۷۴٪', 'Current assessment confidence: 74%')}
        >
          <div className="security-assessment-copy">
            <p>
              {local(
                locale,
                'در داده نمونه، افزایش فعالیت مشاهده‌شده در شرق آسیا با اعلان رسمی رزمایش هم‌خوان است. این هم‌زمانی می‌تواند بخشی از تغییرات ثبت‌شده را توضیح دهد، اما برای نتیجه‌گیری قطعی باید زمان‌بندی رویدادها، دامنه منابع و شواهد مستقل در کنار هم بررسی شوند.',
                'In the sample data, increased activity observed in East Asia aligns with an announced exercise. This timing may explain part of the recorded change, but event timing, source scope, and independent evidence should be reviewed together before drawing a definitive conclusion.',
              )}
            </p>
            <p>
              {local(
                locale,
                'در قفقاز، شواهد موجود برای نسبت‌دادن علت اختلال کافی نیست. این وضعیت به‌عنوان عدم قطعیت حفظ شده تا تفاوت بین شواهد همسو و نقاط بدون پشتوانه کافی روشن بماند.',
                'In the Caucasus, the available evidence is insufficient to attribute a cause to the disruption. This uncertainty remains explicit so supported evidence and weakly supported areas stay distinguishable.',
              )}
            </p>
          </div>
        </InternalSection>

        <InternalSection
          title={local(locale, 'شواهد همسو', 'Supporting evidence')}
          description={local(locale, 'مواردی که با برداشت فعلی هم‌خوان هستند اما به‌تنهایی اثبات علت نیستند.', 'Items that support the current assessment without independently proving causation.')}
          className="security-assessment-supporting"
        >
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
        </InternalSection>

        <InternalSection
          title={local(locale, 'تناقض‌ها و عدم قطعیت', 'Contradictions & uncertainty')}
          description={local(locale, 'مواردی که هنوز شواهد کافی برای نتیجه‌گیری درباره آن‌ها وجود ندارد.', 'Areas where the available evidence is still insufficient for a conclusion.')}
          className="security-assessment-uncertainty"
        >
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
                  'داده فعلی برای نسبت‌دادن علت اختلال کافی نیست و نتیجه باید باز بماند تا شواهد بیشتری اضافه شود.',
                  'The current data is insufficient to attribute a cause to the disruption, so the conclusion should remain open until more evidence is available.',
                )}
              </p>
            </article>
          </div>
        </InternalSection>

        <InternalSection
          title={local(locale, 'نحوه خواندن این تحلیل', 'How to read this assessment')}
          className="security-assessment-scope-card"
        >
          <ul>
            <li>{local(locale, 'شواهد همسو از نتیجه قطعی جدا نگه داشته شده‌اند.', 'Supporting evidence is kept separate from definitive conclusions.')}</li>
            <li>{local(locale, 'موارد متناقض یا دارای داده ناکافی در بخش مستقل نمایش داده می‌شوند.', 'Contradictory or insufficient-data items are shown separately.')}</li>
            <li>{local(locale, 'دامنه و تعداد منابع در بالای صفحه ثابت می‌ماند تا زمینه تحلیل از دست نرود.', 'Scope and source count remain visible so analytical context is preserved.')}</li>
          </ul>
        </InternalSection>
      </div>
    </div>
  )
}
