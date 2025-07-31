import React, { useState } from 'react';
import { useRandomCard } from '../hooks/useTarotAPI';
import TarotCardComponent from './TarotCard';

import './TarotCardReader.css';

export const TarotCardReader: React.FC = () => {
  const [hasDrawnCard, setHasDrawnCard] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const { data: randomCard, error: randomCardError, isLoading: randomCardLoading, mutate: drawNewCard } = useRandomCard();

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
          <h3>🔮 Mystical Interference</h3>
          <p>The cards are not responding. Please try again later.</p>
          <button className="retry-btn" onClick={() => drawNewCard()}>
            Try Again
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
                <span className="deck-text">Tarot Deck</span>
              </div>
            </div>
          </div>
          
          <div className="drawing-instructions">
            <h2>🔮 Welcome to Your Tarot Reading</h2>
            <p className="instruction-text">
              Take a moment to center yourself and focus on your question or intention. 
              When you're ready, draw a card to receive guidance from the universe.
            </p>
            
            <div className="reading-tips">
              <h3>💡 Reading Tips</h3>
              <ul>
                <li>Focus on a specific question or area of your life</li>
                <li>Take deep breaths and clear your mind</li>
                <li>Trust your intuition when interpreting the card</li>
                <li>Remember, tarot offers guidance, not prediction</li>
              </ul>
            </div>
            
            <button 
              className="draw-card-btn"
              onClick={handleDrawCard}
              disabled={isDrawing}
            >
              {isDrawing ? 'Drawing...' : '🎲 Draw a Card'}
            </button>
          </div>
        </div>
      ) : (
        <div className="reading-area">
          <div className="reading-header">
            <h2>🔮 Your Tarot Reading</h2>
            <p className="reading-subtitle">
              The universe has chosen this card for you. Take time to reflect on its meaning.
            </p>
          </div>
          
          {isDrawing ? (
            <div className="drawing-animation">
              <div className="spinner"></div>
              <p>Shuffling the deck...</p>
            </div>
          ) : randomCardLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Revealing your card...</p>
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
                  🔄 Draw Another Card
                </button>
                
                <div className="reading-guidance">
                  <h3>💭 How to Interpret Your Card</h3>
                  <ul>
                    <li><strong>Upright Meaning:</strong> The card's natural energy and positive expression</li>
                    <li><strong>Reversed Meaning:</strong> Blocked energy or alternative interpretations</li>
                    <li><strong>Personal Connection:</strong> How does this card relate to your question?</li>
                    <li><strong>Intuition:</strong> Trust your first impressions and feelings</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-card">
              <p>No card was drawn. Please try again.</p>
              <button className="retry-btn" onClick={handleDrawCard}>
                Draw Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TarotCardReader; 