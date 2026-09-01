import { useEffect, useRef, type CSSProperties } from 'react'

interface IconProps {
  name: string
  size?: number
  type?: 'linear' | 'outline' | 'bold' | 'broken' | 'bulk' | 'twotone'
  className?: string
}

export function Icon({ name, size = 20, type = 'linear', className }: IconProps) {
  const iconRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = iconRef.current
    if (!element) return

    element.setAttribute('size', String(size))
    element.style.width = `${size}px`
    element.style.height = `${size}px`
    element.style.minWidth = `${size}px`
    element.style.minHeight = `${size}px`
  }, [size])

  return (
    <span
      className={className}
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <iconsax-icon
        key={`${name}-${type}-${size}`}
        ref={iconRef}
        name={name}
        type={type}
        size={String(size)}
        color="currentColor"
        style={
          {
            display: 'block',
            width: `${size}px`,
            height: `${size}px`,
            minWidth: `${size}px`,
            minHeight: `${size}px`,
          } as CSSProperties
        }
      />
    </span>
  )
}
