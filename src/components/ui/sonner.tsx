import type { CSSProperties } from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { usePreferences } from '@/app/PreferencesProvider'
import { Icon } from '@/components/Icon'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = usePreferences()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <Icon name="tick-circle" size={16} />,
        info: <Icon name="info-circle" size={16} />,
        warning: <Icon name="warning-2" size={16} />,
        error: <Icon name="close-circle" size={16} />,
        loading: <Icon name="refresh-circle" size={16} className="animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
