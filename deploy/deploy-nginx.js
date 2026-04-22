/**
 * Push the v3.gcss.hk nginx config to the server and reload.
 *
 * Usage:
 *   SFTP_PASSWORD='xxx' node deploy/deploy-nginx.js
 */

const path = require('path');
const fs = require('fs');

const frontendModules = path.resolve(__dirname, '..', 'website', 'frontend', 'node_modules');
const { Client } = require(path.resolve(frontendModules, 'ssh2'));
const SftpClient = require(path.resolve(frontendModules, 'ssh2-sftp-client'));

function loadEnvFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (!key) continue;
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch { /* ignore */ }
}
loadEnvFile(path.join(__dirname, '..', 'website', 'frontend', '.env.local'));
loadEnvFile(path.join(__dirname, '..', 'website', 'frontend', '.env'));
loadEnvFile(path.join(__dirname, '.env'));

const sftpConfig = {
  host: process.env.SFTP_HOST || '47.242.75.250',
  port: parseInt(process.env.SFTP_PORT || '22'),
  username: process.env.SFTP_USER || 'root',
  password: process.env.SFTP_PASSWORD,
};

const LOCAL_CONF = path.join(__dirname, 'nginx', 'v3.gcss.hk.conf').replace(/\\/g, '/');
// CentOS/RHEL nginx layout — drop into conf.d (auto-included by nginx.conf).
const REMOTE_CONF = '/etc/nginx/conf.d/v3.gcss.hk.conf';

function runSSHCommand(command) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let output = '';
    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) { conn.end(); return reject(err); }
        stream.on('data', (d) => { output += d.toString(); });
        stream.stderr.on('data', (d) => { output += d.toString(); });
        stream.on('close', (code) => {
          conn.end();
          if (code === 0) resolve(output.trim());
          else reject(new Error(`Command failed (exit ${code}): ${output.trim()}`));
        });
      });
    });
    conn.on('error', reject);
    conn.connect(sftpConfig);
  });
}

async function main() {
  if (!sftpConfig.password) {
    console.error('Error: SFTP_PASSWORD not set.');
    process.exit(1);
  }

  console.log('Step 1/3: Uploading nginx config...');
  const sftp = new SftpClient();
  try {
    await sftp.connect(sftpConfig);
    const buf = fs.readFileSync(LOCAL_CONF);
    await sftp.put(buf, REMOTE_CONF);
    console.log('  Uploaded ' + REMOTE_CONF + ' (' + buf.length + ' bytes)');
  } finally {
    await sftp.end().catch(() => {});
  }

  console.log('Step 2/3: Validating nginx config...');
  const testOut = await runSSHCommand('nginx -t 2>&1');
  console.log('  ' + testOut.split('\n').join('\n  '));

  console.log('Step 3/3: Reloading nginx...');
  await runSSHCommand('nginx -s reload');

  console.log('\nnginx config deployed successfully.');
}

main().catch((err) => {
  console.error('Deploy failed:', err.message);
  process.exit(1);
});
