import React, { useState } from 'react';
import { useRandomCard } from '../../hooks/useTarotAPI';
import { useLanguage } from '../../App';
import { useTranslations } from '../../utils/translationUtils';
import TarotCardComponent from '../../components/TarotCard';

import './TarotCardReader.css';

export const TarotCardReader: React.FC = () => {
  const [hasDrawnCard, setHasDrawnCard] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations();
  const { data: randomCard, error: randomCardError, isLoading: randomCardLoading, mutate: drawNewCard } = useRandomCard(currentLanguage);

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
          <h3>{t('readerPage.mysticalInterference')}</h3>
          <p>{t('readerPage.cardsNotResponding')}</p>
          <button className="retry-btn" onClick={() => drawNewCard()}>
            {t('readerPage.tryAgain')}
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
                <span className="deck-text">{t('readerPage.tarotDeck')}</span>
              </div>
            </div>
          </div>
          
          <div className="drawing-instructions">
            <h2>{t('readerPage.welcome')}</h2>
            <p className="instruction-text">
              {t('readerPage.instruction')}
            </p>
            
            <div className="reading-tips">
              <h3>{t('readerPage.readingTips')}</h3>
              <ul>
                <li>{t('readerPage.tip1')}</li>
                <li>{t('readerPage.tip2')}</li>
                <li>{t('readerPage.tip3')}</li>
              </ul>
            </div>
            
            <button 
              className="draw-card-btn"
              onClick={handleDrawCard}
              disabled={isDrawing}
            >
              {isDrawing ? t('readerPage.drawing') : t('readerPage.drawCard')}
            </button>
          </div>
        </div>
      ) : (
        <div className="reading-area">
          <div className="reading-header">
            <h2>{t('readerPage.yourReading')}</h2>
            <p className="reading-subtitle">
              {t('readerPage.readingSubtitle')}
            </p>
          </div>
          
          {isDrawing ? (
            <div className="drawing-animation">
              <div className="spinner"></div>
              <p>{t('readerPage.shuffling')}</p>
            </div>
          ) : randomCardLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>{t('readerPage.revealing')}</p>
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
                  {t('readerPage.drawAnother')}
                </button>
                
                <div className="reading-guidance">
                  <h3>{t('readerPage.howToInterpret')}</h3>
                  <ul>
                    <li><strong>{t('readerPage.uprightMeaning')}:</strong> {t('readerPage.uprightDescription')}</li>
                    <li><strong>{t('readerPage.reversedMeaning')}:</strong> {t('readerPage.reversedDescription')}</li>
                    <li><strong>{t('readerPage.personalConnection')}:</strong> {t('readerPage.personalDescription')}</li>
                    <li><strong>{t('readerPage.intuition')}:</strong> {t('readerPage.intuitionDescription')}</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-card">
              <p>{t('readerPage.noCard')}</p>
              <button className="retry-btn" onClick={handleDrawCard}>
                {t('readerPage.drawAgain')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TarotCardReader; 