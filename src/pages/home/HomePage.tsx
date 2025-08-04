import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslations } from '../../utils/translationUtils';
import { TranslationText } from '../../utils/TranslationText';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="home-page">
      <div className="home-content">
        <h2>
          {t('homePage.welcome')}
        </h2>
        <p>
          {t('homePage.description')}
        </p>
        
        <div className="feature-grid">
          <div className="feature-card">
            <h3>
              <TranslationText translationKey="homePage.drawCardsSection.title" />
            </h3>
            <p>
              <TranslationText translationKey="homePage.drawCardsSection.description" />
            </p>
            <Link to="/reader" className="feature-link">
              <TranslationText translationKey="homePage.drawCardsSection.button" />
            </Link>
          </div>
          
          <div className="feature-card">
            <h3>
              <TranslationText translationKey="homePage.exploreDeckSection.title" />
            </h3>
            <p>
              <TranslationText translationKey="homePage.exploreDeckSection.description" />
            </p>
            <Link to="/deck" className="feature-link">
              <TranslationText translationKey="homePage.exploreDeckSection.button" />
            </Link>
          </div>
          
          <div className="feature-card">
            <h3>
              <TranslationText translationKey="homePage.learnTarotSection.title" />
            </h3>
            <p>
              <TranslationText translationKey="homePage.learnTarotSection.description" />
            </p>
            <Link to="/tutorial" className="feature-link">
              <TranslationText translationKey="homePage.learnTarotSection.button" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 