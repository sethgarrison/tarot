import React, { useState } from 'react';
import type { TarotCardLocalized } from '../types/tarot';
import { getCardImagePath } from '../utils/imageUtils';
import { useTranslations } from '../utils/translationUtils';
import './TarotCard.css';

interface TarotCardProps {
  card: TarotCardLocalized;
  className?: string;
}

export const TarotCardComponent: React.FC<TarotCardProps> = ({ card, className = '' }) => {
  const { t } = useTranslations();
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const toggleFlip = () => setIsFlipped((flipped) => !flipped);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  };

  const typeLabel = t(card.type === 'major' ? 'deckPage.filters.arcana.majorArcana' : 'deckPage.filters.arcana.minorArcana');

  return (
    <div className={`tarot-card ${className}`}>
      <div
        className={`card-flip-container ${isFlipped ? 'flipped' : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={card.name}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
      >
        {/* Front of Card - Just the Image */}
        <div className="card-front">
          {imageFailed ? (
            <div className="no-image">
              <span className="card-name">{card.name}</span>
            </div>
          ) : (
            <img
              src={getCardImagePath(card.name_en || card.name)}
              alt={card.name}
              className="card-image"
              width={825}
              height={1426}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          )}
          <div className="flip-hint">
            <span>{t('tarotCard.interactions.clickToFlip')}</span>
          </div>
        </div>

        {/* Back of Card - Meanings */}
        <div className="card-back">
          <div className="card-back-content">
            <h3 className="card-title">{card.name}</h3>

            <div className="card-meta">
              <span className="card-type">{typeLabel}</span>
              {card.suit_en && (
                <span className="card-suit">{t(`deckPage.filters.suit.${card.suit_en}`)}</span>
              )}
              <span className="card-value">{t('tarotCard.sections.value')}: {card.value}</span>
            </div>

            <div className="meaning-group meaning-upright">
              <h4 className="meaning-title">{t('tarotCard.sections.uprightMeaning')}</h4>
              <p className="meaning-text">{card.meaning_up}</p>
            </div>

            <div className="meaning-group meaning-reversed">
              <h4 className="meaning-title">{t('tarotCard.sections.reversedMeaning')}</h4>
              <p className="meaning-text">{card.meaning_rev}</p>
            </div>

            <div className="meaning-group meaning-description">
              <h4 className="meaning-title">{t('tarotCard.sections.description')}</h4>
              <p className="meaning-text">{card.desc}</p>
            </div>
          </div>

          <div className="flip-back-hint">
            <span>{t('tarotCard.interactions.clickToFlipBack')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotCardComponent;
