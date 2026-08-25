import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6 items-center gap-1 rounded-full border border-border bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground',
        className,
      )}
      {...props}
    />
  )
}
