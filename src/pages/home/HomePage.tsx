import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="home-content">
        <h2>Welcome to Your Tarot Journey</h2>
        <p>Discover the mystical world of tarot through intuitive card readings and comprehensive deck exploration.</p>
        
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Draw Cards</h3>
            <p>Experience intuitive tarot readings with our interactive card drawing interface.</p>
            <Link to="/reader" className="feature-link">Start Reading</Link>
          </div>
          
          <div className="feature-card">
            <h3>Explore Deck</h3>
            <p>Browse the complete tarot deck with detailed meanings and interpretations.</p>
            <Link to="/deck" className="feature-link">View Cards</Link>
          </div>
          
          <div className="feature-card">
            <h3>Learn Tarot</h3>
            <p>Master tarot fundamentals with our comprehensive tutorial and guide.</p>
            <Link to="/tutorial" className="feature-link">Start Learning</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 