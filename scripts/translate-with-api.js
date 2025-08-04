const fs = require('fs');
const path = require('path');

// This script demonstrates how to use translation APIs
// You can use Google Translate API, DeepL, or other services

class TranslationService {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
  }

  // Mock translation function - replace with actual API call
  async translateText(text, targetLang = 'es') {
    // This is a placeholder - you would implement actual API calls here
    // Example with Google Translate API:
    /*
    const {Translate} = require('@google-cloud/translate').v2;
    const translate = new Translate({key: this.apiKey});
    
    const [translation] = await translate.translate(text, targetLang);
    return translation;
    */
    
    // For now, return a placeholder
    return `[TRADUCIDO: ${text}]`;
  }

  // Translate card meanings and descriptions
  async translateCardContent(card) {
    const translatedCard = { ...card };
    
    try {
      // Translate meanings
      translatedCard.meaning_up = {
        en: card.meaning_up,
        es: await this.translateText(card.meaning_up)
      };
      
      translatedCard.meaning_rev = {
        en: card.meaning_rev,
        es: await this.translateText(card.meaning_rev)
      };
      
      // Translate description
      translatedCard.description = {
        en: card.desc,
        es: await this.translateText(card.desc)
      };
      
      // Remove old desc field
      delete translatedCard.desc;
      
      return translatedCard;
    } catch (error) {
      console.error(`Error translating card ${card.name_short}:`, error);
      return card;
    }
  }
}

// Function to process all cards with translation
async function translateAllCards() {
  try {
    const cardsPath = path.join(__dirname, 'cards.json');
    const cardsData = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
    
    const translationService = new TranslationService();
    const translatedCards = [];
    
    console.log('🔄 Starting translation process...');
    
    for (let i = 0; i < cardsData.length; i++) {
      const card = cardsData[i];
      console.log(`📝 Translating card ${i + 1}/${cardsData.length}: ${card.name}`);
      
      // Add Spanish names and values (these are already translated in the other script)
      const spanishCard = {
        ...card,
        name: {
          en: card.name,
          es: getSpanishCardName(card.name)
        },
        value: {
          en: card.value,
          es: getSpanishCardValue(card.value)
        }
      };
      
      if (card.suit) {
        spanishCard.suit = {
          en: card.suit,
          es: getSpanishSuit(card.suit)
        };
      }
      
      // Translate meanings and descriptions
      const fullyTranslatedCard = await translationService.translateCardContent(spanishCard);
      translatedCards.push(fullyTranslatedCard);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Save the translated cards
    const outputPath = path.join(__dirname, 'cards-fully-translated.json');
    fs.writeFileSync(outputPath, JSON.stringify(translatedCards, null, 2));
    
    console.log(`✅ Translation complete! Saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error during translation:', error);
  }
}

// Helper functions for card names and values
function getSpanishCardName(englishName) {
  const translations = {
    "The Fool": "El Loco",
    "The Magician": "El Mago",
    "The High Priestess": "La Sacerdotisa",
    "The Empress": "La Emperatriz",
    "The Emperor": "El Emperador",
    "The Hierophant": "El Hierofante",
    "The Lovers": "Los Enamorados",
    "The Chariot": "El Carro",
    "Fortitude": "La Fuerza",
    "The Hermit": "El Ermitaño",
    "Wheel Of Fortune": "La Rueda de la Fortuna",
    "Justice": "La Justicia",
    "The Hanged Man": "El Colgado",
    "Death": "La Muerte",
    "Temperance": "La Templanza",
    "The Devil": "El Diablo",
    "The Tower": "La Torre",
    "The Star": "La Estrella",
    "The Moon": "La Luna",
    "The Sun": "El Sol",
    "The Last Judgment": "El Juicio Final",
    "The World": "El Mundo"
  };
  
  if (englishName.includes(' of ')) {
    const parts = englishName.split(' of ');
    const rank = parts[0];
    const suit = parts[1];
    
    const rankTranslations = {
      "Page": "Paje",
      "Knight": "Caballero", 
      "Queen": "Reina",
      "King": "Rey",
      "Ace": "As"
    };
    
    const suitTranslations = {
      "Wands": "Bastos",
      "Cups": "Copas", 
      "Pentacles": "Oros",
      "Swords": "Espadas"
    };
    
    const translatedRank = rankTranslations[rank] || rank;
    const translatedSuit = suitTranslations[suit] || suit;
    
    return `${translatedRank} de ${translatedSuit}`;
  }
  
  return translations[englishName] || englishName;
}

function getSpanishCardValue(englishValue) {
  const translations = {
    "ZERO": "CERO",
    "page": "paje",
    "knight": "caballero", 
    "queen": "reina",
    "king": "rey",
    "ace": "as"
  };
  
  return translations[englishValue] || englishValue;
}

function getSpanishSuit(englishSuit) {
  const translations = {
    "wands": "bastos",
    "cups": "copas",
    "pentacles": "oros", 
    "swords": "espadas"
  };
  
  return translations[englishSuit] || englishSuit;
}

// Instructions for setting up translation APIs
function showSetupInstructions() {
  console.log('\n📋 SETUP INSTRUCTIONS:');
  console.log('1. Install Google Translate API: npm install @google-cloud/translate');
  console.log('2. Set up Google Cloud credentials');
  console.log('3. Or use DeepL API: npm install deepl-node');
  console.log('4. Update the TranslationService class with your chosen API');
  console.log('5. Run this script to translate all card content');
}

// Run the script
if (require.main === module) {
  showSetupInstructions();
  translateAllCards();
}

module.exports = {
  TranslationService,
  translateAllCards,
  getSpanishCardName,
  getSpanishCardValue,
  getSpanishSuit
}; 