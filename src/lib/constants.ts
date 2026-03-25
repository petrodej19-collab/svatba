export const ROUTES = {
  HOME: "/",
  GATE: "/gate",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_SEATING: "/admin/seating",
} as const;

export const SECTIONS = {
  HERO: "#domov",
  INFO: "#informacije",
  SONGS: "#glasba",
  SEATING: "#sedezni-red",
  RSVP: "#potrditev",
  ACCOMMODATION: "#nastanitev",
  GALLERY: "#fotogalerija",
} as const;

export const COOKIE_NAME = "guest_authenticated";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const WEDDING_DATE = new Date("2026-06-05T15:00:00");
