export type DeckId = 'sissy-senor' | 'rws';

interface Deck {
  name: string;
  extension: string;
}

export const DECKS: Record<DeckId, Deck> = {
  'sissy-senor': { name: 'Sissy Señor', extension: 'webp' },
  rws: { name: 'Rider-Waite-Smith', extension: 'jpg' },
};

export const DEFAULT_DECK: DeckId = 'sissy-senor';

const DECK_STORAGE_KEY = 'tarot-deck';

export const loadSavedDeck = (): DeckId => {
  try {
    const saved = localStorage.getItem(DECK_STORAGE_KEY);
    return saved && saved in DECKS ? (saved as DeckId) : DEFAULT_DECK;
  } catch {
    return DEFAULT_DECK;
  }
};

export const saveDeck = (deck: DeckId): void => {
  try {
    localStorage.setItem(DECK_STORAGE_KEY, deck);
  } catch {
    // The choice just won't be remembered next visit
  }
};

/** Card art lives at public/decks/<deck>/<card_name>.<ext>, keyed by the English card name. */
export const getCardImagePath = (cardNameEn: string, deck: DeckId): string => {
  const slug = cardNameEn.toLowerCase().replace(/\s+/g, '_');
  return `/decks/${deck}/${slug}.${DECKS[deck].extension}`;
};
