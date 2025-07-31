# Migration Scripts

This directory contains scripts to migrate data from the external API to your Supabase database.

## Setup

1. **Install dependencies:**
   ```bash
   cd scripts
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Database Schema

Make sure you have created the following tables in your Supabase database:

### Cards Table
```sql
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  name_short TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL, -- {en: "The Fool", es: "El Loco"}
  type TEXT NOT NULL CHECK (type IN ('major', 'minor')),
  value JSONB NOT NULL, -- {en: "0", es: "0"}
  value_int INTEGER NOT NULL,
  suit JSONB, -- {en: "wands", es: "bastos"} or NULL for major arcana
  meaning_up JSONB NOT NULL, -- {en: "...", es: "..."}
  meaning_rev JSONB NOT NULL, -- {en: "...", es: "..."}
  description JSONB NOT NULL, -- {en: "...", es: "..."}
  image_path TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tutorials Table
```sql
CREATE TABLE tutorials (
  id SERIAL PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL, -- {en: "Understanding Tarot", es: "Entendiendo el Tarot"}
  content JSONB NOT NULL, -- {en: {...}, es: {...}}
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Schema Benefits

This new schema structure provides several advantages:

1. **Flexible Internationalization**: All displayable strings are objects with language codes
2. **Easy Language Addition**: Add new languages by simply adding new keys to the objects
3. **No Schema Changes**: Adding new languages doesn't require database schema changes
4. **Consistent Structure**: All multilingual content follows the same pattern
5. **Type Safety**: Frontend can easily access content with `content[languageCode]`

## Running Migrations

### Migrate Cards
```bash
npm run migrate-cards
```

This script will:
- Fetch all cards from the external API
- Transform the data to match your database schema
- Validate the data for completeness
- Clear existing cards and insert new ones
- Show statistics about the migration

### Migrate Tutorials
```bash
npm run migrate-tutorials
```

This script will:
- Insert tutorial content with both English and Spanish translations
- Clear existing tutorials and insert new ones
- Show the tutorial sections that were created

## What Gets Migrated

### Cards Migration
- **Source**: External tarot API (tarotapi.dev)
- **Fields Mapped**:
  - `name_short` → `name_short` (string)
  - `name` → `name` (object: `{en: "...", es: null}`)
  - `type` → `type` (string)
  - `value` → `value` (object: `{en: "...", es: null}`)
  - `value_int` → `value_int` (number)
  - `suit` → `suit` (object: `{en: "...", es: "..."}` or null)
  - `meaning_up` → `meaning_up` (object: `{en: "...", es: null}`)
  - `meaning_rev` → `meaning_rev` (object: `{en: "...", es: null}`)
  - `desc` → `description` (object: `{en: "...", es: null}`)
  - Image path generated automatically

### Tutorials Migration
- **Source**: Hardcoded tutorial data with Spanish translations
- **Sections**:
  - Overview (Understanding Tarot Cards)
  - Major Arcana (The Major Arcana)
  - Minor Arcana (The Minor Arcana)
  - Suits (The Four Suits)

## Data Structure Examples

### Card Example
```json
{
  "name_short": "ar00",
  "name": {
    "en": "The Fool",
    "es": null
  },
  "type": "major",
  "value": {
    "en": "0",
    "es": null
  },
  "value_int": 0,
  "suit": null,
  "meaning_up": {
    "en": "Innocence, new beginnings, free spirit",
    "es": null
  },
  "meaning_rev": {
    "en": "Recklessness, taking unnecessary risks",
    "es": null
  },
  "description": {
    "en": "The Fool represents new beginnings...",
    "es": null
  }
}
```

### Tutorial Example
```json
{
  "section_key": "overview",
  "title": {
    "en": "Understanding Tarot Cards",
    "es": "Entendiendo las Cartas del Tarot"
  },
  "content": {
    "en": {
      "description": "Tarot cards are a powerful tool...",
      "total_cards": 78
    },
    "es": {
      "description": "Las cartas del tarot son...",
      "total_cards": 78
    }
  }
}
```

## Validation

The card migration script includes comprehensive validation:
- Checks for required fields
- Validates card types (major/minor)
- Validates suits for minor arcana
- Ensures data integrity
- Shows statistics after migration

## Troubleshooting

### Common Issues

1. **Missing environment variables**
   - Make sure `.env` file exists with Supabase credentials
   - Check that variables are named correctly

2. **Database connection errors**
   - Verify Supabase URL and key are correct
   - Check that tables exist in your database

3. **API connection errors**
   - The external API might be temporarily unavailable
   - Check network connection

4. **Data validation errors**
   - Review the error messages for specific issues
   - Check that the API is returning expected data

### Logs

The scripts provide detailed logging:
- ✅ Success messages with statistics
- ❌ Error messages with details
- 📊 Data validation results
- 📋 Sample data after migration

## Next Steps

After running the migrations:

1. **Update your frontend** to use Supabase instead of the external API
2. **Add Spanish translations** for cards that don't have them
3. **Customize card meanings** to match your preferences
4. **Add more tutorial content** as needed
5. **Implement language switching** in your app
6. **Add more languages** by simply adding new keys to the objects 