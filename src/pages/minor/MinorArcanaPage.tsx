import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAllCards } from '../../hooks/useTarotAPI';
import { useLanguage } from '../../App';
import { useTranslations } from '../../utils/translationUtils';
import { getCardImagePath } from '../../utils/imageUtils';
import minorArcanaData from '../../data/minorArcana.json';
import './MinorArcanaPage.css';

interface Localized<T> {
  en: T;
  es?: T;
}

interface SuitContent {
  name: string;
  element: string;
  description: string;
  keywords: string[];
  lifeAreas: string[];
  personalityTraits: string[];
}

interface RankContent {
  name: string;
  keywords: string[];
  description: string;
}

interface IntroContent {
  title: string;
  subtitle: string;
  description: string;
  structure: string;
  numberCards: string;
  courtCards: string;
}

// All teaching text lives in src/data/minorArcana.json so it can be edited by hand
const content = minorArcanaData as {
  intro: Localized<IntroContent>;
  suits: Record<string, Localized<SuitContent>>;
  ranks: Record<string, Localized<RankContent>>;
  combined: Record<string, Localized<string>>;
};

const SUITS = ['wands', 'cups', 'swords', 'pentacles'];
const NUMBER_RANKS = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const COURT_RANKS = ['page', 'knight', 'queen', 'king'];

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);
const englishCardName = (suit: string, rank: string) => `${capitalize(rank)} of ${capitalize(suit)}`;

const MinorArcanaPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations();
  const { data: allCards } = useAllCards(currentLanguage);

  const [selectedSuit, setSelectedSuit] = useState<string | null>(null);
  const [selectedRank, setSelectedRank] = useState<string | null>(null);
  const suitDetailRef = useRef<HTMLElement>(null);
  const combinedRef = useRef<HTMLElement>(null);

  const local = <T,>(entry: Localized<T>): T => entry[currentLanguage] ?? entry.en;

  const cardsByEnglishName = useMemo(
    () => new Map((allCards ?? []).map((card) => [card.name_en, card])),
    [allCards]
  );

  useEffect(() => {
    if (selectedSuit) {
      suitDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedSuit]);

  useEffect(() => {
    // Desktop keeps this panel sticky beside the cards, so only phones need to scroll to it
    if (selectedRank && window.matchMedia('(max-width: 899px)').matches) {
      combinedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedRank, selectedSuit]);

  const intro = local(content.intro);
  const suit = selectedSuit ? local(content.suits[selectedSuit]) : null;
  const rank = selectedRank ? local(content.ranks[selectedRank]) : null;
  const selectedCard =
    selectedSuit && selectedRank ? cardsByEnglishName.get(englishCardName(selectedSuit, selectedRank)) : undefined;

  const selectSuit = (key: string) => {
    setSelectedSuit(key);
    setSelectedRank(null);
  };

  const renderRankTiles = (ranks: string[]) => (
    <div className="rank-grid">
      {ranks.map((key) => {
        const name = englishCardName(selectedSuit ?? '', key);
        return (
          <button
            key={key}
            className={`rank-tile ${selectedRank === key ? 'active' : ''}`}
            aria-pressed={selectedRank === key}
            onClick={() => setSelectedRank(key)}
          >
            <img src={getCardImagePath(name)} alt="" className="rank-art" width={825} height={1426} loading="lazy" />
            <span className="rank-name">{local(content.ranks[key]).name}</span>
            <span className="rank-description">{local(content.ranks[key]).description}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="minor-page">
      <section className="minor-intro">
        <h2>{intro.title}</h2>
        <p className="minor-subtitle">{intro.subtitle}</p>
        <p>{intro.description}</p>
        <p>{intro.structure}</p>
      </section>

      <h3 className="minor-step">{t('minorPage.chooseSuit')}</h3>
      <div className="suit-grid">
        {SUITS.map((key) => {
          const option = local(content.suits[key]);
          return (
            <button
              key={key}
              className={`suit-tile ${selectedSuit === key ? 'active' : ''}`}
              aria-pressed={selectedSuit === key}
              onClick={() => selectSuit(key)}
            >
              <img
                src={getCardImagePath(englishCardName(key, 'ace'))}
                alt=""
                className="suit-art"
                width={825}
                height={1426}
              />
              <span className="suit-name">{option.name}</span>
              <span className="suit-element">{option.element}</span>
              <span className="suit-description">{option.description}</span>
            </button>
          );
        })}
      </div>

      {suit && (
        <>
          <section className="suit-detail" ref={suitDetailRef}>
            <h2>
              {suit.name} <span className="suit-detail-element">{suit.element}</span>
            </h2>
            <p>
              <strong>{t('minorPage.keywords')}:</strong> {suit.keywords.join(', ')}
            </p>
            <div className="suit-lists">
              <div>
                <h4>{t('minorPage.lifeAreas')}</h4>
                <ul>
                  {suit.lifeAreas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>{t('minorPage.personalityTraits')}</h4>
                <ul>
                  {suit.personalityTraits.map((trait) => (
                    <li key={trait}>{trait}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="minor-layout">
            <div className="minor-ranks">
              <h3 className="minor-step">{t('minorPage.chooseCard')}</h3>

              <h4 className="rank-group-title">{t('minorPage.numberCards')}</h4>
              <p className="rank-group-intro">{intro.numberCards}</p>
              {renderRankTiles(NUMBER_RANKS)}

              <h4 className="rank-group-title">{t('minorPage.courtCards')}</h4>
              <p className="rank-group-intro">{intro.courtCards}</p>
              {renderRankTiles(COURT_RANKS)}
            </div>

            <aside className="combined-panel" ref={combinedRef}>
              {selectedCard && rank && selectedSuit && selectedRank ? (
                <>
                  <img
                    src={getCardImagePath(selectedCard.name_en || selectedCard.name)}
                    alt={selectedCard.name}
                    className="combined-art"
                    width={825}
                    height={1426}
                  />
                  <h3 className="combined-name">{selectedCard.name}</h3>

                  <div className="combined-equation">
                    <div>
                      <h4>
                        {t('minorPage.theRank')}: {rank.name}
                      </h4>
                      <p>{rank.keywords.join(', ')}</p>
                    </div>
                    <span className="combined-plus" aria-hidden="true">
                      +
                    </span>
                    <div>
                      <h4>
                        {t('minorPage.theSuit')}: {suit.name}
                      </h4>
                      <p>{suit.keywords.slice(0, 4).join(', ')}</p>
                    </div>
                  </div>

                  <h4 className="combined-title">{t('minorPage.combinedTitle')}</h4>
                  <p>{local(content.combined[`${selectedSuit}_${selectedRank}`])}</p>

                  <h4 className="combined-title">{t('minorPage.classicUpright')}</h4>
                  <p>{selectedCard.meaning_up}</p>

                  <h4 className="combined-title">{t('minorPage.classicReversed')}</h4>
                  <p>{selectedCard.meaning_rev}</p>
                </>
              ) : (
                <p className="combined-prompt">{t('minorPage.selectPrompt')}</p>
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  );
};

export default MinorArcanaPage;
