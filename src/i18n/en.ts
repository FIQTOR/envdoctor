export const en = {
  dash: 'Dashboard', runtime: 'Runtimes', port: 'Ports', dep: 'Dependencies', env: 'Environment',
  perm: 'Permissions', report: 'Report', set: 'Settings', menu: 'Main menu',
  score: 'Health score', total: 'Checks', pass: 'Passed', warn: 'Warnings', fail: 'Failed', all: 'All',
  run: 'Run diagnostics', scanning: 'Scanning', activity: 'Recent activity', bymod: 'Health by module',
  search: 'Search…', resolve: 'Mark resolved (demo)', fix: 'Suggested fix', none: 'No checks match your filters.',
  empty: 'No activity yet.', loading: 'Loading diagnostics…',
  demo: 'Demo mode: every value here is simulated sample data. A browser cannot inspect your operating system. For real checks, run the EnvDoctor CLI (npm run cli).',
  gen: 'Generate report', dlj: 'Download JSON', dlm: 'Download Markdown', cps: 'Copy summary', cpm: 'Copy Markdown',
  preview: 'Preview', pressGen: 'Press “Generate report” to build a report.',
  generated: 'Report generated', copied: 'Copied to clipboard', cfail: 'Copy failed — select the preview text manually',
  saved: 'File saved', dlfail: 'Could not save the file — try the copy buttons',
  theme: 'Theme', dark: 'Dark', light: 'Light', lang: 'Language', prefs: 'Diagnostic preferences',
  pf: 'Include suggested fixes in reports', pn: 'Include detail notes in reports',
  speed: 'Simulated scan speed', slow: 'Relaxed', fast: 'Fast',
  privacy: 'Privacy',
  ptxt: 'EnvDoctor runs entirely on your device. It has no telemetry, no accounts, no API keys and makes no network requests. Only your theme, language and preferences are stored locally in this browser.',
  reset: 'Reset sample data', clear: 'Clear saved settings',
} as const

export type MessageKey = keyof typeof en
export type Messages = Record<MessageKey, string>
