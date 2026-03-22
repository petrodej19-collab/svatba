-- Accommodation assignments for overnight guests
CREATE TABLE accommodations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_name TEXT NOT NULL,          -- e.g. "Glamping šotor 1", "Soba Mackadam"
  guest_names TEXT NOT NULL,        -- comma-separated or free-text list of guests
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

-- Guests can read
CREATE POLICY "Anyone can view accommodations"
  ON accommodations FOR SELECT
  USING (true);

-- Admin can do everything
CREATE POLICY "Authenticated users can manage accommodations"
  ON accommodations FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
