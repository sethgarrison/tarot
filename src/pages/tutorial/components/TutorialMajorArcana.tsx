import React from 'react';
import { TutorialContentCard } from './TutorialContentCard';

interface TutorialMajorArcanaProps {
  content: any;
  title: string;
}

export const TutorialMajorArcana: React.FC<TutorialMajorArcanaProps> = ({ content, title }) => {
  if (!content) return null;

  return (
    <div className="tutorial-section">
      <div className="section-header">
        <h2>{title}</h2>
        <h3 className="subtitle">{content.subtitle}</h3>
        <p className="section-description">{content.description}</p>
      </div>

      <div className="content-grid">
        <TutorialContentCard title="Characteristics">
          <ul>
            {Array.isArray(content.characteristics) ? content.characteristics.map((char: string, index: number) => (
              <li key={index}>{char}</li>
            )) : (
              <li>{typeof content.characteristics === 'string' ? content.characteristics : 'No characteristics available'}</li>
            )}
          </ul>
        </TutorialContentCard>

        <TutorialContentCard title="Numbering">
          <p>{typeof content.numbering === 'string' ? content.numbering : JSON.stringify(content.numbering)}</p>
        </TutorialContentCard>

        <TutorialContentCard title="Themes">
          <ul>
            {Array.isArray(content.themes) ? content.themes.map((theme: string, index: number) => (
              <li key={index}>{theme}</li>
            )) : (
              <li>{typeof content.themes === 'string' ? content.themes : 'No themes available'}</li>
            )}
          </ul>
        </TutorialContentCard>
      </div>
    </div>
  );
}; 