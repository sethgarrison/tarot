import React from 'react';
import { useTranslations } from '../../../utils/translationUtils';

interface TutorialSuitsProps {
  content: any;
  title: string;
}

export const TutorialSuits: React.FC<TutorialSuitsProps> = ({ content, title }) => {
  const { t } = useTranslations();

  if (!content) return null;

  console.log('suits', content);

  return (
    <div className="tutorial-section">
      <div className="section-header">
        <h2>{title}</h2>
        <h3 className="subtitle">{content.subtitle}</h3>
        <p className="section-description">{content.description}</p>
      </div>

      <div className="suits-grid">
        {content.suits && typeof content.suits === 'object' ? Object.entries(content.suits).map(([key, suit]: [string, any]) => (
          <div key={key} className="suit-card">
            <div className="suit-header">
              <h4>{suit.name}</h4>
            </div>
            <div className="suit-content">
              <p><strong>Element:</strong> {suit.element}</p>
              <p><strong>Keywords:</strong> {Array.isArray(suit.keywords) ? suit.keywords.join(', ') : 'N/A'}</p>
              <p><strong>Description:</strong> {suit.description}</p>
              {suit.life_areas && Array.isArray(suit.life_areas) && (
                <div className="life-areas">
                  <strong>Life Areas:</strong>
                  <ul>
                    {suit.life_areas.map((area: string, index: number) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              )}
              {suit.personality_traits && Array.isArray(suit.personality_traits) && (
                <div className="personality-traits">
                  <strong>Personality Traits:</strong>
                  <ul>
                    {suit.personality_traits.map((trait: string, index: number) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="suit-card">
            <p>{t('tutorialComponents.fallbacks.noSuitInfo')}</p>
          </div>
        )}
      </div>
    </div>
  );
}; 