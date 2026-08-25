export type Identifier = string
export type IsoTimestamp = string

export type Role = 'viewer' | 'org-admin' | 'data-manager'

export type DataState =
  'loading' | 'fresh' | 'cached' | 'stale' | 'partial' | 'empty' | 'error' | 'restricted'

interface EntityBase {
  id: Identifier
  organizationId: Identifier
  createdAt: IsoTimestamp
  updatedAt: IsoTimestamp
}

export interface Organization extends Omit<EntityBase, 'organizationId'> {
  name: string
  defaultLocale: 'fa' | 'en'
}

export interface User extends EntityBase {
  displayName: string
  role: Role
}

export interface Source extends EntityBase {
  name: string
  nameEn?: string
  kind: 'api' | 'rss' | 'website' | 'dataset' | 'stream' | 'manual'
  state: DataState
  domain?: IntelligenceDomain
  lastSuccess?: IsoTimestamp
  latencyMs?: number
}

export interface Evidence extends EntityBase {
  sourceId: Identifier
  retrievedAt: IsoTimestamp
  citation: string
}

export interface Event extends EntityBase {
  title: string
  titleEn?: string
  summary?: string
  summaryEn?: string
  occurredAt: IsoTimestamp
  evidenceIds: Identifier[]
  state: DataState
  domain?: IntelligenceDomain
  region?: string
  regionEn?: string
  coordinates?: [number, number]
  severity?: Severity
  sourceCount?: number
  confidence?: number
}

export interface Signal extends EntityBase {
  eventIds: Identifier[]
  significance: 'low' | 'medium' | 'high'
}

export interface Assessment extends EntityBase {
  signalIds: Identifier[]
  confidence: 'low' | 'medium' | 'high' | 'insufficient'
  generatedBy: 'mock-ai' | 'human' | 'system'
}

export interface Report extends EntityBase {
  title: string
  assessmentIds: Identifier[]
  version: number
}

export interface IngestionJob extends EntityBase {
  sourceIds: Identifier[]
  status: 'queued' | 'running' | 'completed' | 'partial' | 'failed' | 'cancelled'
}

export interface PrototypeSnapshot {
  organizations: Organization[]
  users: User[]
  sources: Source[]
  evidence: Evidence[]
  events: Event[]
  signals: Signal[]
  assessments: Assessment[]
  reports: Report[]
  ingestionJobs: IngestionJob[]
}

export type IntelligenceDomain =
  | 'conflict'
  | 'political'
  | 'military'
  | 'economic'
  | 'hazard'
  | 'infrastructure'
  | 'maritime'
  | 'cyber'

export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface LocalizedText {
  fa: string
  en: string
}

export interface CountryProfile {
  id: Identifier
  name: LocalizedText
  region: LocalizedText
  risk: number
  trend: 'rising' | 'stable' | 'falling'
  events: number
  indicators: { label: LocalizedText; value: string }[]
}

export interface Corridor {
  id: Identifier
  name: LocalizedText
  from: LocalizedText
  to: LocalizedText
  status: 'open' | 'delayed' | 'disrupted'
  delayHours: number
}

export interface MarketInstrument {
  id: Identifier
  symbol: string
  name: LocalizedText
  value: string
  change: number
  series: number[]
}

export interface Forecast {
  id: Identifier
  title: LocalizedText
  horizon: LocalizedText
  confidence: number
  observed: number[]
  projected: number[]
  assumptions: LocalizedText[]
  limitations: LocalizedText
}
