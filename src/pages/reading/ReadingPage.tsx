import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAllCards } from '../../hooks/useTarotAPI';
import { useDeck, useLanguage } from '../../App';
import { shuffled } from '../../services/tarotData';
import { useTranslations } from '../../utils/translationUtils';
import { getCardImagePath } from '../../utils/imageUtils';
import { SPREADS } from './spreads';
import type { Spread } from './spreads';
import './ReadingPage.css';

interface DrawnCard {
  nameShort: string;
  reversed: boolean;
}

const ReadingPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations();
  const { deck } = useDeck();
  const { data: allCards } = useAllCards(currentLanguage);

  const [spread, setSpread] = useState<Spread | null>(null);
  const [draws, setDraws] = useState<DrawnCard[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [interpreting, setInterpreting] = useState(false);
  const [includeReversed, setIncludeReversed] = useState(true);
  const interpretationRef = useRef<HTMLElement>(null);

  // Draws store only ids so a reading survives switching language
  const cardsByShort = useMemo(
    () => new Map((allCards ?? []).map((card) => [card.name_short, card])),
    [allCards]
  );

  useEffect(() => {
    if (interpreting) {
      interpretationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [interpreting]);

  const startSpread = (next: Spread) => {
    setDraws(
      shuffled(allCards ?? [])
        .slice(0, next.positions.length)
        .map((card) => ({
          nameShort: card.name_short,
          reversed: includeReversed && Math.random() < 0.5,
        }))
    );
    setRevealed(0);
    setInterpreting(false);
    setSpread(next);
  };

  if (!allCards) {
    return null;
  }

  if (!spread) {
    return (
      <div className="reading-page">
        <section className="reading-intro">
          <h2>{t('readingPage.title')}</h2>
          <p>{t('readingPage.intro')}</p>
        </section>

        <div className="spread-picker">
          {SPREADS.map((option) => (
            <button key={option.id} className="spread-option" onClick={() => startSpread(option)}>
              <span className="spread-option-name">{t(`readingPage.spreads.${option.id}.name`)}</span>
              <span className="spread-option-count">
                {t(option.positions.length === 1 ? 'readingPage.oneCard' : 'readingPage.cardCount', {
                  count: option.positions.length,
                })}
              </span>
              <span className="spread-option-description">{t(`readingPage.spreads.${option.id}.description`)}</span>
            </button>
          ))}
        </div>

        <label className="reversed-toggle">
          <input
            type="checkbox"
            checked={includeReversed}
            onChange={(e) => setIncludeReversed(e.target.checked)}
          />
          {t('readingPage.includeReversed')}
        </label>
      </div>
    );
  }

  const total = spread.positions.length;
  const allRevealed = revealed === total;
  const latestIndex = revealed - 1;
  const latestDraw = draws[latestIndex];
  const latestCard = latestDraw && cardsByShort.get(latestDraw.nameShort);

  const positionName = (key: string) => t(`readingPage.positions.${key}.name`);
  const positionQuestion = (key: string) => t(`readingPage.positions.${key}.question`);
  const orientation = (reversed: boolean) => t(reversed ? 'readingPage.reversed' : 'readingPage.upright');

  const actionLabel = revealed === 0 ? t('readingPage.drawFirst') : t('readingPage.nextCard');

  return (
    <div className="reading-page">
      <div className="reading-heading">
        <h2>{t(`readingPage.spreads.${spread.id}.name`)}</h2>
        <button className="reading-link" onClick={() => setSpread(null)}>
          {t('readingPage.chooseAnother')}
        </button>
      </div>

      <div className="reading-layout">
        <div className={`spread spread-${spread.id}`}>
          {spread.positions.map((key, index) => {
            const draw = index < revealed ? draws[index] : undefined;
            const card = draw && cardsByShort.get(draw.nameShort);
            return (
              <figure key={key} className={`slot slot-${index + 1} ${index === latestIndex ? 'slot-latest' : ''}`}>
                <div className="slot-frame">
                  {card ? (
                    <img
                      src={getCardImagePath(card.name_en || card.name, deck)}
                      alt={`${card.name} (${orientation(draw.reversed)})`}
                      className={`slot-card ${draw.reversed ? 'reversed' : ''}`}
                      width={825}
                      height={1426}
                    />
                  ) : (
                    <span className="slot-number">{index + 1}</span>
                  )}
                </div>
                <figcaption className="slot-caption">{positionName(key)}</figcaption>
              </figure>
            );
          })}
        </div>

        <div className="reading-controls">
          <div className="reading-status" aria-live="polite">
            {latestCard ? (
              <>
                <p className="status-position">
                  {latestIndex + 1}. {positionName(spread.positions[latestIndex])}
                </p>
                <p className="status-question">{positionQuestion(spread.positions[latestIndex])}</p>
                <p className="status-card">
                  {latestCard.name} <span className="status-orientation">{orientation(latestDraw.reversed)}</span>
                </p>
                {!interpreting && <p className="status-hint">{t('readingPage.recallHint')}</p>}
              </>
            ) : (
              <p className="status-question">{t('readingPage.readyHint')}</p>
            )}
          </div>

          <div className="reading-actions">
            {!allRevealed && (
              <button className="reading-btn" onClick={() => setRevealed(revealed + 1)}>
                {actionLabel}
              </button>
            )}
            {allRevealed && !interpreting && (
              <button className="reading-btn" onClick={() => setInterpreting(true)}>
                {t('readingPage.interpret')}
              </button>
            )}
            {interpreting && (
              <button className="reading-btn" onClick={() => startSpread(spread)}>
                {t('readingPage.drawAgain')}
              </button>
            )}
          </div>
        </div>
      </div>

      {interpreting && (
        <section className="interpretation" ref={interpretationRef}>
          <h2>{t('readingPage.summaryTitle')}</h2>
          <ol className="interpretation-list">
            {spread.positions.map((key, index) => {
              const draw = draws[index];
              const card = cardsByShort.get(draw.nameShort);
              if (!card) return null;
              return (
                <li key={key} className="interpretation-item">
                  <img
                    src={getCardImagePath(card.name_en || card.name, deck)}
                    alt=""
                    className={`interpretation-card ${draw.reversed ? 'reversed' : ''}`}
                    width={825}
                    height={1426}
                  />
                  <div>
                    <h3 className="interpretation-position">
                      {index + 1}. {positionName(key)}
                    </h3>
                    <p className="interpretation-question">{positionQuestion(key)}</p>
                    <p className="interpretation-name">
                      {card.name} <span className="status-orientation">{orientation(draw.reversed)}</span>
                    </p>
                    <p className="interpretation-meaning">{draw.reversed ? card.meaning_rev : card.meaning_up}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="interpretation-practice">
            <h3>{t('readingPage.practiceTitle')}</h3>
            <p>{t(`readingPage.spreads.${spread.id}.practice`)}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ReadingPage;
