import type { Lang } from '../types'
import { en } from './en'
import type { MessageKey, Messages } from './en'
import { id } from './id'

export type { MessageKey, Messages }
export type TFn = (key: MessageKey) => string

export const LANGS: Record<Lang, Messages> = { en, id }

export function translate(lang: Lang, key: MessageKey): string {
  return LANGS[lang]?.[key] ?? en[key]
}
