/*
  # Add Gifts and Update Signups

  1. New Tables
    - `gifts`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `total_stock` (int)
      - `remaining_stock` (int)
      - `max_for_men` (int, optional) - To track the 20 limit

  2. Update Tables
    - `event_signups`
      - Add `gender` (text)
      - Add `gift_id` (uuid, FK to gifts)

  3. Seed Data
    - Insert 'Branded hair band' and 'Branded tissue'
*/

-- Create gifts table
CREATE TABLE IF NOT EXISTS gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  total_stock int NOT NULL,
  remaining_stock int NOT NULL,
  max_for_men int, -- Number of units available specifically for men
  men_given int DEFAULT 0, -- Number of units already given to men
  created_at timestamptz DEFAULT now()
);

-- Seed gifts
INSERT INTO gifts (name, total_stock, remaining_stock, max_for_men)
VALUES 
  ('Branded hair band', 100, 100, 20),
  ('Branded tissue', 500, 500, NULL)
ON CONFLICT (name) DO NOTHING;

-- Update event_signups
ALTER TABLE event_signups ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE event_signups ADD COLUMN IF NOT EXISTS gift_id uuid REFERENCES gifts(id);

-- Update policies (allow anon to read gifts to check stock)
CREATE POLICY "Anyone can read gifts"
  ON gifts FOR SELECT
  TO anon
  USING (true);
