import React, { useState } from 'react';
import { useTutorials, useTutorialSection } from '../../hooks/useTarotAPI';
import { useLanguage } from '../../App';
import { useTranslations } from '../../utils/translationUtils';
import { TutorialOverview, TutorialMajorArcana, TutorialMinorArcana, TutorialSuits } from './components';
import './TutorialPage.css';

interface TutorialPageProps {
  className?: string;
}

export const TutorialPage: React.FC<TutorialPageProps> = ({ className = '' }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations();

  // Fetch tutorials data using global language
  const { error: tutorialsError, isLoading: tutorialsLoading } = useTutorials(currentLanguage);
  const { data: activeTutorialData, error: sectionError, isLoading: sectionLoading } = useTutorialSection(activeSection, currentLanguage);
  
  // Fetch suits data when minor arcana is active
  const { data: suitsData, error: suitsError, isLoading: suitsLoading } = useTutorialSection('suits', currentLanguage);

  const sections = [
    { id: 'overview', title: t('tutorialComponents.sections.history'), image: '/tarot-gold-1.png' },
    { id: 'major_arcana', title: t('tutorialComponents.sections.majorArcana'), image: '/tarot-gold-2.png' },
    { id: 'minor_arcana', title: t('tutorialComponents.sections.minorArcana'), image: '/tarot-gold-3.png' },
    { id: 'suits', title: t('tutorialComponents.sections.cards'), image: '/tarot-gold-4.png' }
  ];

  const currentSection = sections.find(section => section.id === activeSection) || sections[0];

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
          <h3>{t('tutorialPage.error.title')}</h3>
          <p>{t('tutorialPage.error.message')}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            {t('tutorialPage.error.retry')}
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
          <p>{t('tutorialPage.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`tutorial-page ${className}`}>
      <div className="tutorial-container">
        <div className="tutorial-nav-container">
          {/* Desktop Navigation */}
          <nav className="tutorial-nav tutorial-nav-desktop">
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

          {/* Mobile Dropdown Navigation */}
          <nav className="tutorial-nav tutorial-nav-mobile">
            <button 
              className="tutorial-dropdown-toggle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
            >
              <img src={currentSection.image} alt={currentSection.title} className="nav-icon" />
              <span className="nav-title">{currentSection.title}</span>
              <span className={`tutorial-dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
            </button>
            
            {isDropdownOpen && (
              <div className="tutorial-dropdown-menu">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    className={`tutorial-dropdown-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection(section.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <img src={section.image} alt={section.title} className="nav-icon" />
                    <span className="nav-title">{section.title}</span>
                  </button>
                ))}
              </div>
            )}
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