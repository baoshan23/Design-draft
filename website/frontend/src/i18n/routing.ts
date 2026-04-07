import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  // Our App Router structure is /[locale]/..., so locale prefixes are always present.
  localePrefix: 'always',
});
