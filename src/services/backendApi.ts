import type { TarotCard, TarotCardDetail, TarotCardLocalized } from '../types/tarot';

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '';

const ADMIN_SESSION_KEY = 'tarot_admin_api_key';

export function setAdminSessionToken(token: string): void {
  sessionStorage.setItem(ADMIN_SESSION_KEY, token);
}

export function getAdminSessionToken(): string | null {
  return sessionStorage.getItem(ADMIN_SESSION_KEY);
}

export function clearAdminSessionToken(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = API_BASE.replace(/\/$/, '');
  return base ? `${base}${p}` : p;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Map API card DTO (one language) to TarotCard */
function rowToTarotCard(row: Record<string, unknown>): TarotCard {
  return {
    name_short: row.name_short as string,
    name: row.name as string,
    type: row.type as string,
    value: row.value as string,
    value_int: row.value_int as number,
    meaning_up: row.meaning_up as string,
    meaning_rev: row.meaning_rev as string,
    desc: row.desc as string,
    suit: row.suit as string | undefined,
  };
}

class BackendTarotService {
  async getAllCards(): Promise<TarotCard[]> {
    const rows = await fetchJson<Record<string, unknown>[]>(apiUrl(`/api/cards?lang=en`));
    return rows.map(rowToTarotCard);
  }

  async getAllCardsWithLanguage(language: string = 'en'): Promise<TarotCardLocalized[]> {
    return fetchJson(apiUrl(`/api/cards?lang=${encodeURIComponent(language)}`));
  }

  async getCardByNameWithLanguage(
    name: string,
    language: string = 'en'
  ): Promise<TarotCardLocalized> {
    return fetchJson(
      apiUrl(
        `/api/cards/by-name-lang?name=${encodeURIComponent(name)}&lang=${encodeURIComponent(language)}`
      )
    );
  }

  async getCardByNameShortWithLanguage(
    nameShort: string,
    language: string = 'en'
  ): Promise<TarotCardLocalized> {
    return fetchJson(
      apiUrl(
        `/api/cards/by-short/${encodeURIComponent(nameShort)}?lang=${encodeURIComponent(language)}`
      )
    );
  }

  async getRandomCardWithLanguage(language: string = 'en'): Promise<TarotCardLocalized> {
    return fetchJson(apiUrl(`/api/cards/random?lang=${encodeURIComponent(language)}`));
  }

  async getRandomCardsWithLanguage(
    count: number,
    language: string = 'en'
  ): Promise<TarotCardLocalized[]> {
    return fetchJson(
      apiUrl(
        `/api/cards/random-many?count=${encodeURIComponent(String(count))}&lang=${encodeURIComponent(language)}`
      )
    );
  }

  async getCardsBySuitWithLanguage(
    suit: string,
    language: string = 'en'
  ): Promise<TarotCardLocalized[]> {
    return fetchJson(
      apiUrl(
        `/api/cards/by-suit/${encodeURIComponent(suit)}?lang=${encodeURIComponent(language)}`
      )
    );
  }

  async getCardsByTypeWithLanguage(
    type: 'major' | 'minor',
    language: string = 'en'
  ): Promise<TarotCardLocalized[]> {
    return fetchJson(
      apiUrl(
        `/api/cards/by-type/${encodeURIComponent(type)}?lang=${encodeURIComponent(language)}`
      )
    );
  }

  async getMajorArcanaWithLanguage(language: string = 'en'): Promise<TarotCardLocalized[]> {
    return this.getCardsByTypeWithLanguage('major', language);
  }

  async getMinorArcanaWithLanguage(language: string = 'en'): Promise<TarotCardLocalized[]> {
    return this.getCardsByTypeWithLanguage('minor', language);
  }

  async searchCardsWithLanguage(
    query: string,
    language: string = 'en'
  ): Promise<TarotCardLocalized[]> {
    return fetchJson(
      apiUrl(
        `/api/cards/search?q=${encodeURIComponent(query)}&lang=${encodeURIComponent(language)}`
      )
    );
  }

  async getCardByName(name: string): Promise<TarotCard> {
    const row = await fetchJson<Record<string, unknown>>(
      apiUrl(`/api/cards/by-name?name=${encodeURIComponent(name)}&lang=en`)
    );
    return rowToTarotCard(row);
  }

  async getCardByNameShort(nameShort: string): Promise<TarotCard> {
    const row = await fetchJson<Record<string, unknown>>(
      apiUrl(`/api/cards/by-short/${encodeURIComponent(nameShort)}?lang=en`)
    );
    return rowToTarotCard(row);
  }

  async getRandomCard(): Promise<TarotCard> {
    const row = await fetchJson<Record<string, unknown>>(apiUrl('/api/cards/random?lang=en'));
    return rowToTarotCard(row);
  }

  async getRandomCards(count: number): Promise<TarotCardDetail[]> {
    const rows = await fetchJson<Record<string, unknown>[]>(
      apiUrl(`/api/cards/random-many?count=${encodeURIComponent(String(count))}&lang=en`)
    );
    return rows.map(rowToTarotCard);
  }

  async getCardsBySuit(suit: string): Promise<TarotCard[]> {
    const rows = await fetchJson<Record<string, unknown>[]>(
      apiUrl(`/api/cards/by-suit/${encodeURIComponent(suit)}?lang=en`)
    );
    return rows.map(rowToTarotCard);
  }

  async getCardsByType(type: 'major' | 'minor'): Promise<TarotCard[]> {
    const rows = await fetchJson<Record<string, unknown>[]>(
      apiUrl(`/api/cards/by-type/${encodeURIComponent(type)}?lang=en`)
    );
    return rows.map(rowToTarotCard);
  }

  async getMajorArcana(): Promise<TarotCard[]> {
    return this.getCardsByType('major');
  }

  async getMinorArcana(): Promise<TarotCard[]> {
    return this.getCardsByType('minor');
  }

  async searchCards(query: string): Promise<TarotCard[]> {
    const rows = await fetchJson<Record<string, unknown>[]>(
      apiUrl(`/api/cards/search?q=${encodeURIComponent(query)}&lang=en`)
    );
    return rows.map(rowToTarotCard);
  }

  async getTutorials(language: string = 'en'): Promise<
    { section_key: string; title: string; content: unknown }[]
  > {
    return fetchJson(apiUrl(`/api/tutorials?lang=${encodeURIComponent(language)}`));
  }

  async getTutorialSection(
    sectionKey: string,
    language: string = 'en'
  ): Promise<{ section_key: string; title: string; content: unknown }> {
    return fetchJson(
      apiUrl(
        `/api/tutorials/section/${encodeURIComponent(sectionKey)}?lang=${encodeURIComponent(language)}`
      )
    );
  }

  async updateCard(
    cardId: string,
    updates: Partial<{
      name: { en: string; es?: string };
      value: { en: string; es?: string };
      meaning_up: { en: string; es?: string };
      meaning_rev: { en: string; es?: string };
      description: { en: string; es?: string };
      suit?: { en: string; es?: string };
    }>
  ): Promise<void> {
    const token = getAdminSessionToken();
    if (!token) {
      throw new Error('Admin session: open /admin and enter your API key');
    }
    await fetchJson(apiUrl(`/api/admin/cards/${encodeURIComponent(cardId)}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
  }

  async getAllCardsForAdmin(): Promise<unknown[]> {
    const token = getAdminSessionToken();
    if (!token) {
      throw new Error('Admin session: enter your API key');
    }
    return fetchJson(apiUrl('/api/admin/cards'), {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export const tarotDataAPI = new BackendTarotService();
export default tarotDataAPI;
