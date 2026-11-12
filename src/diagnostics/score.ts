import type { Check, Summary } from '../types'

/** Health score: passes count 1, warnings 0.5, failures 0. Empty input scores 0. */
export function summarize(checks: Check[]): Summary {
  const pass = checks.filter((c) => c.status === 'pass').length
  const warn = checks.filter((c) => c.status === 'warn').length
  const fail = checks.filter((c) => c.status === 'fail').length
  const total = checks.length
  return { total, pass, warn, fail, score: total ? Math.round(((pass + warn * 0.5) / total) * 100) : 0 }
}
