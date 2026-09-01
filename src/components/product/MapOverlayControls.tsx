import { useEffect, useMemo, useState } from 'react'

import { Icon } from '@/components/Icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface MapLayerControlOption {
  id: string
  label: string
  colorClass: string
  count?: number
}

export function MapOverlayControls({
  isFa,
  layers = [],
  selectedLayerIds,
  onLayerToggle,
}: {
  isFa: boolean
  layers?: MapLayerControlOption[]
  selectedLayerIds?: ReadonlySet<string>
  onLayerToggle?: (id: string, checked: boolean) => void
}) {
  const [now, setNow] = useState(() => new Date())
  const [layerSearch, setLayerSearch] = useState('')

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(isFa ? 'fa-IR-u-ca-gregory-nu-latn' : 'en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(now),
    [isFa, now],
  )

  const timeLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      }).format(now),
    [now],
  )

  const filteredLayers = useMemo(() => {
    const query = layerSearch.trim().toLocaleLowerCase(isFa ? 'fa' : 'en')
    if (!query) return layers
    return layers.filter((layer) => layer.label.toLocaleLowerCase(isFa ? 'fa' : 'en').includes(query))
  }, [isFa, layerSearch, layers])

  const selected = selectedLayerIds ?? new Set<string>()
  const toggleLayer = onLayerToggle ?? (() => undefined)
  const activeLayerCount = selectedLayerIds?.size ?? layers.length
  const hasLayerControls = layers.length > 0 && selectedLayerIds != null && onLayerToggle != null

  return (
    <>
      <div className="map-time-chip" aria-label={isFa ? 'زمان مرجع UTC' : 'UTC reference time'}>
        <Icon name="clock" size={18} />
        <time dateTime={now.toISOString()}>
          <bdi dir="ltr">{timeLabel} UTC</bdi>
          <span>{dateLabel}</span>
        </time>
      </div>

      {hasLayerControls ? (
        <div className="map-layer-control">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="map-layer-trigger"
                aria-label={isFa ? 'بازکردن لایه‌های اطلاعاتی نقشه' : 'Open map intelligence layers'}
              >
                <Icon name="setting-4" size={18} />
                <span>{isFa ? 'لایه‌ها' : 'Layers'}</span>
                <Badge variant="secondary" className="map-layer-count">
                  {activeLayerCount}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="start"
              sideOffset={8}
              className="map-layer-popover"
              dir={isFa ? 'rtl' : 'ltr'}
            >
              <div className="map-layer-popover-header">
                <div>
                  <strong>{isFa ? 'لایه‌های اطلاعاتی' : 'Intelligence layers'}</strong>
                  <small>{isFa ? 'نمایش داده‌ها روی نقشه' : 'Control data shown on the map'}</small>
                </div>
                <Badge variant="outline">
                  {activeLayerCount} {isFa ? 'فعال' : 'active'}
                </Badge>
              </div>

              <InputGroup className="map-layer-search">
                <InputGroupInput
                  value={layerSearch}
                  onChange={(event) => setLayerSearch(event.target.value)}
                  placeholder={isFa ? 'جست‌وجو در لایه‌ها…' : 'Search layers…'}
                  aria-label={isFa ? 'جست‌وجو در لایه‌ها' : 'Search map layers'}
                />
                <InputGroupAddon align="inline-start">
                  <Icon name="search-normal" size={16} />
                </InputGroupAddon>
              </InputGroup>

              <ScrollArea className="map-layer-scroll">
                <div className="map-layer-list">
                  {filteredLayers.length ? (
                    filteredLayers.map((layer) => {
                      const controlId = `map-layer-${layer.id}`
                      const checked = selected.has(layer.id)
                      return (
                        <Label key={layer.id} htmlFor={controlId} className="map-layer-option">
                          <Checkbox
                            id={controlId}
                            checked={checked}
                            onCheckedChange={(value) => toggleLayer(layer.id, value === true)}
                          />
                          <span className={`map-layer-dot ${layer.colorClass}`} aria-hidden="true" />
                          <span className="map-layer-option-label">{layer.label}</span>
                          {layer.count != null ? <small>{layer.count}</small> : null}
                        </Label>
                      )
                    })
                  ) : (
                    <p className="map-layer-empty">
                      {isFa ? 'لایه‌ای با این عبارت پیدا نشد.' : 'No layer matches this search.'}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      ) : null}
    </>
  )
}
