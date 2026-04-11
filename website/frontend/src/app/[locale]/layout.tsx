import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from '@/providers/ThemeProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/layout/ScrollProgress';
import ScrollToTop from '@/components/ui/ScrollToTop';
import GlobalEffects from '@/components/effects/GlobalEffects';
import { routing } from '@/i18n/routing';
import '../globals.css';
import '../enhancements.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className="gcss-html"
      suppressHydrationWarning
    >
      <head>
        {/* External theme init — runs synchronously before body paint
            to prevent dark-mode FOUC. Intentionally an external src so
            React 19 / Next 16 don't flag it as an inline script. */}
        <script src="/theme-init.js" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ScrollProgress />
            <GlobalEffects />
            <Header />
            <main>{children}</main>
            <Footer />
            <ScrollToTop />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
