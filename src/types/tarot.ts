// Multilingual content interface
export interface MultilingualContent {
  en: string;
  es?: string;
}

// Database card interface (matches actual Supabase schema)
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

export interface TarotCardResponse {
  nhits: number;
  cards: TarotCard[];
}

export interface TarotCardDetail {
  type: string;
  name_short: string;
  name: string;
  value: string;
  value_int: number;
  meaning_up: string;
  meaning_rev: string;
  desc: string;
  suit?: string; // Only present for minor arcana
}

export interface TarotReading {
  cards: TarotCardDetail[];
  cards_picked: string[];
  cards_remaining: string[];
  reading_type: string;
  description: string;
}

export interface TarotAPIError {
  error: string;
  message: string;
}

// Admin interface for editing cards
export interface EditableCard extends DatabaseCard {
  isEditing: boolean;
  originalData: DatabaseCard;
  hasChanges: boolean;
}

// API endpoints - using the working tarotapi.dev
export const TAROT_API_BASE = 'https://tarotapi.dev/api/v1';

export const API_ENDPOINTS = {
  ALL_CARDS: `${TAROT_API_BASE}/cards`,
  CARD_BY_NAME: (name: string) => `${TAROT_API_BASE}/cards/${encodeURIComponent(name)}`,
  CARD_BY_NAME_SHORT: (nameShort: string) => `${TAROT_API_BASE}/cards/${encodeURIComponent(nameShort)}`,
  RANDOM_CARD: `${TAROT_API_BASE}/cards/random`,
  RANDOM_CARDS: (count: number) => `${TAROT_API_BASE}/cards/random?count=${count}`,
  READING: (type: string) => `${TAROT_API_BASE}/cards/random?count=3&reading_type=${type}`,
} as const; 