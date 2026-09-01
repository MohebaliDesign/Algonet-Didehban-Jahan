import * as React from 'react'

import { cn } from '@/lib/utils'

type ButtonGroupOrientation = 'horizontal' | 'vertical'

function ButtonGroup({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<'div'> & {
  orientation?: ButtonGroupOrientation
}) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      aria-orientation={orientation}
      className={cn(
        'flex w-fit items-stretch [&>*]:focus-visible:relative [&>*]:focus-visible:z-10',
        orientation === 'vertical'
          ? 'flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none'
          : 'flex-row [&>*:not(:first-child)]:-ms-px [&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none',
        className,
      )}
      {...props}
    />
  )
}

export { ButtonGroup }
