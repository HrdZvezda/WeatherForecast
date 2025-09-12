import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './Translation.jsx';

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  // 偵測瀏覽器語言
  const detectBrowserLanguage = () => {
    const browserLang = navigator.language || navigator.languages[0] || 'en';
    if (browserLang.startsWith('zh')) return 'zh';
    return 'en';
  };

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // 優先讀取 localStorage，然後偵測瀏覽器語言
    const saved = localStorage.getItem('weather-app-language');
    return saved || detectBrowserLanguage();
  });

  // 持久化語言設置
  useEffect(() => {
    localStorage.setItem('weather-app-language', currentLanguage);
    // 同時設置 document 的 lang 屬性
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  // 翻譯函數 - 支持模板插值
  const t = (key, params = {}, defaultValue = '') => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    let result = value || defaultValue || key;
    
    // 支持 {{key}} 模板插值
    if (typeof result === 'string' && Object.keys(params).length > 0) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g');
        result = result.replace(regex, params[paramKey]);
      });
    }
    
    return result;
  };

  // 新增：天氣描述翻譯函數
  const translateWeather = (englishDesc) => {
    if (!englishDesc) return '';
    
    const lowerDesc = englishDesc.toLowerCase().trim();
    const translated = translations[currentLanguage]?.weather?.[lowerDesc];
    
    if (translated) {
      return translated;
    }
    
    // 兜底機制：如果找不到翻譯，記錄並返回原文
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing weather translation for: "${lowerDesc}"`);
    }
    
    // 對於英文，返回首字母大寫的原文
    // 對於中文，也返回原文（用戶至少看得到內容）
    return englishDesc;
  };

  // 切換語言
  const switchLanguage = (lang) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
    }
  };

  // 格式化日期時間
  const formatDateTime = (date, options = {}) => {
    const locale = currentLanguage === 'zh' ? 'zh-TW' : 'en-US';
    return new Intl.DateTimeFormat(locale, options).format(date);
  };

  // 取得當前語言的星期幾
  const getWeekday = (dayIndex, format = 'long') => {
    return t(`weekdays.${format}`)[dayIndex] || '';
  };

  // 修改：始終返回英文（因為 API 請求都用英文了）
  const getApiLanguage = () => {
    return 'en'; 
  };

  return (
    <I18nContext.Provider value={{
      currentLanguage,
      switchLanguage,
      t,
      translateWeather, // 新增天氣翻譯函數
      formatDateTime,
      getWeekday,
      getApiLanguage,
      availableLanguages: Object.keys(translations)
    }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};