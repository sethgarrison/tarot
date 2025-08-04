import translations from '../data/translations.json';
import { useLanguage } from '../App';

export const useTranslations = () => {
  const { currentLanguage } = useLanguage();

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Split the key by dots to navigate the nested object
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    // Navigate through the nested object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return the key if translation not found
          }
        }
        break;
      }
    }

    // If value is a string, apply parameter substitution
    if (typeof value === 'string') {
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramName) => {
          return params[paramName]?.toString() || match;
        });
      }
      return value;
    }

    return key; // Return the key if translation not found
  };

  return { t, currentLanguage };
};

// Helper function to get nested translation objects
export const useTranslationObject = (baseKey: string) => {
  const { currentLanguage } = useLanguage();
  
  const getTranslationObject = (key: string) => {
    const fullKey = `${baseKey}.${key}`;
    const keys = fullKey.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return {};
          }
        }
        break;
      }
    }
    
    return value || {};
  };

  return { getTranslationObject };
}; 