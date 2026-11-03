import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import mr from './mr.json';
import hi from './hi.json';
import en from './en.json';

const savedLanguage = localStorage.getItem('parijat_lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    mr: { translation: mr },
    hi: { translation: hi },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
