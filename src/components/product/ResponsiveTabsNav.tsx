import { Icon } from '@/components/Icon'
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

function TabIcon({ value }: { value: string }) {
  switch (value) {
    case 'overview':
      return <Icon name="eye" size={18} />
    case 'sources':
      return <Icon name="document" size={18} />
    case 'related':
      return <Icon name="link-2" size={18} />
    case 'raw':
      return <Icon name="data" size={18} />
    case 'events':
      return <Icon name="radar-2" size={18} />
    case 'trends':
      return <Icon name="trend-up" size={18} />
    case 'evidence':
      return <Icon name="document-text" size={18} />
    default:
      return null
  }
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
                <span className="inline-flex items-center gap-2">
                  <TabIcon value={item.value} />
                  <span>{item.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <TabsList variant="line" className={className} aria-label={ariaLabel}>
      {items.map((item) => (
        <TabsTrigger key={item.value} value={item.value}>
          <TabIcon value={item.value} />
          <span>{item.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
