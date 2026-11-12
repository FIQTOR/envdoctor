import { sampleChecks } from '../data/sample'
import type { Check } from '../types'

/**
 * A source of diagnostic results. The UI only depends on this interface.
 *
 * Today: `mockProvider` (simulated data — browsers cannot inspect the OS).
 * Future native build (Tauri + Rust): implement a provider whose `collect()` calls
 *   `invoke<Check[]>('collect_diagnostics')` from '@tauri-apps/api/core',
 * with the Rust command reading versions, ports, permissions, etc. locally.
 */
export interface DiagnosticProvider {
  id: string
  label: string
  /** True when results are fabricated sample data rather than real system state. */
  simulated: boolean
  collect(): Promise<Check[]>
}

export const mockProvider: DiagnosticProvider = {
  id: 'mock',
  label: 'simulated sample data',
  simulated: true,
  collect: async () => sampleChecks(),
}

export const activeProvider: DiagnosticProvider = mockProvider
