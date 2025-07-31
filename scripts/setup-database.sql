-- Setup script for Tarot App Database
-- Run this in your Supabase SQL editor

-- Cards table with new multilingual schema
CREATE TABLE IF NOT EXISTS cards (
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

-- Tutorials table with new multilingual schema
CREATE TABLE IF NOT EXISTS tutorials (
  id SERIAL PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL, -- {en: "Understanding Tarot", es: "Entendiendo el Tarot"}
  content JSONB NOT NULL, -- {en: {...}, es: {...}}
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cards_name_short ON cards(name_short);
CREATE INDEX IF NOT EXISTS idx_cards_type ON cards(type);
CREATE INDEX IF NOT EXISTS idx_cards_suit ON cards USING GIN(suit);
CREATE INDEX IF NOT EXISTS idx_tutorials_section_key ON tutorials(section_key);
CREATE INDEX IF NOT EXISTS idx_tutorials_order_index ON tutorials(order_index);

-- Enable Row Level Security (RLS) - optional but recommended
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to cards" ON cards
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to tutorials" ON tutorials
  FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update (if needed)
CREATE POLICY "Allow authenticated users to insert cards" ON cards
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update cards" ON cards
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert tutorials" ON tutorials
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update tutorials" ON tutorials
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE cards IS 'Tarot cards with multilingual support';
COMMENT ON COLUMN cards.name IS 'Card name in multiple languages: {en: "The Fool", es: "El Loco"}';
COMMENT ON COLUMN cards.value IS 'Card value in multiple languages: {en: "0", es: "0"}';
COMMENT ON COLUMN cards.suit IS 'Card suit in multiple languages: {en: "wands", es: "bastos"} or null for major arcana';
COMMENT ON COLUMN cards.meaning_up IS 'Upright meaning in multiple languages';
COMMENT ON COLUMN cards.meaning_rev IS 'Reversed meaning in multiple languages';
COMMENT ON COLUMN cards.description IS 'Card description in multiple languages';

COMMENT ON TABLE tutorials IS 'Tutorial content with multilingual support';
COMMENT ON COLUMN tutorials.title IS 'Tutorial title in multiple languages';
COMMENT ON COLUMN tutorials.content IS 'Tutorial content in multiple languages'; 