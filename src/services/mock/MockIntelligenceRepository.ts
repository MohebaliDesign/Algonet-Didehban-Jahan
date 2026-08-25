import { foundationSnapshot } from '@/data/mock/foundationSnapshot'
import type { IntelligenceRepository, ServiceResult } from '@/services/contracts'
import type { PrototypeSnapshot } from '@/types/domain'

export class MockIntelligenceRepository implements IntelligenceRepository {
  async getSnapshot(): Promise<ServiceResult<PrototypeSnapshot>> {
    return Promise.resolve({
      data: foundationSnapshot,
      state: 'empty',
      observedAt: new Date().toISOString(),
      message: 'Phase 1 contains typed boundaries, not product data.',
    })
  }

  async getEvent(id: string) {
    return Promise.resolve({
      data: foundationSnapshot.events.find((event) => event.id === id) ?? null,
      state: 'empty' as const,
      observedAt: new Date().toISOString(),
      message: 'No event fixtures are defined in Phase 1.',
    })
  }
}
