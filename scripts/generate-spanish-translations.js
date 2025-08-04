const fs = require('fs');
const path = require('path');

// Spanish translations for card names
const cardNameTranslations = {
  // Major Arcana
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
  "The World": "El Mundo",

  // Suits
  "wands": "bastos",
  "cups": "copas",
  "pentacles": "oros",
  "swords": "espadas",

  // Court cards
  "Page": "Paje",
  "Knight": "Caballero",
  "Queen": "Reina",
  "King": "Rey",
  "Ace": "As",
  "two": "dos",
  "three": "tres",
  "four": "cuatro",
  "five": "cinco",
  "six": "seis",
  "seven": "siete",
  "eight": "ocho",
  "nine": "nueve",
  "ten": "diez"
};

// Function to translate card names
function translateCardName(englishName) {
  // Handle court cards and numbered cards
  if (englishName.includes(' of ')) {
    const parts = englishName.split(' of ');
    const rank = parts[0];
    const suit = parts[1];
    
    const translatedRank = cardNameTranslations[rank] || rank;
    const translatedSuit = cardNameTranslations[suit] || suit;
    
    return `${translatedRank} de ${translatedSuit}`;
  }
  
  // Handle major arcana
  return cardNameTranslations[englishName] || englishName;
}

// Function to translate card values
function translateCardValue(englishValue) {
  if (englishValue === "ZERO") return "CERO";
  if (englishValue === "page") return "paje";
  if (englishValue === "knight") return "caballero";
  if (englishValue === "queen") return "reina";
  if (englishValue === "king") return "rey";
  if (englishValue === "ace") return "as";
  
  // For numbered values, keep as is since they're numbers
  return englishValue;
}

// Function to translate suit names
function translateSuit(englishSuit) {
  return cardNameTranslations[englishSuit] || englishSuit;
}

// Function to translate meanings and descriptions
function translateText(englishText) {
  // This is a simplified translation - in a real implementation,
  // you would use a translation service like Google Translate API
  // For now, we'll create a basic structure that can be filled in later
  
  // Common tarot terms translations
  const commonTerms = {
    "love": "amor",
    "success": "éxito",
    "failure": "fracaso",
    "death": "muerte",
    "life": "vida",
    "hope": "esperanza",
    "fear": "miedo",
    "joy": "alegría",
    "sadness": "tristeza",
    "wealth": "riqueza",
    "poverty": "pobreza",
    "journey": "viaje",
    "home": "hogar",
    "family": "familia",
    "friendship": "amistad",
    "marriage": "matrimonio",
    "divorce": "divorcio",
    "birth": "nacimiento",
    "growth": "crecimiento",
    "change": "cambio",
    "stability": "estabilidad",
    "conflict": "conflicto",
    "peace": "paz",
    "war": "guerra",
    "victory": "victoria",
    "defeat": "derrota",
    "wisdom": "sabiduría",
    "knowledge": "conocimiento",
    "ignorance": "ignorancia",
    "truth": "verdad",
    "lies": "mentiras",
    "faith": "fe",
    "doubt": "duda",
    "courage": "coraje",
    "cowardice": "cobardía",
    "strength": "fuerza",
    "weakness": "debilidad",
    "beauty": "belleza",
    "ugliness": "fealdad",
    "youth": "juventud",
    "age": "vejez",
    "past": "pasado",
    "present": "presente",
    "future": "futuro"
  };
  
  // For now, return a placeholder that indicates this needs translation
  return `[TRADUCCIÓN PENDIENTE: ${englishText}]`;
}

// Function to properly escape text for SQL
function escapeForSQL(text) {
  if (!text) return '';
  
  return text
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/'/g, "''")     // Escape single quotes by doubling them
    .replace(/"/g, '\\"')    // Escape double quotes
    .replace(/\n/g, '\\n')   // Escape newlines
    .replace(/\r/g, '\\r')   // Escape carriage returns
    .replace(/\t/g, '\\t');  // Escape tabs
}

// Main function to process the cards
function generateSpanishTranslations() {
  try {
    // Read the original cards data
    const cardsPath = path.join(__dirname, 'cards.json');
    const cardsData = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
    
    // Process each card to add Spanish translations
    const translatedCards = cardsData.map(card => {
      const spanishCard = {
        ...card,
        name: {
          en: card.name,
          es: translateCardName(card.name)
        },
        value: {
          en: card.value,
          es: translateCardValue(card.value)
        },
        meaning_up: {
          en: card.meaning_up,
          es: translateText(card.meaning_up)
        },
        meaning_rev: {
          en: card.meaning_rev,
          es: translateText(card.meaning_rev)
        },
        description: {
          en: card.desc,
          es: translateText(card.desc)
        }
      };
      
      // Add suit translation if it exists
      if (card.suit) {
        spanishCard.suit = {
          en: card.suit,
          es: translateSuit(card.suit)
        };
      }
      
      // Remove the old desc field since it's now in description
      delete spanishCard.desc;
      
      return spanishCard;
    });
    
    // Write the translated cards to a new file
    const outputPath = path.join(__dirname, 'cards-with-spanish.json');
    fs.writeFileSync(outputPath, JSON.stringify(translatedCards, null, 2));
    
    console.log(`✅ Successfully generated Spanish translations for ${translatedCards.length} cards`);
    console.log(`📁 Output saved to: ${outputPath}`);
    console.log('\n📝 Note: The Spanish translations for meanings and descriptions are placeholders.');
    console.log('   You will need to manually translate these or use a translation service.');
    
    // Also create a migration script
    createMigrationScript(translatedCards);
    
  } catch (error) {
    console.error('❌ Error generating Spanish translations:', error);
  }
}

// Function to create a migration script for the database
function createMigrationScript(cards) {
  const migrationScript = `-- Migration script to add Spanish translations to existing cards
-- Run this in your Supabase SQL editor

-- First, let's add the Spanish translations to existing cards
${cards.map(card => {
  const updates = [];
  
  // Update name - properly escaped
  updates.push(`name = jsonb_set(name, '{es}', '${escapeForSQL(card.name.es)}')`);
  
  // Update value - properly escaped
  updates.push(`value = jsonb_set(value, '{es}', '${escapeForSQL(card.value.es)}')`);
  
  // Update meaning_up - properly escaped
  updates.push(`meaning_up = jsonb_set(meaning_up, '{es}', '${escapeForSQL(card.meaning_up.es)}')`);
  
  // Update meaning_rev - properly escaped
  updates.push(`meaning_rev = jsonb_set(meaning_rev, '{es}', '${escapeForSQL(card.meaning_rev.es)}')`);
  
  // Update description - properly escaped
  updates.push(`description = jsonb_set(description, '{es}', '${escapeForSQL(card.description.es)}')`);
  
  // Update suit if it exists - properly escaped
  if (card.suit) {
    updates.push(`suit = jsonb_set(suit, '{es}', '${escapeForSQL(card.suit.es)}')`);
  }
  
  return `UPDATE cards SET ${updates.join(', ')} WHERE name_short = '${card.name_short}';`;
}).join('\n')}

-- Verify the updates
SELECT name_short, name, value, meaning_up, meaning_rev, description, suit 
FROM cards 
WHERE name->>'es' IS NOT NULL 
LIMIT 5;
`;

  const migrationPath = path.join(__dirname, 'migrate-spanish-translations.sql');
  fs.writeFileSync(migrationPath, migrationScript);
  
  console.log(`📄 Migration script created: ${migrationPath}`);
}

// Run the script
if (require.main === module) {
  generateSpanishTranslations();
}

module.exports = {
  generateSpanishTranslations,
  translateCardName,
  translateCardValue,
  translateSuit,
  translateText,
  escapeForSQL
}; 