import React, { useState, useMemo } from 'react';
import { useAllCards } from '../../hooks/useTarotAPI';
import { useLanguage } from '../../App';
import TarotCardComponent from '../../components/TarotCard';

import './DeckPage.css';

interface DeckPageProps {
  className?: string;
}

type FilterType = 'all' | 'major' | 'minor';
type SuitFilter = 'all' | 'wands' | 'cups' | 'swords' | 'pentacles';
type CardTypeFilter = 'all' | 'number' | 'court';

export const DeckPage: React.FC<DeckPageProps> = ({ className = '' }) => {
  const { currentLanguage } = useLanguage();
  const { data: allCards, error, isLoading } = useAllCards(currentLanguage);
  
  // Filter states
  const [arcanaFilter, setArcanaFilter] = useState<FilterType>('all');
  const [suitFilter, setSuitFilter] = useState<SuitFilter>('all');
  const [cardTypeFilter, setCardTypeFilter] = useState<CardTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    if (!allCards) return [];

    return allCards
      .filter((card) => {
        // Arcana filter
        if (arcanaFilter !== 'all' && card.type !== arcanaFilter) {
          return false;
        }

        // Suit filter (only applies to minor arcana)
        if (suitFilter !== 'all' && card.type === 'minor') {
          if (card.suit?.toLowerCase() !== suitFilter) {
            return false;
          }
        }

        // Card type filter (only applies to minor arcana)
        if (cardTypeFilter !== 'all' && card.type === 'minor') {
          const valueInt = card.value_int;
          if (cardTypeFilter === 'number' && (valueInt < 1 || valueInt > 10)) {
            return false;
          }
          if (cardTypeFilter === 'court' && (valueInt < 11 || valueInt > 14)) {
            return false;
          }
        }

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            card.name.toLowerCase().includes(query) ||
            card.name_short.toLowerCase().includes(query) ||
            card.suit?.toLowerCase().includes(query) ||
            card.type.toLowerCase().includes(query)
          );
        }

        return true;
      })
      .sort((a, b) => {
        // Sort major arcana by value_int (0-21)
        if (a.type === 'major' && b.type === 'major') {
          return a.value_int - b.value_int;
        }
        
        // Sort minor arcana by suit then by value_int
        if (a.type === 'minor' && b.type === 'minor') {
          const suitOrder = { wands: 0, cups: 1, swords: 2, pentacles: 3 };
          const aSuit = a.suit?.toLowerCase() || '';
          const bSuit = b.suit?.toLowerCase() || '';
          
          if (aSuit !== bSuit) {
            return (suitOrder[aSuit as keyof typeof suitOrder] || 0) - 
                   (suitOrder[bSuit as keyof typeof suitOrder] || 0);
          }
          
          return a.value_int - b.value_int;
        }
        
        // Major arcana comes first
        return a.type === 'major' ? -1 : 1;
      });
  }, [allCards, arcanaFilter, suitFilter, cardTypeFilter, searchQuery]);

  const getFilterStats = () => {
    if (!allCards) return { total: 0, filtered: 0 };
    
    const total = allCards.length;
    const filtered = filteredCards.length;
    
    return { total, filtered };
  };

  const clearFilters = () => {
    setArcanaFilter('all');
    setSuitFilter('all');
    setCardTypeFilter('all');
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className={`deck-page ${className}`}>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading tarot deck...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`deck-page ${className}`}>
        <div className="error-message">
          <h3>Deck Loading Error</h3>
          <p>Unable to load the tarot deck. Please try again later.</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { total, filtered } = getFilterStats();

  return (
    <div className={`deck-page ${className}`}>
      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
            disabled={arcanaFilter === 'all' && suitFilter === 'all' && cardTypeFilter === 'all' && !searchQuery}
          >
            Clear Filters
          </button>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label className="filter-label">Arcana:</label>
            <select 
              value={arcanaFilter} 
              onChange={(e) => setArcanaFilter(e.target.value as FilterType)}
              className="filter-select"
            >
              <option value="all">All Cards</option>
              <option value="major">Major Arcana</option>
              <option value="minor">Minor Arcana</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Suit:</label>
            <select 
              value={suitFilter} 
              onChange={(e) => setSuitFilter(e.target.value as SuitFilter)}
              className="filter-select"
              disabled={arcanaFilter === 'major'}
            >
              <option value="all">All Suits</option>
              <option value="wands">Wands</option>
              <option value="cups">Cups</option>
              <option value="swords">Swords</option>
              <option value="pentacles">Pentacles</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Card Type:</label>
            <select 
              value={cardTypeFilter} 
              onChange={(e) => setCardTypeFilter(e.target.value as CardTypeFilter)}
              className="filter-select"
              disabled={arcanaFilter === 'major'}
            >
              <option value="all">All Types</option>
              <option value="number">Number Cards (Ace-10)</option>
              <option value="court">Court Cards (Page, Knight, Queen, King)</option>
            </select>
          </div>
        </div>

        <div className="filter-stats">
          <span className="stats-text">
            Showing {filtered} of {total} cards
          </span>
          {filtered !== total && (
            <span className="filtered-indicator">
              (Filtered)
            </span>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <div key={card.name_short} className="card-grid-item">
              <TarotCardComponent 
                card={card} 
                showDetails={true}
                flipOnClick={true}
                className="deck-card"
              />
            </div>
          ))
        ) : (
          <div className="no-cards">
            <div className="no-cards-content">
              <span className="no-cards-icon">🔍</span>
              <h3>No cards found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button 
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckPage; 