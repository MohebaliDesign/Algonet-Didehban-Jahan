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

export function InternalPageToolbar({
  backLabel,
  onBack,
  actions,
}: {
  backLabel: string
  onBack: () => void
  actions?: ReactNode
}) {
  return (
    <div className="internal-page-toolbar" role="toolbar" aria-label={backLabel}>
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
