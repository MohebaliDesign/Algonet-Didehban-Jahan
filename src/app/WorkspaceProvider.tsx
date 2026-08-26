import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

import type { IntelligenceDomain, Role } from '@/types/domain'
import { PROTOTYPE_CURRENT_USER } from '@/data/mock/prototypeCurrentUser'

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

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  // DEMO ONLY: local React state previews role-dependent interfaces. It is not
  // authentication, is deliberately not persisted, and grants no production permission.
  const [role, setRole] = useState<Role>(PROTOTYPE_CURRENT_USER.defaultRole)
  const [filters, setFilters] = useState(defaults)
  const [inspector, setInspector] = useState<InspectorItem | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const setFilter = useCallback(
    <K extends keyof ContextFilters>(key: K, value: ContextFilters[K]) =>
      setFilters((current) => ({ ...current, [key]: value })),
    [],
  )

  const notify = useCallback((message: string) => {
    toast(message)
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
      notify,
    }),
    [filters, inspector, notify, role, searchOpen, setFilter],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext)
  if (!value) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return value
}
