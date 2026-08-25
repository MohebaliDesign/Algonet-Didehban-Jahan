import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react'

declare module 'iconsax'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'iconsax-icon': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        name: string
        type?: 'linear' | 'outline' | 'bold' | 'broken' | 'bulk' | 'twotone'
        size?: string
        color?: string
        style?: CSSProperties
      }
    }
  }
}
