import { useState, useEffect, useCallback } from 'react';
import type { Language } from '@/types';

const LANG_KEY = 'ai-news-language';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANG_KEY) as Language;
      if (saved) return saved;
    }
    return 'zh';
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language);
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  }, []);

  const setLang = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  return { language, toggleLanguage, setLang };
}
