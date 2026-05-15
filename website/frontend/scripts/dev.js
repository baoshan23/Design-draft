#!/usr/bin/env node
// Launches `next dev` with variables from .env.local pre-applied to the
// process env so settings like PORT (which Next reads before loading
// .env files) take effect. Missing .env.local is a no-op, keeping
// behaviour identical for anyone without a local override.

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (val.length >= 2 && ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

const next = path.resolve(__dirname, '..', 'node_modules', '.bin', 'next');
const child = spawn(next, ['dev', ...process.argv.slice(2)], { stdio: 'inherit', env: process.env });
child.on('exit', code => process.exit(code ?? 0));
