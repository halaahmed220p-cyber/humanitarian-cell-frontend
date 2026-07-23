import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      home: "الرئيسية",
      about: "من نحن",
      projects: "المشاريع",
      programs: "البرامج",
      newsAndReports: "الأخبار والتقارير",
      donateNow: "تبرع الآن",
      contactUs: "تواصل معنا",
      programNotFound: "البرنامج غير موجود",
      backToPrograms: "العودة للبرامج"
    }
  },
  en: {
    translation: {
      home: "Home",
      about: "About Us",
      projects: "Projects",
      programs: "Programs",
      newsAndReports: "News & Reports",
      donateNow: "Donate Now",
      contactUs: "Contact Us",
      programNotFound: "Program not found",
      backToPrograms: "Back to Programs"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    interpolation: { escapeValue: false }
  });

export default i18n;