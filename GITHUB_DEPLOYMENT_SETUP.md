# GitHub Actions Deployment Setup

This workflow automatically builds and deploys the frontend to production when you push to the `main` branch.

## Workflow Flow

```
Local Dev (git push to main)
    ↓
GitHub Actions Build (npm run build)
    ↓
GitHub Actions Deploy (rsync to server)
    ↓
Production Server Live
```

## Setup Steps

### 1. Generate SSH Key for Deployment

```bash
# Create SSH key without passphrase
ssh-keygen -t ed25519 -C "github-deploy" -f deploy-key -N ""

# This creates:
# - deploy-key (private key)
# - deploy-key.pub (public key)
```

### 2. Add Public Key to Server

```bash
# Copy public key content
cat deploy-key.pub

# SSH into your server and add it to authorized_keys
ssh root@47.242.75.250
mkdir -p ~/.ssh
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 3. Add GitHub Secrets

Go to: **GitHub → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret | Value |
|--------|-------|
| `DEPLOY_HOST` | `47.242.75.250` |
| `DEPLOY_USER` | `root` |
| `DEPLOY_PATH` | `/var/www/gcss-website` |
| `SSH_PRIVATE_KEY` | (entire content of `deploy-key` file) |
| `NEXT_PUBLIC_API_URL` | `https://api.gcss.hk/api` |
| `NEXT_PUBLIC_SITE_URL` | `https://gcss.hk` |

### 4. Test Deployment

```bash
# Push to main branch to trigger workflow
git add .
git commit -m "feat: deployment setup"
git push origin main

# Watch deployment:
# GitHub → Actions → Build and Deploy to Production
```

## Monitoring Deployments

1. **GitHub Actions Logs**: See build/deploy progress in real-time
2. **Success**: Website updates at <https://gcss.hk> (or <http://47.242.75.250>)
3. **Failure**: Check logs for error messages

## Manual Trigger

Can also manually trigger without pushing:

- GitHub → Actions → Build and Deploy → Run workflow

## Troubleshooting

### "Permission denied (publickey)"

- Verify SSH key is in authorized_keys on server
- Check key permissions: `chmod 600 ~/.ssh/authorized_keys`

### Build fails

- Check Node version matches (20.x)
- Verify environment variables are set in Secrets
- Check npm dependencies: `npm ci --production=false`

### Deploy fails

- Verify DEPLOY_PATH exists on server
- Check disk space: `df -h`
- Verify rsync is installed on server

## Rollback

If deployment breaks the site:

```bash
# SSH into server
ssh root@47.242.75.250

# Go to deployment directory
cd /var/www/gcss-website

# Check existing files/backups
ls -la

# Restore from backup if available, or:
# - Revert commit in GitHub
# - Push again to re-deploy
```

## Next Steps

1. ✅ Create SSH key pair
2. ✅ Add public key to server  
3. ✅ Add GitHub secrets
4. ✅ Commit and push to main
5. ✅ Watch GitHub Actions run
6. ✅ Verify site updates

---

**From now on**: Just `git push origin main` and the site will auto-deploy! 🚀
