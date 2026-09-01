import type { CSSProperties } from 'react'

interface IconProps {
  name: string
  size?: number
  type?: 'linear' | 'outline' | 'bold' | 'broken' | 'bulk' | 'twotone'
  className?: string
}

export function Icon({ name, size = 20, type = 'linear', className }: IconProps) {
  return (
    <span className={className} aria-hidden="true" style={{ display: 'inline-flex' }}>
      <iconsax-icon
        name={name}
        type={type}
        size={String(size)}
        color="currentColor"
        style={{ display: 'block' } as CSSProperties}
      />
    </span>
  )
}
