import useSWR from 'swr';
import { tarotDataAPI } from '../services/tarotData';
import type { TarotCardLocalized } from '../types/tarot';

// Hook to get all cards
export const useAllCards = (language: string = 'en') => {
  return useSWR<TarotCardLocalized[]>(`all-cards-${language}`, () => tarotDataAPI.getAllCardsWithLanguage(language), {
    keepPreviousData: true, // keeps flipped cards in place when the language changes
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
  });
};
