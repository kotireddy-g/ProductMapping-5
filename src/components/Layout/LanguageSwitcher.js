import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const toggleLanguage = () => {
        const newLanguage = currentLanguage === 'en' ? 'th' : 'en';
        i18n.changeLanguage(newLanguage);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-500 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            title={currentLanguage === 'en' ? 'Switch to Thai' : 'Switch to English'}
        >
            <Globe size={20} />
            <span className="font-medium">{currentLanguage === 'en' ? 'ไทย' : 'EN'}</span>
        </button>
    );
};

export default LanguageSwitcher;
