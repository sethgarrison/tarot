import React, { useState } from 'react';
import { useRandomCard } from '../hooks/useTarotAPI';
import { useLanguage } from '../App';
import TarotCardComponent from './TarotCard';

import './TarotCardReader.css';

// Translations object
const translations = {
  en: {
    welcome: 'Welcome to Your Tarot Reading',
    instruction: 'Take a moment to center yourself and focus on your question or intention. When you\'re ready, draw a card to receive guidance from the universe.',
    readingTips: 'Reading Tips',
    tip1: 'Focus on a specific question or area of your life',
    tip2: 'Take deep breaths and clear your mind',
    tip3: 'Trust your intuition when interpreting the card',
    tip4: 'Remember, tarot offers guidance, not prediction',
    drawCard: '🎲 Draw a Card',
    drawing: 'Drawing...',
    yourReading: 'Your Tarot Reading',
    readingSubtitle: 'The universe has chosen this card for you. Take time to reflect on its meaning.',
    shuffling: 'Shuffling the deck...',
    revealing: 'Revealing your card...',
    drawAnother: '🔄 Draw Another Card',
    howToInterpret: 'How to Interpret Your Card',
    uprightMeaning: 'Upright Meaning',
    uprightDescription: 'The card\'s natural energy and positive expression',
    reversedMeaning: 'Reversed Meaning',
    reversedDescription: 'Blocked energy or alternative interpretations',
    personalConnection: 'Personal Connection',
    personalDescription: 'How does this card relate to your question?',
    intuition: 'Intuition',
    intuitionDescription: 'Trust your first impressions and feelings',
    noCard: 'No card was drawn. Please try again.',
    drawAgain: 'Draw Again',
    mysticalInterference: 'Mystical Interference',
    cardsNotResponding: 'The cards are not responding. Please try again later.',
    tryAgain: 'Try Again',
    tarotDeck: 'Tarot Deck'
  },
  es: {
    welcome: 'Bienvenido a Tu Lectura de Tarot',
    instruction: 'Tómate un momento para centrarte y enfocarte en tu pregunta o intención. Cuando estés listo, saca una carta para recibir orientación del universo.',
    readingTips: 'Consejos de Lectura',
    tip1: 'Enfócate en una pregunta específica o área de tu vida',
    tip2: 'Respira profundamente y limpia tu mente',
    tip3: 'Confía en tu intuición al interpretar la carta',
    tip4: 'Recuerda, el tarot ofrece orientación, no predicción',
    drawCard: '🎲 Sacar una Carta',
    drawing: 'Sacando...',
    yourReading: 'Tu Lectura de Tarot',
    readingSubtitle: 'El universo ha elegido esta carta para ti. Tómate tiempo para reflexionar sobre su significado.',
    shuffling: 'Barajando el mazo...',
    revealing: 'Revelando tu carta...',
    drawAnother: '🔄 Sacar Otra Carta',
    howToInterpret: 'Cómo Interpretar Tu Carta',
    uprightMeaning: 'Significado Derecho',
    uprightDescription: 'La energía natural de la carta y su expresión positiva',
    reversedMeaning: 'Significado Invertido',
    reversedDescription: 'Energía bloqueada o interpretaciones alternativas',
    personalConnection: 'Conexión Personal',
    personalDescription: '¿Cómo se relaciona esta carta con tu pregunta?',
    intuition: 'Intuición',
    intuitionDescription: 'Confía en tus primeras impresiones y sentimientos',
    noCard: 'No se sacó ninguna carta. Por favor, intenta de nuevo.',
    drawAgain: 'Sacar de Nuevo',
    mysticalInterference: 'Interferencia Mística',
    cardsNotResponding: 'Las cartas no están respondiendo. Por favor, intenta más tarde.',
    tryAgain: 'Intentar de Nuevo',
    tarotDeck: 'Mazo de Tarot'
  }
};

export const TarotCardReader: React.FC = () => {
  const [hasDrawnCard, setHasDrawnCard] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const { currentLanguage } = useLanguage();
  const { data: randomCard, error: randomCardError, isLoading: randomCardLoading, mutate: drawNewCard } = useRandomCard(currentLanguage);
  
  const t = translations[currentLanguage];

  const handleDrawCard = async () => {
    setIsDrawing(true);
    setHasDrawnCard(true);
    
    // Add a small delay for dramatic effect
    setTimeout(() => {
      drawNewCard();
      setIsDrawing(false);
    }, 1000);
  };

  const handleDrawAgain = () => {
    setHasDrawnCard(false);
    setIsDrawing(false);
  };

  if (randomCardError) {
    return (
      <div className="card-reader">
        <div className="error-message">
          <h3>{t.mysticalInterference}</h3>
          <p>{t.cardsNotResponding}</p>
          <button className="retry-btn" onClick={() => drawNewCard()}>
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-reader">
      {!hasDrawnCard ? (
        <div className="drawing-area">
          <div className="deck-container">
            <div className="deck">
              <div className="deck-back">
                <span className="deck-symbol">🃏</span>
                <span className="deck-text">{t.tarotDeck}</span>
              </div>
            </div>
          </div>
          
          <div className="drawing-instructions">
            <h2>{t.welcome}</h2>
            <p className="instruction-text">
              {t.instruction}
            </p>
            
            <div className="reading-tips">
              <h3>{t.readingTips}</h3>
              <ul>
                <li>{t.tip1}</li>
                <li>{t.tip2}</li>
                <li>{t.tip3}</li>
              </ul>
            </div>
            
            <button 
              className="draw-card-btn"
              onClick={handleDrawCard}
              disabled={isDrawing}
            >
              {isDrawing ? t.drawing : t.drawCard}
            </button>
          </div>
        </div>
      ) : (
        <div className="reading-area">
          <div className="reading-header">
            <h2>{t.yourReading}</h2>
            <p className="reading-subtitle">
              {t.readingSubtitle}
            </p>
          </div>
          
          {isDrawing ? (
            <div className="drawing-animation">
              <div className="spinner"></div>
              <p>{t.shuffling}</p>
            </div>
          ) : randomCardLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>{t.revealing}</p>
            </div>
          ) : randomCard ? (
            <div className="card-display">
              <TarotCardComponent 
                card={randomCard} 
                showDetails={true}
                className="reading-card"
                flipOnClick={true}
              />
              
              <div className="reading-actions">
                <button 
                  className="draw-again-btn"
                  onClick={handleDrawAgain}
                >
                  {t.drawAnother}
                </button>
                
                <div className="reading-guidance">
                  <h3>{t.howToInterpret}</h3>
                  <ul>
                    <li><strong>{t.uprightMeaning}:</strong> {t.uprightDescription}</li>
                    <li><strong>{t.reversedMeaning}:</strong> {t.reversedDescription}</li>
                    <li><strong>{t.personalConnection}:</strong> {t.personalDescription}</li>
                    <li><strong>{t.intuition}:</strong> {t.intuitionDescription}</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-card">
              <p>{t.noCard}</p>
              <button className="retry-btn" onClick={handleDrawCard}>
                {t.drawAgain}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TarotCardReader; 