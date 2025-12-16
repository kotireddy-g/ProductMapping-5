import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import th from './locales/th.json';

// Initialize i18next
i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: {
                translation: en
            },
            th: {
                translation: th
            }
        },
        lng: localStorage.getItem('language') || 'en', // default language
        fallbackLng: 'en', // fallback language if translation is missing
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;
