// Language context: locale (en | hi) and t(key) for app and in-game strings

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Locale, translate } from '../translations';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const t = useCallback((key: string) => translate(locale, key), [locale]);
  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (ctx === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
