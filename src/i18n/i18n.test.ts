import { describe, expect, it } from 'vitest'
import { en } from './en'
import { id } from './id'
import { translate } from './index'

describe('i18n', () => {
  it('has identical keys in every language', () => {
    expect(Object.keys(id).sort()).toEqual(Object.keys(en).sort())
  })
  it('has no empty strings', () => {
    for (const lang of [en, id]) for (const v of Object.values(lang)) expect(v.trim()).not.toBe('')
  })
  it('translates by language', () => {
    expect(translate('en', 'dash')).toBe('Dashboard')
    expect(translate('id', 'dash')).toBe('Dasbor')
  })
})
