# Contributing to EnvDoctor

Thanks for helping! EnvDoctor is free, open source (MIT), offline-first and privacy-first. Contributions must keep it that way.

## Ground rules
- **No telemetry, no accounts, no API keys, no network calls, no paid or AI services.**
- Never display, log or export real secret values. Mask them.
- Do not claim real system access from browser code. The web app uses simulated data; real checks live in the CLI (and a future Tauri backend).
- Every visible control must work. No decorative buttons.

## Setup
```bash
git clone https://github.com/FIQTOR/envdoctor.git
cd envdoctor
npm install
npm run dev        # web UI at http://localhost:5173
npm test           # unit tests (Vitest)
npm run typecheck  # TypeScript
npm run cli        # real local diagnostics in your terminal
```

## Project layout
See the *Architecture* section of the README. Quick map: UI in `src/components` and `src/views`, data in `src/data`, scoring/providers in `src/diagnostics`, exports in `src/export`, strings in `src/i18n`, preferences in `src/settings`, real checks in `cli/`.

## Common contributions
- **Add a language:** create `src/i18n/<code>.ts` typed as `Messages` (the compiler enforces every key), register it in `src/i18n/index.ts` and the `Lang` type, add a selector button in `src/views/SettingsView.tsx`. The i18n test checks completeness.
- **Add a diagnostic to the CLI:** add a function in `cli/envdoctor.mjs` that calls `add(module, name, status, value, detail, fix)`. Probes must be read-only and local.
- **Add sample data:** edit `src/data/sample.ts` (fictional values only).
- **Native provider:** implement `DiagnosticProvider` (`src/diagnostics/providers.ts`) backed by Tauri commands.

## Pull requests
1. Open an issue first for large changes.
2. Keep PRs focused; add or update tests for logic changes.
3. Make sure `npm run typecheck`, `npm test` and `npm run build` pass.
4. Update `CHANGELOG.md` under *Unreleased*.
