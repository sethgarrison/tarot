import { useState, createContext, useContext } from 'react'
import { SWRProvider } from './components/SWRProvider'
import TarotCardReader from './components/TarotCardReader'
import DeckPage from './components/DeckPage'
import TutorialPage from './components/TutorialPage'
import AdminPage from './components/AdminPage'
import LanguageSwitcher from './components/LanguageSwitcher'
import './App.css'
import './utils/languageUtils.css'

type AppPage = 'drawer' | 'deck' | 'tutorial' | 'admin';

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

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('drawer');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      <SWRProvider>
        <div className="App">
          <header className="App-header">
            <div className="header-top">
              <h1>🔮 Tarot Deck Reader</h1>
              <LanguageSwitcher />
            </div>
            <p>Your mystical journey into tarot begins here</p>
            
            <nav className="app-navigation">
              <button 
                className={`nav-btn ${currentPage === 'drawer' ? 'active' : ''}`}
                onClick={() => setCurrentPage('drawer')}
              >
                🎴 Draw Cards
              </button>
              <button 
                className={`nav-btn ${currentPage === 'deck' ? 'active' : ''}`}
                onClick={() => setCurrentPage('deck')}
              >
                📚 View Deck
              </button>
              <button 
                className={`nav-btn ${currentPage === 'tutorial' ? 'active' : ''}`}
                onClick={() => setCurrentPage('tutorial')}
              >
                📖 Tutorial
              </button>
              <button 
                className={`nav-btn ${currentPage === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentPage('admin')}
              >
                🔧 Admin
              </button>
            </nav>
          </header>

          <main className="App-main">
            {currentPage === 'drawer' && <TarotCardReader />}
            {currentPage === 'deck' && <DeckPage />}
            {currentPage === 'tutorial' && <TutorialPage />}
            {currentPage === 'admin' && <AdminPage />}
          </main>
        </div>
      </SWRProvider>
    </LanguageContext.Provider>
  );
}

export default App;
