import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all regions that are supported
  locales: ['en', 'ar', 'de'],
  // Used when no locale matches - Global English is now default
  defaultLocale: 'en',
  // Always show locale prefix in URL
  localePrefix: 'always'
});