import React, { useState } from 'react';
import { useTutorials, useTutorialSection } from '../hooks/useTarotAPI';
import './TutorialPage.css';

interface TutorialPageProps {
  className?: string;
}

export const TutorialPage: React.FC<TutorialPageProps> = ({ className = '' }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [language, setLanguage] = useState<string>('en');

  // Fetch tutorials data
  const { error: tutorialsError, isLoading: tutorialsLoading } = useTutorials(language);
  const { data: activeTutorialData, error: sectionError, isLoading: sectionLoading } = useTutorialSection(activeSection, language);

  const sections = [
    { id: 'overview', title: 'Overview', icon: '🔮' },
    { id: 'major_arcana', title: 'Major Arcana', icon: '⭐' },
    { id: 'minor_arcana', title: 'Minor Arcana', icon: '✨' },
    { id: 'suits', title: 'Suits', icon: '🎴' }
  ];

  const renderOverview = () => {
    if (!activeTutorialData) return null;
    
    const content = activeTutorialData.content;
    
    return (
      <div className="tutorial-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{content.total_cards}</div>
            <div className="stat-label">Total Cards</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{content.major_arcana_count}</div>
            <div className="stat-label">Major Arcana</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{content.minor_arcana_count}</div>
            <div className="stat-label">Minor Arcana</div>
          </div>
        </div>
      </div>
    );
  };

  const renderMajorArcana = () => {
    if (!activeTutorialData) return null;
    
    const content = activeTutorialData.content;
    
    return (
      <div className="tutorial-section">
        <div className="section-header">
          <h2>{activeTutorialData.title}</h2>
          <h3 className="subtitle">{content.subtitle}</h3>
          <p className="section-description">{content.description}</p>
        </div>

        <div className="content-grid">
          <div className="content-card">
            <h4>Characteristics</h4>
            <ul>
              {content.characteristics?.map((char: string, index: number) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>

          <div className="content-card">
            <h4>Numbering</h4>
            <p>{content.numbering}</p>
          </div>

          <div className="content-card">
            <h4>Themes</h4>
            <ul>
              {content.themes?.map((theme: string, index: number) => (
                <li key={index}>{theme}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderMinorArcana = () => {
    if (!activeTutorialData) return null;
    
    const content = activeTutorialData.content;
    
    return (
      <div className="tutorial-section">
        <div className="section-header">
          <h2>{activeTutorialData.title}</h2>
          <h3 className="subtitle">{content.subtitle}</h3>
          <p className="section-description">{content.description}</p>
        </div>

        <div className="content-grid">
          <div className="content-card">
            <h4>Characteristics</h4>
            <ul>
              {content.characteristics?.map((char: string, index: number) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>

          <div className="content-card">
            <h4>Structure</h4>
            <div className="structure-info">
              <p><strong>Suits:</strong> {content.structure?.suits}</p>
              <p><strong>Cards per suit:</strong> {content.structure?.cards_per_suit}</p>
              <p><strong>Number cards:</strong> {content.structure?.number_cards}</p>
              <p><strong>Court cards:</strong> {content.structure?.court_cards}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSuits = () => {
    if (!activeTutorialData) return null;
    
    const content = activeTutorialData.content;
    
    return (
      <div className="tutorial-section">
        <div className="section-header">
          <h2>{activeTutorialData.title}</h2>
          <p className="section-description">{content.description}</p>
        </div>

        <div className="suits-grid">
          {Object.entries(content).map(([key, suit]: [string, any]) => {
            if (key === 'description') return null;
            
            return (
              <div key={key} className="suit-card">
                <div className="suit-header">
                  <h3>{suit.name}</h3>
                  <span className="element-badge">{suit.element}</span>
                </div>
                <p className="suit-description">{suit.description}</p>
                
                <div className="suit-details">
                  <div className="detail-section">
                    <h4>Keywords</h4>
                    <div className="keywords">
                      {suit.keywords?.map((keyword: string, index: number) => (
                        <span key={index} className="keyword-tag">{keyword}</span>
                      ))}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Life Areas</h4>
                    <ul>
                      {suit.life_areas?.map((area: string, index: number) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="detail-section">
                    <h4>Personality Traits</h4>
                    <ul>
                      {suit.personality_traits?.map((trait: string, index: number) => (
                        <li key={index}>{trait}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'major_arcana':
        return renderMajorArcana();
      case 'minor_arcana':
        return renderMinorArcana();
      case 'suits':
        return renderSuits();
      default:
        return renderOverview();
    }
  };

  // Loading state
  if (tutorialsLoading || sectionLoading) {
    return (
      <div className={`tutorial-page ${className}`}>
        <div className="tutorial-header">
          <h1>🔮 Tarot Tutorial</h1>
          <p>Loading tutorial content...</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (tutorialsError || sectionError) {
    return (
      <div className={`tutorial-page ${className}`}>
        <div className="tutorial-header">
          <h1>🔮 Tarot Tutorial</h1>
          <p>Error loading tutorial content. Please try again later.</p>
        </div>
        <div className="error-message">
          <p>Unable to load tutorial data from the database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`tutorial-page ${className}`}>
      <div className="tutorial-header">
        <h1>🔮 Tarot Tutorial</h1>
        <p>Learn the fundamentals of tarot card reading</p>
        
        {/* Language Switcher */}
        <div className="language-switcher">
          <button 
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            🇺🇸 English
          </button>
          <button 
            className={`lang-btn ${language === 'es' ? 'active' : ''}`}
            onClick={() => setLanguage('es')}
          >
            🇪🇸 Español
          </button>
        </div>
      </div>

      <div className="tutorial-navigation">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-title">{section.title}</span>
          </button>
        ))}
      </div>

      <div className="tutorial-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default TutorialPage; 