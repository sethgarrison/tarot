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

/** Card art lives at public/decks/<deck>/<card_name>.<ext>, keyed by the English card name. */
export const getCardImagePath = (cardNameEn: string, deck: DeckId = DEFAULT_DECK): string => {
  const slug = cardNameEn.toLowerCase().replace(/\s+/g, '_');
  return `/decks/${deck}/${slug}.${DECKS[deck].extension}`;
};
