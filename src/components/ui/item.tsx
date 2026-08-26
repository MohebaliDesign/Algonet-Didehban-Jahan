import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

const itemVariants = cva(
  'group/item flex w-full min-w-0 items-center rounded-md text-start transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
  {
    variants: {
      variant: {
        default: 'border-0 bg-transparent',
        outline: 'border border-border bg-transparent',
        muted: 'border-0 bg-muted/60',
      },
      size: {
        default: 'gap-3 px-3 py-3',
        sm: 'gap-3 px-3 py-2',
        xs: 'gap-2 px-2 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Item({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof itemVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'div'

  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  )
}

function ItemGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-group"
      className={cn('flex w-full min-w-0 flex-col gap-2', className)}
      {...props}
    />
  )
}

function ItemMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & {
  variant?: 'default' | 'icon' | 'image'
}) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        'flex shrink-0 items-center justify-center',
        variant === 'icon' && 'size-10 rounded-md bg-muted text-muted-foreground',
        variant === 'image' && 'overflow-hidden rounded-md [&_img]:size-full [&_img]:object-cover',
        className,
      )}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-1 text-start', className)}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-title"
      className={cn('type-body font-semibold text-foreground', className)}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-description"
      className={cn('type-caption text-muted-foreground', className)}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-actions"
      className={cn('ms-auto flex shrink-0 items-center gap-2', className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="item-header" className={cn('w-full', className)} {...props} />
}

function ItemFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="item-footer" className={cn('w-full', className)} {...props} />
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
  itemVariants,
}
