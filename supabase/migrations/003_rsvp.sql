-- RSVP responses from guests
CREATE TABLE rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  attending TEXT NOT NULL DEFAULT 'da',        -- 'da', 'ne', 'mogoče'
  meat_menu INT NOT NULL DEFAULT 0,
  vegetarian_menu INT NOT NULL DEFAULT 0,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Guests can submit RSVPs
CREATE POLICY "rsvps_insert" ON rsvps
  FOR INSERT WITH CHECK (true);

-- Only admin can view all RSVPs
CREATE POLICY "rsvps_select" ON rsvps
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admin can do everything
CREATE POLICY "rsvps_all" ON rsvps
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
