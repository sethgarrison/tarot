import type { TarotCard, TarotCardResponse, TarotCardDetail, TarotReading, TarotAPIError } from '../types/tarot';
import { API_ENDPOINTS } from '../types/tarot';

class TarotAPIService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData: TarotAPIError = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Tarot API Error:', error);
      throw error;
    }
  }

  // Get all cards
  async getAllCards(): Promise<TarotCard[]> {
    const response: TarotCardResponse = await this.fetchWithErrorHandling(API_ENDPOINTS.ALL_CARDS);
    return response.cards;
  }

  // Get a specific card by name
  async getCardByName(name: string): Promise<TarotCard> {
    return await this.fetchWithErrorHandling(API_ENDPOINTS.CARD_BY_NAME(name));
  }

  // Get a specific card by short name
  async getCardByNameShort(nameShort: string): Promise<TarotCard> {
    return await this.fetchWithErrorHandling(API_ENDPOINTS.CARD_BY_NAME_SHORT(nameShort));
  }

  // Get a random card
  async getRandomCard(): Promise<TarotCard> {
    const response: TarotCardResponse = await this.fetchWithErrorHandling(API_ENDPOINTS.RANDOM_CARD);
    return response.cards[0]; // Extract the first card from the array
  }

  // Get multiple random cards
  async getRandomCards(count: number): Promise<TarotCardDetail[]> {
    const response: TarotCardResponse = await this.fetchWithErrorHandling(API_ENDPOINTS.RANDOM_CARDS(count));
    return response.cards;
  }

  // Get a reading with specific type
  async getReading(readingType: string): Promise<TarotReading> {
    return await this.fetchWithErrorHandling(API_ENDPOINTS.READING(readingType));
  }

  // Get cards by suit
  async getCardsBySuit(suit: string): Promise<TarotCard[]> {
    const allCards = await this.getAllCards();
    return allCards.filter(card => card.suit?.toLowerCase() === suit.toLowerCase());
  }

  // Get cards by type (major/minor arcana)
  async getCardsByType(type: 'major' | 'minor'): Promise<TarotCard[]> {
    const allCards = await this.getAllCards();
    return allCards.filter(card => card.type.toLowerCase() === type.toLowerCase());
  }

  // Get major arcana cards
  async getMajorArcana(): Promise<TarotCard[]> {
    return await this.getCardsByType('major');
  }

  // Get minor arcana cards
  async getMinorArcana(): Promise<TarotCard[]> {
    return await this.getCardsByType('minor');
  }

  // Search cards by name
  async searchCards(query: string): Promise<TarotCard[]> {
    const allCards = await this.getAllCards();
    const searchTerm = query.toLowerCase();
    return allCards.filter(card => 
      card.name.toLowerCase().includes(searchTerm) ||
      card.name_short.toLowerCase().includes(searchTerm) ||
      card.suit?.toLowerCase().includes(searchTerm)
    );
  }
}

// Export a singleton instance
export const tarotAPI = new TarotAPIService();
export default tarotAPI; 