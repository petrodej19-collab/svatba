-- Site content key-value store for editable wedding details
CREATE TABLE site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "site_content_select" ON site_content
  FOR SELECT USING (true);

-- Only authenticated (admin) can modify
CREATE POLICY "site_content_all" ON site_content
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Seed with default empty keys
INSERT INTO site_content (key, value) VALUES
  ('date_time', ''),
  ('venue_name', ''),
  ('venue_address', ''),
  ('directions', ''),
  ('schedule_ceremony', ''),
  ('schedule_aperitif', ''),
  ('schedule_dinner', ''),
  ('schedule_party', ''),
  ('dress_code', ''),
  ('accommodation', ''),
  ('hero_image_url', '');
