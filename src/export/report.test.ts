import { describe, expect, it } from 'vitest'
import { sampleChecks } from '../data/sample'
import { buildReport, toJson, toMarkdown, toSummaryText } from './report'

const now = new Date('2026-01-01T00:00:00Z')
const both = { includeFixes: true, includeNotes: true }

describe('report export', () => {
  it('omits fixes when disabled', () => {
    const r = buildReport(sampleChecks(), { includeFixes: false, includeNotes: true }, true, now)
    expect(r.checks.every((c) => c.fix === undefined)).toBe(true)
  })
  it('includes fixes only for non-passing checks when enabled', () => {
    const r = buildReport(sampleChecks(), both, true, now)
    expect(r.checks.some((c) => c.fix)).toBe(true)
    expect(r.checks.filter((c) => c.status === 'pass').every((c) => c.fix === undefined)).toBe(true)
  })
  it('omits notes when disabled', () => {
    const r = buildReport(sampleChecks(), { includeFixes: true, includeNotes: false }, true, now)
    expect(r.checks.every((c) => c.detail === undefined)).toBe(true)
  })
  it('marks simulated reports as demo', () => {
    expect(buildReport([], both, true, now).mode).toContain('simulated')
  })
  it('produces valid JSON', () => {
    const r = buildReport(sampleChecks(), both, true, now)
    expect(JSON.parse(toJson(r)).summary.total).toBe(r.summary.total)
  })
  it('escapes pipes in Markdown tables', () => {
    const checks = sampleChecks().slice(0, 1).map((c) => ({ ...c, name: 'a|b' }))
    const md = toMarkdown(buildReport(checks, both, true, now))
    expect(md).toContain('a\\|b')
    expect(md).toContain('# EnvDoctor Report')
  })
  it('summary text mentions the score', () => {
    const r = buildReport(sampleChecks(), both, true, now)
    expect(toSummaryText(r)).toContain(`${r.summary.score}/100`)
  })
})
