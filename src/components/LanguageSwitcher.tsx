import React from 'react';
import { useLanguage } from '../App';
import { useTranslations } from '../utils/translationUtils';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslations();

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
        title={t('languageSwitcher.english')}
      >
        🇺🇸 EN
      </button>
      <button
        className={`lang-btn ${currentLanguage === 'es' ? 'active' : ''}`}
        onClick={() => setLanguage('es')}
        title={t('languageSwitcher.spanish')}
      >
        🇪🇸 ES
      </button>
    </div>
  );
};

export default LanguageSwitcher; 