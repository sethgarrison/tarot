import React from 'react';
import { useDeck } from '../App';
import { DECKS } from '../utils/imageUtils';
import type { DeckId } from '../utils/imageUtils';
import { useTranslations } from '../utils/translationUtils';
import './DeckSwitcher.css';

const DeckSwitcher: React.FC = () => {
  const { deck, setDeck } = useDeck();
  const { t } = useTranslations();

  return (
    <label className="deck-switcher">
      <span>{t('deckSwitcher.label')}</span>
      <select value={deck} onChange={(e) => setDeck(e.target.value as DeckId)}>
        {(Object.keys(DECKS) as DeckId[]).map((id) => (
          <option key={id} value={id}>
            {DECKS[id].name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default DeckSwitcher;
