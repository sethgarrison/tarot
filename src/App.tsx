import { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { SWRProvider } from './components/SWRProvider'
import DeckPage from './pages/deck'
import ReadingPage from './pages/reading'
import MinorArcanaPage from './pages/minor'
import LanguageSwitcher from './components/LanguageSwitcher'
import DeckSwitcher from './components/DeckSwitcher'
import { useTranslations } from './utils/translationUtils'
import { DEFAULT_DECK, loadSavedDeck, saveDeck } from './utils/imageUtils'
import type { DeckId } from './utils/imageUtils'
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

// Global deck context
interface DeckContextType {
  deck: DeckId;
  setDeck: (deck: DeckId) => void;
}

export const DeckContext = createContext<DeckContextType>({
  deck: DEFAULT_DECK,
  setDeck: () => {},
});

export const useDeck = () => useContext(DeckContext);

const HEADER_TITLE = 'Sissy Señor';

function Navigation() {
  const { t } = useTranslations();

  return (
    <nav className="app-navigation">
      <NavLink to="/" end className="nav-link">{t('navigation.deck')}</NavLink>
      <NavLink to="/minor-arcana" className="nav-link">{t('navigation.minor')}</NavLink>
      <NavLink to="/reading" className="nav-link">{t('navigation.reading')}</NavLink>
    </nav>
  );
}

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [deck, setDeckState] = useState<DeckId>(loadSavedDeck);

  const setDeck = (next: DeckId) => {
    setDeckState(next);
    saveDeck(next);
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage: setCurrentLanguage }}>
      <DeckContext.Provider value={{ deck, setDeck }}>
        <SWRProvider>
          <Router>
            <div className="App">
              <header className="App-header">
                <h1>{HEADER_TITLE} <span className="header-accent">Tarot</span></h1>
                <div className="header-controls">
                  <Navigation />
                  <DeckSwitcher />
                  <LanguageSwitcher />
                </div>
              </header>

              <main className="App-main">
                <Routes>
                  <Route path="/" element={<DeckPage />} />
                  <Route path="/minor-arcana" element={<MinorArcanaPage />} />
                  <Route path="/reading" element={<ReadingPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </Router>
        </SWRProvider>
      </DeckContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;
