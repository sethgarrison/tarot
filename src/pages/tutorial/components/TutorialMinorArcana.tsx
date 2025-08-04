import React, { useState } from 'react';

interface TutorialMinorArcanaProps {
  content: any;
  title: string;
}

interface NumberCard {
  number: string;
  name: string;
  keywords: string[];
  description: string;
}

interface CourtCard {
  name: string;
  keywords: string[];
  description: string;
}

export const TutorialMinorArcana: React.FC<TutorialMinorArcanaProps> = ({ content, title }) => {
  const [selectedSuit, setSelectedSuit] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<string>('');

  if (!content || !content.suits) return null;

  const numberCards: NumberCard[] = [
    { number: 'ace', name: 'Ace', keywords: ['new beginnings', 'potential', 'opportunity', 'pure energy'], description: 'The Ace represents the pure essence of the suit, new beginnings, and unlimited potential.' },
    { number: '2', name: 'Two', keywords: ['partnership', 'balance', 'choice', 'harmony'], description: 'The Two represents partnership, balance, and the need to make choices.' },
    { number: '3', name: 'Three', keywords: ['creativity', 'growth', 'expansion', 'collaboration'], description: 'The Three represents creativity, growth, and the power of collaboration.' },
    { number: '4', name: 'Four', keywords: ['stability', 'foundation', 'security', 'structure'], description: 'The Four represents stability, foundation, and creating solid structures.' },
    { number: '5', name: 'Five', keywords: ['challenge', 'conflict', 'change', 'adaptation'], description: 'The Five represents challenges, conflicts, and the need to adapt to change.' },
    { number: '6', name: 'Six', keywords: ['harmony', 'balance', 'resolution', 'cooperation'], description: 'The Six represents harmony, balance, and finding resolution to conflicts.' },
    { number: '7', name: 'Seven', keywords: ['assessment', 'evaluation', 'reflection', 'perseverance'], description: 'The Seven represents assessment, evaluation, and the need to persevere.' },
    { number: '8', name: 'Eight', keywords: ['movement', 'progress', 'action', 'momentum'], description: 'The Eight represents movement, progress, and taking decisive action.' },
    { number: '9', name: 'Nine', keywords: ['completion', 'fulfillment', 'satisfaction', 'preparation'], description: 'The Nine represents completion, fulfillment, and preparation for the final stage.' },
    { number: '10', name: 'Ten', keywords: ['completion', 'culmination', 'fullness', 'end of cycle'], description: 'The Ten represents the completion of a cycle and the fullness of experience.' }
  ];

  const courtCards: CourtCard[] = [
    { name: 'Page', keywords: ['learning', 'curiosity', 'new skills', 'messages'], description: 'The Page represents learning, curiosity, and the beginning of a new journey.' },
    { name: 'Knight', keywords: ['action', 'movement', 'adventure', 'impulsiveness'], description: 'The Knight represents action, movement, and taking bold steps forward.' },
    { name: 'Queen', keywords: ['nurturing', 'wisdom', 'maturity', 'emotional intelligence'], description: 'The Queen represents nurturing, wisdom, and emotional maturity.' },
    { name: 'King', keywords: ['authority', 'leadership', 'mastery', 'control'], description: 'The King represents authority, leadership, and mastery of the suit\'s domain.' }
  ];

  const getCombinationInterpretation = (suit: string, card: string) => {
    const suitInfo = content.suits[suit];
    if (!suitInfo) return 'Select a suit first.';
    
    const isNumberCard = numberCards.some(nc => nc.number === card);
    const isCourtCard = courtCards.some(cc => cc.name.toLowerCase() === card);
    
    if (isNumberCard) {
      const numberInfo = numberCards.find(nc => nc.number === card);
      return `${numberInfo?.name} of ${suitInfo.name}: ${numberInfo?.description} In the context of ${suitInfo.name} (${suitInfo.element}), this represents ${numberInfo?.keywords.join(', ')}.`;
    } else if (isCourtCard) {
      const courtInfo = courtCards.find(cc => cc.name.toLowerCase() === card);
      return `${courtInfo?.name} of ${suitInfo.name}: ${courtInfo?.description} In the context of ${suitInfo.name} (${suitInfo.element}), this represents ${courtInfo?.keywords.join(', ')}.`;
    }
    
    return 'Select a card to see its interpretation.';
  };

  const handleSuitSelect = (suit: string) => {
    setSelectedSuit(suit);
    setSelectedCard(''); // Reset card selection when suit changes
  };

  const handleCardSelect = (card: string) => {
    setSelectedCard(card);
  };

  return (
    <div className="tutorial-section">
      <div className="section-header">
        <h2>{title}</h2>
        <h3 className="subtitle">{content.subtitle}</h3>
        <p className="section-description">{content.description}</p>
      </div>

      {/* Suit Selection */}
      <div className="suit-selection">
        <h3>Choose a Suit</h3>
        <div className="suit-buttons">
          {Object.entries(content.suits).map(([key, suit]: [string, any]) => (
            <button
              key={key}
              className={`suit-button ${selectedSuit === key ? 'active' : ''}`}
              onClick={() => handleSuitSelect(key)}
            >
              <div className="suit-name">{suit.name}</div>
              <div className="suit-element">{suit.element}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Suit Info */}
      {selectedSuit && content.suits[selectedSuit] && (
        <div className="selected-suit-info">
          <h4>{content.suits[selectedSuit].name} ({content.suits[selectedSuit].element})</h4>
          <p>{content.suits[selectedSuit].description}</p>
          <div className="keywords">
            <strong>Keywords:</strong> {content.suits[selectedSuit].keywords.join(', ')}
          </div>
          {content.suits[selectedSuit].life_areas && (
            <div className="life-areas">
              <strong>Life Areas:</strong>
              <ul>
                {content.suits[selectedSuit].life_areas.map((area: string, index: number) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          )}
          {content.suits[selectedSuit].personality_traits && (
            <div className="personality-traits">
              <strong>Personality Traits:</strong>
              <ul>
                {content.suits[selectedSuit].personality_traits.map((trait: string, index: number) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Card Selection */}
      {selectedSuit && (
        <div className="card-selection">
          <h3>Choose a Card</h3>
          
          {/* Number Cards */}
          <div className="card-group">
            <h4>Number Cards</h4>
            <div className="card-buttons">
              {numberCards.map((card) => (
                <button
                  key={card.number}
                  className={`card-button ${selectedCard === card.number ? 'active' : ''}`}
                  onClick={() => handleCardSelect(card.number)}
                >
                  {card.name}
                </button>
              ))}
            </div>
          </div>

          {/* Court Cards */}
          <div className="card-group">
            <h4>Court Cards</h4>
            <div className="card-buttons">
              {courtCards.map((card) => (
                <button
                  key={card.name}
                  className={`card-button ${selectedCard === card.name.toLowerCase() ? 'active' : ''}`}
                  onClick={() => handleCardSelect(card.name.toLowerCase())}
                >
                  {card.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Card Info */}
      {selectedCard && (
        <div className="selected-card-info">
          {(() => {
            const isNumberCard = numberCards.some(nc => nc.number === selectedCard);
            const isCourtCard = courtCards.some(cc => cc.name.toLowerCase() === selectedCard);
            
            if (isNumberCard) {
              const card = numberCards.find(nc => nc.number === selectedCard);
              return (
                <>
                  <h4>{card?.name}</h4>
                  <p>{card?.description}</p>
                  <div className="keywords">
                    <strong>Keywords:</strong> {card?.keywords.join(', ')}
                  </div>
                </>
              );
            } else if (isCourtCard) {
              const card = courtCards.find(cc => cc.name.toLowerCase() === selectedCard);
              return (
                <>
                  <h4>{card?.name}</h4>
                  <p>{card?.description}</p>
                  <div className="keywords">
                    <strong>Keywords:</strong> {card?.keywords.join(', ')}
                  </div>
                </>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Combined Interpretation */}
      {selectedSuit && selectedCard && (
        <div className="combination-interpretation">
          <h3>Combined Interpretation</h3>
          <div className="interpretation-content">
            <p>{getCombinationInterpretation(selectedSuit, selectedCard)}</p>
          </div>
        </div>
      )}
    </div>
  );
}; 