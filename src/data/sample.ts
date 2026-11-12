import type { Check, ModuleId, Status } from '../types'

const c = (
  mod: ModuleId, name: string, status: Status, value: string, detail: string,
  fix = '', meta: [string, string][] = [],
): Check => ({ id: `${mod}:${name}`, mod, name, status, value, detail, fix, meta })

/** Fictional demonstration data. Contains no real secrets or system information. */
export function sampleChecks(): Check[] {
  return [
    c('runtime', 'Node.js', 'pass', 'v20.11.1', 'LTS release; satisfies engines >=18'),
    c('runtime', 'npm', 'pass', '10.2.4', 'No stale cache or proxy flags detected'),
    c('runtime', 'Python', 'pass', '3.11.7', 'Default interpreter on PATH'),
    c('runtime', 'pip', 'warn', '23.0.1', 'A newer pip (24.x) is available', 'python -m pip install --upgrade pip'),
    c('runtime', 'Java', 'pass', '17.0.9', 'JAVA_HOME matches the active JDK'),
    c('runtime', 'PHP', 'fail', '7.4.33', 'End-of-life release; project requires >=8.1', 'Install PHP 8.2 with your package manager and update PATH'),
    c('runtime', 'Git', 'pass', '2.43.0', 'user.name and user.email are configured'),
    c('runtime', 'Docker', 'warn', '24.0.7', 'CLI found but the daemon is not responding', 'Start Docker Desktop, or run: sudo systemctl start docker'),

    c('port', 'React dev server', 'fail', ':3000', 'Held by a node process that is not this project', 'Stop it with: kill 14231 — or run the app on another port (PORT=3001)', [['process', 'node'], ['PID', '14231']]),
    c('port', 'Vite', 'pass', ':5173', 'Free'),
    c('port', 'Tomcat', 'warn', ':8080', 'In use by java; fine if intentional', 'Confirm you need it, otherwise stop the service', [['process', 'java'], ['PID', '9922']]),
    c('port', 'PostgreSQL', 'pass', ':5432', 'Listening as expected', '', [['process', 'postgres'], ['PID', '1180']]),
    c('port', 'MySQL', 'pass', ':3306', 'Free'),
    c('port', 'Redis', 'warn', ':6379', 'Bound to 0.0.0.0 instead of localhost only', 'Set bind 127.0.0.1 in redis.conf and restart', [['process', 'redis-server'], ['PID', '2210']]),
    c('port', 'Django runserver', 'fail', ':8000', 'A stale runserver process still holds the port', 'Stop it with: kill 20417', [['process', 'python'], ['PID', '20417']]),
    c('port', 'MongoDB', 'pass', ':27017', 'Free'),
    c('port', 'Angular CLI', 'pass', ':4200', 'Free'),

    c('dep', 'react', 'pass', '18.3.1', 'Up to date'),
    c('dep', 'typescript', 'pass', '5.4.5', 'Up to date'),
    c('dep', 'tailwindcss', 'pass', '3.4.1', 'Patch update available, not required', '', [['latest', '3.4.17']]),
    c('dep', 'eslint', 'pass', '8.57.0', 'Matches lockfile'),
    c('dep', 'lodash', 'warn', '4.17.15', 'Outdated: a newer patch release exists', 'npm update lodash', [['latest', '4.17.21']]),
    c('dep', 'axios', 'fail', '0.21.1', 'Several major versions behind', 'npm install axios@latest, then review the changelog', [['latest', '1.x']]),
    c('dep', 'webpack', 'warn', '5.90.1 + 4.46.0', 'Duplicate: two versions in the tree (via legacy-loader)', 'Run npm dedupe or upgrade legacy-loader'),
    c('dep', 'moment', 'warn', '2.29.4', 'Maintenance-mode library; heavy for most uses', 'Plan a migration to a lighter date library'),

    c('env', 'NODE_ENV', 'warn', 'production', 'Set to production on a development machine', 'Unset it or export NODE_ENV=development'),
    c('env', 'DATABASE_URL', 'pass', 'postgres://app:••••@localhost:5432/app', 'Credentials masked; points to localhost'),
    c('env', 'API_SECRET', 'fail', '•••••••••••••••• (16 chars)', 'Defined in a .env file that is not listed in .gitignore', 'Add .env to .gitignore and rotate the secret', [['masked', 'yes']]),
    c('env', 'JWT_SECRET', 'warn', '•••••••• (8 chars)', 'Short value; looks like a default placeholder', 'Generate a random value of 32+ characters', [['masked', 'yes']]),
    c('env', 'DEBUG', 'warn', '*', 'Wildcard debug logging can leak request data', 'Scope it, e.g. DEBUG=app:*'),
    c('env', 'PATH', 'pass', '14 entries', 'No duplicate or missing directories'),

    c('perm', '~/projects/app', 'pass', 'rwx', 'Read, write and execute for the current user'),
    c('perm', './node_modules', 'pass', 'rwx', 'Writable'),
    c('perm', '/usr/local/lib/node_modules', 'warn', 'r-x', 'Not writable; global installs would need elevation', 'Point the npm prefix at a user-owned directory'),
    c('perm', './.env.local', 'fail', 'missing', 'Referenced by config but not found', 'cp .env.example .env.local'),
    c('perm', '~/.ssh', 'fail', '755', 'Directory is too open; SSH expects 700', 'chmod 700 ~/.ssh'),
    c('perm', './dist', 'warn', 'missing', 'Output directory does not exist yet', 'Run the build, or: mkdir dist'),
    c('perm', '~/.npmrc', 'pass', '600', 'Private to the current user'),
  ]
}
