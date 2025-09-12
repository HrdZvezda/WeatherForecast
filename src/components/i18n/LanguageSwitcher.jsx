import React from 'react';
import { useI18n } from '../i18n/I18nContext';

const LanguageSwitcher = () => {
  const { currentLanguage, switchLanguage } = useI18n();

  const toggleLanguage = () => {
    switchLanguage(currentLanguage === 'en' ? 'zh' : 'en');
  };

  return (
    <button 
      className="language-switcher-btn"
      onClick={toggleLanguage}
      title="切換語言 / Switch Language"
    >
      <i className="fa-solid fa-globe"></i>
      <span className="lang-text">{currentLanguage.toUpperCase()}</span>
      
      <style jsx>{`
        .language-switcher-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          margin-right: 8px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .language-switcher-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .language-switcher-btn i {
          font-size: 14px;
        }
        
        @media (max-width: 820px) {
          .language-switcher-btn .lang-text {
            display: none; /* 在寬度小於 820px 時隱藏文字 */
          }
          .language-switcher-btn {
            padding: 6px 10px; /* 同時微調 padding，讓按鈕更緊湊 */
            gap: 0;
          }
        }
        @media (max-width: 450px) {
          .language-switcher-btn {
            padding: 6px 8px;
          }
        }
      `}</style>
    </button>
  );
};

export default LanguageSwitcher;