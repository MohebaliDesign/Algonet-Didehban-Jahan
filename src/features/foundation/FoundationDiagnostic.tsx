import { usePreferences } from '@/app/PreferencesProvider'
import { Icon } from '@/components/Icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { DataState } from '@/types/domain'

const contractEntities = [
  'Events',
  'Sources',
  'Evidence',
  'Signals',
  'Assessments',
  'Reports',
  'Organizations',
  'Users',
  'Roles',
  'Ingestion jobs',
]

const diagnosticStates: DataState[] = [
  'loading',
  'fresh',
  'cached',
  'stale',
  'partial',
  'empty',
  'error',
  'restricted',
]

const stateCopyKey: Record<DataState, keyof ReturnType<typeof usePreferences>['copy']> = {
  loading: 'stateLoading',
  fresh: 'stateFresh',
  cached: 'stateCached',
  stale: 'stateStale',
  partial: 'statePartial',
  empty: 'stateEmpty',
  error: 'stateError',
  restricted: 'stateRestricted',
}

const summaryCards = [
  { icon: 'global', title: 'directionTitle', description: 'directionDescription' },
  { icon: 'moon', title: 'themeTitle', description: 'themeDescription' },
  { icon: 'data', title: 'boundaryTitle', description: 'boundaryDescription' },
  { icon: 'people', title: 'roleTitle', description: 'roleDescription' },
] as const

export function FoundationDiagnostic() {
  const { copy, locale, setLocale, setTheme, theme } = usePreferences()

  return (
    <main className="foundation-page">
      <div className="foundation-orb foundation-orb-one" />
      <div className="foundation-orb foundation-orb-two" />

      <header className="foundation-header">
        <a className="brand-lockup" href="#overview" aria-label={copy.title}>
          <span className="brand-mark">
            <Icon name="eye" size={23} type="bulk" />
          </span>
          <span>
            <strong>دیده‌بان جهان</strong>
            <small>DIDEHBAN JAHAN</small>
          </span>
        </a>

        <Badge className="foundation-status">
          <span className="status-dot" />
          {copy.ready}
        </Badge>
      </header>

      <section className="hero" id="overview">
        <div className="hero-copy">
          <p className="eyebrow">
            <Icon name="code-circle" size={18} />
            {copy.eyebrow}
          </p>
          <h1>{copy.title}</h1>
          <p className="hero-intro">{copy.intro}</p>

          <div className="diagnostic-controls" aria-label={copy.diagnosticNote}>
            <div className="control-group">
              <span>{copy.localeLabel}</span>
              <Button variant="outline" onClick={() => setLocale(locale === 'fa' ? 'en' : 'fa')}>
                <Icon name="translate" />
                {locale === 'fa' ? copy.showEnglish : copy.showPersian}
              </Button>
            </div>
            <div className="control-group">
              <span>{copy.themeLabel}</span>
              <Button
                variant="outline"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                <Icon name={theme === 'light' ? 'moon' : 'sun'} />
                {theme === 'light' ? copy.useDark : copy.useLight}
              </Button>
            </div>
          </div>
          <p className="diagnostic-note">{copy.diagnosticNote}</p>
        </div>

        <Card className="token-preview-card">
          <CardHeader>
            <div className="preview-icon">
              <Icon name="color-swatch" size={24} type="bulk" />
            </div>
            <CardTitle>{copy.sourceTokens}</CardTitle>
            <CardDescription>{copy.sourceTokensDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="preview-stack">
              <div className="preview-line preview-line-wide" />
              <div className="preview-line" />
              <div className="preview-pills">
                <span />
                <span />
                <span />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="summary-grid" aria-label={copy.title}>
        {summaryCards.map((item) => (
          <Card key={item.title} className="summary-card">
            <CardContent>
              <div className="summary-icon">
                <Icon name={item.icon} size={21} />
              </div>
              <div>
                <h2>{copy[item.title]}</h2>
                <p>{copy[item.description]}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="content-grid">
        <Card className="specimen-card">
          <CardHeader>
            <CardTitle>{copy.typographyTitle}</CardTitle>
            <CardDescription>{copy.directionDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <blockquote>{copy.typographyBody}</blockquote>
            <p className="english-specimen" lang="en" dir="ltr">
              {copy.englishSpecimen}
            </p>
          </CardContent>
        </Card>

        <Card className="technical-card">
          <CardHeader>
            <CardTitle>{copy.technicalTitle}</CardTitle>
            <CardDescription>{copy.technicalDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="technical-list">
              <div>
                <dt>URL</dt>
                <dd dir="ltr">https://example.org/event/IR-2026-0081</dd>
              </div>
              <div>
                <dt>TICKER</dt>
                <dd dir="ltr">XAU/USD · BTC-USD</dd>
              </div>
              <div>
                <dt>COORD</dt>
                <dd dir="ltr">35.6892° N, 51.3890° E</dd>
              </div>
              <div>
                <dt>UTC</dt>
                <dd dir="ltr">
                  <time dateTime="2026-08-24T12:30:00Z">2026-08-24 12:30:00 UTC</time>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="tokens-card">
          <CardHeader>
            <CardTitle>{copy.tokenTitle}</CardTitle>
            <CardDescription>{copy.tokenDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="swatch-grid">
              <Swatch className="swatch-primary" label={copy.brandPrimary} value="#416DFF" />
              <Swatch className="swatch-secondary" label={copy.brandSecondary} value="#FF4000" />
              <Swatch className="swatch-surface" label={copy.surface} value="semantic" />
              <Swatch className="swatch-foreground" label={copy.foreground} value="semantic" />
            </div>
          </CardContent>
        </Card>

        <Card className="states-card">
          <CardHeader>
            <div className="title-row">
              <CardTitle>{copy.statesTitle}</CardTitle>
              <Badge>{copy.temporary}</Badge>
            </div>
            <CardDescription>{copy.statesDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="state-list">
              {diagnosticStates.map((state) => (
                <span className={`data-state data-state-${state}`} key={state}>
                  <span />
                  {copy[stateCopyKey[state]]}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="contracts-card">
        <CardHeader>
          <CardTitle>{copy.contractTitle}</CardTitle>
          <CardDescription>{copy.contractDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="contract-list">
            {contractEntities.map((entity) => (
              <code dir="ltr" key={entity}>
                {entity}
              </code>
            ))}
          </div>
        </CardContent>
      </Card>

      <footer>{copy.footer}</footer>
    </main>
  )
}

function Swatch({ className, label, value }: { className: string; label: string; value: string }) {
  return (
    <div className="swatch-item">
      <span className={`swatch ${className}`} />
      <span>
        <strong>{label}</strong>
        <small dir="ltr">{value}</small>
      </span>
    </div>
  )
}
