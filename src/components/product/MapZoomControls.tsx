import { useEffect, useRef } from 'react'

import Highcharts from 'highcharts/es-modules/masters/highmaps.src.js'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function resolveMapChart(scope: HTMLElement | null) {
  const renderTo = scope?.querySelector<HTMLElement>('.map-collection-chart') ?? null
  if (!renderTo) return undefined
  return Highcharts.charts.find((chart) => chart?.renderTo === renderTo) as
    | Highcharts.MapChart
    | undefined
}

export function MapZoomControls({ isFa }: { isFa: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  const getScope = () => rootRef.current?.parentElement ?? null

  const zoomBy = (amount: number) => {
    resolveMapChart(getScope())?.mapView.zoomBy(amount, undefined, undefined, { duration: 180 })
  }

  useEffect(() => {
    const scope = getScope()
    if (!scope || typeof ResizeObserver === 'undefined') return

    let frame = 0
    const reflow = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => resolveMapChart(scope)?.reflow())
    }

    const observer = new ResizeObserver(reflow)
    observer.observe(scope)
    reflow()

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={rootRef} className="map-zoom-control">
      <ButtonGroup
        orientation="vertical"
        aria-label={isFa ? 'کنترل بزرگ‌نمایی نقشه' : 'Map zoom controls'}
        className="map-zoom-button-group"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => zoomBy(1)}
              aria-label={isFa ? 'بزرگ‌نمایی نقشه' : 'Zoom in map'}
            >
              <Icon name="add" size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isFa ? 'right' : 'left'}>
            {isFa ? 'بزرگ‌نمایی' : 'Zoom in'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => zoomBy(-1)}
              aria-label={isFa ? 'کوچک‌نمایی نقشه' : 'Zoom out map'}
            >
              <Icon name="minus" size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isFa ? 'right' : 'left'}>
            {isFa ? 'کوچک‌نمایی' : 'Zoom out'}
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </div>
  )
}
