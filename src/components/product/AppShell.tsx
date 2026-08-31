import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { countries, events, reportTitlesEn, reports, sources } from '@/data/mock/visualMvpData'
import { PROTOTYPE_CURRENT_USER } from '@/data/mock/prototypeCurrentUser'
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
  const { role, filters, setFilter, resetFilters, setSearchOpen } = useWorkspace()
  const { state, isMobile } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const isManagementAuthorized = role === 'org-admin' || role === 'data-manager'
  const isDataManagementPage = location.pathname === '/data'

  useEffect(() => setFiltersOpen(false), [location.pathname])

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
          <SidebarProfileMenu onOpenManagement={() => navigate('/data')} />
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
            {isManagementAuthorized && (
              <Button
                variant={isDataManagementPage ? 'secondary' : 'outline'}
                className="data-management-topbar-cta"
                onClick={() => navigate('/data')}
                aria-current={isDataManagementPage ? 'page' : undefined}
              >
                <Icon name="data" size={18} />
                <span>{copy.sourcesData}</span>
              </Button>
            )}
          </div>
        </header>

        {!isDataManagementPage && (
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
        )}

        <main className="product-canvas">
          <Outlet />
        </main>
      </SidebarInset>

      <GlobalSearch />
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
  const fieldId = useId()

  return (
    <Field className="context-filter">
      <FieldLabel htmlFor={fieldId} className="context-filter-label">
        <span>{label}</span>
        {meta ? <small>{meta}</small> : null}
      </FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={fieldId} aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(([key, text]) => (
              <SelectItem key={key} value={key}>
                {text}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
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
