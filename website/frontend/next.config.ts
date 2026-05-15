import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const shouldExport = process.env.GCSS_EXPORT === '1';

const nextConfig: NextConfig = {
  // Static export is opt-in because Windows/OneDrive can lock the output folder (out/)
  // and cause non-deploy builds to fail with EBUSY.
  output: shouldExport ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Allow HMR WebSocket when loading dev server over LAN IP (Next 16)
  allowedDevOrigins: ['192.168.0.157', '*.local', '*.claude.by'],
};

export default withNextIntl(nextConfig);
