-- Add accommodation request fields to rsvps
ALTER TABLE rsvps
  ADD COLUMN accommodation_needed BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN accommodation_guests INT NOT NULL DEFAULT 0;
