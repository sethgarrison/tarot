import { createClient } from '@supabase/supabase-js';
import type { TarotCard, TarotCardDetail } from '../types/tarot';

// Supabase configuration - using environment variables only
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid credentials
const hasValidCredentials = supabaseUrl && supabaseKey;

if (!hasValidCredentials) {
  console.error('❌ Supabase credentials not configured properly');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  console.error('For development: create a .env file');
  console.error('For production: set environment variables in your deployment platform');
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
    type: dbCard.type,
    value: (dbCard.value as any)[language] || dbCard.value.en,
    value_int: dbCard.value_int,
    meaning_up: (dbCard.meaning_up as any)[language] || dbCard.meaning_up.en,
    meaning_rev: (dbCard.meaning_rev as any)[language] || dbCard.meaning_rev.en,
    description: (dbCard.description as any)[language] || dbCard.description.en,
    suit: dbCard.suit ? ((dbCard.suit as any)[language] || dbCard.suit.en) : undefined,
    image_path: dbCard.image_path
  };
}

class SupabaseTarotService {
  // Get all cards
  async getAllCards(): Promise<TarotCard[]> {
    if (!supabase) {
      throw new Error('Supabase not configured. Please update credentials in src/services/supabaseAPI.ts');
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
      throw new Error('Supabase not configured. Please update credentials in src/services/supabaseAPI.ts');
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

  // Get a specific card by name
  async getCardByName(name: string): Promise<TarotCard> {
    if (!supabase) {
      throw new Error('Supabase not configured. Please update credentials in src/services/supabaseAPI.ts');
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
      throw new Error('Supabase not configured. Please update credentials in src/services/supabaseAPI.ts');
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

  // Get tutorials
  async getTutorials(language: string = 'en'): Promise<any[]> {
    if (!supabase) {
      throw new Error('Supabase not configured. Please update credentials in src/services/supabaseAPI.ts');
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

  // Get a specific tutorial section
  async getTutorialSection(sectionKey: string, language: string = 'en'): Promise<any> {
    if (!supabase) {
      throw new Error('Supabase not configured. Please update credentials in src/services/supabaseAPI.ts');
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

      return {
        section_key: data.section_key,
        title: data.title[language] || data.title.en,
        content: data.content[language] || data.content.en
      };
    } catch (error) {
      throw error;
    }
  }
}

// Export a singleton instance
export const supabaseTarotAPI = new SupabaseTarotService();
export default supabaseTarotAPI; 