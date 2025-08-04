import { createClient } from '@supabase/supabase-js';
import type { TarotCard, TarotCardDetail } from '../types/tarot';

// Supabase configuration - using environment variables only
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid credentials
const hasValidCredentials = supabaseUrl && supabaseKey && 
  supabaseUrl !== 'NOT SET' && supabaseKey !== 'NOT SET';

if (!hasValidCredentials) {
  console.warn('⚠️ Supabase credentials not configured - using fallback mode');
  console.warn('For full functionality, deploy to Vercel/Netlify with environment variables');
}

const supabase = hasValidCredentials ? createClient(supabaseUrl, supabaseKey) : null;

// Helper function to transform database card to API format
function transformCardFromDB(dbCard: {
  name_short: string;
  name: { en: string; es?: string };
  type: string;
  value: { en: string; es?: string };
  value_int: number;
  meaning_up: { en: string; es?: string };
  meaning_rev: { en: string; es?: string };
  description: { en: string; es?: string };
  suit?: { en: string; es?: string };
  image_path?: string;
}): TarotCard {
  return {
    name_short: dbCard.name_short,
    name: dbCard.name.en, // Use English name for backward compatibility
    type: dbCard.type,
    value: dbCard.value.en, // Use English value for backward compatibility
    value_int: dbCard.value_int,
    meaning_up: dbCard.meaning_up.en, // Use English meaning for backward compatibility
    meaning_rev: dbCard.meaning_rev.en, // Use English meaning for backward compatibility
    desc: dbCard.description.en, // Use English description for backward compatibility
    suit: dbCard.suit?.en || undefined // Use English suit for backward compatibility
  };
}

// Helper function to get card with language support
function getCardWithLanguage(dbCard: {
  name_short: string;
  name: { en: string; es?: string };
  type: string;
  value: { en: string; es?: string };
  value_int: number;
  meaning_up: { en: string; es?: string };
  meaning_rev: { en: string; es?: string };
  description: { en: string; es?: string };
  suit?: { en: string; es?: string };
  image_path?: string;
}, language: string = 'en'): any {
  return {
    name_short: dbCard.name_short,
    name: (dbCard.name as any)[language] || dbCard.name.en,
    name_en: dbCard.name.en, // Keep English name for image lookups
    type: dbCard.type,
    value: (dbCard.value as any)[language] || dbCard.value.en,
    value_int: dbCard.value_int,
    meaning_up: (dbCard.meaning_up as any)[language] || dbCard.meaning_up.en,
    meaning_rev: (dbCard.meaning_rev as any)[language] || dbCard.meaning_rev.en,
    desc: (dbCard.description as any)[language] || dbCard.description.en,
    suit: dbCard.suit ? ((dbCard.suit as any)[language] || dbCard.suit.en) : undefined,
    image_path: dbCard.image_path
  };
}

class SupabaseTarotService {
  // Get all cards
  async getAllCards(): Promise<TarotCard[]> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty array');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('name_short');

      if (error) {
        throw new Error(error.message);
      }

      return data.map(card => transformCardFromDB(card));
    } catch (error) {
      throw error;
    }
  }

  // Get all cards with language support
  async getAllCardsWithLanguage(language: string = 'en'): Promise<any[]> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty array');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('name_short');

      if (error) {
        throw new Error(error.message);
      }

      return data.map(card => getCardWithLanguage(card, language));
    } catch (error) {
      throw error;
    }
  }

  // Get card by name with language support
  async getCardByNameWithLanguage(name: string, language: string = 'en'): Promise<any> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty object');
      return {};
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('name->en', name)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return getCardWithLanguage(data, language);
    } catch (error) {
      throw error;
    }
  }

  // Get card by name short with language support
  async getCardByNameShortWithLanguage(nameShort: string, language: string = 'en'): Promise<any> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty object');
      return {};
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('name_short', nameShort)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return getCardWithLanguage(data, language);
    } catch (error) {
      throw error;
    }
  }

  // Get random card with language support
  async getRandomCardWithLanguage(language: string = 'en'): Promise<any> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty object');
      return {};
    }
    
    try {
      // Get all cards first
      const { data, error } = await supabase
        .from('cards')
        .select('*');

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        throw new Error('No cards found');
      }

      // Select a random card
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomCard = data[randomIndex];

      return getCardWithLanguage(randomCard, language);
    } catch (error) {
      throw error;
    }
  }

  // Get random cards with language support
  async getRandomCardsWithLanguage(count: number, language: string = 'en'): Promise<any[]> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty array');
      return [];
    }
    
    try {
      // Get all cards first
      const { data, error } = await supabase
        .from('cards')
        .select('*');

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Shuffle and select random cards
      const shuffled = [...data].sort(() => 0.5 - Math.random());
      const selectedCards = shuffled.slice(0, Math.min(count, data.length));

      return selectedCards.map(card => getCardWithLanguage(card, language));
    } catch (error) {
      throw error;
    }
  }

  // Get cards by suit with language support
  async getCardsBySuitWithLanguage(suit: string, language: string = 'en'): Promise<any[]> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty array');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('suit->en', suit)
        .order('value_int');

      if (error) {
        throw new Error(error.message);
      }

      return data.map(card => getCardWithLanguage(card, language));
    } catch (error) {
      throw error;
    }
  }

  // Get cards by type with language support
  async getCardsByTypeWithLanguage(type: 'major' | 'minor', language: string = 'en'): Promise<any[]> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty array');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('type', type)
        .order('value_int');

      if (error) {
        throw new Error(error.message);
      }

      return data.map(card => getCardWithLanguage(card, language));
    } catch (error) {
      throw error;
    }
  }

  // Get major arcana with language support
  async getMajorArcanaWithLanguage(language: string = 'en'): Promise<any[]> {
    return this.getCardsByTypeWithLanguage('major', language);
  }

  // Get minor arcana with language support
  async getMinorArcanaWithLanguage(language: string = 'en'): Promise<any[]> {
    return this.getCardsByTypeWithLanguage('minor', language);
  }

  // Search cards with language support
  async searchCardsWithLanguage(query: string, language: string = 'en'): Promise<any[]> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty array');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .or(`name->en.ilike.%${query}%,name->es.ilike.%${query}%,description->en.ilike.%${query}%,description->es.ilike.%${query}%`)
        .order('name_short');

      if (error) {
        throw new Error(error.message);
      }

      return data.map(card => getCardWithLanguage(card, language));
    } catch (error) {
      throw error;
    }
  }

  // Get a specific card by name
  async getCardByName(name: string): Promise<TarotCard> {
    if (!supabase) {
      throw new Error('Supabase not configured - cannot fetch specific card');
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .or(`name->en.eq.${name},name->es.eq.${name}`)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return transformCardFromDB(data);
    } catch (error) {
      throw error;
    }
  }

  // Get a specific card by short name
  async getCardByNameShort(nameShort: string): Promise<TarotCard> {
    if (!supabase) {
      throw new Error('Supabase not configured - cannot fetch specific card');
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('name_short', nameShort)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return transformCardFromDB(data);
    } catch (error) {
      throw error;
    }
  }

  // Get a random card
  async getRandomCard(): Promise<TarotCard> {
    if (!supabase) {
      throw new Error('Supabase not configured - cannot fetch random card');
    }
    
    try {
      // First get all cards to select randomly from
      const { data: allCards, error: fetchError } = await supabase
        .from('cards')
        .select('*');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!allCards || allCards.length === 0) {
        throw new Error('No cards found in database');
      }

      // Select a random card
      const randomIndex = Math.floor(Math.random() * allCards.length);
      const randomCard = allCards[randomIndex];

      return transformCardFromDB(randomCard);
    } catch (error) {
      throw error;
    }
  }

  // Get multiple random cards
  async getRandomCards(count: number): Promise<TarotCardDetail[]> {
    if (!supabase) {
      throw new Error('Supabase not configured. Please update credentials in src/services/supabaseAPI.ts');
    }
    
    try {
      // First get all cards to select randomly from
      const { data: allCards, error: fetchError } = await supabase
        .from('cards')
        .select('*');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!allCards || allCards.length === 0) {
        throw new Error('No cards found in database');
      }

      // Select random cards
      const shuffled = [...allCards].sort(() => 0.5 - Math.random());
      const selectedCards = shuffled.slice(0, Math.min(count, allCards.length));

      return selectedCards.map(card => transformCardFromDB(card));
    } catch (error) {
      throw error;
    }
  }

  // Get cards by suit
  async getCardsBySuit(suit: string): Promise<TarotCard[]> {
    if (!supabase) {
      throw new Error('Supabase not configured. Please update credentials in src/services/supabaseAPI.ts');
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .not('suit', 'is', null)
        .or(`suit->en.eq.${suit},suit->es.eq.${suit}`)
        .order('name_short');

      if (error) {
        throw new Error(error.message);
      }

      return data.map(card => transformCardFromDB(card));
    } catch (error) {
      throw error;
    }
  }

  // Get cards by type (major/minor arcana)
  async getCardsByType(type: 'major' | 'minor'): Promise<TarotCard[]> {
    if (!supabase) {
      throw new Error('Supabase not configured. Please update credentials in src/services/supabaseAPI.ts');
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('type', type)
        .order('name_short');

      if (error) {
        throw new Error(error.message);
      }

      return data.map(card => transformCardFromDB(card));
    } catch (error) {
      throw error;
    }
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
    if (!supabase) {
      throw new Error('Supabase not configured. Please update credentials in src/services/supabaseAPI.ts');
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .or(`name->en.ilike.%${query}%,name->es.ilike.%${query}%,name_short.ilike.%${query}%`)
        .order('name_short');

      if (error) {
        throw new Error(error.message);
      }

      return data.map(card => transformCardFromDB(card));
    } catch (error) {
      throw error;
    }
  }

  // Get tutorials with language support
  async getTutorials(language: string = 'en'): Promise<any[]> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty array');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) {
        throw new Error(error.message);
      }

      return data.map(tutorial => ({
        section_key: tutorial.section_key,
        title: tutorial.title[language] || tutorial.title.en,
        content: tutorial.content[language] || tutorial.content.en
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get a specific tutorial section with language support
  async getTutorialSection(sectionKey: string, language: string = 'en'): Promise<any> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty object');
      return {};
    }
    
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('section_key', sectionKey)
        .eq('is_active', true)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Transform the data to use the selected language
      return {
        section_key: data.section_key,
        title: data.title[language] || data.title.en,
        content: data.content[language] || data.content.en
      };
    } catch (error) {
      throw error;
    }
  }

  // Admin functions for updating cards
  async updateCard(cardId: string, updates: Partial<{
    name: { en: string; es?: string };
    value: { en: string; es?: string };
    meaning_up: { en: string; es?: string };
    meaning_rev: { en: string; es?: string };
    description: { en: string; es?: string };
    suit?: { en: string; es?: string };
  }>): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('name_short', cardId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      throw error;
    }
  }

  // Get all cards for admin interface
  async getAllCardsForAdmin(): Promise<any[]> {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty array');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('value_int', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  }
}

// Export a singleton instance
export const supabaseTarotAPI = new SupabaseTarotService();
export default supabaseTarotAPI; 