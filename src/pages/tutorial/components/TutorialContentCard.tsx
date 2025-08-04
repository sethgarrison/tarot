import React from 'react';

interface TutorialContentCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const TutorialContentCard: React.FC<TutorialContentCardProps> = ({ 
  title, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`content-card ${className}`}>
      {title && <h4>{title}</h4>}
      {children}
    </div>
  );
}; 