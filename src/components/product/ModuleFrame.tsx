import { useEffect, useState, type ReactNode } from 'react'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useProductCopy } from '@/localization/productCopy'
import type { DataState } from '@/types/domain'

export type ModuleSize = 'small' | 'medium' | 'large' | 'wide'

export interface ModuleFrameProps {
  id: string
  title: string
  description?: string
  state?: DataState
  updated?: string
  sourceCount?: number
  eventCount?: number
  confidence?: number
  size?: ModuleSize
  editing?: boolean
  expanded?: boolean
  collapsed?: boolean
  onMove?: (direction: -1 | 1) => void
  onResize?: () => void
  onCollapse?: () => void
  onExpand?: () => void
  children: ReactNode
  footerAction?: () => void
  headerAccessory?: ReactNode
}

const stateKeys: Record<
  DataState,
  'loading' | 'fresh' | 'cached' | 'stale' | 'partial' | 'empty' | 'error' | 'restricted'
> = {
  loading: 'loading',
  fresh: 'fresh',
  cached: 'cached',
  stale: 'stale',
  partial: 'partial',
  empty: 'empty',
  error: 'error',
  restricted: 'restricted',
}

export function ModuleFrame({
  id,
  title,
  description,
  state = 'fresh',
  updated,
  sourceCount,
  eventCount,
  confidence,
  size = 'medium',
  editing,
  expanded,
  collapsed,
  onMove,
  onResize,
  onCollapse,
  onExpand,
  children,
  footerAction,
  headerAccessory,
}: ModuleFrameProps) {
  const copy = useProductCopy()
  const { locale } = usePreferences()
  const { openInspector } = useWorkspace()
  return (
    <Card
      className={`module-frame module-${size} ${expanded ? 'module-expanded' : ''} ${collapsed ? 'module-collapsed' : ''}`}
      data-module-id={id}
      role="region"
      aria-label={title}
    >
      <CardHeader className="module-header">
        <div className="module-title">
          <div className="module-title-line">
            {editing && (
              <span
                className="drag-handle"
                title={locale === 'fa' ? 'دستگیره جابه‌جایی' : 'Drag handle'}
              >
                <Icon name="menu" size={16} />
              </span>
            )}
            <h2 title={title}>{title}</h2>
            <Badge variant="outline" className={`state-badge state-${state}`}>
              <i />
              {copy[stateKeys[state]]}
            </Badge>
          </div>
          {description && !collapsed && <p title={description}>{description}</p>}
        </div>
        <div className="module-controls">
          {headerAccessory ? <div className="module-header-accessory">{headerAccessory}</div> : null}
          {!editing && (
            <ModuleIconButton
              label={copy.analyze}
              onClick={() => openInspector({ kind: 'ai', id, title })}
            >
              <Icon name="magic-star" size={18} />
            </ModuleIconButton>
          )}
          <ModuleIconButton label={copy.collapse} onClick={onCollapse}>
            <Icon name={collapsed ? 'arrow-down-02' : 'minus'} size={18} />
          </ModuleIconButton>
          <ModuleIconButton label={copy.expand} onClick={onExpand}>
            <Icon name={expanded ? 'maximize-3' : 'maximize-4'} size={18} />
          </ModuleIconButton>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={copy.more}>
                    <Icon name="more" size={18} />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>{copy.more}</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="module-menu">
              <DropdownMenuItem onSelect={() => openInspector({ kind: 'ai', id, title })}>
                <Icon name="magic-star" />
                {copy.analyze}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={footerAction} disabled={!footerAction}>
                <Icon name="link-2" />
                {copy.related}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <Separator className="module-separator" />
      {editing && (
        <div className="edit-tools">
          <Button variant="outline" size="sm" onClick={() => onMove?.(-1)}>
            <Icon name="arrow-up-02" />
            {copy.moveUp}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onMove?.(1)}>
            <Icon name="arrow-down-02" />
            {copy.moveDown}
          </Button>
          <Button variant="outline" size="sm" onClick={onResize}>
            <Icon name="arrow-square" />
            {copy.resize}
          </Button>
        </div>
      )}
      <Collapsible open={!collapsed}>
        <CollapsibleContent>
          <CardContent className="module-content">{children}</CardContent>
          {(sourceCount || eventCount || confidence) && (
            <CardFooter className="module-footer">
              {sourceCount != null && (
                <span>
                  <Icon name="document" size={14} />
                  {sourceCount} {copy.sourcesLabel}
                </span>
              )}
              {eventCount != null && (
                <span>
                  <Icon name="radar-2" size={14} />
                  {eventCount} {locale === 'fa' ? 'رویداد' : 'events'}
                </span>
              )}
              {confidence != null && (
                <span>
                  <Icon name="shield-tick" size={14} />
                  {copy.confidence} {confidence}%
                </span>
              )}
              <time>
                {copy.updated}: {updated ?? (locale === 'fa' ? '۲ دقیقه پیش' : '2 minutes ago')}
              </time>
            </CardFooter>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

function ModuleIconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} onClick={onClick}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export interface LayoutItem {
  id: string
  size: ModuleSize
  collapsed: boolean
}

export function usePersistentLayout(page: string, role: string, defaults: LayoutItem[]) {
  const key = `didehban.layout.${page}.${role}`
  const [items, setItems] = useState<LayoutItem[]>(() => {
    try {
      const value = localStorage.getItem(key)
      return value ? (JSON.parse(value) as LayoutItem[]) : defaults
    } catch {
      return defaults
    }
  })
  useEffect(() => localStorage.setItem(key, JSON.stringify(items)), [items, key])
  const move = (id: string, direction: -1 | 1) =>
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id)
      const target = index + direction
      if (index < 0 || target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  const resize = (id: string) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              size:
                item.size === 'small'
                  ? 'medium'
                  : item.size === 'medium'
                    ? 'large'
                    : item.size === 'large'
                      ? 'wide'
                      : 'small',
            }
          : item,
      ),
    )
  const collapse = (id: string) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, collapsed: !item.collapsed } : item)),
    )
  const reset = () => setItems(defaults)
  return { items, move, resize, collapse, reset }
}
