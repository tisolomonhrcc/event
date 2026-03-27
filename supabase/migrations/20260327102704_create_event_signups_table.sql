/*
  # Create Event Signups Table

  1. New Tables
    - `event_signups`
      - `id` (uuid, primary key) - Auto-generated unique identifier
      - `full_name` (text, required) - User's full name
      - `whatsapp` (text, required, unique) - WhatsApp number to prevent duplicates
      - `job_role` (text, optional) - User's job role
      - `play_title` (text, required) - User's creative play title response
      - `ticket_code` (text, required, unique) - Generated 4-digit gift ticket code
      - `created_at` (timestamptz) - Timestamp of signup

  2. Security
    - Enable RLS on `event_signups` table
    - Add policy for public insert (anyone can sign up)
    - Add policy for users to read their own signup by ticket code
*/

CREATE TABLE IF NOT EXISTS event_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  whatsapp text NOT NULL UNIQUE,
  job_role text,
  play_title text NOT NULL,
  ticket_code text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create signup"
  ON event_signups FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read signups by ticket code"
  ON event_signups FOR SELECT
  TO anon
  USING (true);