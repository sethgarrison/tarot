import React from 'react';
import { useTranslations } from './translationUtils';

interface TranslationTextProps {
  translationKey: string;
  params?: Record<string, string | number>;
  className?: string;
  children?: React.ReactNode;
}

export const TranslationText: React.FC<TranslationTextProps> = ({ 
  translationKey, 
  params, 
  className = '',
  children 
}) => {
  const { t } = useTranslations();
  const text = t(translationKey, params);
  
  return (
    <span className={className}>
      {text}
      {children}
    </span>
  );
};

// Component for translating text content
export const T: React.FC<TranslationTextProps> = TranslationText; 