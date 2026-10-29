// Multilingual content interface
export interface MultilingualContent {
  en: string;
  es?: string;
}

// Card as stored in src/data/cards.json (multilingual fields)
export interface DatabaseCard {
  name_short: string;
  name: MultilingualContent;
  type: string;
  value: MultilingualContent;
  value_int: number;
  meaning_up: MultilingualContent;
  meaning_rev: MultilingualContent;
  description: MultilingualContent;
  suit?: MultilingualContent;
  image_path?: string;
}

// Legacy interface for backward compatibility (flattened for API)
export interface TarotCard {
  type: string;
  name_short: string;
  name: string;
  name_en?: string; // English name for image lookups
  value: string;
  value_int: number;
  meaning_up: string;
  meaning_rev: string;
  desc: string;
  suit?: string; // Only present for minor arcana
}

/** Card resolved to a single language (includes optional extras) */
export type TarotCardLocalized = TarotCard & {
  name_en?: string;
  image_path?: string;
};
