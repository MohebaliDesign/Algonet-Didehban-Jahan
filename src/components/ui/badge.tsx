import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'type-caption inline-flex min-h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg border border-transparent px-2 py-0.5 font-medium whitespace-nowrap transition-[background-color,border-color,color] duration-150 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary [a&]:hover:bg-primary/20',
        secondary: 'bg-muted text-foreground [a&]:hover:bg-accent',
        destructive:
          'bg-destructive/10 text-destructive focus-visible:ring-destructive/20 [a&]:hover:bg-destructive/20',
        outline:
          'border-border bg-transparent text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        ghost: 'text-muted-foreground [a&]:hover:bg-accent [a&]:hover:text-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
