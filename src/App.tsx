import { useState } from 'react';
import { SWRProvider } from './components/SWRProvider';
import TarotCardReader from './components/TarotCardReader';
import DeckPage from './components/DeckPage';
import TutorialPage from './components/TutorialPage';
import './App.css';

type AppPage = 'drawer' | 'deck' | 'tutorial';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('drawer');

  return (
    <SWRProvider>
      <div className="App">
        <header className="App-header">
          <h1>🔮 Tarot Deck Reader</h1>
          <p>Your mystical journey into tarot begins here</p>
          
          <nav className="app-navigation">
            <button 
              className={`nav-btn ${currentPage === 'drawer' ? 'active' : ''}`}
              onClick={() => setCurrentPage('drawer')}
            >
              🎲 Card Reader
            </button>
            <button 
              className={`nav-btn ${currentPage === 'deck' ? 'active' : ''}`}
              onClick={() => setCurrentPage('deck')}
            >
              🎴 Deck
            </button>
            <button 
              className={`nav-btn ${currentPage === 'tutorial' ? 'active' : ''}`}
              onClick={() => setCurrentPage('tutorial')}
            >
              📚 Tutorial
            </button>
          </nav>
        </header>
        
        <main className="App-main">
          {currentPage === 'drawer' ? (
            <TarotCardReader />
          ) : currentPage === 'deck' ? (
            <DeckPage />
          ) : (
            <TutorialPage />
          )}
        </main>
      </div>
    </SWRProvider>
  );
}

export default App;
