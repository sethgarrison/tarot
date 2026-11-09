import { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { SWRProvider } from './components/SWRProvider'
import DeckPage from './pages/deck'
import ReadingPage from './pages/reading'
import LanguageSwitcher from './components/LanguageSwitcher'
import { useTranslations } from './utils/translationUtils'
import './App.css'

// Global language context
export type Language = 'en' | 'es';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

const HEADER_TITLE = 'Sissy Señor';

function Navigation() {
  const { t } = useTranslations();

  return (
    <nav className="app-navigation">
      <NavLink to="/" end className="nav-link">{t('navigation.deck')}</NavLink>
      <NavLink to="/reading" className="nav-link">{t('navigation.reading')}</NavLink>
    </nav>
  );
}

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage: setCurrentLanguage }}>
      <SWRProvider>
        <Router>
          <div className="App">
            <header className="App-header">
              <h1>{HEADER_TITLE} <span className="header-accent">Tarot</span></h1>
              <div className="header-controls">
                <Navigation />
                <LanguageSwitcher />
              </div>
            </header>
            <div className="brand-stripe" aria-hidden="true" />

            <main className="App-main">
              <Routes>
                <Route path="/" element={<DeckPage />} />
                <Route path="/reading" element={<ReadingPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </SWRProvider>
    </LanguageContext.Provider>
  );
}

export default App;
