import type { Settings } from '../types'

const KEY = 'envdoctor.settings.v1'

export const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  lang: 'en',
  includeFixes: true,
  includeNotes: true,
  speed: 'slow',
}

/** Only theme, language and preferences are stored — locally, in this browser. */
export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(s: Settings): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* storage unavailable: ignore */ }
}

export function clearSettings(): void {
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
}
