import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import ta from './locales/ta/translation.json';
import hi from './locales/hi/translation.json';
import te from './locales/te/translation.json';

const getStoredLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const savedLanguage = window.localStorage.getItem('codearena-lang');
  return savedLanguage && ['en', 'ta', 'hi', 'te'].includes(savedLanguage) ? savedLanguage : 'en';
};

const resources = {
  en: { translation: en },
  ta: { translation: ta },
  hi: { translation: hi },
  te: { translation: te }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    supportedLngs: ['en', 'ta', 'hi', 'te'],
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
