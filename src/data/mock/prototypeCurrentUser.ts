import type { LocalizedText, Role } from '@/types/domain'

export interface PrototypeCurrentUser {
  id: string
  name: LocalizedText
  initials: LocalizedText
  defaultRole: Role
}

/**
 * DEMO-ONLY identity fixture. This local mock must never be used as production
 * authentication or authorization, and the role selector must never grant real access.
 */
export const PROTOTYPE_CURRENT_USER: PrototypeCurrentUser = {
  id: 'USER-DEMO-001',
  name: { fa: 'مریم نادری', en: 'Maryam Naderi' },
  initials: { fa: 'م‌ن', en: 'MN' },
  defaultRole: 'viewer',
}
