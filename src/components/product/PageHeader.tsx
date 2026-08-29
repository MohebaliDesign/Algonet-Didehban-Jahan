import { usePreferences } from '@/app/PreferencesProvider'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { useProductCopy } from '@/localization/productCopy'

export function PageHeader({
  title,
  summary,
  editing,
  onEditing,
  onReset,
  eyebrow,
}: {
  title: string
  summary: string
  editing?: boolean
  onEditing?: () => void
  onReset?: () => void
  eyebrow?: string
}) {
  const { locale } = usePreferences()
  const copy = useProductCopy()
  return (
    <header className="page-header">
      <div>
        <span className="page-eyebrow">
          <i />
          {eyebrow ?? (locale === 'fa' ? 'تصویر عملیاتی' : 'Operational view')}
        </span>
        <h1>{title}</h1>
        <p>{summary}</p>
      </div>
      {onEditing && (
        <div className="page-actions">
          {editing && (
            <Button variant="ghost" onClick={onReset}>
              <Icon name="refresh-circle" />
              {copy.resetLayout}
            </Button>
          )}
          <Button variant={editing ? 'default' : 'outline'} onClick={onEditing}>
            <Icon name={editing ? 'tick-circle' : 'grid-edit'} />
            {editing ? copy.finishEditing : copy.editLayout}
          </Button>
        </div>
      )}
    </header>
  )
}

export function KpiStrip({
  items,
  iconSize = 19,
}: {
  items: { label: string; value: string; change?: string; tone?: string; icon: string }[]
  iconSize?: number
}) {
  return (
    <section className="kpi-strip">
      {items.map((item) => (
        <article key={item.label}>
          <span className={`kpi-icon ${item.tone ?? ''}`}>
            <Icon name={item.icon} size={iconSize} />
          </span>
          <div>
            <small>{item.label}</small>
            <strong dir="auto">{item.value}</strong>
            {item.change && <span dir="auto">{item.change}</span>}
          </div>
        </article>
      ))}
    </section>
  )
}
