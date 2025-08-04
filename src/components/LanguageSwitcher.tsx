import React from 'react';
import { useLanguage } from '../App';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
        title="English"
      >
        🇺🇸 EN
      </button>
      <button
        className={`lang-btn ${currentLanguage === 'es' ? 'active' : ''}`}
        onClick={() => setLanguage('es')}
        title="Español"
      >
        🇪🇸 ES
      </button>
    </div>
  );
};

export default LanguageSwitcher; 