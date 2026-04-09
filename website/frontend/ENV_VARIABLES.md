# Environment Variables Documentation

## Development (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.gcss.hk/api
NEXT_PUBLIC_SITE_URL=https://gcss.hk
```

## Deployment & Scripts

### SFTP Deployment (deploy.js)

```env
# SFTP Server credentials - REQUIRED for deploy.js
SFTP_HOST=47.242.75.250
SFTP_PORT=22
SFTP_USER=root
SFTP_PASSWORD=<your-secure-password-here>
```

### SSH Server Setup (setup-server.js)

```env
# SSH Server credentials - REQUIRED for setup-server.js
SSH_HOST=47.242.75.250
SSH_PORT=22
SSH_USER=root
SSH_PASSWORD=<your-secure-password-here>
```

## Security Best Practices

⚠️ **IMPORTANT**: Never commit `.env.local` or credentials to version control!

### Setting up credentials securely

1. **Local Development**: Create `.env.local` in `frontend/` with your credentials
2. **CI/CD**: Use GitHub Secrets or your CI provider's secret management
3. **Production**: Use environment variable services (e.g., AWS Secrets Manager, Vercel Environment Variables)

### Example for GitHub Actions: Add secrets and reference in workflow

```yaml
- name: Deploy
  env:
    SFTP_PASSWORD: ${{ secrets.SFTP_PASSWORD }}
    SSH_PASSWORD: ${{ secrets.SSH_PASSWORD }}
  run: npm run deploy
```

### Example using direnv (local development)

```bash
# Create .envrc in project root
export SFTP_PASSWORD="your-password"
export SSH_PASSWORD="your-password"

# Activate with: direnv allow
```
