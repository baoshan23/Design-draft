# 🚀 GitHub Deployment Quick Start

## The New Workflow

```
You (git push) → GitHub → Auto Build → Auto Deploy → Live Site ✅
```

## 3 Quick Steps to Enable Auto-Deploy

### Step 1️⃣: Generate SSH Key

```powershell
# Run locally on your computer
ssh-keygen -t ed25519 -C "github-deploy" -f deploy-key -N ""

# Output: deploy-key (private) and deploy-key.pub (public)
```

### Step 2️⃣: Add Public Key to Server

```bash
ssh root@47.242.75.250
cat >> ~/.ssh/authorized_keys
# Paste content of deploy-key.pub
# Press Ctrl+D
chmod 600 ~/.ssh/authorized_keys
```

### Step 3️⃣: Add GitHub Secrets

1. Go to: **GitHub repo → Settings → Secrets and variables → Actions**
2. Create these 6 secrets:
   - `DEPLOY_HOST` = `47.242.75.250`
   - `DEPLOY_USER` = `root`
   - `DEPLOY_PATH` = `/var/www/gcss-website`
   - `SSH_PRIVATE_KEY` = (entire content of `deploy-key` file)
   - `NEXT_PUBLIC_API_URL` = `https://api.gcss.hk/api`
   - `NEXT_PUBLIC_SITE_URL` = `https://gcss.hk`

## Done! Now Every Push Auto-Deploys

```bash
# Just do normal git workflow
git add .
git commit -m "your message"
git push origin main

# Watch it deploy: GitHub Actions tab
```

## That's It! 🎉

No more manual SFTP, just push to GitHub and the site updates automatically!
