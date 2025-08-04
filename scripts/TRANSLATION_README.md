# Spanish Translation Generation for Tarot Card Database

This directory contains scripts to generate Spanish translations for your tarot card database. The scripts are designed to work with your existing multilingual database schema that uses JSONB fields.

## Files Created

1. **`generate-spanish-translations.js`** - Basic translation script with card names and placeholders
2. **`translate-with-api.js`** - Advanced script for API-based translations
3. **`cards-with-spanish.json`** - Generated file with Spanish translations
4. **`migrate-spanish-translations.sql`** - SQL script to update your database

## What's Been Translated

### ✅ Completed Translations
- **Card Names**: All 78 tarot cards have proper Spanish names
- **Card Values**: Numbers, court cards (Page, Knight, Queen, King), and Aces
- **Suit Names**: Wands → Bastos, Cups → Copas, Pentacles → Oros, Swords → Espadas

### ⏳ Pending Translations
- **Card Meanings** (upright and reversed)
- **Card Descriptions** (detailed explanations)

## Usage

### Option 1: Use the Basic Script (Already Run)
```bash
cd scripts
node generate-spanish-translations.js
```

This creates:
- `cards-with-spanish.json` - Cards with Spanish names and placeholder meanings
- `migrate-spanish-translations.sql` - Database migration script

### Option 2: Use Translation APIs

#### Setup Google Translate API
```bash
npm install @google-cloud/translate
```

1. Set up Google Cloud credentials
2. Update the `TranslationService` class in `translate-with-api.js`
3. Run the script

#### Setup DeepL API
```bash
npm install deepl-node
```

1. Get a DeepL API key
2. Update the translation function
3. Run the script

### Option 3: Manual Translation
You can manually translate the meanings and descriptions by editing the `cards-with-spanish.json` file and then running the migration script.

## Database Migration

### Apply Spanish Translations to Your Database

1. **Run the migration script in your Supabase SQL editor:**
   ```sql
   -- Copy and paste the contents of migrate-spanish-translations.sql
   ```

2. **Verify the updates:**
   ```sql
   SELECT name_short, name, value, meaning_up, meaning_rev, description, suit 
   FROM cards 
   WHERE name->>'es' IS NOT NULL 
   LIMIT 5;
   ```

## Card Name Translations

### Major Arcana
- The Fool → El Loco
- The Magician → El Mago
- The High Priestess → La Sacerdotisa
- The Empress → La Emperatriz
- The Emperor → El Emperador
- The Hierophant → El Hierofante
- The Lovers → Los Enamorados
- The Chariot → El Carro
- Fortitude → La Fuerza
- The Hermit → El Ermitaño
- Wheel of Fortune → La Rueda de la Fortuna
- Justice → La Justicia
- The Hanged Man → El Colgado
- Death → La Muerte
- Temperance → La Templanza
- The Devil → El Diablo
- The Tower → La Torre
- The Star → La Estrella
- The Moon → La Luna
- The Sun → El Sol
- The Last Judgment → El Juicio Final
- The World → El Mundo

### Suits
- Wands → Bastos
- Cups → Copas
- Pentacles → Oros
- Swords → Espadas

### Court Cards
- Page → Paje
- Knight → Caballero
- Queen → Reina
- King → Rey
- Ace → As

## Frontend Integration

Your existing code already supports multilingual content. The database schema uses JSONB fields that can store multiple languages:

```typescript
// Example of how to access Spanish content
const card = await getCard('ar01'); // The Magician
console.log(card.name.es); // "El Mago"
console.log(card.meaning_up.es); // Spanish meaning
```

## Next Steps

1. **Complete the translations**: Use a translation API or manual translation to complete the meanings and descriptions
2. **Test the frontend**: Ensure your app can display Spanish content
3. **Add language switching**: Implement a language selector in your UI
4. **Add more languages**: The same structure can be used for other languages

## Translation Quality

For the best results, consider:
- **Professional translation** for important content
- **Cultural adaptation** for tarot-specific terminology
- **Consistency** in terminology across all cards
- **Context preservation** for spiritual and esoteric content

## Troubleshooting

### Common Issues

1. **Database connection errors**: Ensure your Supabase credentials are correct
2. **JSONB syntax errors**: Check that the migration script uses proper JSONB syntax
3. **Translation API limits**: Be aware of rate limits when using translation APIs

### Getting Help

- Check the Supabase documentation for JSONB operations
- Review the generated SQL script before running it
- Test translations on a small subset first

## Contributing

If you improve the translations or add new languages:
1. Update the translation scripts
2. Regenerate the JSON files
3. Create new migration scripts
4. Test thoroughly before applying to production

---

**Note**: The current translations for meanings and descriptions are placeholders. You'll need to complete these using translation services or manual translation for the best quality. 