import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import sw from './locales/sw.json';
import luo from './locales/luo.json';
import ki from './locales/ki.json';
import tuv from './locales/tuv.json';
import kln from './locales/kln.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sw: { translation: sw },
      luo: { translation: luo },
      ki: { translation: ki },
      tuv: { translation: tuv },
      kln: { translation: kln },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
