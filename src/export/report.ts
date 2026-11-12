import { summarize } from '../diagnostics/score'
import { MODULES } from '../types'
import type { Check, Report } from '../types'

export const APP_VERSION = '0.1.0'

export interface ReportOptions {
  includeFixes: boolean
  includeNotes: boolean
}

export function buildReport(checks: Check[], opts: ReportOptions, simulated: boolean, now: Date = new Date()): Report {
  return {
    tool: 'EnvDoctor',
    version: APP_VERSION,
    mode: simulated ? 'demo — simulated sample data, no real system access' : 'local diagnostics',
    generatedAt: now.toISOString(),
    summary: summarize(checks),
    checks: checks.map((c) => ({
      module: c.mod,
      name: c.name,
      status: c.status,
      value: c.value,
      ...(opts.includeNotes ? { detail: c.detail } : {}),
      ...(opts.includeFixes && c.fix && c.status !== 'pass' ? { fix: c.fix } : {}),
    })),
  }
}

export function toSummaryText(r: Report): string {
  const s = r.summary
  return `EnvDoctor report — health ${s.score}/100 · ${s.total} checks: ${s.pass} passed, ${s.warn} warnings, ${s.fail} failed.`
}

export function toJson(r: Report): string {
  return JSON.stringify(r, null, 2)
}

const esc = (s: string) => s.replace(/\|/g, '\\|')

export function toMarkdown(r: Report): string {
  const sections = MODULES.map((m) => {
    const rows = r.checks.filter((c) => c.module === m)
    if (!rows.length) return ''
    const body = rows
      .map((c) => {
        const notes = [c.detail, c.fix ? `Fix: ${c.fix}` : ''].filter(Boolean).join(' — ')
        return `| ${c.status} | ${esc(c.name)} | ${esc(c.value)} | ${esc(notes)} |`
      })
      .join('\n')
    return `## ${m}\n\n| Status | Check | Value | Notes |\n|---|---|---|---|\n${body}`
  }).filter(Boolean)
  return `# EnvDoctor Report\n\n> Mode: ${r.mode}\n\nGenerated: ${r.generatedAt}\n\n${toSummaryText(r)}\n\n${sections.join('\n\n')}\n`
}
