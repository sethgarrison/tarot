export type SpreadId = 'single' | 'three' | 'celtic';

export interface Spread {
  id: SpreadId;
  /** Position keys in the order the cards are laid out; text lives in translations.json */
  positions: string[];
}

export const SPREADS: Spread[] = [
  { id: 'single', positions: ['focus'] },
  { id: 'three', positions: ['past', 'present', 'future'] },
  {
    id: 'celtic',
    positions: [
      'cover',
      'cross',
      'crown',
      'foundation',
      'behind',
      'before',
      'self',
      'environment',
      'hopes',
      'outcome',
    ],
  },
];
