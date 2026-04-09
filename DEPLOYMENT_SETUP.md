# GitHub Actions Deployment Setup

## Current State

✅ Code committed and pushed to GitHub (commit 293030a)
✅ Build process working (all 26 pages prerendered)
✅ GitHub Actions workflow configured in `.github/workflows/deploy.yml`

## Required GitHub Repository Secrets

To enable automatic deployment via GitHub Actions, configure these secrets in your repository:

**Settings → Secrets and variables → Actions**

### Secrets to Add

1. **SSH_KEY** (Private SSH key)
   - Used for SSH authentication to deploy server
   - For server 47.242.75.250 as root user
   - Format: Private key content (typically from ~/.ssh/id_rsa or similar)

2. **CI_HOST**
   - Value: `47.242.75.250`
   - The production server IP address

3. **CI_USER**
   - Value: `root`
   - SSH username for server authentication

4. **CI_PATH**
   - Value: `/var/www/gcss-website`
   - Remote deployment directory on server

5. **NEXT_PUBLIC_SITE_URL** (Environment variable)
   - Value: `https://gcss-website.com` (or your actual domain)
   - Used in build and for deployment notifications

## Deployment Flow

Once secrets are configured:

1. GitHub Actions automatically triggers on push to main
2. Builds the Next.js project (all 26 pages)
3. Deploys via rsync using SSH to production server
4. Sends deployment status notification

## How to Set Secrets

### Via GitHub Web UI

1. Go to repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret with name and value above

### Via GitHub CLI

```bash
gh secret set SSH_KEY
gh secret set CI_HOST -b "47.242.75.250"
gh secret set CI_USER -b "root"
gh secret set CI_PATH -b "/var/www/gcss-website"
gh secret set NEXT_PUBLIC_SITE_URL -b "https://your-domain.com"
```

## Test the Deployment

After configuring secrets:

1. Make a test commit to main: `git push origin main`
2. Go to repository → Actions tab
3. Monitor the "Build and Deploy to Production" workflow
4. Check deployment status and logs

## Features Deployed

- **B2C Model Documentation**: Direct operator ecosystem with transaction flows
- **B2B Model Documentation**: Platform/franchise ecosystem with revenue sharing
- **Business Diagram Modal**: Interactive visualization with detailed explanations
- **Multilingual Support**: English and Chinese translations included
- **Responsive Design**: Works on all screen sizes
