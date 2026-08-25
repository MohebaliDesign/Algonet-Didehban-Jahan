import type { PrototypeSnapshot } from '@/types/domain'

/**
 * Deliberately small Phase 1 fixture. Feature work may add focused fixtures,
 * but this file must never become a substitute for a production data source.
 */
export const foundationSnapshot: PrototypeSnapshot = {
  organizations: [],
  users: [],
  sources: [],
  evidence: [],
  events: [],
  signals: [],
  assessments: [],
  reports: [],
  ingestionJobs: [],
}
