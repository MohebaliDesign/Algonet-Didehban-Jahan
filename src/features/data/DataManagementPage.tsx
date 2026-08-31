import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { usePreferences } from '@/app/PreferencesProvider'
import { useWorkspace } from '@/app/WorkspaceProvider'
import { Icon } from '@/components/Icon'
import { KpiStrip } from '@/components/product/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  initialManagedSources,
  type ManagedSource,
  type ManagedSourceType,
  type SourceHealth,
} from '@/features/data/dataManagementSources'

type Locale = 'fa' | 'en'
type CrawlState = 'idle' | 'running' | 'completed'
type SelectionFilter = 'all' | 'selected' | 'unselected'
type SortMode = 'attention' | 'name' | 'category' | 'health'

const categoryLabels: Record<string, { fa: string; en: string }> = {
  geopolitics: { fa: 'ژئوپلیتیک', en: 'Geopolitics' },
  hazards: { fa: 'مخاطرات', en: 'Hazards' },
  cyber: { fa: 'سایبری', en: 'Cyber' },
  agriculture: { fa: 'کشاورزی', en: 'Agriculture' },
  health: { fa: 'سلامت', en: 'Health' },
  conflict: { fa: 'درگیری', en: 'Conflict' },
  climate: { fa: 'اقلیم', en: 'Climate' },
  markets: { fa: 'بازارها', en: 'Markets' },
  military: { fa: 'نظامی', en: 'Military' },
}

const healthLabels: Record<SourceHealth, { fa: string; en: string }> = {
  healthy: { fa: 'سالم', en: 'Healthy' },
  error: { fa: 'خطا', en: 'Error' },
  untested: { fa: 'بررسی‌نشده', en: 'Not checked' },
}

const sourceTypeLabels: Record<ManagedSourceType, string> = {
  rss: 'RSS',
  api: 'API',
  website: 'Web',
  dataset: 'Dataset',
}

function local(locale: Locale, fa: string, en: string) {
  return locale === 'fa' ? fa : en
}

function getCategoryLabel(category: string, locale: Locale) {
  return categoryLabels[category]?.[locale] ?? category
}

function getHealthLabel(health: SourceHealth, locale: Locale) {
  return healthLabels[health][locale]
}

function formatTime(value: string | undefined, locale: Locale) {
  if (!value) return local(locale, 'هنوز بررسی نشده', 'Not checked yet')
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function DataManagementPage() {
  const { locale } = usePreferences()
  const { role } = useWorkspace()
  const [managedSources, setManagedSources] = useState<ManagedSource[]>(initialManagedSources)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [healthFilter, setHealthFilter] = useState<'all' | SourceHealth>('all')
  const [selectionFilter, setSelectionFilter] = useState<SelectionFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('attention')
  const [healthDialogOpen, setHealthDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [testingSourceIds, setTestingSourceIds] = useState<Set<string>>(new Set())
  const [crawlState, setCrawlState] = useState<CrawlState>('idle')
  const [crawlTotal, setCrawlTotal] = useState(0)
  const [crawlCompleted, setCrawlCompleted] = useState(0)
  const [lastRunAt, setLastRunAt] = useState<Date | null>(null)
  const [newSourceName, setNewSourceName] = useState('')
  const [newSourceUrl, setNewSourceUrl] = useState('')
  const [newSourceCategory, setNewSourceCategory] = useState('geopolitics')
  const [newSourceType, setNewSourceType] = useState<ManagedSourceType>('rss')

  const isAuthorized = role === 'org-admin' || role === 'data-manager'
  const isCrawling = crawlState === 'running'
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US'),
    [locale],
  )

  const selectedCount = managedSources.filter((source) => source.selected).length
  const healthyCount = managedSources.filter((source) => source.health === 'healthy').length
  const errorCount = managedSources.filter((source) => source.health === 'error').length
  const untestedCount = managedSources.filter((source) => source.health === 'untested').length
  const needsAttentionCount = errorCount + untestedCount

  const categories = useMemo(
    () => Array.from(new Set(managedSources.map((source) => source.category))).sort(),
    [managedSources],
  )

  const filteredSources = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const attentionRank: Record<SourceHealth, number> = { error: 0, untested: 1, healthy: 2 }
    const healthRank: Record<SourceHealth, number> = { healthy: 0, untested: 1, error: 2 }

    return managedSources
      .filter((source) => {
        const matchesQuery =
          !normalizedQuery ||
          source.name.toLocaleLowerCase().includes(normalizedQuery) ||
          source.url.toLocaleLowerCase().includes(normalizedQuery) ||
          getCategoryLabel(source.category, locale).toLocaleLowerCase().includes(normalizedQuery)
        const matchesCategory = categoryFilter === 'all' || source.category === categoryFilter
        const matchesHealth = healthFilter === 'all' || source.health === healthFilter
        const matchesSelection =
          selectionFilter === 'all' ||
          (selectionFilter === 'selected' && source.selected) ||
          (selectionFilter === 'unselected' && !source.selected)

        return matchesQuery && matchesCategory && matchesHealth && matchesSelection
      })
      .sort((a, b) => {
        if (sortMode === 'name') return a.name.localeCompare(b.name, locale === 'fa' ? 'fa' : 'en')
        if (sortMode === 'category') {
          return getCategoryLabel(a.category, locale).localeCompare(
            getCategoryLabel(b.category, locale),
            locale === 'fa' ? 'fa' : 'en',
          )
        }
        if (sortMode === 'health') return healthRank[a.health] - healthRank[b.health]
        return attentionRank[a.health] - attentionRank[b.health] || a.name.localeCompare(b.name)
      })
  }, [categoryFilter, healthFilter, locale, managedSources, query, selectionFilter, sortMode])

  const visibleSelectedCount = filteredSources.filter((source) => source.selected).length
  const allVisibleSelected = filteredSources.length > 0 && visibleSelectedCount === filteredSources.length
  const someVisibleSelected = visibleSelectedCount > 0 && !allVisibleSelected

  useEffect(() => {
    if (crawlState !== 'running' || crawlTotal <= 0) return
    const timer = window.setInterval(() => {
      setCrawlCompleted((current) => Math.min(current + 1, crawlTotal))
    }, 420)
    return () => window.clearInterval(timer)
  }, [crawlState, crawlTotal])

  useEffect(() => {
    if (crawlState !== 'running' || crawlTotal <= 0 || crawlCompleted < crawlTotal) return
    setCrawlState('completed')
    setLastRunAt(new Date())
    toast.success(local(locale, 'جمع‌آوری داده‌ها با موفقیت تکمیل شد.', 'Data collection completed successfully.'))
  }, [crawlCompleted, crawlState, crawlTotal, locale])

  if (!isAuthorized) {
    return (
      <div className="page-view data-management-page">
        <header className="page-header data-management-header">
          <div>
            <h1>{local(locale, 'منابع و داده‌ها', 'Sources & Data')}</h1>
            <p>
              {local(
                locale,
                'این صفحه فقط برای مدیر سازمان و مدیر منابع و داده‌ها در دسترس است.',
                'This page is available only to organization admins and data & sources managers.',
              )}
            </p>
          </div>
        </header>
        <Card className="data-access-card">
          <CardContent>
            <span className="data-access-icon">
              <Icon name="lock" size={28} />
            </span>
            <div>
              <h2>{local(locale, 'دسترسی به این بخش محدود است', 'Access to this area is restricted')}</h2>
              <p>
                {local(
                  locale,
                  'برای مشاهده، انتخاب و پایش منابع باید نقش «مدیر سازمان» یا «مدیر منابع و داده‌ها» داشته باشید.',
                  'You need the Organization Admin or Data & Sources Manager role to view, select, and monitor sources.',
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const crawlPercent = crawlTotal ? Math.round((crawlCompleted / crawlTotal) * 100) : 0

  const toggleSource = (id: string, selected: boolean) => {
    if (isCrawling) return
    setManagedSources((current) =>
      current.map((source) => (source.id === id ? { ...source, selected } : source)),
    )
  }

  const setVisibleSelection = (selected: boolean) => {
    if (isCrawling) return
    const visibleIds = new Set(filteredSources.map((source) => source.id))
    setManagedSources((current) =>
      current.map((source) => (visibleIds.has(source.id) ? { ...source, selected } : source)),
    )
  }

  const selectHealthySources = () => {
    if (isCrawling) return
    setManagedSources((current) =>
      current.map((source) => ({ ...source, selected: source.health === 'healthy' })),
    )
    toast.success(local(locale, 'فقط منابع سالم انتخاب شدند.', 'Only healthy sources are selected.'))
  }

  const clearSelection = () => {
    if (isCrawling) return
    setManagedSources((current) => current.map((source) => ({ ...source, selected: false })))
  }

  const startCrawl = () => {
    if (!selectedCount || isCrawling) return
    setCrawlTotal(selectedCount)
    setCrawlCompleted(0)
    setCrawlState('running')
  }

  const deleteSource = (id: string) => {
    if (isCrawling) return
    const removed = managedSources.find((source) => source.id === id)
    if (!removed) return
    const originalIndex = managedSources.findIndex((source) => source.id === id)
    setManagedSources((current) => current.filter((source) => source.id !== id))
    toast.success(local(locale, 'منبع حذف شد.', 'Source removed.'), {
      action: {
        label: local(locale, 'بازگردانی', 'Undo'),
        onClick: () =>
          setManagedSources((current) => {
            if (current.some((source) => source.id === removed.id)) return current
            const next = [...current]
            next.splice(Math.min(originalIndex, next.length), 0, removed)
            return next
          }),
      },
    })
  }

  const runSourceTest = (id: string) => {
    const target = managedSources.find((source) => source.id === id)
    if (!target || testingSourceIds.has(id)) return

    setTestingSourceIds((current) => new Set(current).add(id))
    window.setTimeout(() => {
      const failed = Boolean(target.testWillFail)
      setManagedSources((current) =>
        current.map((source) =>
          source.id === id
            ? {
                ...source,
                health: failed ? 'error' : 'healthy',
                httpStatus: failed ? undefined : 200,
                responseTimeMs: failed ? (source.responseTimeMs ?? 12800) : (source.responseTimeMs ?? 680),
                records: failed ? 0 : (source.records ?? 24),
                lastCheckedAt: new Date().toISOString(),
              }
            : source,
        ),
      )
      setTestingSourceIds((current) => {
        const next = new Set(current)
        next.delete(id)
        return next
      })
      if (failed) {
        toast.error(local(locale, 'دسترسی به این منبع ناموفق بود.', 'This source could not be reached.'))
      } else {
        toast.success(local(locale, 'منبع در دسترس است و به‌درستی پاسخ می‌دهد.', 'The source is reachable and responding correctly.'))
      }
    }, 650)
  }

  const runAllSourceTests = () => {
    if (testingSourceIds.size) return
    setTestingSourceIds(new Set(managedSources.map((source) => source.id)))
    window.setTimeout(() => {
      const now = new Date().toISOString()
      setManagedSources((current) =>
        current.map((source) => {
          const failed = Boolean(source.testWillFail)
          return {
            ...source,
            health: failed ? 'error' : 'healthy',
            httpStatus: failed ? undefined : 200,
            responseTimeMs: failed ? (source.responseTimeMs ?? 12800) : (source.responseTimeMs ?? 680),
            records: failed ? 0 : (source.records ?? 24),
            lastCheckedAt: now,
          }
        }),
      )
      setTestingSourceIds(new Set())
      toast.success(local(locale, 'بررسی همه منابع تمام شد.', 'All source checks are complete.'))
    }, 950)
  }

  const addSource = () => {
    const name = newSourceName.trim()
    const url = newSourceUrl.trim()
    if (!name || !url) {
      toast.error(local(locale, 'نام و نشانی منبع را وارد کنید.', 'Enter a source name and URL.'))
      return
    }

    const source: ManagedSource = {
      id: `custom-${Date.now()}`,
      name,
      url,
      category: newSourceCategory,
      type: newSourceType,
      tier: 2,
      health: 'untested',
      selected: true,
    }
    setManagedSources((current) => [source, ...current])
    setNewSourceName('')
    setNewSourceUrl('')
    setNewSourceCategory('geopolitics')
    setNewSourceType('rss')
    setAddDialogOpen(false)
    toast.success(local(locale, 'منبع جدید اضافه شد و برای جمع‌آوری داده انتخاب شده است.', 'The new source was added and selected for data collection.'))
  }

  return (
    <div className="page-view data-management-page">
      <header className="page-header data-management-header">
        <div>
          <h1>{local(locale, 'منابع و داده‌ها', 'Sources & Data')}</h1>
          <p>
            {local(
              locale,
              'منابعی را که داده‌های گزارش‌ها و تحلیل‌ها از آن‌ها جمع‌آوری می‌شود، انتخاب، بررسی و مدیریت کنید.',
              'Choose, verify, and manage the sources used to collect data for reports and analysis.',
            )}
          </p>
        </div>
        <div className="page-actions data-management-page-actions">
          <Button variant="outline" onClick={() => setHealthDialogOpen(true)}>
            <Icon name="shield-tick" size={18} />
            {local(locale, 'بررسی سلامت منابع', 'Check source health')}
          </Button>
          <Button onClick={startCrawl} disabled={!selectedCount || isCrawling}>
            <Icon name="refresh-circle" size={18} className={isCrawling ? 'data-spin' : undefined} />
            {isCrawling
              ? local(locale, 'در حال جمع‌آوری داده…', 'Collecting data…')
              : local(locale, 'شروع جمع‌آوری داده', 'Start data collection')}
          </Button>
        </div>
      </header>

      <KpiStrip
        items={[
          {
            label: local(locale, 'منابع انتخاب‌شده', 'Selected sources'),
            value: numberFormatter.format(selectedCount),
            change: local(
              locale,
              `از ${numberFormatter.format(managedSources.length)} منبع`,
              `of ${numberFormatter.format(managedSources.length)} sources`,
            ),
            icon: 'tick-square',
          },
          {
            label: local(locale, 'منابع سالم', 'Healthy sources'),
            value: numberFormatter.format(healthyCount),
            change: local(locale, 'آماده جمع‌آوری داده', 'Ready for collection'),
            icon: 'shield-tick',
            tone: 'positive',
          },
          {
            label: local(locale, 'نیازمند بررسی', 'Needs attention'),
            value: numberFormatter.format(needsAttentionCount),
            change: local(
              locale,
              `${numberFormatter.format(errorCount)} خطا · ${numberFormatter.format(untestedCount)} بررسی‌نشده`,
              `${numberFormatter.format(errorCount)} errors · ${numberFormatter.format(untestedCount)} unchecked`,
            ),
            icon: 'warning-2',
            tone: needsAttentionCount ? 'warning' : 'positive',
          },
          {
            label: local(locale, 'آخرین جمع‌آوری', 'Last collection'),
            value:
              crawlState === 'running'
                ? local(locale, 'در حال اجرا', 'Running')
                : lastRunAt
                  ? local(locale, 'همین حالا', 'Just now')
                  : local(locale, 'اجرا نشده', 'Not run'),
            change: lastRunAt
              ? local(locale, 'با منابع انتخاب‌شده', 'Using selected sources')
              : local(locale, 'هنوز داده جدیدی دریافت نشده', 'No new collection yet'),
            icon: 'timer',
            tone: lastRunAt ? 'positive' : undefined,
          },
        ]}
      />

      {crawlState !== 'idle' && (
        <Card className={`data-run-status data-run-status-${crawlState}`}>
          <CardContent>
            <span className="data-run-status-icon">
              <Icon
                name={crawlState === 'running' ? 'refresh-circle' : 'tick-circle'}
                size={22}
                className={crawlState === 'running' ? 'data-spin' : undefined}
              />
            </span>
            <div className="data-run-status-copy">
              <strong>
                {crawlState === 'running'
                  ? local(locale, 'در حال جمع‌آوری داده‌ها', 'Collecting data from sources')
                  : local(locale, 'جمع‌آوری داده‌ها تکمیل شد', 'Data collection completed')}
              </strong>
              <span>
                {crawlState === 'running'
                  ? local(
                      locale,
                      'داده‌های جدید از منابع انتخاب‌شده دریافت و برای تحلیل آماده می‌شوند.',
                      'New data is being collected from selected sources and prepared for analysis.',
                    )
                  : local(
                      locale,
                      'داده‌های دریافت‌شده برای استفاده در گزارش‌ها و تحلیل‌ها آماده هستند.',
                      'Collected data is ready to be used in reports and analysis.',
                    )}
              </span>
            </div>
            <div className="data-run-progress">
              <div>
                <span>
                  {numberFormatter.format(crawlCompleted)} / {numberFormatter.format(crawlTotal)}{' '}
                  {local(locale, 'منبع', 'sources')}
                </span>
                <strong dir="ltr">{crawlPercent}%</strong>
              </div>
              <Progress
                value={crawlPercent}
                aria-label={local(locale, 'پیشرفت جمع‌آوری داده', 'Data collection progress')}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="data-sources-card">
        <CardHeader className="data-sources-card-header">
          <div>
            <h2>{local(locale, 'فهرست منابع', 'Source directory')}</h2>
            <p>
              {local(
                locale,
                'انتخاب منبع مشخص می‌کند کدام داده‌ها در جمع‌آوری بعدی وارد تحلیل و گزارش شوند.',
                'Source selection determines which data is included in the next collection, analysis, and reports.',
              )}
            </p>
          </div>
          <Button variant="outline" onClick={() => setAddDialogOpen(true)} disabled={isCrawling}>
            <Icon name="add" size={18} />
            {local(locale, 'افزودن منبع', 'Add source')}
          </Button>
        </CardHeader>
        <CardContent className="data-sources-card-content">
          <div className="data-source-toolbar">
            <InputGroup className="data-source-search">
              <InputGroupInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={local(
                  locale,
                  'نام، دامنه یا نشانی منبع را جست‌وجو کنید…',
                  'Search by source name, domain, or URL…',
                )}
                aria-label={local(locale, 'جست‌وجوی منابع', 'Search sources')}
              />
              <InputGroupAddon align="inline-start">
                <Icon name="search-normal" size={18} />
              </InputGroupAddon>
            </InputGroup>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger aria-label={local(locale, 'فیلتر دسته منبع', 'Filter source category')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{local(locale, 'همه دسته‌ها', 'All categories')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryLabel(category, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={healthFilter}
              onValueChange={(value) => setHealthFilter(value as 'all' | SourceHealth)}
            >
              <SelectTrigger aria-label={local(locale, 'فیلتر سلامت منبع', 'Filter source health')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{local(locale, 'همه وضعیت‌ها', 'All statuses')}</SelectItem>
                <SelectItem value="healthy">{getHealthLabel('healthy', locale)}</SelectItem>
                <SelectItem value="error">{getHealthLabel('error', locale)}</SelectItem>
                <SelectItem value="untested">{getHealthLabel('untested', locale)}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectionFilter}
              onValueChange={(value) => setSelectionFilter(value as SelectionFilter)}
            >
              <SelectTrigger aria-label={local(locale, 'فیلتر انتخاب منابع', 'Filter source selection')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{local(locale, 'همه منابع', 'All sources')}</SelectItem>
                <SelectItem value="selected">{local(locale, 'فقط انتخاب‌شده‌ها', 'Selected only')}</SelectItem>
                <SelectItem value="unselected">{local(locale, 'انتخاب‌نشده‌ها', 'Not selected')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortMode} onValueChange={(value) => setSortMode(value as SortMode)}>
              <SelectTrigger aria-label={local(locale, 'مرتب‌سازی منابع', 'Sort sources')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attention">
                  {local(locale, 'نیازمند توجه اول', 'Needs attention first')}
                </SelectItem>
                <SelectItem value="name">{local(locale, 'نام منبع', 'Source name')}</SelectItem>
                <SelectItem value="category">{local(locale, 'دسته', 'Category')}</SelectItem>
                <SelectItem value="health">{local(locale, 'وضعیت سلامت', 'Health status')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="data-selection-toolbar">
            <span>
              <strong>{numberFormatter.format(selectedCount)}</strong>{' '}
              {local(locale, 'منبع انتخاب شده', 'sources selected')}
            </span>
          </div>

          <div className="data-source-table-wrap">
            <Table className="data-source-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="data-col-select">
                    <Checkbox
                      checked={allVisibleSelected ? true : someVisibleSelected ? 'indeterminate' : false}
                      onCheckedChange={(checked) => setVisibleSelection(checked === true)}
                      disabled={isCrawling || !filteredSources.length}
                      aria-label={local(locale, 'انتخاب همه منابع نمایش‌داده‌شده', 'Select all visible sources')}
                    />
                  </TableHead>
                  <TableHead>{local(locale, 'منبع', 'Source')}</TableHead>
                  <TableHead className="data-col-category">{local(locale, 'دسته', 'Category')}</TableHead>
                  <TableHead className="data-col-type">{local(locale, 'نوع', 'Type')}</TableHead>
                  <TableHead>{local(locale, 'سلامت', 'Health')}</TableHead>
                  <TableHead className="data-col-last-check">
                    {local(locale, 'آخرین بررسی', 'Last checked')}
                  </TableHead>
                  <TableHead className="data-col-actions">
                    <span className="sr-only">{local(locale, 'عملیات', 'Actions')}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSources.map((source) => (
                  <TableRow key={source.id} data-selected={source.selected ? 'true' : 'false'}>
                    <TableCell className="data-col-select">
                      <Checkbox
                        checked={source.selected}
                        onCheckedChange={(checked) => toggleSource(source.id, checked === true)}
                        disabled={isCrawling}
                        aria-label={local(
                          locale,
                          `انتخاب منبع ${source.name}`,
                          `Select source ${source.name}`,
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="data-source-identity">
                        <strong>{source.name}</strong>
                        <span dir="ltr" title={source.url}>
                          {source.url}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="data-col-category">
                      <span className="data-source-category">
                        {getCategoryLabel(source.category, locale)}
                        <small dir="ltr">Tier {source.tier}</small>
                      </span>
                    </TableCell>
                    <TableCell className="data-col-type" dir="ltr">
                      {sourceTypeLabels[source.type]}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`source-health-badge source-health-${source.health}`}>
                        <i />
                        {getHealthLabel(source.health, locale)}
                      </Badge>
                    </TableCell>
                    <TableCell className="data-col-last-check">
                      <span className="data-last-check">{formatTime(source.lastCheckedAt, locale)}</span>
                    </TableCell>
                    <TableCell className="data-col-actions">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={local(locale, `عملیات ${source.name}`, `${source.name} actions`)}
                          >
                            <Icon name="more" size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => {
                              setHealthDialogOpen(true)
                              runSourceTest(source.id)
                            }}
                          >
                            <Icon name="shield-tick" size={17} />
                            {local(locale, 'بررسی سلامت', 'Check health')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="data-destructive-menu-item"
                            disabled={isCrawling}
                            onSelect={() => deleteSource(source.id)}
                          >
                            <Icon name="trash" size={17} />
                            {local(locale, 'حذف منبع', 'Remove source')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!filteredSources.length && (
              <div className="data-table-empty">
                <Icon name="search-normal" size={26} />
                <strong>{local(locale, 'منبعی با این فیلترها پیدا نشد', 'No sources match these filters')}</strong>
                <span>{local(locale, 'جست‌وجو یا فیلترها را تغییر دهید.', 'Adjust your search or filters.')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={healthDialogOpen} onOpenChange={setHealthDialogOpen}>
        <DialogContent className="data-health-dialog">
          <DialogHeader>
            <DialogTitle>{local(locale, 'بررسی سلامت منابع', 'Source health check')}</DialogTitle>
            <DialogDescription>
              {local(
                locale,
                'وضعیت دسترسی، پاسخ HTTP و زمان پاسخ هر منبع را بررسی کنید.',
                'Review reachability, HTTP response, and response time for each source.',
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="data-health-summary">
            <span className="source-health-summary source-health-healthy">
              <i />
              {numberFormatter.format(healthyCount)} {getHealthLabel('healthy', locale)}
            </span>
            <span className="source-health-summary source-health-error">
              <i />
              {numberFormatter.format(errorCount)} {getHealthLabel('error', locale)}
            </span>
            <span className="source-health-summary source-health-untested">
              <i />
              {numberFormatter.format(untestedCount)} {getHealthLabel('untested', locale)}
            </span>
          </div>
          <div className="data-health-table-wrap">
            <Table className="data-health-table">
              <TableHeader>
                <TableRow>
                  <TableHead>{local(locale, 'منبع', 'Source')}</TableHead>
                  <TableHead>{local(locale, 'وضعیت', 'Status')}</TableHead>
                  <TableHead>HTTP</TableHead>
                  <TableHead>{local(locale, 'زمان پاسخ', 'Response time')}</TableHead>
                  <TableHead>{local(locale, 'رکورد', 'Records')}</TableHead>
                  <TableHead>{local(locale, 'عملیات', 'Action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managedSources.map((source) => {
                  const isTesting = testingSourceIds.has(source.id)
                  return (
                    <TableRow key={source.id}>
                      <TableCell>
                        <div className="data-source-identity">
                          <strong>{source.name}</strong>
                          <span dir="ltr" title={source.url}>
                            {source.url}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`source-health-badge source-health-${source.health}`}>
                          <i />
                          {getHealthLabel(source.health, locale)}
                        </Badge>
                      </TableCell>
                      <TableCell dir="ltr">{source.httpStatus ?? '—'}</TableCell>
                      <TableCell dir="ltr">
                        {source.responseTimeMs ? `${numberFormatter.format(source.responseTimeMs)} ms` : '—'}
                      </TableCell>
                      <TableCell>{source.records == null ? '—' : numberFormatter.format(source.records)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => runSourceTest(source.id)}
                          disabled={isTesting}
                        >
                          <Icon name="refresh-circle" size={16} className={isTesting ? 'data-spin' : undefined} />
                          {isTesting
                            ? local(locale, 'در حال بررسی…', 'Checking…')
                            : local(locale, 'تست', 'Test')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="data-health-dialog-footer">
            <DialogClose asChild>
              <Button variant="outline">{local(locale, 'بستن', 'Close')}</Button>
            </DialogClose>
            <Button onClick={runAllSourceTests} disabled={testingSourceIds.size > 0}>
              <Icon
                name="refresh-circle"
                size={17}
                className={testingSourceIds.size ? 'data-spin' : undefined}
              />
              {testingSourceIds.size
                ? local(locale, 'در حال بررسی منابع…', 'Checking sources…')
                : local(locale, 'بررسی همه منابع', 'Check all sources')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="data-add-source-dialog">
          <DialogHeader>
            <DialogTitle>{local(locale, 'افزودن منبع', 'Add source')}</DialogTitle>
            <DialogDescription>
              {local(
                locale,
                'منبع جدید پس از اضافه‌شدن به‌صورت پیش‌فرض برای جمع‌آوری داده انتخاب می‌شود.',
                'New sources are selected for data collection by default.',
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="data-add-source-form">
            <Field>
              <FieldLabel htmlFor="data-source-name">{local(locale, 'نام منبع', 'Source name')}</FieldLabel>
              <Input
                id="data-source-name"
                value={newSourceName}
                onChange={(event) => setNewSourceName(event.target.value)}
                placeholder={local(locale, 'مثلاً خبرگزاری نمونه', 'e.g. Example News Feed')}
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="data-source-url">{local(locale, 'نشانی منبع', 'Source URL')}</FieldLabel>
              <Input
                id="data-source-url"
                value={newSourceUrl}
                onChange={(event) => setNewSourceUrl(event.target.value)}
                placeholder="https://example.com/feed.xml"
                dir="ltr"
              />
            </Field>
            <div className="data-add-source-grid">
              <Field>
                <FieldLabel>{local(locale, 'دسته', 'Category')}</FieldLabel>
                <Select value={newSourceCategory} onValueChange={setNewSourceCategory}>
                  <SelectTrigger aria-label={local(locale, 'دسته منبع جدید', 'New source category')}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categoryLabels).map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryLabel(category, locale)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>{local(locale, 'نوع منبع', 'Source type')}</FieldLabel>
                <Select
                  value={newSourceType}
                  onValueChange={(value) => setNewSourceType(value as ManagedSourceType)}
                >
                  <SelectTrigger aria-label={local(locale, 'نوع منبع جدید', 'New source type')}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(sourceTypeLabels) as ManagedSourceType[]).map((type) => (
                      <SelectItem key={type} value={type}>
                        {sourceTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{local(locale, 'انصراف', 'Cancel')}</Button>
            </DialogClose>
            <Button onClick={addSource}>
              <Icon name="add" size={17} />
              {local(locale, 'افزودن منبع', 'Add source')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
