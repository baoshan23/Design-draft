/**
 * GCSS Unified Deploy — builds and deploys both frontend + backend
 *
 * Usage:
 *   node deploy/deploy-all.js              # deploy both
 *   node deploy/deploy-all.js --frontend   # frontend only
 *   node deploy/deploy-all.js --backend    # backend only
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FRONTEND_DIR = path.join(ROOT, 'website', 'frontend');

const args = process.argv.slice(2);
const frontendOnly = args.includes('--frontend');
const backendOnly = args.includes('--backend');
const deployBoth = !frontendOnly && !backendOnly;

function run(label, command, cwd) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${label}`);
  console.log(`${'='.repeat(60)}\n`);
  try {
    execSync(command, { cwd, stdio: 'inherit', env: process.env });
  } catch (err) {
    console.error(`\n${label} FAILED`);
    process.exit(1);
  }
}

const startTime = Date.now();

if (deployBoth || frontendOnly) {
  run(
    'FRONTEND: Building static export...',
    'node scripts/build-export.js',
    FRONTEND_DIR
  );
  run(
    'FRONTEND: Deploying to server...',
    'node scripts/deploy.js',
    FRONTEND_DIR
  );
}

if (deployBoth || backendOnly) {
  run(
    'BACKEND: Compiling + deploying...',
    'node deploy/deploy-backend.js',
    ROOT
  );
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n${'='.repeat(60)}`);
console.log(`  All done in ${elapsed}s`);
console.log(`${'='.repeat(60)}\n`);
