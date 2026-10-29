import type { DatabaseCard, MultilingualContent, TarotCardLocalized } from '../types/tarot';
import cardsData from '../data/cards.json';
import tutorialsData from '../data/tutorials.json';

/**
 * Card and tutorial data bundled with the app (src/data/*.json); edit those files to change content.
 * Mirrors the lookups the old tarot API did, resolving each field as `content[lang] ?? content.en`.
 */

type Localizable = Partial<Record<string, unknown>> & { en: unknown };

interface TutorialRow {
  section_key: string;
  title: MultilingualContent;
  content: Localizable;
}

export interface TutorialSection {
  section_key: string;
  title: string;
  content: unknown;
}

const cards = cardsData as DatabaseCard[];
const tutorials = tutorialsData as TutorialRow[];

function pickLang(content: MultilingualContent | undefined, lang: string): string {
  if (!content) return '';
  return content[lang as keyof MultilingualContent] ?? content.en ?? '';
}

function pickLangContent(content: Localizable, lang: string): unknown {
  return lang in content ? content[lang] : content.en;
}

function localize(card: DatabaseCard, lang: string): TarotCardLocalized {
  return {
    name_short: card.name_short,
    name: pickLang(card.name, lang),
    name_en: card.name.en,
    type: card.type,
    value: pickLang(card.value, lang),
    value_int: card.value_int,
    meaning_up: pickLang(card.meaning_up, lang),
    meaning_rev: pickLang(card.meaning_rev, lang),
    desc: pickLang(card.description, lang),
    suit: card.suit ? pickLang(card.suit, lang) : undefined,
    image_path: card.image_path,
  };
}

function notFound(what: string): Error {
  return new Error(`${what} not found`);
}

const byNameShort = (a: DatabaseCard, b: DatabaseCard) => a.name_short.localeCompare(b.name_short);
const byValue = (a: DatabaseCard, b: DatabaseCard) => a.value_int - b.value_int;

function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Methods stay async so the SWR hooks in useTarotAPI.ts don't need to change.
class TarotDataService {
  async getAllCardsWithLanguage(language: string = 'en'): Promise<TarotCardLocalized[]> {
    return [...cards].sort(byNameShort).map((c) => localize(c, language));
  }

  async getCardByNameWithLanguage(name: string, language: string = 'en'): Promise<TarotCardLocalized> {
    const card = cards.find((c) => c.name.en === name);
    if (!card) throw notFound('Card');
    return localize(card, language);
  }

  async getCardByNameShortWithLanguage(
    nameShort: string,
    language: string = 'en'
  ): Promise<TarotCardLocalized> {
    const card = cards.find((c) => c.name_short === nameShort);
    if (!card) throw notFound('Card');
    return localize(card, language);
  }

  async getRandomCardWithLanguage(language: string = 'en'): Promise<TarotCardLocalized> {
    return localize(cards[Math.floor(Math.random() * cards.length)], language);
  }

  async getRandomCardsWithLanguage(count: number, language: string = 'en'): Promise<TarotCardLocalized[]> {
    return shuffled(cards)
      .slice(0, Math.max(1, count))
      .map((c) => localize(c, language));
  }

  async getCardsBySuitWithLanguage(suit: string, language: string = 'en'): Promise<TarotCardLocalized[]> {
    return cards
      .filter((c) => c.suit?.en === suit)
      .sort(byValue)
      .map((c) => localize(c, language));
  }

  async getCardsByTypeWithLanguage(
    type: 'major' | 'minor',
    language: string = 'en'
  ): Promise<TarotCardLocalized[]> {
    return cards
      .filter((c) => c.type === type)
      .sort(byValue)
      .map((c) => localize(c, language));
  }

  async getMajorArcanaWithLanguage(language: string = 'en'): Promise<TarotCardLocalized[]> {
    return this.getCardsByTypeWithLanguage('major', language);
  }

  async getMinorArcanaWithLanguage(language: string = 'en'): Promise<TarotCardLocalized[]> {
    return this.getCardsByTypeWithLanguage('minor', language);
  }

  async searchCardsWithLanguage(query: string, language: string = 'en'): Promise<TarotCardLocalized[]> {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return [...cards]
      .sort(byNameShort)
      .filter((c) =>
        [c.name.en, c.name.es, c.description.en, c.description.es].some((h) =>
          (h ?? '').toLowerCase().includes(needle)
        )
      )
      .map((c) => localize(c, language));
  }

  async getTutorials(language: string = 'en'): Promise<TutorialSection[]> {
    return tutorials.map((t) => ({
      section_key: t.section_key,
      title: pickLang(t.title, language),
      content: pickLangContent(t.content, language),
    }));
  }

  async getTutorialSection(sectionKey: string, language: string = 'en'): Promise<TutorialSection> {
    const section = (await this.getTutorials(language)).find((t) => t.section_key === sectionKey);
    if (!section) throw notFound('Tutorial');
    return section;
  }
}

export const tarotDataAPI = new TarotDataService();
export default tarotDataAPI;
