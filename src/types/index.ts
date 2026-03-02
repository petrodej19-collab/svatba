export interface WeddingTable {
  id: string;
  name: string;
  seat_count: number;
  position_x: number;
  position_y: number;
  sort_order: number;
  created_at: string;
}

export interface Guest {
  id: string;
  table_id: string;
  name: string;
  seat_index: number | null;
  created_at: string;
}

export interface SongRequest {
  id: string;
  song_title: string;
  artist: string | null;
  requested_by: string | null;
  created_at: string;
}

export interface WeddingTableWithGuests extends WeddingTable {
  guests: Guest[];
}

export interface SiteContent {
  key: string;
  value: string;
  updated_at: string;
}

export interface Rsvp {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  attending: string;
  meat_menu: number;
  vegetarian_menu: number;
  message: string | null;
  accommodation_needed: boolean;
  accommodation_guests: number;
  created_at: string;
}
