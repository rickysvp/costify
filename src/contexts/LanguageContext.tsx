import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getTranslation, type Language } from '../i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: ReturnType<typeof getTranslation>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 检测用户所在地区并返回默认语言
function detectDefaultLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  // 优先读取用户手动设置
  const savedLang = localStorage.getItem('anytokn-language') as Language;
  if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
    return savedLang;
  }
  
  // 获取浏览器语言
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  const langCode = browserLang.toLowerCase();
  
  // 中文地区：中国大陆、台湾、香港、澳门、新加坡
  const chineseRegions = ['zh-cn', 'zh-tw', 'zh-hk', 'zh-mo', 'zh-sg', 'zh'];
  
  // 检查是否为中文地区
  const isChineseRegion = chineseRegions.some(code => 
    langCode === code || langCode.startsWith(code + '-')
  );
  
  // 中文地区使用中文，其他地区使用英文
  return isChineseRegion ? 'zh' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 客户端初始化时检测语言
    const defaultLang = detectDefaultLanguage();
    setLangState(defaultLang);
    setIsInitialized(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('anytokn-language', newLang);
    }
  };

  const t = getTranslation(lang);

  // 防止闪烁，等待初始化完成
  if (!isInitialized) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
