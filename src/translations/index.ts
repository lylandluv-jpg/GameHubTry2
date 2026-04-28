import { en } from './en';
import { hi } from './hi';
import type { TranslationKeys } from './en';

export type Locale = 'en' | 'hi';

export const translations: Record<Locale, TranslationKeys> = {
  en,
  hi,
};

// Helper to get nested value by path like 'dashboard.title'
function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : undefined;
}

export function translate(locale: Locale, key: string): string {
  const val = getNested(translations[locale] as unknown as Record<string, unknown>, key);
  if (val != null) return val;
  return getNested(translations.en as unknown as Record<string, unknown>, key) ?? key;
}

export { en, hi };
