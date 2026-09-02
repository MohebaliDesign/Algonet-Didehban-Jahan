import { useIsMobile } from '@/hooks/use-mobile'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ResponsiveTabItem {
  value: string
  label: string
}

interface ResponsiveTabsNavProps {
  value: string
  onValueChange: (value: string) => void
  items: ResponsiveTabItem[]
  ariaLabel: string
  className?: string
}

export function ResponsiveTabsNav({
  value,
  onValueChange,
  items,
  ariaLabel,
  className,
}: ResponsiveTabsNavProps) {
  const isCompact = useIsMobile()

  if (isCompact) {
    return (
      <div className="responsive-tab-select">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full" aria-label={ariaLabel}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <TabsList className={className} aria-label={ariaLabel}>
      {items.map((item) => (
        <TabsTrigger key={item.value} value={item.value}>
          {item.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
