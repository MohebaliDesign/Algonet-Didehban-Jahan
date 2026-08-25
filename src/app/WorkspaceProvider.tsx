import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import type { IntelligenceDomain, Role } from '@/types/domain'

export interface ContextFilters {
  geography: string
  timeRange: string
  domain: IntelligenceDomain | 'all'
  sourceSet: string
  savedView: string
}

export interface InspectorItem {
  kind: 'event' | 'signal' | 'country' | 'route' | 'report' | 'source' | 'ai'
  id: string
  title: string
  titleEn?: string
}

interface WorkspaceValue {
  role: Role
  setRole: (role: Role) => void
  filters: ContextFilters
  setFilter: <K extends keyof ContextFilters>(key: K, value: ContextFilters[K]) => void
  resetFilters: () => void
  inspector: InspectorItem | null
  openInspector: (item: InspectorItem) => void
  closeInspector: () => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  toast: string | null
  notify: (message: string) => void
}

const defaults: ContextFilters = {
  geography: 'global',
  timeRange: '24h',
  domain: 'all',
  sourceSet: 'verified',
  savedView: 'daily',
}

const WorkspaceContext = createContext<WorkspaceValue | null>(null)

function readRole(): Role {
  const value = localStorage.getItem('didehban.prototype.role')
  return value === 'org-admin' || value === 'data-manager' ? value : 'viewer'
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(readRole)
  const [filters, setFilters] = useState(defaults)
  const [inspector, setInspector] = useState<InspectorItem | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const setRole = useCallback((next: Role) => {
    localStorage.setItem('didehban.prototype.role', next)
    setRoleState(next)
  }, [])

  const setFilter = useCallback(
    <K extends keyof ContextFilters>(key: K, value: ContextFilters[K]) =>
      setFilters((current) => ({ ...current, [key]: value })),
    [],
  )

  const notify = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2800)
  }, [])

  const value = useMemo<WorkspaceValue>(
    () => ({
      role,
      setRole,
      filters,
      setFilter,
      resetFilters: () => setFilters(defaults),
      inspector,
      openInspector: setInspector,
      closeInspector: () => setInspector(null),
      searchOpen,
      setSearchOpen,
      toast,
      notify,
    }),
    [filters, inspector, notify, role, searchOpen, setFilter, setRole, toast],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext)
  if (!value) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return value
}
