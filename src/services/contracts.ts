import type { DataState, Identifier, PrototypeSnapshot } from '@/types/domain'

export interface ServiceResult<T> {
  data: T
  state: DataState
  observedAt: string
  message?: string
}

export interface IntelligenceRepository {
  getSnapshot(signal?: AbortSignal): Promise<ServiceResult<PrototypeSnapshot>>
  getEvent(
    id: Identifier,
    signal?: AbortSignal,
  ): Promise<ServiceResult<PrototypeSnapshot['events'][number] | null>>
}
