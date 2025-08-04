import { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { SWRProvider } from './components/SWRProvider'
import HomePage from './pages/home'
import TarotCardReader from './pages/reader'
import DeckPage from './pages/deck'
import TutorialPage from './pages/tutorial'
import AdminPage from './pages/admin'
import LanguageSwitcher from './components/LanguageSwitcher'
import { useTranslations } from './utils/translationUtils'
import { usePageTitle } from './utils/pageTitleUtils'
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
  const { t } = useTranslations();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: t('navigation.home') },
    { path: '/reader', label: t('navigation.drawCards') },
    { path: '/deck', label: t('navigation.viewDeck') },
    { path: '/tutorial', label: t('navigation.tutorial') },
    { path: '/admin', label: t('navigation.admin') }
  ];

  const currentPage = navItems.find(item => item.path === location.pathname)?.label || t('navigation.home');

  return (
    <nav className="app-navigation">
      {/* Desktop Navigation */}
      <div className="nav-desktop">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`nav-btn ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Dropdown Navigation */}
      <div className="nav-mobile">
        <button 
          className="nav-dropdown-toggle"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
        >
          <span className="nav-dropdown-label">{currentPage}</span>
          <span className={`nav-dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
        </button>
        
        {isDropdownOpen && (
          <div className="nav-dropdown-menu">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`nav-dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const { t } = useTranslations();
  const { updatePageTitle } = usePageTitle();

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  // Update page title when language changes
  useEffect(() => {
    updatePageTitle();
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      <SWRProvider>
        <Router>
          <div className="App">
            <header className="App-header">
              <div className="header-top">
                <h1>{t('header.title')}</h1>
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
