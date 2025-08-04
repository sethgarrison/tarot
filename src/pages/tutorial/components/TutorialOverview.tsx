import React from 'react';
import { useTranslations } from '../../../utils/translationUtils';
import { TutorialSectionHeader } from './TutorialSectionHeader';
import { TutorialContentCard } from './TutorialContentCard';

interface TutorialOverviewProps {
  content: any;
}

export const TutorialOverview: React.FC<TutorialOverviewProps> = ({ content }) => {
  const { t } = useTranslations();

  if (!content) return null;

  return (
    <div className="tutorial-section">
      {/* History Section */}
      <div className="overview-section">
        <TutorialSectionHeader 
          title={t('tutorialComponents.sections.history')} 
          imageSrc="/tarot-gold-1.png" 
          imageAlt={t('tutorialComponents.sections.history')} 
        />
        <TutorialContentCard>
          <p>{typeof content.history === 'string' ? content.history : t('tutorialComponents.fallbacks.historyNotAvailable')}</p>
        </TutorialContentCard>
      </div>

      {/* Cards Overview */}
      <div className="overview-section">
        <TutorialSectionHeader 
          title={t('tutorialComponents.sections.cards')} 
          imageSrc="/tarot-gold-2.png" 
          imageAlt={t('tutorialComponents.sections.cards')} 
        />
        <TutorialContentCard>
          <p>{typeof content.cards_overview === 'string' ? content.cards_overview : t('tutorialComponents.fallbacks.cardsOverviewNotAvailable')}</p>
        </TutorialContentCard>
      </div>

      {/* Major Arcana Overview */}
      <div className="overview-section">
        <TutorialSectionHeader 
          title={t('tutorialComponents.sections.majorArcana')} 
          imageSrc="/tarot-gold-3.png" 
          imageAlt={t('tutorialComponents.sections.majorArcana')} 
        />
        <TutorialContentCard>
          <p>{typeof content.major_arcana_overview === 'string' ? content.major_arcana_overview : t('tutorialComponents.fallbacks.majorArcanaOverviewNotAvailable')}</p>
        </TutorialContentCard>
      </div>

      {/* Minor Arcana Overview */}
      <div className="overview-section">
        <TutorialSectionHeader 
          title={t('tutorialComponents.sections.minorArcana')} 
          imageSrc="/tarot-gold-4.png" 
          imageAlt={t('tutorialComponents.sections.minorArcana')} 
        />
        <TutorialContentCard>
          <p>{typeof content.minor_arcana_overview === 'string' ? content.minor_arcana_overview : t('tutorialComponents.fallbacks.minorArcanaOverviewNotAvailable')}</p>
        </TutorialContentCard>
      </div>

      {/* Interesting Trivia */}
      <div className="overview-section">
        <TutorialSectionHeader 
          title={t('tutorialComponents.sections.interestingTrivia')} 
          imageSrc="/tarot-gold-1.png" 
          imageAlt={t('tutorialComponents.sections.interestingTrivia')} 
        />
        <TutorialContentCard>
          {Array.isArray(content.trivia) ? (
            <ul>
              {content.trivia.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{typeof content.trivia === 'string' ? content.trivia : t('tutorialComponents.fallbacks.triviaNotAvailable')}</p>
          )}
        </TutorialContentCard>
      </div>
    </div>
  );
}; 