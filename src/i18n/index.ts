import i18n from 'i18next';
import { EN } from './EN/index';
import { ES } from './ES/index';

const resources = {
  en: {
    translation: { ...EN }
  },
  es: {
    translation: { ...ES }
  }
};

const fallbackLng = localStorage.getItem('language') || 'es';

i18n.init({
  resources,
  fallbackLng,
  debug: false,
  interpolation: {
    escapeValue: false
  }
});


export default i18n;