import React, { useState, useEffect } from 'react';
import { supabaseTarotAPI } from '../services/supabaseAPI';
import { useLanguage } from '../App';
import { MultilingualText } from '../utils/languageUtils';
import type { DatabaseCard, EditableCard, MultilingualContent } from '../types/tarot';
import './AdminPage.css';

const AdminPage: React.FC = () => {
  const [cards, setCards] = useState<EditableCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'major' | 'minor'>('all');
  const { currentLanguage } = useLanguage();
  const [savingCard, setSavingCard] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{ cardId: string; field: string } | null>(null);
  const [rowChanges, setRowChanges] = useState<Record<string, Partial<DatabaseCard>>>({});

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const cardsData = await supabaseTarotAPI.getAllCardsForAdmin();
      const editableCards: EditableCard[] = cardsData.map((card: DatabaseCard) => ({
        ...card,
        isEditing: false,
        originalData: { ...card },
        hasChanges: false
      }));
      setCards(editableCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const handleCellEdit = (cardId: string, field: string) => {
    setEditingCell({ cardId, field });
  };

  const handleCellChange = (cardId: string, field: string, value: string) => {
    // Track changes for this row
    setRowChanges(prev => {
      const currentChanges = prev[cardId] || {};
      const fieldData = cards.find(c => c.name_short === cardId);
      
      if (!fieldData) return prev;

      let updatedChanges = { ...currentChanges };
      
      if (field === 'name' || field === 'value' || field === 'meaning_up' || field === 'meaning_rev' || field === 'description') {
        const currentField = (fieldData as any)[field] as MultilingualContent;
        updatedChanges[field] = {
          ...currentField,
          [currentLanguage]: value
        };
      } else if (field === 'suit' && fieldData.suit) {
        updatedChanges.suit = {
          ...fieldData.suit,
          [currentLanguage]: value
        };
      }

      return {
        ...prev,
        [cardId]: updatedChanges
      };
    });
  };

  const handleCellSave = async (cardId: string, field: string, value: string) => {
    handleCellChange(cardId, field, value);
    setEditingCell(null);
  };

  const handleCellCancel = () => {
    setEditingCell(null);
  };

  const handleSaveRow = async (cardId: string) => {
    try {
      setSavingCard(cardId);
      const changes = rowChanges[cardId];
      
      if (!changes || Object.keys(changes).length === 0) {
        return;
      }

      await supabaseTarotAPI.updateCard(cardId, changes);

      // Update local state
      setCards(cards.map(c => {
        if (c.name_short === cardId) {
          const updatedCard = { ...c, ...changes };
          return { ...updatedCard, originalData: { ...updatedCard } };
        }
        return c;
      }));

      // Clear changes for this row
      setRowChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[cardId];
        return newChanges;
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save card');
    } finally {
      setSavingCard(null);
    }
  };

  const handleCancelRow = (cardId: string) => {
    // Clear changes for this row
    setRowChanges(prev => {
      const newChanges = { ...prev };
      delete newChanges[cardId];
      return newChanges;
    });
  };

  const getFieldValue = (card: DatabaseCard, field: string): string => {
    if (field === 'suit' && card.suit) {
      return card.suit[currentLanguage] || card.suit.en || '';
    }
    const fieldData = (card as any)[field] as MultilingualContent;
    return fieldData?.[currentLanguage] || fieldData?.en || '';
  };

  const hasRowChanges = (cardId: string): boolean => {
    return !!rowChanges[cardId] && Object.keys(rowChanges[cardId]).length > 0;
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.name_short.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || 
                       (filterType === 'major' && card.type === 'major') ||
                       (filterType === 'minor' && card.type === 'minor');
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading cards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error">Error: {error}</div>
        <button onClick={loadCards}>Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>🔧 Card Management</h2>
        <p>Edit card information and translations</p>
      </div>

      <div className="admin-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as 'all' | 'major' | 'minor')}
            className="filter-select"
          >
            <option value="all">All Cards</option>
            <option value="major">Major Arcana</option>
            <option value="minor">Minor Arcana</option>
          </select>
        </div>

        <div className="stats">
          <span>Total: {cards.length}</span>
          <span>Filtered: {filteredCards.length}</span>
          <span>Modified: {Object.keys(rowChanges).length}</span>
          <span>Language: {currentLanguage.toUpperCase()}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="cards-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Name ({currentLanguage})</th>
              <th>Value ({currentLanguage})</th>
              <th>Suit ({currentLanguage})</th>
              <th>Upright Meaning ({currentLanguage})</th>
              <th>Reversed Meaning ({currentLanguage})</th>
              <th>Description ({currentLanguage})</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.map(card => (
              <tr key={card.name_short} className={`${editingCell?.cardId === card.name_short ? 'editing-row' : ''} ${hasRowChanges(card.name_short) ? 'modified-row' : ''}`}>
                <td className="cell-id">{card.name_short}</td>
                <td className={`cell-type ${card.type}`}>{card.type}</td>
                
                <td className="editable-cell">
                  {editingCell?.cardId === card.name_short && editingCell?.field === 'name' ? (
                    <div className="cell-edit">
                      <input
                        type="text"
                        defaultValue={getFieldValue(card, 'name')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCellSave(card.name_short, 'name', e.currentTarget.value);
                          } else if (e.key === 'Escape') {
                            handleCellCancel();
                          }
                        }}
                        onBlur={(e) => handleCellSave(card.name_short, 'name', e.target.value)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div 
                      className="cell-content"
                      onClick={() => handleCellEdit(card.name_short, 'name')}
                    >
                      <MultilingualText content={card.name} />
                    </div>
                  )}
                </td>

                <td className="editable-cell">
                  {editingCell?.cardId === card.name_short && editingCell?.field === 'value' ? (
                    <div className="cell-edit">
                      <input
                        type="text"
                        defaultValue={getFieldValue(card, 'value')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCellSave(card.name_short, 'value', e.currentTarget.value);
                          } else if (e.key === 'Escape') {
                            handleCellCancel();
                          }
                        }}
                        onBlur={(e) => handleCellSave(card.name_short, 'value', e.target.value)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div 
                      className="cell-content"
                      onClick={() => handleCellEdit(card.name_short, 'value')}
                    >
                      <MultilingualText content={card.value} />
                    </div>
                  )}
                </td>

                <td className="editable-cell">
                  {editingCell?.cardId === card.name_short && editingCell?.field === 'suit' ? (
                    <div className="cell-edit">
                      <input
                        type="text"
                        defaultValue={getFieldValue(card, 'suit')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCellSave(card.name_short, 'suit', e.currentTarget.value);
                          } else if (e.key === 'Escape') {
                            handleCellCancel();
                          }
                        }}
                        onBlur={(e) => handleCellSave(card.name_short, 'suit', e.target.value)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div 
                      className="cell-content"
                      onClick={() => handleCellEdit(card.name_short, 'suit')}
                    >
                      <MultilingualText content={card.suit} />
                    </div>
                  )}
                </td>

                <td className="editable-cell">
                  {editingCell?.cardId === card.name_short && editingCell?.field === 'meaning_up' ? (
                    <div className="cell-edit">
                      <textarea
                        defaultValue={getFieldValue(card, 'meaning_up')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            handleCellSave(card.name_short, 'meaning_up', e.currentTarget.value);
                          } else if (e.key === 'Escape') {
                            handleCellCancel();
                          }
                        }}
                        onBlur={(e) => handleCellSave(card.name_short, 'meaning_up', e.target.value)}
                        autoFocus
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div 
                      className="cell-content"
                      onClick={() => handleCellEdit(card.name_short, 'meaning_up')}
                    >
                      <MultilingualText content={card.meaning_up} />
                    </div>
                  )}
                </td>

                <td className="editable-cell">
                  {editingCell?.cardId === card.name_short && editingCell?.field === 'meaning_rev' ? (
                    <div className="cell-edit">
                      <textarea
                        defaultValue={getFieldValue(card, 'meaning_rev')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            handleCellSave(card.name_short, 'meaning_rev', e.currentTarget.value);
                          } else if (e.key === 'Escape') {
                            handleCellCancel();
                          }
                        }}
                        onBlur={(e) => handleCellSave(card.name_short, 'meaning_rev', e.target.value)}
                        autoFocus
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div 
                      className="cell-content"
                      onClick={() => handleCellEdit(card.name_short, 'meaning_rev')}
                    >
                      <MultilingualText content={card.meaning_rev} />
                    </div>
                  )}
                </td>

                <td className="editable-cell">
                  {editingCell?.cardId === card.name_short && editingCell?.field === 'description' ? (
                    <div className="cell-edit">
                      <textarea
                        defaultValue={getFieldValue(card, 'description')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            handleCellSave(card.name_short, 'description', e.currentTarget.value);
                          } else if (e.key === 'Escape') {
                            handleCellCancel();
                          }
                        }}
                        onBlur={(e) => handleCellSave(card.name_short, 'description', e.target.value)}
                        autoFocus
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div 
                      className="cell-content"
                      onClick={() => handleCellEdit(card.name_short, 'description')}
                    >
                      <MultilingualText content={card.description} />
                    </div>
                  )}
                </td>

                <td className="cell-actions">
                  {savingCard === card.name_short ? (
                    <span className="saving">Saving...</span>
                  ) : hasRowChanges(card.name_short) ? (
                    <div className="row-actions">
                      <button 
                        onClick={() => handleSaveRow(card.name_short)}
                        className="save-btn"
                        title="Save changes"
                      >
                        💾 Save
                      </button>
                      <button 
                        onClick={() => handleCancelRow(card.name_short)}
                        className="cancel-btn"
                        title="Cancel changes"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="edit-hint">Click to edit</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCards.length === 0 && (
        <div className="no-cards">
          <p>No cards found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPage; 