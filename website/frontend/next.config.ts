import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: isProduction ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

export default withNextIntl(nextConfig);
