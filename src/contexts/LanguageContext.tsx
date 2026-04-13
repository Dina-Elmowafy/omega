import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "HOME",
    services: "SERVICES",
    about: "WHO WE ARE",
    news: "NEWS",
    contact: "CONTACT",
    portal: "PORTAL",
    login: "Login",
    logout: "Logout",
    ourServices: "Our Services",
    readMore: "Read More",
    contactUs: "Contact Us",
    getInTouch: "Get In Touch",
    address: "Address",
    phone: "Phone",
    email: "Email",
    sendMsg: "Send Message",
    nameLabel: "Your Name",
    emailLabel: "Your Email",
    msgLabel: "Your Message"
  },
  ar: {
    home: "الرئيسية",
    services: "الخدمات",
    about: "من نحن",
    news: "الأخبار",
    contact: "تواصل معنا",
    portal: "البوابة",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    ourServices: "خدماتنا",
    readMore: "اقرأ المزيد",
    contactUs: "تواصل معنا",
    getInTouch: "ابقى على تواصل",
    address: "العنوان",
    phone: "رقم الهاتف",
    email: "البريد الإلكتروني",
    sendMsg: "إرسال رسالة",
    nameLabel: "الاسم",
    emailLabel: "البريد الإلكتروني",
    msgLabel: "الرسالة"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    root.lang = language;
    localStorage.setItem('lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};