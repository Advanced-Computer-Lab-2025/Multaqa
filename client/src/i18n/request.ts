import { getRequestConfig } from 'next-intl/server';

const DEFAULT_LOCALE = 'en';

export default getRequestConfig(async () => {
  // Keep it simple: default to English. Middleware will redirect requests without locale to include it.
  const locale = DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default
  };
});