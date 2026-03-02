-- Wedding Tables (physical tables at the wedding)
CREATE TABLE wedding_tables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  seat_count INT NOT NULL DEFAULT 8,
  position_x FLOAT NOT NULL DEFAULT 0,
  position_y FLOAT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Guests assigned to tables
CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id UUID REFERENCES wedding_tables(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  seat_index INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Song requests from guests
CREATE TABLE song_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  song_title TEXT NOT NULL,
  artist TEXT,
  requested_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE wedding_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_requests ENABLE ROW LEVEL SECURITY;

-- wedding_tables: anyone can read, only authenticated users can modify
CREATE POLICY "wedding_tables_select" ON wedding_tables FOR SELECT USING (true);
CREATE POLICY "wedding_tables_all" ON wedding_tables FOR ALL USING (auth.role() = 'authenticated');

-- guests: anyone can read, only authenticated users can modify
CREATE POLICY "guests_select" ON guests FOR SELECT USING (true);
CREATE POLICY "guests_all" ON guests FOR ALL USING (auth.role() = 'authenticated');

-- song_requests: anyone can read and insert, only authenticated users can do everything
CREATE POLICY "song_requests_select" ON song_requests FOR SELECT USING (true);
CREATE POLICY "song_requests_insert" ON song_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "song_requests_all" ON song_requests FOR ALL USING (auth.role() = 'authenticated');

-- To run this migration:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Paste this SQL and run it
-- Or use the Supabase CLI: supabase db push
