const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// API endpoint
const API_BASE = 'https://tarotapi.dev/api/v1';

async function fetchAllCards() {
  try {
    console.log('Fetching cards from API...');
    const response = await fetch(`${API_BASE}/cards`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Fetched ${data.cards.length} cards from API`);
    return data.cards;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
}

function transformCardData(apiCard) {
  return {
    name_short: apiCard.name_short,
    name: {
      en: apiCard.name,
      es: null // Will be filled in later with translations
    },
    type: apiCard.type,
    value: {
      en: apiCard.value,
      es: null
    },
    value_int: apiCard.value_int,
    suit: apiCard.suit ? {
      en: apiCard.suit,
      es: getSuitTranslation(apiCard.suit)
    } : null,
    meaning_up: {
      en: apiCard.meaning_up,
      es: null
    },
    meaning_rev: {
      en: apiCard.meaning_rev,
      es: null
    },
    desc: {
      en: apiCard.desc,
      es: null
    },
    image_path: `/tarot-images/${apiCard.name.toLowerCase().replace(/\s+/g, '_')}.jpg`
  };
}

function getSuitTranslation(suit) {
  const suitTranslations = {
    'wands': 'bastos',
    'cups': 'copas',
    'swords': 'espadas',
    'pentacles': 'oros'
  };
  return suitTranslations[suit.toLowerCase()] || null;
}

async function insertCards(cards) {
  try {
    console.log('Inserting cards into Supabase...');
    
    // Clear existing cards first
    const { error: deleteError } = await supabase
      .from('cards')
      .delete()
      .neq('id', 0); // Delete all records
    
    if (deleteError) {
      console.error('Error clearing existing cards:', deleteError);
      throw deleteError;
    }
    
    console.log('Cleared existing cards');
    
    // Insert new cards
    const { data, error } = await supabase
      .from('cards')
      .insert(cards)
      .select();
    
    if (error) {
      console.error('Error inserting cards:', error);
      throw error;
    }
    
    console.log(`Successfully inserted ${data.length} cards`);
    return data;
  } catch (error) {
    console.error('Error in insertCards:', error);
    throw error;
  }
}

async function validateData(cards) {
  console.log('\nValidating card data...');
  
  const validationErrors = [];
  
  cards.forEach((card, index) => {
    if (!card.name_short) {
      validationErrors.push(`Card ${index}: Missing name_short`);
    }
    if (!card.name || !card.name.en) {
      validationErrors.push(`Card ${index}: Missing name.en`);
    }
    if (!card.type || !['major', 'minor'].includes(card.type)) {
      validationErrors.push(`Card ${index}: Invalid type "${card.type}"`);
    }
    if (!card.value || !card.value.en) {
      validationErrors.push(`Card ${index}: Missing value.en`);
    }
    if (typeof card.value_int !== 'number') {
      validationErrors.push(`Card ${index}: Invalid value_int "${card.value_int}"`);
    }
    if (!card.meaning_up || !card.meaning_up.en) {
      validationErrors.push(`Card ${index}: Missing meaning_up.en`);
    }
    if (!card.meaning_rev || !card.meaning_rev.en) {
      validationErrors.push(`Card ${index}: Missing meaning_rev.en`);
    }
    if (!card.desc || !card.desc.en) {
      validationErrors.push(`Card ${index}: Missing desc.en`);
    }
    
    // Validate suit for minor arcana
    if (card.type === 'minor' && !card.suit) {
      validationErrors.push(`Card ${index}: Minor arcana missing suit`);
    }
    if (card.suit && !['wands', 'cups', 'swords', 'pentacles'].includes(card.suit.en)) {
      validationErrors.push(`Card ${index}: Invalid suit "${card.suit.en}"`);
    }
  });
  
  if (validationErrors.length > 0) {
    console.error('Validation errors found:');
    validationErrors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Data validation failed');
  }
  
  console.log('✅ All cards validated successfully');
  
  // Log some statistics
  const majorCount = cards.filter(c => c.type === 'major').length;
  const minorCount = cards.filter(c => c.type === 'minor').length;
  const wandsCount = cards.filter(c => c.suit?.en === 'wands').length;
  const cupsCount = cards.filter(c => c.suit?.en === 'cups').length;
  const swordsCount = cards.filter(c => c.suit?.en === 'swords').length;
  const pentaclesCount = cards.filter(c => c.suit?.en === 'pentacles').length;
  
  console.log(`\n📊 Card Statistics:`);
  console.log(`  Major Arcana: ${majorCount} cards`);
  console.log(`  Minor Arcana: ${minorCount} cards`);
  console.log(`  Total: ${cards.length} cards`);
  console.log(`\n  Suits:`);
  console.log(`    Wands: ${wandsCount} cards`);
  console.log(`    Cups: ${cupsCount} cards`);
  console.log(`    Swords: ${swordsCount} cards`);
  console.log(`    Pentacles: ${pentaclesCount} cards`);
}

async function migrateCards() {
  try {
    console.log('🚀 Starting card migration...\n');
    
    // Fetch cards from API
    const apiCards = await fetchAllCards();
    
    // Transform data for database
    const transformedCards = apiCards.map(transformCardData);
    
    // Validate the data
    await validateData(transformedCards);
    
    // Insert into Supabase
    const insertedCards = await insertCards(transformedCards);
    
    console.log('\n✅ Migration completed successfully!');
    console.log(`📦 Migrated ${insertedCards.length} cards to Supabase`);
    
    // Show a few sample cards
    console.log('\n📋 Sample cards:');
    insertedCards.slice(0, 3).forEach(card => {
      console.log(`  - ${card.name.en} (${card.type})`);
    });
    
    console.log('\n💡 Next steps:');
    console.log('  - Add Spanish translations to the cards');
    console.log('  - Update your frontend to use the new schema');
    console.log('  - Implement language switching functionality');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  migrateCards();
}

module.exports = { migrateCards }; 