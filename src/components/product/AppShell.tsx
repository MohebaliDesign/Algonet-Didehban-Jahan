import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { countries, events, reportTitlesEn, reports, sources } from '@/data/mock/visualMvpData'
import { PROTOTYPE_CURRENT_USER } from '@/data/mock/prototypeCurrentUser'
import { DataManagementPage } from '@/features/pages/ProductPages'
import { useProductCopy } from '@/localization/productCopy'
import type { IntelligenceDomain, Role } from '@/types/domain'

const navigation = [
  { path: '/world', key: 'world', icon: 'global' },
  { path: '/developments', key: 'developments', icon: 'trend-up' },
  { path: '/security', key: 'security', icon: 'shield-security' },
  { path: '/markets', key: 'markets', icon: 'chart' },
  { path: '/countries', key: 'countries', icon: 'routing-2' },
  { path: '/reports', key: 'reports', icon: 'document-text' },
] as const

const domains: { value: IntelligenceDomain | 'all'; fa: string; en: string }[] = [
  { value: 'all', fa: 'همه حوزه‌ها', en: 'All domains' },
  { value: 'conflict', fa: 'درگیری', en: 'Conflict' },
  { value: 'military', fa: 'نظامی', en: 'Military' },
  { value: 'economic', fa: 'اقتصاد', en: 'Economy' },
  { value: 'hazard', fa: 'مخاطرات', en: 'Hazards' },
  { value: 'infrastructure', fa: 'زیرساخت', en: 'Infrastructure' },
  { value: 'maritime', fa: 'مسیرها', en: 'Routes' },
  { value: 'cyber', fa: 'سایبری', en: 'Cyber' },
]

export function AppShell() {
  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          '--sidebar-width': '240px',
          '--sidebar-width-icon': '72px',
        } as CSSProperties
      }
    >
      <AppShellContent />
    </SidebarProvider>
  )
}

function AppShellContent() {
  const copy = useProductCopy()
  const { locale, setLocale, theme, setTheme } = usePreferences()
  const { role, filters, setFilter, resetFilters, setSearchOpen, inspector, closeInspector } =
    useWorkspace()
  const { state, isMobile } = useSidebar()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [managementOpen, setManagementOpen] = useState(false)
  const location = useLocation()
  const isManagementAuthorized = role === 'org-admin' || role === 'data-manager'

  useEffect(() => setFiltersOpen(false), [location.pathname])
  useEffect(() => {
    if (!isManagementAuthorized) setManagementOpen(false)
  }, [isManagementAuthorized])

  return (
    <div className="app-shell">
      <Sidebar
        side={locale === 'fa' ? 'right' : 'left'}
        collapsible="icon"
        className="primary-nav"
        dir={locale === 'fa' ? 'rtl' : 'ltr'}
        aria-label={copy.primaryNavigation}
      >
        <SidebarHeader className="product-lockup">
          <div className="product-lockup-inner">
            <span className="product-symbol">
              <Icon name="eye" size={22} type="bulk" />
            </span>
            <span className="product-lockup-copy">
              <strong>{copy.product}</strong>
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <nav aria-label={copy.primaryNavigation}>
            <SidebarMenu>
              {navigation.map((item) => {
                const active = location.pathname === item.path
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={{
                        children: copy[item.key],
                        side: locale === 'fa' ? 'left' : 'right',
                      }}
                      className="nav-menu-button"
                    >
                      <NavLink
                        to={item.path}
                        className="nav-item"
                        aria-current={active ? 'page' : undefined}
                      >
                        <Icon
                          name={item.icon}
                          size={21}
                          type={active ? 'bulk' : 'linear'}
                          className="nav-item-icon"
                        />
                        <span className="nav-item-label">{copy[item.key]}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </nav>
        </SidebarContent>
        <SidebarFooter className="product-sidebar-footer">
          <SidebarProfileMenu onOpenManagement={() => setManagementOpen(true)} />
          <SidebarMenu>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger
                    className="nav-collapse"
                    aria-label={state === 'expanded' ? copy.collapseSidebar : copy.expandSidebar}
                    title={state === 'expanded' ? copy.collapseSidebar : copy.expandSidebar}
                  >
                    <Icon
                      name={
                        state === 'expanded'
                          ? locale === 'fa'
                            ? 'sidebar-right'
                            : 'sidebar-left'
                          : locale === 'fa'
                            ? 'sidebar-left'
                            : 'sidebar-right'
                      }
                      size={20}
                    />
                    <span className="nav-collapse-label">
                      {state === 'expanded' ? copy.collapseSidebar : copy.expandSidebar}
                    </span>
                  </SidebarTrigger>
                </TooltipTrigger>
                <TooltipContent
                  side={locale === 'fa' ? 'left' : 'right'}
                  hidden={state !== 'collapsed' || isMobile}
                >
                  {copy.expandSidebar}
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="shell-main">
        <header className="global-topbar">
          <SidebarTrigger
            className="mobile-sidebar-trigger"
            aria-label={copy.expandSidebar}
            title={copy.expandSidebar}
          >
            <Icon name="menu" size={20} />
          </SidebarTrigger>
          <Button
            variant="outline"
            className="global-search-trigger"
            onClick={() => setSearchOpen(true)}
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
          >
            <Icon name="search-normal" />
            <span>{copy.searchHint}</span>
            <kbd dir="ltr">Ctrl K</kbd>
          </Button>
          <div className="topbar-actions">
            <span className="sync-status">
              <i />
              {copy.sync}
            </span>
            <TopbarIconButton
              label={
                locale === 'fa'
                  ? theme === 'light'
                    ? 'فعال‌کردن تم تیره'
                    : 'فعال‌کردن تم روشن'
                  : theme === 'light'
                    ? 'Switch to dark theme'
                    : 'Switch to light theme'
              }
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </TopbarIconButton>
            <Button
              variant="ghost"
              className="language-button"
              onClick={() => setLocale(locale === 'fa' ? 'en' : 'fa')}
              dir="ltr"
            >
              {locale === 'fa' ? 'EN' : 'فا'}
            </Button>
          </div>
        </header>

        <div className={`context-bar ${filtersOpen ? 'open' : ''}`}>
          <Button
            variant="ghost"
            className="compact-filter-toggle"
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
          >
            <Icon name="filter" />
            {locale === 'fa' ? 'فیلترها' : 'Filters'}
          </Button>
          <Filter
            label={copy.geography}
            value={filters.geography}
            onChange={(value) => setFilter('geography', value)}
            options={[
              ['global', copy.global],
              ['mena', locale === 'fa' ? 'خاورمیانه' : 'Middle East'],
              ['europe', locale === 'fa' ? 'اروپا' : 'Europe'],
              ['asia', locale === 'fa' ? 'آسیا' : 'Asia'],
            ]}
          />
          <Filter
            label={copy.time}
            value={filters.timeRange}
            onChange={(value) => setFilter('timeRange', value)}
            options={[
              ['24h', locale === 'fa' ? '۲۴ ساعت' : '24 hours'],
              ['7d', locale === 'fa' ? '۷ روز' : '7 days'],
              ['30d', locale === 'fa' ? '۳۰ روز' : '30 days'],
            ]}
          />
          <Filter
            label={copy.domain}
            value={filters.domain}
            onChange={(value) => setFilter('domain', value as IntelligenceDomain | 'all')}
            options={domains.map((item) => [item.value, locale === 'fa' ? item.fa : item.en])}
          />
          <Filter
            label={copy.sources}
            value={filters.sourceSet}
            onChange={(value) => setFilter('sourceSet', value)}
            options={[
              ['verified', copy.verifiedSources],
              ['all', locale === 'fa' ? 'همه منابع' : 'All sources'],
              ['watch', locale === 'fa' ? 'مجموعه پایش' : 'Watch set'],
            ]}
            meta={copy.sourceCount}
          />
          <Filter
            label={copy.savedView}
            value={filters.savedView}
            onChange={(value) => setFilter('savedView', value)}
            options={[
              ['daily', copy.dailyView],
              ['routes', locale === 'fa' ? 'ریسک مسیرها' : 'Route risk'],
              ['markets', locale === 'fa' ? 'پایش بازار' : 'Market watch'],
            ]}
          />
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <Icon name="refresh-circle" size={16} />
            {copy.reset}
          </Button>
        </div>

        <main className="product-canvas">
          <Outlet />
        </main>
      </SidebarInset>

      <GlobalSearch />
      {inspector && <Inspector onClose={closeInspector} />}
      {isManagementAuthorized && (
        <Sheet open={managementOpen} onOpenChange={setManagementOpen}>
          <SheetContent
            side={locale === 'fa' ? 'left' : 'right'}
            className="management-sheet"
            aria-label={copy.sourcesDataTitle}
          >
            <SheetHeader>
              <SheetTitle>{copy.sourcesDataTitle}</SheetTitle>
              <SheetDescription>{copy.devOnly}</SheetDescription>
            </SheetHeader>
            <ScrollArea className="management-sheet-body">
              <DataManagementPage embedded />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

function SidebarProfileMenu({ onOpenManagement }: { onOpenManagement: () => void }) {
  const { locale } = usePreferences()
  const copy = useProductCopy()
  const { role, setRole } = useWorkspace()
  const { state, isMobile } = useSidebar()
  const [open, setOpen] = useState(false)
  const isAuthorized = role === 'org-admin' || role === 'data-manager'
  const roleLabels: Record<Role, string> = {
    viewer: copy.viewer,
    'org-admin': copy.orgAdmin,
    'data-manager': copy.dataManager,
  }
  const identityTooltip = `${PROTOTYPE_CURRENT_USER.name[locale]} — ${roleLabels[role]}`

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="sidebar-profile-trigger"
                  aria-label={copy.profileMenu}
                  title={copy.profileMenu}
                >
                  <Avatar className="sidebar-profile-avatar">
                    <AvatarFallback>{PROTOTYPE_CURRENT_USER.initials[locale]}</AvatarFallback>
                  </Avatar>
                  <span className="sidebar-profile-copy">
                    <strong>{PROTOTYPE_CURRENT_USER.name[locale]}</strong>
                    <small>{roleLabels[role]}</small>
                  </span>
                  <Icon
                    name="arrow-down-01"
                    size={16}
                    className={`sidebar-profile-chevron ${open ? 'open' : ''}`}
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent
              side={locale === 'fa' ? 'left' : 'right'}
              hidden={state !== 'collapsed' || isMobile}
            >
              {identityTooltip}
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            side={locale === 'fa' ? 'left' : 'right'}
            align="end"
            className="profile-menu-content"
          >
            <DropdownMenuLabel className="profile-menu-identity">
              <Avatar>
                <AvatarFallback>{PROTOTYPE_CURRENT_USER.initials[locale]}</AvatarFallback>
              </Avatar>
              <span>
                <strong>{PROTOTYPE_CURRENT_USER.name[locale]}</strong>
                <small>{roleLabels[role]}</small>
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="prototype-role-label">
              <span>{copy.demoRole}</span>
              <small>{copy.demoRoleNotice}</small>
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup value={role} onValueChange={(value) => setRole(value as Role)}>
              {(['viewer', 'org-admin', 'data-manager'] as Role[]).map((item) => (
                <DropdownMenuRadioItem key={item} value={item}>
                  {roleLabels[item]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {isAuthorized && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onOpenManagement}>
                  <Icon name="data" size={18} />
                  {copy.sourcesData}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function TopbarIconButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string
  className?: string
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`icon-button ${className ?? ''}`}
          aria-label={label}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function Filter({
  label,
  value,
  onChange,
  options,
  meta,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[][]
  meta?: string
}) {
  return (
    <div className="context-filter">
      <span>{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(([key, text]) => (
            <SelectItem key={key} value={key}>
              {text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {meta && <small>{meta}</small>}
    </div>
  )
}

function GlobalSearch() {
  const { locale } = usePreferences()
  const copy = useProductCopy()
  const { searchOpen, setSearchOpen, openInspector } = useWorkspace()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase()
    if (!q) return []
    return [
      ...events.map((item) => ({
        id: item.id,
        kind: 'event' as const,
        title: locale === 'fa' ? item.title : (item.titleEn ?? item.title),
        meta: locale === 'fa' ? 'رویداد' : 'Event',
      })),
      ...reports.map((item) => ({
        id: item.id,
        kind: 'report' as const,
        title: locale === 'fa' ? item.title : reportTitlesEn[item.id],
        meta: locale === 'fa' ? 'گزارش' : 'Report',
      })),
      ...countries.map((item) => ({
        id: item.id,
        kind: 'country' as const,
        title: item.name[locale],
        meta: locale === 'fa' ? 'کشور' : 'Country',
      })),
      ...sources.map((item) => ({
        id: item.id,
        kind: 'source' as const,
        title: locale === 'fa' ? item.name : (item.nameEn ?? item.name),
        meta: locale === 'fa' ? 'منبع' : 'Source',
      })),
    ]
      .filter((item) => item.title.toLocaleLowerCase().includes(q))
      .slice(0, 8)
  }, [locale, query])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setSearchOpen])
  return (
    <CommandDialog
      open={searchOpen}
      onOpenChange={setSearchOpen}
      title={copy.search}
      description={copy.searchHint}
      className="search-palette"
    >
      <CommandInput value={query} onValueChange={setQuery} placeholder={copy.searchHint} />
      <CommandList className="search-results">
        {query && <CommandEmpty>{copy.noResults}</CommandEmpty>}
        {results.map((item) => (
          <CommandItem
            key={`${item.kind}-${item.id}`}
            value={`${item.title} ${item.meta}`}
            onSelect={() => {
              if (item.kind === 'country') navigate('/countries')
              if (item.kind === 'report') navigate('/reports')
              openInspector({ kind: item.kind, id: item.id, title: item.title })
              setSearchOpen(false)
              setQuery('')
            }}
          >
            <span className={`result-icon ${item.kind}`}>
              <Icon
                name={
                  item.kind === 'event'
                    ? 'radar-2'
                    : item.kind === 'report'
                      ? 'document-text'
                      : item.kind === 'country'
                        ? 'global'
                        : 'link-2'
                }
              />
            </span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.meta}</small>
            </span>
            <Icon name="arrow-left-01" className="directional-icon" />
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  )
}

function Inspector({ onClose }: { onClose: () => void }) {
  const { locale } = usePreferences()
  const copy = useProductCopy()
  const { inspector, notify } = useWorkspace()
  const [tab, setTab] = useState('overview')
  const returnFocus = useRef<HTMLElement | SVGElement | null>(
    document.activeElement instanceof HTMLElement || document.activeElement instanceof SVGElement
      ? document.activeElement
      : null,
  )
  if (!inspector) return null
  const event = events.find((item) => item.id === inspector.id)
  const title = locale === 'fa' ? inspector.title : (inspector.titleEn ?? inspector.title)
  const tabs = [
    ['overview', copy.overview],
    ['evidence', copy.evidence],
    ['ai', copy.aiAnalysis],
    ['timeline', copy.timeline],
    ['sources', copy.inspectorSources],
  ]
  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={locale === 'fa' ? 'left' : 'right'}
        className="inspector"
        showCloseButton={false}
        aria-label={title}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          const target = returnFocus.current?.isConnected
            ? returnFocus.current
            : document.querySelector<HTMLElement>('.global-search-trigger')
          target?.focus()
        }}
      >
        <SheetHeader>
          <div>
            <Badge variant="outline" className="inspector-kind">
              <Icon name={inspector.kind === 'ai' ? 'magic-star' : 'radar-2'} size={15} />
              {inspector.kind === 'ai' ? copy.generated : copy.overview}
            </Badge>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>
              {event
                ? locale === 'fa'
                  ? event.region
                  : event.regionEn
                : locale === 'fa'
                  ? 'جزئیات مرتبط با نمای فعلی'
                  : 'Details related to the current view'}
            </SheetDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="icon-button"
            onClick={onClose}
            aria-label={copy.close}
          >
            <Icon name="close-circle" />
          </Button>
        </SheetHeader>
        <Tabs value={tab} onValueChange={setTab} className="inspector-tabs-root">
          <TabsList className="inspector-tabs">
            {tabs.map(([key, label]) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollArea className="inspector-body">
            <TabsContent value="overview">
              <InspectorOverview event={event} />
            </TabsContent>
            <TabsContent value="evidence">
              <EvidencePanel />
            </TabsContent>
            <TabsContent value="ai">
              <AIAnalysis />
            </TabsContent>
            <TabsContent value="timeline">
              <TimelinePanel />
            </TabsContent>
            <TabsContent value="sources">
              <SourcePanel />
            </TabsContent>
          </ScrollArea>
        </Tabs>
        <SheetFooter>
          <Button
            variant="outline"
            onClick={() =>
              notify(
                locale === 'fa' ? 'به گزارش نمایشی افزوده شد.' : 'Added to the prototype report.',
              )
            }
          >
            <Icon name="document-download" />
            {copy.addToReport}
          </Button>
          <Button onClick={() => setTab('ai')}>
            <Icon name="magic-star" />
            {copy.analyze}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function InspectorOverview({ event }: { event?: (typeof events)[number] }) {
  const { locale } = usePreferences()
  const copy = useProductCopy()
  return (
    <div className="inspector-stack">
      <section className="narrative-callout">
        <span>{locale === 'fa' ? 'آنچه مشاهده شده' : 'Observed'}</span>
        <p>
          {event
            ? locale === 'fa'
              ? event.summary
              : event.summaryEn
            : locale === 'fa'
              ? 'این جزئیات از دادهٔ قطعی نمونه و تحلیل ساختگی تشکیل شده است.'
              : 'These details combine deterministic demo data and simulated analysis.'}
        </p>
      </section>
      <div className="trust-grid">
        <Metric label={copy.confidence} value={`${event?.confidence ?? 78}%`} />
        <Metric label={copy.sourcesLabel} value={String(event?.sourceCount ?? 7)} />
        <Metric label={copy.freshness} value={copy.fresh} />
      </div>
      <section>
        <h3>{locale === 'fa' ? 'چرا مهم است؟' : 'Why it matters'}</h3>
        <p>
          {locale === 'fa'
            ? 'این تحول می‌تواند بر زمان‌بندی مسیرها و ارزیابی ریسک منطقه‌ای اثر بگذارد؛ اثر نهایی هنوز قطعی نیست.'
            : 'This development may affect route timing and regional risk; the final impact is not yet certain.'}
        </p>
      </section>
      <section>
        <h3>{locale === 'fa' ? 'محدوده و زمان' : 'Scope and time'}</h3>
        <code dir="ltr">2026-08-24 11:42 UTC · 26.56 N, 56.25 E</code>
      </section>
    </div>
  )
}
function EvidencePanel() {
  const { locale } = usePreferences()
  return (
    <div className="evidence-list">
      {[1, 2, 3].map((n) => (
        <article key={n}>
          <span>{n}</span>
          <div>
            <strong>
              {locale === 'fa'
                ? ['گزارش مستقل تردد دریایی', 'اطلاعیه اپراتور بندری', 'تصویر ماهواره‌ای باز'][
                    n - 1
                  ]
                : ['Independent maritime report', 'Port operator notice', 'Open satellite imagery'][
                    n - 1
                  ]}
            </strong>
            <p>
              {locale === 'fa'
                ? 'شاهد پشتیبان · بازیابی‌شده در نمونهٔ محلی'
                : 'Supporting evidence · retrieved in the local prototype'}
            </p>
            <code dir="ltr">
              SRC-00{n} · 2026-08-24T11:{40 + n}:00Z
            </code>
          </div>
        </article>
      ))}
    </div>
  )
}
function AIAnalysis() {
  const { locale } = usePreferences()
  const copy = useProductCopy()
  const { notify } = useWorkspace()
  return (
    <div className="ai-analysis">
      <div className="ai-label">
        <Icon name="magic-star" />
        {copy.generated}
        <span>v1.4</span>
      </div>
      <section>
        <h3>{copy.executiveSummary}</h3>
        <p>
          {locale === 'fa'
            ? 'هم‌گرایی چند منبع مستقل از افزایش فشار عملیاتی خبر می‌دهد، اما برای نتیجه‌گیری دربارهٔ تداوم آن دادهٔ بیشتری لازم است.'
            : 'Multiple independent sources indicate increased operational pressure, but more data is needed to conclude that it will persist.'}
        </p>
      </section>
      <section>
        <h3>{copy.keyFindings}</h3>
        <ul>
          <li>
            {locale === 'fa'
              ? 'افزایش زمان عبور در دو نقطه مشاهده شده است.'
              : 'Transit time increased at two observed points.'}
          </li>
          <li>
            {locale === 'fa'
              ? 'تنوع منابع متوسط رو به بالاست.'
              : 'Source diversity is medium-high.'}
          </li>
        </ul>
      </section>
      <div className="analysis-facts">
        <Metric label={copy.confidence} value="76%" />
        <Metric label={copy.diversity} value={locale === 'fa' ? '۵ نوع' : '5 types'} />
        <Metric label={copy.freshness} value={locale === 'fa' ? '۲ دقیقه' : '2 min'} />
      </div>
      <section className="contradiction">
        <h3>{copy.contradictory}</h3>
        <p>
          {locale === 'fa'
            ? 'یک منبع محلی کاهش تأخیر را گزارش کرده؛ استقلال آن هنوز تأیید نشده است.'
            : 'One local source reports declining delays; its independence is not confirmed.'}
        </p>
      </section>
      <section>
        <h3>{copy.assumptions}</h3>
        <p>
          {locale === 'fa'
            ? 'الگوی تردد گزارش‌شده با عملیات تجاری عادی قابل مقایسه فرض شده است.'
            : 'Reported traffic patterns are assumed comparable with normal commercial operation.'}
        </p>
      </section>
      <section>
        <h3>{copy.limitations}</h3>
        <p>
          {locale === 'fa'
            ? 'دادهٔ دو بندر با تأخیر رسیده و این تحلیل پیش‌بینی قطعی نیست.'
            : 'Data from two ports is delayed; this analysis is not a certain forecast.'}
        </p>
      </section>
      <Button
        variant="outline"
        onClick={() =>
          notify(
            locale === 'fa'
              ? 'تحلیل نمایشی دوباره اجرا شد؛ خروجی ثابت است.'
              : 'Prototype analysis re-run; output is deterministic.',
          )
        }
      >
        <Icon name="refresh-circle" />
        {copy.rerun}
      </Button>
    </div>
  )
}
function TimelinePanel() {
  const { locale } = usePreferences()
  return (
    <ol className="detail-timeline">
      {['11:42', '10:56', '09:20'].map((time, index) => (
        <li key={time}>
          <time dir="ltr">{time} UTC</time>
          <span>
            {locale === 'fa'
              ? ['ثبت تغییر زمان عبور', 'تأیید دومین منبع مستقل', 'شروع پایش الگوی تردد'][index]
              : [
                  'Transit-time change recorded',
                  'Second independent source confirmed',
                  'Traffic-pattern watch started',
                ][index]}
          </span>
        </li>
      ))}
    </ol>
  )
}
function SourcePanel() {
  const { locale } = usePreferences()
  return (
    <div className="source-mini-list">
      {sources.slice(0, 4).map((source) => (
        <article key={source.id}>
          <span className={`state-dot ${source.state}`} />
          <div>
            <strong>{locale === 'fa' ? source.name : source.nameEn}</strong>
            <code dir="ltr">
              {source.kind.toUpperCase()} · {source.latencyMs} ms
            </code>
          </div>
        </article>
      ))}
    </div>
  )
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-cell">
      <small>{label}</small>
      <strong dir="auto">{value}</strong>
    </div>
  )
}
