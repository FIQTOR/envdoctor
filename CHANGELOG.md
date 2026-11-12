# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [0.1.0] - 2026-11-12

### Added
- Web prototype (React + TypeScript + Tailwind) with dashboard, runtime, port, dependency, environment-variable and permission inspectors, all running on simulated sample data.
- Diagnostic report generation with JSON and Markdown export and clipboard copy.
- Light/dark theme, English and Indonesian localization, diagnostic preferences.
- `DiagnosticProvider` interface so a native (Tauri/Rust) provider can replace the mock one.
- Zero-dependency CLI (`npx envdoctor` / `npm run cli`) that runs real local checks for runtimes, ports, environment variable hygiene, project files and permissions.
- Unit tests for scoring, report export and localization completeness.
