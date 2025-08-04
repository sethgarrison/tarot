import React, { useState } from 'react';
import type { TarotCard } from '../types/tarot';
import { useCardImage, useCardImageExists } from '../hooks/useTarotAPI';
import './TarotCard.css';

interface TarotCardProps {
  card?: TarotCard;
  showDetails?: boolean;
  className?: string;
  flipOnClick?: boolean;
}

export const TarotCardComponent: React.FC<TarotCardProps> = ({ 
  card, 
  showDetails = true,
  className = '',
  flipOnClick = true
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  // Safety check for undefined card
  if (!card) {
    return (
      <div className={`tarot-card ${className}`}>
        <div className="card-image-section">
          <div className="card-image-container">
            <div className="no-image">
              <div className="no-image-content">
                <span className="card-symbol">❓</span>
                <span className="card-name">Card not found</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data: imagePath } = useCardImage(card.name_en || card.name);
  const { data: imageExists } = useCardImageExists(card.name_en || card.name);

  const getCardTypeLabel = (type: string) => {
    return type === 'major' ? 'Major Arcana' : 'Minor Arcana';
  };

  const getSuitLabel = (suit?: string) => {
    if (!suit) return null;
    const suitLabels: Record<string, string> = {
      wands: 'Wands',
      cups: 'Cups', 
      swords: 'Swords',
      pentacles: 'Pentacles'
    };
    return suitLabels[suit.toLowerCase()] || suit;
  };

  const handleCardClick = () => {
    if (flipOnClick) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className={`tarot-card ${className}`}>
      {/* Card Container with Flip */}
      <div className={`card-flip-container ${isFlipped ? 'flipped' : ''}`}>
        {/* Front of Card - Just the Image */}
        <div className="card-front" onClick={handleCardClick}>
          <div className="card-image-container">
            {imageExists ? (
              <img 
                src={imagePath} 
                alt={card.name}
                className="card-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`no-image ${imageExists ? 'hidden' : ''}`}>
              <div className="no-image-content">
                <span className="card-symbol">🃏</span>
                <span className="card-name">{card.name}</span>
              </div>
            </div>
          </div>
          {flipOnClick && (
            <div className="flip-hint">
              <span>Click to flip</span>
            </div>
          )}
        </div>

        {/* Back of Card - Meanings */}
        <div className="card-back" onClick={handleCardClick}>
          <div className="card-back-content">
            <h3 className="card-title">{card.name}</h3>
            
            <div className="card-meta">
              <span className="card-type">{getCardTypeLabel(card.type)}</span>
              {card.suit && (
                <span className="card-suit">{getSuitLabel(card.suit)}</span>
              )}
              <span className="card-value">Value: {card.value}</span>
            </div>

            <div className="meanings-section">
              <div className="meaning-group">
                <h4 className="meaning-title">Upright Meaning</h4>
                <p className="meaning-text">{card.meaning_up}</p>
              </div>
              
              <div className="meaning-group">
                <h4 className="meaning-title">Reversed Meaning</h4>
                <p className="meaning-text">{card.meaning_rev}</p>
              </div>
            </div>

            <div className="description-section">
              <h4 className="description-title">Description</h4>
              <p className="description-text">{card.desc}</p>
            </div>
          </div>
          
          <div className="flip-hint">
            <span>Click to flip back</span>
          </div>
        </div>
      </div>

      {/* Optional Details Panel */}
      {showDetails && !flipOnClick && (
        <div className="details-panel">
          <button 
            className="details-toggle"
            onClick={() => setShowDetailsPanel(!showDetailsPanel)}
          >
            {showDetailsPanel ? 'Hide Details' : 'Show Details'}
          </button>
          
          {showDetailsPanel && (
            <div className="details-content">
              <div className="card-header">
                <h3 className="card-title">{card.name}</h3>
                <div className="card-meta">
                  <span className="card-type">{getCardTypeLabel(card.type)}</span>
                  {card.suit && (
                    <span className="card-suit">{getSuitLabel(card.suit)}</span>
                  )}
                  <span className="card-value">Value: {card.value}</span>
                </div>
              </div>

              <div className="card-content">
                <div className="meanings-section">
                  <div className="meaning-group">
                    <h4 className="meaning-title">Upright Meaning</h4>
                    <p className="meaning-text">{card.meaning_up}</p>
                  </div>
                  
                  <div className="meaning-group">
                    <h4 className="meaning-title">Reversed Meaning</h4>
                    <p className="meaning-text">{card.meaning_rev}</p>
                  </div>
                </div>

                <div className="description-section">
                  <h4 className="description-title">Description</h4>
                  <p className="description-text">{card.desc}</p>
                </div>

                <div className="additional-info">
                  <div className="info-item">
                    <span className="info-label">Short Name:</span>
                    <span className="info-value">{card.name_short}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Value (Int):</span>
                    <span className="info-value">{card.value_int}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TarotCardComponent; 