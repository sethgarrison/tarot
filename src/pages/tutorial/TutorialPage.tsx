import React, { useState } from 'react';
import { useTutorials, useTutorialSection } from '../../hooks/useTarotAPI';
import { useLanguage } from '../../App';
import { TutorialOverview, TutorialMajorArcana, TutorialMinorArcana, TutorialSuits } from './components';
import './TutorialPage.css';

interface TutorialPageProps {
  className?: string;
}

export const TutorialPage: React.FC<TutorialPageProps> = ({ className = '' }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const { currentLanguage } = useLanguage();

  // Fetch tutorials data using global language
  const { error: tutorialsError, isLoading: tutorialsLoading } = useTutorials(currentLanguage);
  const { data: activeTutorialData, error: sectionError, isLoading: sectionLoading } = useTutorialSection(activeSection, currentLanguage);
  
  // Fetch suits data when minor arcana is active
  const { data: suitsData, error: suitsError, isLoading: suitsLoading } = useTutorialSection('suits', currentLanguage);

  const sections = [
    { id: 'overview', title: 'Overview', image: '/tarot-gold-1.png' },
    { id: 'major_arcana', title: 'Major Arcana', image: '/tarot-gold-2.png' },
    { id: 'minor_arcana', title: 'Minor Arcana', image: '/tarot-gold-3.png' },
    { id: 'suits', title: 'Suits', image: '/tarot-gold-4.png' }
  ];

  const renderSection = () => {
    if (!activeTutorialData) return null;
    
    const content = activeTutorialData.content;
    const title = activeTutorialData.title;

    switch (activeSection) {
      case 'overview':
        return <TutorialOverview content={content} />;
      case 'major_arcana':
        return <TutorialMajorArcana content={content} title={title} />;
      case 'minor_arcana':
        // Pass both minor arcana and suits data
        const combinedContent = {
          ...content,
          suits: suitsData?.content?.suits || {}
        };
        return <TutorialMinorArcana content={combinedContent} title={title} />;
      case 'suits':
        return <TutorialSuits content={content} title={title} />;
      default:
        return <TutorialOverview content={content} />;
    }
  };

  if (tutorialsError || sectionError || (activeSection === 'minor_arcana' && suitsError)) {
    return (
      <div className="tutorial-page">
        <div className="error-message">
          <h3>Tutorial Error</h3>
          <p>Unable to load tutorial content. Please try again later.</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (tutorialsLoading || sectionLoading || (activeSection === 'minor_arcana' && suitsLoading)) {
    return (
      <div className="tutorial-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading tutorial content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`tutorial-page ${className}`}>
      <div className="tutorial-header">
        <h1>Tarot Tutorial</h1>
        <p>Learn the fundamentals of tarot reading and card interpretation</p>
      </div>

      <div className="tutorial-container">
        <div className="tutorial-sidebar">
          <nav className="tutorial-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <img src={section.image} alt={section.title} className="nav-icon" />
                <span className="nav-title">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="tutorial-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default TutorialPage; 