import useSWR from 'swr';
import { supabaseTarotAPI } from '../services/supabaseAPI';
import type { TarotCard, TarotCardDetail } from '../types/tarot';

// Hook to get all cards
export const useAllCards = (language: string = 'en') => {
  return useSWR<TarotCard[]>(`all-cards-${language}`, () => supabaseTarotAPI.getAllCards(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
  });
};

// Hook to get a specific card by name
export const useCardByName = (name: string, language: string = 'en') => {
  return useSWR<TarotCard>(
    name ? `card-${name}-${language}` : null,
    () => supabaseTarotAPI.getCardByName(name),
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
  return useSWR<TarotCard>(
    nameShort ? `card-short-${nameShort}-${language}` : null,
    () => supabaseTarotAPI.getCardByNameShort(nameShort),
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
  return useSWR<TarotCard>(
    `random-card-${language}`,
    () => supabaseTarotAPI.getRandomCard(),
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
  return useSWR<TarotCardDetail[]>(
    `random-cards-${count}-${language}`,
    () => supabaseTarotAPI.getRandomCards(count),
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
  return useSWR<TarotCard[]>(
    suit ? `cards-suit-${suit}-${language}` : null,
    () => supabaseTarotAPI.getCardsBySuit(suit),
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
  return useSWR<TarotCard[]>(
    type ? `cards-type-${type}-${language}` : null,
    () => supabaseTarotAPI.getCardsByType(type),
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
  return useSWR<TarotCard[]>(
    `major-arcana-${language}`,
    () => supabaseTarotAPI.getMajorArcana(),
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
  return useSWR<TarotCard[]>(
    `minor-arcana-${language}`,
    () => supabaseTarotAPI.getMinorArcana(),
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
  return useSWR<TarotCard[]>(
    query ? `search-${query}-${language}` : null,
    () => supabaseTarotAPI.searchCards(query),
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
  return useSWR<any[]>(
    `tutorials-${language}`,
    () => supabaseTarotAPI.getTutorials(language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to get a specific tutorial section
export const useTutorialSection = (sectionKey: string, language: string = 'en') => {
  return useSWR<any>(
    sectionKey ? `tutorial-${sectionKey}-${language}` : null,
    () => supabaseTarotAPI.getTutorialSection(sectionKey, language),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to get card image
export const useCardImage = (cardName: string) => {
  return useSWR<string>(
    cardName ? `card-image-${cardName}` : null,
    () => Promise.resolve(`/tarot/tarot-images/${cardName.toLowerCase().replace(/\s+/g, '_')}.jpg`),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
};

// Hook to check if card image exists
export const useCardImageExists = (cardName: string) => {
  return useSWR<boolean>(
    cardName ? `card-image-exists-${cardName}` : null,
    async () => {
      try {
        const response = await fetch(`/tarot/tarot-images/${cardName.toLowerCase().replace(/\s+/g, '_')}.jpg`);
        return response.ok;
      } catch {
        return false;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );
}; 