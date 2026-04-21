const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

/**
 * Next.js static export generates Flight data under folders like:
 *   out/en/about/__next.$d$locale/about.txt
 * But the client may request the dot-flattened form:
 *   /en/about/__next.$d$locale.about.txt
 *
 * This script creates dot-flattened copies alongside the folder form so
 * simple static servers (python http.server, etc.) don't 404 those requests.
 */

const LOCALE_DIR_NAME = '__next.$d$locale';

async function pathExists(p) {
    try {
        await fsp.access(p, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

async function* walkDirs(rootDir) {
    const entries = await fsp.readdir(rootDir, { withFileTypes: true });
    for (const ent of entries) {
        const full = path.join(rootDir, ent.name);
        if (ent.isDirectory()) {
            yield full;
            yield* walkDirs(full);
        }
    }
}

async function* walkFiles(rootDir) {
    const entries = await fsp.readdir(rootDir, { withFileTypes: true });
    for (const ent of entries) {
        const full = path.join(rootDir, ent.name);
        if (ent.isDirectory()) {
            yield* walkFiles(full);
        } else if (ent.isFile()) {
            yield full;
        }
    }
}

async function main() {
    const outDir = path.join(__dirname, '..', 'out');
    if (!(await pathExists(outDir))) {
        console.warn(`[patch-export] out/ not found at ${outDir}. Nothing to patch.`);
        return;
    }

    let copied = 0;
    let skipped = 0;

    for await (const dirPath of walkDirs(outDir)) {
        if (path.basename(dirPath) !== LOCALE_DIR_NAME) continue;

        const parentDir = path.dirname(dirPath);

        for await (const filePath of walkFiles(dirPath)) {
            if (!filePath.endsWith('.txt')) continue;

            const rel = path
                .relative(dirPath, filePath)
                .split(path.sep)
                .join('.');

            const destName = `${LOCALE_DIR_NAME}.${rel}`;
            const destPath = path.join(parentDir, destName);

            try {
                await fsp.copyFile(filePath, destPath, fs.constants.COPYFILE_EXCL);
                copied += 1;
            } catch (err) {
                // Already exists or can't copy.
                if (err && err.code === 'EEXIST') {
                    skipped += 1;
                    continue;
                }
                throw err;
            }
        }
    }

    console.log(`[patch-export] Created ${copied} dot-flattened Flight files (skipped ${skipped}).`);
}

main().catch((err) => {
    console.error('[patch-export] Failed:', err);
    process.exit(1);
});
