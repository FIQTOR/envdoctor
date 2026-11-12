import { describe, expect, it } from 'vitest'
import { sampleChecks } from '../data/sample'
import type { Check, Status } from '../types'
import { summarize } from './score'

const mk = (status: Status): Check => ({ id: status + Math.random(), mod: 'runtime', name: 'x', status, value: '', detail: '', fix: '', meta: [] })

describe('summarize', () => {
  it('returns 0 for no checks', () => expect(summarize([]).score).toBe(0))
  it('scores all-pass as 100', () => expect(summarize([mk('pass'), mk('pass')]).score).toBe(100))
  it('counts a warning as half a pass', () => expect(summarize([mk('pass'), mk('pass'), mk('warn'), mk('warn')]).score).toBe(75))
  it('counts failures as zero', () => expect(summarize([mk('fail'), mk('pass')]).score).toBe(50))
  it('totals add up for the sample data', () => {
    const s = summarize(sampleChecks())
    expect(s.pass + s.warn + s.fail).toBe(s.total)
  })
  it('sample ids are unique', () => {
    const ids = sampleChecks().map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
