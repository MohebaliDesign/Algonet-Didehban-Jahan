import { useEffect, useRef } from 'react'

import Highcharts from 'highcharts/es-modules/masters/highmaps.src.js'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export interface MapCountrySelection {
  countryCode: string
  countryNameFa: string
  countryNameEn: string
}

type CountryPointCustom = {
  level?: string
  nameFa?: string
  nameEn?: string
  isoA2?: string
  isoA3?: string
}

type MapPointWithProperties = Highcharts.Point & {
  properties?: Record<string, string | number | null | undefined>
}

function resolveMapChart(scope: HTMLElement | null) {
  const renderTo = scope?.querySelector<HTMLElement>('.map-collection-chart') ?? null
  if (!renderTo) return undefined
  return Highcharts.charts.find((chart) => chart?.renderTo === renderTo) as
    | Highcharts.MapChart
    | undefined
}

function countrySelectionFromPoint(point: Highcharts.Point): MapCountrySelection | null {
  const custom = (point.options as { custom?: CountryPointCustom }).custom
  if (custom?.level !== 'country') return null

  const properties = (point as MapPointWithProperties).properties
  const hcKey = String(properties?.['hc-key'] ?? '').toUpperCase()
  const isoA3 = String(custom.isoA3 ?? properties?.['iso-a3'] ?? '').toUpperCase()
  const countryCode = isoA3 && isoA3 !== '-99' ? isoA3 : hcKey
  if (!countryCode) return null

  const countryNameEn = custom.nameEn ?? String(point.name ?? countryCode)
  return {
    countryCode,
    countryNameFa: custom.nameFa ?? countryNameEn,
    countryNameEn,
  }
}

export function MapZoomControls({
  isFa,
  onCountryDrilldown,
}: {
  isFa: boolean
  onCountryDrilldown?: (country: MapCountrySelection) => void
}) {
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

  useEffect(() => {
    const scope = getScope()
    if (!scope || !onCountryDrilldown || typeof MutationObserver === 'undefined') return

    let attachedChart: Highcharts.MapChart | undefined
    let detachCountryListener: (() => void) | undefined

    const attachToChart = () => {
      const chart = resolveMapChart(scope)
      if (!chart || chart === attachedChart) return

      detachCountryListener?.()
      attachedChart = chart
      detachCountryListener = Highcharts.addEvent(chart, 'drilldown', (event) => {
        const point = (event as unknown as { point?: Highcharts.Point }).point
        if (!point) return
        const selection = countrySelectionFromPoint(point)
        if (selection) onCountryDrilldown(selection)
      })
    }

    const observer = new MutationObserver(attachToChart)
    observer.observe(scope, { childList: true, subtree: true })
    attachToChart()

    return () => {
      detachCountryListener?.()
      observer.disconnect()
    }
  }, [onCountryDrilldown])

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
