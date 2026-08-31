import type { ReactNode } from 'react'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface InternalBreadcrumbItem {
  label: string
  onSelect?: () => void
}

export function InternalPageToolbar({
  backLabel,
  onBack,
  pageLabel,
  breadcrumbLabel,
  breadcrumbs = [],
  actions,
}: {
  backLabel: string
  onBack: () => void
  pageLabel: string
  breadcrumbLabel: string
  breadcrumbs?: InternalBreadcrumbItem[]
  actions?: ReactNode
}) {
  return (
    <div className="internal-page-toolbar" role="toolbar" aria-label={pageLabel}>
      <div className="internal-page-toolbar-leading">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="internal-page-back-button"
          aria-label={backLabel}
          title={backLabel}
          onClick={onBack}
        >
          <Icon name="arrow-left-01" size={20} className="directional-icon" />
        </Button>

        <div className="internal-page-toolbar-context">
          <strong className="internal-page-toolbar-title">{pageLabel}</strong>
          {breadcrumbs.length ? (
            <nav className="internal-breadcrumb" aria-label={breadcrumbLabel}>
              <ol>
                {breadcrumbs.map((item, index) => {
                  const current = index === breadcrumbs.length - 1
                  return (
                    <li key={`${item.label}-${index}`}>
                      {index > 0 ? (
                        <Icon name="arrow-left-01" size={14} className="internal-breadcrumb-separator directional-icon" />
                      ) : null}
                      {item.onSelect && !current ? (
                        <button type="button" onClick={item.onSelect} className="internal-breadcrumb-link">
                          {item.label}
                        </button>
                      ) : (
                        <span aria-current={current ? 'page' : undefined}>{item.label}</span>
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>
          ) : null}
        </div>
      </div>

      {actions ? <div className="internal-page-toolbar-actions">{actions}</div> : null}
    </div>
  )
}

export function InternalSection({
  title,
  description,
  footer,
  className,
  children,
}: {
  title: string
  description?: string
  footer?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <Card className={cn('internal-section', className)}>
      <CardHeader className="internal-section-header">
        <CardTitle className="internal-section-title">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="internal-section-content">{children}</CardContent>
      {footer ? <CardFooter className="internal-section-footer">{footer}</CardFooter> : null}
    </Card>
  )
}
