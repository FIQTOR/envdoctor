# Security Policy

## Supported versions
Only the latest release on the `main` branch receives security fixes.

## Reporting a vulnerability
Please **do not open a public issue** for security problems.
Use GitHub's private reporting: open the repository's **Security** tab and choose **Report a vulnerability**.
Include what you found, steps to reproduce and the affected version. We aim to acknowledge reports within 7 days.

## Scope and design guarantees
EnvDoctor is built to be offline-first and privacy-first. Reports of any of the following are treated as security issues:
- Any network request, telemetry or data exfiltration added to the app or CLI.
- Environment-variable **values** (secrets) being displayed, logged or exported. Only masked placeholders and lengths may ever appear.
- Command execution in the CLI beyond the fixed, read-only version/port probes it documents.

Note: the web app is a demo that uses simulated data and cannot read your operating system.
