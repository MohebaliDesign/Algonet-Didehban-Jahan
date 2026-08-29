import * as React from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'group/input-group relative flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] outline-none dark:bg-input/30',
        'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50',
        'has-[[data-slot=input-group-control][aria-invalid=true]]:border-destructive has-[[data-slot=input-group-control][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot=input-group-control][aria-invalid=true]]:ring-destructive/40',
        className,
      )}
      {...props}
    />
  )
}

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & {
  align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end'
}) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        'text-muted-foreground flex cursor-text items-center justify-center gap-2 text-sm font-medium select-none [&>svg:not([class*=size-])]:size-4',
        'data-[align=inline-start]:order-first data-[align=inline-start]:ps-3 data-[align=inline-start]:pe-2',
        'data-[align=inline-end]:order-last data-[align=inline-end]:ps-2 data-[align=inline-end]:pe-3',
        'data-[align=block-start]:order-first data-[align=block-start]:w-full data-[align=block-start]:px-3 data-[align=block-start]:pt-2.5',
        'data-[align=block-end]:order-last data-[align=block-end]:w-full data-[align=block-end]:px-3 data-[align=block-end]:pb-2.5',
        className,
      )}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('button')) return
        event.currentTarget.parentElement?.querySelector('input')?.focus()
      }}
      {...props}
    />
  )
}

function InputGroupInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent',
        className,
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupInput }
