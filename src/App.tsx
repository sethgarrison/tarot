import { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SWRProvider } from './components/SWRProvider'
import DeckPage from './pages/deck'
import LanguageSwitcher from './components/LanguageSwitcher'
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
              <LanguageSwitcher />
            </header>
            <div className="brand-stripe" aria-hidden="true" />

            <main className="App-main">
              <Routes>
                <Route path="/" element={<DeckPage />} />
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
