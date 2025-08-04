import React from 'react';
import { useLanguage } from '../App';
import type { MultilingualContent } from '../types/tarot';

export const useMultilingualText = () => {
  const { currentLanguage } = useLanguage();

  const getText = (content: MultilingualContent | string | undefined, fallback?: string): string => {
    if (!content) return fallback || '';
    
    // If it's a string, return it directly
    if (typeof content === 'string') {
      return content;
    }
    
    // If it's a MultilingualContent object
    if (typeof content === 'object' && content !== null) {
      const targetText = content[currentLanguage];
      const fallbackText = content.en;
      
      if (targetText) {
        return targetText;
      }
      
      // If no translation exists, return fallback in red
      if (fallbackText) {
        return `[${fallbackText}]`;
      }
    }
    
    return fallback || '';
  };

  const hasTranslation = (content: MultilingualContent | string | undefined): boolean => {
    if (!content) return false;
    
    if (typeof content === 'string') return true;
    
    if (typeof content === 'object' && content !== null) {
      return !!content[currentLanguage];
    }
    
    return false;
  };

  const isMissingTranslation = (content: MultilingualContent | string | undefined): boolean => {
    if (!content) return false;
    
    if (typeof content === 'string') return false;
    
    if (typeof content === 'object' && content !== null) {
      return currentLanguage !== 'en' && !content[currentLanguage] && !!content.en;
    }
    
    return false;
  };

  return {
    getText,
    hasTranslation,
    isMissingTranslation,
    currentLanguage
  };
};

export const MultilingualText: React.FC<{
  content: MultilingualContent | string | undefined;
  fallback?: string;
  className?: string;
}> = ({ content, fallback, className }) => {
  const { getText, isMissingTranslation } = useMultilingualText();
  const text = getText(content, fallback);
  const isMissing = isMissingTranslation(content);
  
  return React.createElement('span', {
    className: `multilingual-text ${isMissing ? 'missing-translation' : ''} ${className || ''}`
  }, text);
}; 