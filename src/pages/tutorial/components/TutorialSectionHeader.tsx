import React from 'react';

interface TutorialSectionHeaderProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
}

export const TutorialSectionHeader: React.FC<TutorialSectionHeaderProps> = ({ 
  title, 
  imageSrc, 
  imageAlt 
}) => {
  return (
    <div className="section-header-with-image">
      <img src={imageSrc} alt={imageAlt} className="section-icon" />
      <h3>{title}</h3>
    </div>
  );
}; 