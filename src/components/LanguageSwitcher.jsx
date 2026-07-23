import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  // تغيير اتجاه الصفحة (RTL / LTR) تلقائياً بناءً على اللغة المختارة
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <button 
      onClick={toggleLanguage}
      className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition text-sm font-medium flex items-center gap-1.5 shadow-sm"
    >
      🌐 {i18n.language === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}