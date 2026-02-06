// i18n configuration for next-intl
export const locales = ['en', 'ru'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

// Helper function to get messages
export async function getMessages(locale: Locale) {
  return (await import(`../../messages/${locale}.json`)).default;
}
