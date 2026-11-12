export type Status = 'pass' | 'warn' | 'fail'
export type ModuleId = 'runtime' | 'port' | 'dep' | 'env' | 'perm'
export type Theme = 'light' | 'dark'
export type Lang = 'en' | 'id'

export const MODULES: ModuleId[] = ['runtime', 'port', 'dep', 'env', 'perm']

/** One diagnostic result. `value` is what is shown prominently (a version, port, mode...). */
export interface Check {
  id: string
  mod: ModuleId
  name: string
  status: Status
  value: string
  detail: string
  fix: string
  meta: [string, string][]
}

export interface Summary {
  total: number
  pass: number
  warn: number
  fail: number
  /** 0–100; warnings count as half a pass. */
  score: number
}

export interface ReportCheck {
  module: ModuleId
  name: string
  status: Status
  value: string
  detail?: string
  fix?: string
}

export interface Report {
  tool: string
  version: string
  mode: string
  generatedAt: string
  summary: Summary
  checks: ReportCheck[]
}

export interface ActivityEntry {
  id: number
  msg: string
  status: Status
  time: string
}

export interface Settings {
  theme: Theme
  lang: Lang
  includeFixes: boolean
  includeNotes: boolean
  speed: 'slow' | 'fast'
}
