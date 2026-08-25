import { useMemo, useState } from 'react'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { events, layerLabels } from '@/data/mock/visualMvpData'
import type { IntelligenceDomain } from '@/types/domain'

const land = [
  'M45 72 L73 48 122 42 155 58 165 84 143 103 126 128 105 122 88 101 61 96 Z',
  'M150 134 L178 123 195 144 185 170 172 211 154 231 144 198 132 168 Z',
  'M232 57 L269 40 317 45 342 58 378 63 421 80 449 103 424 119 393 109 371 125 335 116 310 103 279 109 254 91 Z',
  'M253 121 L289 116 317 133 305 166 286 199 264 190 248 159 Z',
  'M420 179 L447 172 466 188 449 205 421 203 408 190 Z',
  'M207 66 L218 57 227 65 217 76 Z',
]

const positions: Record<string, [number, number]> = {
  'evt-hormuz': [318, 142],
  'evt-caucasus': [292, 91],
  'evt-east-asia': [408, 112],
  'evt-europe-energy': [270, 80],
  'evt-africa-flood': [296, 161],
  'evt-cyber': [281, 84],
}

export function WorldMap() {
  const { locale } = usePreferences()
  const { filters, openInspector } = useWorkspace()
  const [zoom, setZoom] = useState(1)
  const [layerSearch, setLayerSearch] = useState('')
  const [layers, setLayers] = useState<Set<IntelligenceDomain>>(
    new Set(Object.keys(layerLabels) as IntelligenceDomain[]),
  )
  const [listView, setListView] = useState(false)
  const [timeline, setTimeline] = useState(18)
  const visible = useMemo(
    () =>
      events.filter(
        (item) =>
          (filters.domain === 'all' || item.domain === filters.domain) &&
          item.domain &&
          layers.has(item.domain),
      ),
    [filters.domain, layers],
  )
  const toggle = (domain: IntelligenceDomain) =>
    setLayers((current) => {
      const next = new Set(current)
      if (next.has(domain)) next.delete(domain)
      else next.add(domain)
      return next
    })
  return (
    <div className="map-workspace">
      <div className="map-toolbar">
        <div className="view-switch">
          <button className={!listView ? 'active' : ''} onClick={() => setListView(false)}>
            <Icon name="global" />
            {locale === 'fa' ? 'نقشه' : 'Map'}
          </button>
          <button className={listView ? 'active' : ''} onClick={() => setListView(true)}>
            <Icon name="menu" />
            {locale === 'fa' ? 'فهرست' : 'List'}
          </button>
        </div>
        <button
          onClick={() => {
            setZoom(1)
            setTimeline(18)
          }}
        >
          <Icon name="gps" />
          {locale === 'fa' ? 'بازنشانی نما' : 'Reset view'}
        </button>
      </div>
      {!listView && (
        <div className="map-stage">
          <svg
            className="world-map-svg"
            viewBox="0 0 500 250"
            role="img"
            aria-label={
              locale === 'fa' ? 'نقشه رویدادهای اطلاعاتی جهان' : 'World intelligence event map'
            }
          >
            <title>
              {locale === 'fa'
                ? 'رویدادهای قابل انتخاب روی نقشه'
                : 'Selectable events on the world map'}
            </title>
            <g className="map-grid">
              {[50, 100, 150, 200].map((y) => (
                <line key={`y${y}`} x1="0" x2="500" y1={y} y2={y} />
              ))}
              {[100, 200, 300, 400].map((x) => (
                <line key={`x${x}`} y1="0" y2="250" x1={x} x2={x} />
              ))}
            </g>
            <g style={{ transform: `scale(${zoom})`, transformOrigin: '250px 125px' }}>
              {land.map((path, i) => (
                <path className="map-land" d={path} key={i} />
              ))}
              <path className="map-route" d="M160 152 Q250 95 318 142 T430 132" />
              {visible.map((item, index) => {
                const [x, y] = positions[item.id]
                const clustered = index === 1 && zoom < 1.2
                return (
                  <g
                    key={item.id}
                    className={`map-marker marker-${item.severity}`}
                    onClick={() =>
                      openInspector({
                        kind: 'event',
                        id: item.id,
                        title: item.title,
                        titleEn: item.titleEn,
                      })
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter')
                        openInspector({
                          kind: 'event',
                          id: item.id,
                          title: item.title,
                          titleEn: item.titleEn,
                        })
                    }}
                    aria-label={locale === 'fa' ? item.title : item.titleEn}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={
                        clustered
                          ? 14
                          : item.severity === 'critical'
                            ? 10
                            : item.severity === 'high'
                              ? 8
                              : 6
                      }
                    />
                    <circle cx={x} cy={y} r={clustered ? 7 : 3} className="marker-core" />
                    {clustered && (
                      <text x={x} y={y + 3} textAnchor="middle">
                        3
                      </text>
                    )}
                    <title>{locale === 'fa' ? item.title : item.titleEn}</title>
                  </g>
                )
              })}
            </g>
          </svg>
          <div className="zoom-controls">
            <button
              onClick={() => setZoom((value) => Math.min(1.45, value + 0.15))}
              aria-label="Zoom in"
            >
              +
            </button>
            <span dir="ltr">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((value) => Math.max(0.8, value - 0.15))}
              aria-label="Zoom out"
            >
              −
            </button>
          </div>
          <aside className="layer-panel">
            <header>
              <div>
                <strong>{locale === 'fa' ? 'لایه‌های اطلاعاتی' : 'Intelligence layers'}</strong>
                <small>
                  {layers.size} {locale === 'fa' ? 'لایه فعال' : 'active layers'}
                </small>
              </div>
              <Icon name="layer" />
            </header>
            <label>
              <Icon name="search-normal" size={15} />
              <input
                value={layerSearch}
                onChange={(e) => setLayerSearch(e.target.value)}
                placeholder={locale === 'fa' ? 'جست‌وجوی لایه…' : 'Search layers…'}
              />
            </label>
            <div>
              {(Object.keys(layerLabels) as IntelligenceDomain[])
                .filter((key) =>
                  (locale === 'fa' ? layerLabels[key].fa : layerLabels[key].en)
                    .toLowerCase()
                    .includes(layerSearch.toLowerCase()),
                )
                .map((key) => (
                  <button
                    key={key}
                    className={layers.has(key) ? 'selected' : ''}
                    onClick={() => toggle(key)}
                  >
                    <span className={`legend-symbol layer-${key}`} />
                    <span>{locale === 'fa' ? layerLabels[key].fa : layerLabels[key].en}</span>
                    <Icon name={layers.has(key) ? 'tick-square' : 'stop'} size={17} />
                  </button>
                ))}
            </div>
          </aside>
          <div className="map-legend">
            <strong>{locale === 'fa' ? 'شدت' : 'Severity'}</strong>
            <span>
              <i className="low" />
              {locale === 'fa' ? 'کم' : 'Low'}
            </span>
            <span>
              <i className="medium" />
              {locale === 'fa' ? 'متوسط' : 'Medium'}
            </span>
            <span>
              <i className="high" />
              {locale === 'fa' ? 'بالا' : 'High'}
            </span>
            <span>
              <i className="critical" />
              {locale === 'fa' ? 'بحرانی' : 'Critical'}
            </span>
          </div>
        </div>
      )}
      {listView && (
        <div className="map-list-alternative">
          {visible.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                openInspector({
                  kind: 'event',
                  id: item.id,
                  title: item.title,
                  titleEn: item.titleEn,
                })
              }
            >
              <span className={`event-severity ${item.severity}`} />
              <span>
                <strong>{locale === 'fa' ? item.title : item.titleEn}</strong>
                <small>
                  {locale === 'fa' ? item.region : item.regionEn} · {item.sourceCount}{' '}
                  {locale === 'fa' ? 'منبع' : 'sources'}
                </small>
              </span>
              <time dir="ltr">{item.occurredAt.slice(11, 16)} UTC</time>
            </button>
          ))}
        </div>
      )}
      <div className="map-timeline">
        <button>
          <Icon name="pause" size={16} />
        </button>
        <span dir="ltr">00:00</span>
        <input
          type="range"
          min="0"
          max="24"
          value={timeline}
          onChange={(e) => setTimeline(Number(e.target.value))}
          aria-label={locale === 'fa' ? 'زمان نقشه' : 'Map time'}
        />
        <span dir="ltr">{String(timeline).padStart(2, '0')}:00 UTC</span>
        <small>{locale === 'fa' ? '۲۴ ساعت گذشته' : 'Past 24 hours'}</small>
      </div>
    </div>
  )
}
