import { createContext, useContext, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { SWRProvider } from './components/SWRProvider'
import HomePage from './pages/home'
import TarotCardReader from './pages/reader'
import DeckPage from './pages/deck'
import TutorialPage from './pages/tutorial'
import AdminPage from './pages/admin'
import LanguageSwitcher from './components/LanguageSwitcher'
import './App.css'
import './utils/languageUtils.css'

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

// Navigation component
function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="app-navigation">
      <Link 
        to="/"
        className={`nav-btn ${isActive('/') ? 'active' : ''}`}
      >
        Home
      </Link>
      <Link 
        to="/reader"
        className={`nav-btn ${isActive('/reader') ? 'active' : ''}`}
      >
        Draw Cards
      </Link>
      <Link 
        to="/deck"
        className={`nav-btn ${isActive('/deck') ? 'active' : ''}`}
      >
        View Deck
      </Link>
      <Link 
        to="/tutorial"
        className={`nav-btn ${isActive('/tutorial') ? 'active' : ''}`}
      >
        Tutorial
      </Link>
      <Link 
        to="/admin"
        className={`nav-btn ${isActive('/admin') ? 'active' : ''}`}
      >
        Admin
      </Link>
    </nav>
  );
}

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      <SWRProvider>
        <Router>
          <div className="App">
            <header className="App-header">
              <div className="header-top">
                <h1>Tarot Deck Reader</h1>
                <LanguageSwitcher />
              </div>
              <Navigation />
            </header>

            <main className="App-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/reader" element={<TarotCardReader />} />
                <Route path="/deck" element={<DeckPage />} />
                <Route path="/tutorial" element={<TutorialPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </SWRProvider>
    </LanguageContext.Provider>
  );
}

export default App;
