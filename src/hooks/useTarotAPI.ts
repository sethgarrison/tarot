import useSWR from 'swr';
import { tarotDataAPI } from '../services/backendApi';
import type { TarotCardLocalized } from '../types/tarot';
import { getImagePath, checkImageExists } from '../utils/imageUtils';

// Hook to get all cards
export const useAllCards = (language: string = 'en') => {
  return useSWR<TarotCardLocalized[]>(`all-cards-${language}`, () => tarotDataAPI.getAllCardsWithLanguage(language), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
  });
};

// Hook to get a specific card by name
export const useCardByName = (name: string, language: string = 'en') => {
  return useSWR<TarotCardLocalized>(
    name ? `card-${name}-${language}` : null,
    () => tarotDataAPI.getCardByNameWithLanguage(name, language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to get a specific card by short name
export const useCardByNameShort = (nameShort: string, language: string = 'en') => {
  return useSWR<TarotCardLocalized>(
    nameShort ? `card-short-${nameShort}-${language}` : null,
    () => tarotDataAPI.getCardByNameShortWithLanguage(nameShort, language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to get a random card
export const useRandomCard = (language: string = 'en') => {
  return useSWR<TarotCardLocalized>(
    `random-card-${language}`,
    () => tarotDataAPI.getRandomCardWithLanguage(language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 0, // No deduplication for random cards
      errorRetryCount: 3,
    }
  );
};

// Hook to get multiple random cards
export const useRandomCards = (count: number, language: string = 'en') => {
  return useSWR<TarotCardLocalized[]>(
    `random-cards-${count}-${language}`,
    () => tarotDataAPI.getRandomCardsWithLanguage(count, language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 0, // No deduplication for random cards
      errorRetryCount: 3,
    }
  );
};

// Hook to get cards by suit
export const useCardsBySuit = (suit: string, language: string = 'en') => {
  return useSWR<TarotCardLocalized[]>(
    suit ? `cards-suit-${suit}-${language}` : null,
    () => tarotDataAPI.getCardsBySuitWithLanguage(suit, language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to get cards by type
export const useCardsByType = (type: 'major' | 'minor', language: string = 'en') => {
  return useSWR<TarotCardLocalized[]>(
    type ? `cards-type-${type}-${language}` : null,
    () => tarotDataAPI.getCardsByTypeWithLanguage(type, language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to get major arcana
export const useMajorArcana = (language: string = 'en') => {
  return useSWR<TarotCardLocalized[]>(
    `major-arcana-${language}`,
    () => tarotDataAPI.getMajorArcanaWithLanguage(language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to get minor arcana
export const useMinorArcana = (language: string = 'en') => {
  return useSWR<TarotCardLocalized[]>(
    `minor-arcana-${language}`,
    () => tarotDataAPI.getMinorArcanaWithLanguage(language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to search cards
export const useSearchCards = (query: string, language: string = 'en') => {
  return useSWR<TarotCardLocalized[]>(
    query ? `search-${query}-${language}` : null,
    () => tarotDataAPI.searchCardsWithLanguage(query, language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to get tutorials
export const useTutorials = (language: string = 'en') => {
  return useSWR<{ section_key: string; title: string; content: unknown }[]>(
    `tutorials-${language}`,
    () => tarotDataAPI.getTutorials(language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to get tutorial section
export const useTutorialSection = (sectionKey: string, language: string = 'en') => {
  return useSWR<{ section_key: string; title: string; content: unknown }>(
    sectionKey ? `tutorial-section-${sectionKey}-${language}` : null,
    () => tarotDataAPI.getTutorialSection(sectionKey, language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to get card image path
export const useCardImage = (cardName: string) => {
  return useSWR<string>(
    cardName ? `card-image-${cardName}` : null,
    () => getImagePath(cardName),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 3600000, // 1 hour
      errorRetryCount: 1,
    }
  );
};

// Hook to check if card image exists
export const useCardImageExists = (cardName: string) => {
  return useSWR<boolean>(
    cardName ? `card-image-exists-${cardName}` : null,
    () => checkImageExists(cardName),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 3600000, // 1 hour
      errorRetryCount: 1,
    }
  );
}; 