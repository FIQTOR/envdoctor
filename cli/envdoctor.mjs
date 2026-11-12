#!/usr/bin/env node
// EnvDoctor CLI — real, read-only, local diagnostics.
// Zero dependencies. Makes NO network requests. Never prints environment variable values.
import { execFile } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const argv = process.argv.slice(2)
const has = (f) => argv.includes(f)

const HELP = `EnvDoctor ${pkg.version} — local development environment doctor

Usage: envdoctor [--json | --md] [--help] [--version]

  (no flag)   human-readable report
  --json      machine-readable JSON (same schema as the web app export)
  --md        Markdown report
  Exit code is 1 when at least one check fails, otherwise 0.

What it checks (read-only, offline):
  runtimes     versions of node, npm, python, pip, java, php, git, docker
  ports        whether common dev ports are free (owner lookup via lsof when available)
  dependencies package.json / lockfile / node_modules in the current directory
  environment  secret-looking variable NAMES (values are never shown) and risky settings
  permissions  current directory, node_modules, .env vs .gitignore, ~/.ssh and ~/.npmrc modes
Not checked: outdated or duplicate packages (needs a registry lookup, which this tool never does).`

if (has('--help') || has('-h')) { console.log(HELP); process.exit(0) }
if (has('--version') || has('-v')) { console.log(pkg.version); process.exit(0) }

const checks = []
const add = (module, name, status, value, detail, fix = '') => checks.push({ module, name, status, value, detail, fix })
const exists = (p) => fs.existsSync(p)
const canAccess = (p, mode) => { try { fs.accessSync(p, mode); return true } catch { return false } }
const posix = process.platform !== 'win32'
const nodeMajor = Number(process.versions.node.split('.')[0])

async function probe(cmd, args) {
  try {
    const { stdout, stderr } = await run(cmd, args, { timeout: 5000, shell: !posix, windowsHide: true })
    return `${stdout}\n${stderr}`.match(/\d+(?:\.\d+)+/)?.[0] ?? 'unknown'
  } catch { return null }
}

async function runtimes() {
  const ok = nodeMajor >= 18
  add('runtime', 'Node.js', ok ? 'pass' : 'warn', `v${process.versions.node}`, ok ? 'Supported version (>=18)' : 'Older than the supported Node 18+', ok ? '' : 'Upgrade to a current LTS release')
  const tools = [
    ['npm', ['npm'], ['--version']], ['Python', ['python3', 'python'], ['--version']], ['pip', ['pip3', 'pip'], ['--version']],
    ['Java', ['java'], ['-version']], ['PHP', ['php'], ['--version']], ['Git', ['git'], ['--version']], ['Docker', ['docker'], ['--version']],
  ]
  for (const [name, cmds, args] of tools) {
    let found = null
    for (const cmd of cmds) { found = await probe(cmd, args); if (found) { add('runtime', name, 'pass', found, `Found via "${cmd}"`); break } }
    if (!found) add('runtime', name, 'warn', 'not found', 'Not found on PATH', 'Install it if your project needs it')
  }
}

const PORTS = [[3000, 'React / Node dev server'], [3001, 'Dev server (alt)'], [4200, 'Angular CLI'], [5173, 'Vite'], [5432, 'PostgreSQL'], [3306, 'MySQL'], [6379, 'Redis'], [8000, 'Django / Python'], [8080, 'HTTP alt / Tomcat'], [27017, 'MongoDB']]
const portBusy = (port) => new Promise((resolve) => {
  const s = net.createServer()
  s.once('error', (e) => resolve(e.code === 'EADDRINUSE'))
  s.once('listening', () => s.close(() => resolve(false)))
  s.listen(port, '127.0.0.1')
})
async function portOwner(port) {
  if (!posix) return null
  try {
    const { stdout } = await run('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-Fpc'], { timeout: 3000 })
    const pid = stdout.match(/^p(\d+)/m)?.[1]
    return pid ? { pid, cmd: stdout.match(/^c(.+)$/m)?.[1] ?? 'unknown' } : null
  } catch { return null }
}
async function ports() {
  const busy = await Promise.all(PORTS.map(([p]) => portBusy(p)))
  for (let i = 0; i < PORTS.length; i++) {
    const [port, label] = PORTS[i]
    if (!busy[i]) { add('port', label, 'pass', `:${port}`, 'Free'); continue }
    const o = await portOwner(port)
    add('port', label, 'warn', `:${port}`, o ? `In use by ${o.cmd} (PID ${o.pid})` : 'In use (owner unknown: lsof unavailable or not permitted)',
      o ? `Stop it with: kill ${o.pid} — or use another port` : 'Find the owner with your OS tools, or use another port')
  }
}

const SENSITIVE = /(secret|token|passw(or)?d|api[_-]?key|private[_-]?key|credential)/i
const WEAK = new Set(['changeme', 'password', 'secret', 'test', 'admin', '123456', 'default', 'example'])
function environment() {
  const names = Object.keys(process.env).filter((k) => SENSITIVE.test(k)).sort()
  for (const k of names) {
    const v = process.env[k] ?? ''
    const weak = v.length < 8 || WEAK.has(v.toLowerCase())
    add('env', k, weak ? 'warn' : 'pass', `•••• (${v.length} chars)`, weak ? 'Short or placeholder-like value' : 'Value masked; never displayed', weak ? 'Use a long random value' : '')
  }
  if (!names.length) add('env', 'Secret-like variables', 'pass', 'none', 'No variables with secret-like names are set in this shell')
  if (process.env.NODE_ENV === 'production') add('env', 'NODE_ENV', 'warn', 'production', 'Set to production in this shell', 'Unset it for local development')
  if (process.env.DEBUG === '*') add('env', 'DEBUG', 'warn', '*', 'Wildcard debug logging can leak request data', 'Scope it, e.g. DEBUG=app:*')
}

function dependencies(cwd) {
  const file = path.join(cwd, 'package.json')
  if (!exists(file)) { add('dep', 'package.json', 'warn', 'not found', 'No package.json in the current directory', 'Run EnvDoctor from a project root to check dependencies'); return }
  let json
  try { json = JSON.parse(fs.readFileSync(file, 'utf8')) } catch { add('dep', 'package.json', 'fail', 'invalid', 'package.json is not valid JSON', 'Fix the syntax error'); return }
  const all = { ...json.dependencies, ...json.devDependencies }
  const count = Object.keys(all).length
  add('dep', 'package.json', 'pass', `${count} deps`, `${Object.keys(json.dependencies ?? {}).length} runtime, ${Object.keys(json.devDependencies ?? {}).length} dev`)
  const lock = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'].find((f) => exists(path.join(cwd, f)))
  add('dep', 'Lockfile', lock ? 'pass' : 'warn', lock ?? 'missing', lock ? 'Installs are reproducible' : 'No lockfile found', lock ? '' : 'Run your package manager install and commit the lockfile')
  if (count > 0) { const nm = exists(path.join(cwd, 'node_modules')); add('dep', 'node_modules', nm ? 'pass' : 'warn', nm ? 'present' : 'missing', nm ? 'Dependencies are installed' : 'Dependencies are not installed', nm ? '' : 'Run npm install') }
  const loose = Object.entries(all).filter(([, v]) => v === '*' || v === 'latest').map(([k]) => k)
  if (loose.length) add('dep', 'Unpinned ranges', 'warn', `${loose.length}`, `Uses "*" or "latest": ${loose.slice(0, 5).join(', ')}`, 'Use a semver range such as ^1.2.3')
  const need = String(json.engines?.node ?? '').match(/>=\s*(\d+)/)?.[1]
  if (need) { const ok = nodeMajor >= Number(need); add('dep', 'engines.node', ok ? 'pass' : 'fail', `>=${need}`, ok ? 'Current Node satisfies engines' : `Current Node is v${process.versions.node}`, ok ? '' : `Switch to Node ${need}+`) }
}

function permissions(cwd) {
  const rw = canAccess(cwd, fs.constants.R_OK | fs.constants.W_OK)
  add('perm', '.', rw ? 'pass' : 'fail', rw ? 'rw' : 'no access', rw ? 'Current directory is readable and writable' : 'Cannot read/write the current directory', rw ? '' : 'Check ownership with ls -ld .')
  const nm = path.join(cwd, 'node_modules')
  if (exists(nm)) { const w = canAccess(nm, fs.constants.W_OK); add('perm', 'node_modules', w ? 'pass' : 'warn', w ? 'rw' : 'read-only', w ? 'Writable' : 'Not writable', w ? '' : 'Fix ownership; avoid installing with sudo') }
  if (exists(path.join(cwd, '.env'))) {
    let ignored = false
    try { ignored = fs.readFileSync(path.join(cwd, '.gitignore'), 'utf8').split(/\r?\n/).map((l) => l.trim()).some((l) => ['.env', '/.env', '.env*', '*.env'].includes(l)) } catch { /* no .gitignore */ }
    add('perm', '.env', ignored ? 'pass' : 'fail', ignored ? 'ignored' : 'tracked?', ignored ? '.env is listed in .gitignore' : '.env exists but is not in .gitignore', ignored ? '' : 'Add .env to .gitignore and rotate any committed secret')
  }
  if (!posix) return
  const modeOf = (p) => fs.statSync(p).mode & 0o777
  const ssh = path.join(os.homedir(), '.ssh')
  if (exists(ssh)) { const m = modeOf(ssh); const ok = (m & 0o077) === 0; add('perm', '~/.ssh', ok ? 'pass' : 'fail', m.toString(8), ok ? 'Private to the current user' : 'Directory is too open; SSH expects 700', ok ? '' : 'chmod 700 ~/.ssh') }
  const npmrc = path.join(os.homedir(), '.npmrc')
  if (exists(npmrc)) { const m = modeOf(npmrc); const ok = (m & 0o077) === 0; add('perm', '~/.npmrc', ok ? 'pass' : 'warn', m.toString(8), ok ? 'Private to the current user' : 'May contain tokens but is readable by others', ok ? '' : 'chmod 600 ~/.npmrc') }
}

const summarize = (list) => {
  const n = (s) => list.filter((c) => c.status === s).length
  const total = list.length
  return { total, pass: n('pass'), warn: n('warn'), fail: n('fail'), score: total ? Math.round(((n('pass') + n('warn') * 0.5) / total) * 100) : 0 }
}
const LABEL = { runtime: 'Runtimes', port: 'Ports', dep: 'Dependencies', env: 'Environment', perm: 'Permissions' }
const MODULES = Object.keys(LABEL)
const line = (s) => `EnvDoctor report — health ${s.score}/100 · ${s.total} checks: ${s.pass} passed, ${s.warn} warnings, ${s.fail} failed.`

await runtimes(); await ports(); dependencies(process.cwd()); environment(); permissions(process.cwd())
const s = summarize(checks)
const report = {
  tool: 'EnvDoctor', version: pkg.version, mode: 'local diagnostics', generatedAt: new Date().toISOString(), summary: s,
  checks: checks.map(({ fix, ...c }) => (fix && c.status !== 'pass' ? { ...c, fix } : c)),
}

if (has('--json')) console.log(JSON.stringify(report, null, 2))
else if (has('--md')) {
  const esc = (t) => String(t).replace(/\|/g, '\\|')
  console.log(`# EnvDoctor Report\n\n> Mode: ${report.mode}\n\nGenerated: ${report.generatedAt}\n\n${line(s)}\n`)
  for (const m of MODULES) {
    const rows = report.checks.filter((c) => c.module === m)
    if (rows.length) console.log(`## ${m}\n\n| Status | Check | Value | Notes |\n|---|---|---|---|\n${rows.map((c) => `| ${c.status} | ${esc(c.name)} | ${esc(c.value)} | ${esc([c.detail, c.fix && `Fix: ${c.fix}`].filter(Boolean).join(' — '))} |`).join('\n')}\n`)
  }
} else {
  const color = process.stdout.isTTY && !process.env.NO_COLOR
  const paint = (code, t) => (color ? `\x1b[${code}m${t}\x1b[0m` : t)
  const icon = { pass: paint(32, '✔'), warn: paint(33, '!'), fail: paint(31, '✘') }
  console.log(paint(1, `EnvDoctor ${pkg.version}`) + ' — local diagnostics (read-only, offline)\n')
  for (const m of MODULES) {
    console.log(paint(1, LABEL[m]))
    for (const c of report.checks.filter((x) => x.module === m)) {
      console.log(`  ${icon[c.status]} ${c.name.padEnd(24)} ${String(c.value).padEnd(18)} ${paint(2, c.detail)}`)
      if (c.fix) console.log(`      ${paint(36, '→ ' + c.fix)}`)
    }
    console.log()
  }
  console.log(line(s))
}
process.exitCode = s.fail > 0 ? 1 : 0
