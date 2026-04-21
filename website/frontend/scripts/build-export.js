const path = require('path');
const { spawnSync } = require('child_process');

// Runs `next build` with output: 'export' enabled via env.
// We keep export opt-in to avoid Windows/OneDrive EBUSY issues during normal `npm run build`.

const nextCmd = process.platform === 'win32' ? 'next.cmd' : 'next';
const nextBin = path.join(__dirname, '..', 'node_modules', '.bin', nextCmd);

const res = spawnSync(nextBin, ['build'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
        ...process.env,
        GCSS_EXPORT: '1',
        NODE_ENV: 'production',
    },
});

if (res.error) {
    // eslint-disable-next-line no-console
    console.error('Failed to run Next.js build:', res.error);
}

if ((res.status ?? 1) === 0) {
    const patchScript = path.join(__dirname, 'patch-export-flight-files.js');
    const patchRes = spawnSync(process.execPath, [patchScript], {
        stdio: 'inherit',
    });
    if (patchRes.error) {
        // eslint-disable-next-line no-console
        console.error('Failed to patch exported Flight files:', patchRes.error);
        process.exit(patchRes.status ?? 1);
    }
    process.exit(patchRes.status ?? 0);
}

process.exit(res.status ?? 1);
