import React from 'react';
import { TutorialSectionHeader } from './TutorialSectionHeader';
import { TutorialContentCard } from './TutorialContentCard';

interface TutorialOverviewProps {
  content: any;
}

export const TutorialOverview: React.FC<TutorialOverviewProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="tutorial-section">
      {/* History Section */}
      <div className="overview-section">
        <TutorialSectionHeader 
          title="History" 
          imageSrc="/tarot-gold-1.png" 
          imageAlt="History" 
        />
        <TutorialContentCard>
          <p>{typeof content.history === 'string' ? content.history : 'History content not available'}</p>
        </TutorialContentCard>
      </div>

      {/* Cards Overview */}
      <div className="overview-section">
        <TutorialSectionHeader 
          title="Cards" 
          imageSrc="/tarot-gold-2.png" 
          imageAlt="Cards" 
        />
        <TutorialContentCard>
          <p>{typeof content.cards_overview === 'string' ? content.cards_overview : 'Cards overview not available'}</p>
        </TutorialContentCard>
      </div>

      {/* Major Arcana Overview */}
      <div className="overview-section">
        <TutorialSectionHeader 
          title="Major Arcana" 
          imageSrc="/tarot-gold-3.png" 
          imageAlt="Major Arcana" 
        />
        <TutorialContentCard>
          <p>{typeof content.major_arcana_overview === 'string' ? content.major_arcana_overview : 'Major Arcana overview not available'}</p>
        </TutorialContentCard>
      </div>

      {/* Minor Arcana Overview */}
      <div className="overview-section">
        <TutorialSectionHeader 
          title="Minor Arcana" 
          imageSrc="/tarot-gold-4.png" 
          imageAlt="Minor Arcana" 
        />
        <TutorialContentCard>
          <p>{typeof content.minor_arcana_overview === 'string' ? content.minor_arcana_overview : 'Minor Arcana overview not available'}</p>
        </TutorialContentCard>
      </div>

      {/* Interesting Trivia */}
      <div className="overview-section">
        <TutorialSectionHeader 
          title="Interesting Trivia" 
          imageSrc="/tarot-gold-1.png" 
          imageAlt="Trivia" 
        />
        <TutorialContentCard>
          {Array.isArray(content.trivia) ? (
            <ul>
              {content.trivia.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{typeof content.trivia === 'string' ? content.trivia : 'Trivia not available'}</p>
          )}
        </TutorialContentCard>
      </div>
    </div>
  );
}; 