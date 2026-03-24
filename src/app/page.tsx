import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WeddingTableWithGuests, Guest, SongRequest, SiteContent, Accommodation } from "@/types";
import { SongsSection } from "@/components/SongsSection";
import { FloorPlan } from "@/components/FloorPlan";
import { Countdown } from "@/components/Countdown";
import { RsvpSection } from "@/components/RsvpSection";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createServerSupabaseClient();

  const [songsResult, tablesResult, guestsResult, accommodationsResult] = await Promise.all([
    supabase
      .from("song_requests")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("wedding_tables")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase.from("guests").select("*"),
    supabase
      .from("accommodations")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  // site_content may not exist yet — query separately and handle gracefully
  const contentResult = await supabase.from("site_content").select("*");

  const songs = (songsResult.data as SongRequest[]) || [];
  const accommodations = (accommodationsResult.data as Accommodation[]) || [];
  const tablesWithGuests: WeddingTableWithGuests[] = (
    tablesResult.data || []
  ).map((table) => ({
    ...table,
    guests: (guestsResult.data || []).filter(
      (g: Guest) => g.table_id === table.id
    ),
  }));

  // Build content map with fallbacks
  const contentMap: Record<string, string> = {};
  ((contentResult.data as SiteContent[]) || []).forEach((row) => {
    contentMap[row.key] = row.value;
  });

  const c = (key: string, fallback: string) => contentMap[key] || fallback;
  const heroImage = c("hero_image_url", "/images/hero.jpg");
  const sectionEnabled = (key: string) => contentMap[`section_enabled_${key}`] !== "false";
  const sectionName = (key: string, fallback: string) => contentMap[`section_name_${key}`] || fallback;

  return (
    <div>
      {/* ───── HERO ───── */}
      <section
        id="domov"
        className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-warm-900 relative overflow-hidden"
      >
        {/* Floral border decorations — positioned around edges */}
        <img
          src="/images/2.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-110"
          aria-hidden="true"
        />

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

        <div className="relative text-center space-y-10 animate-fade-in max-w-2xl mx-auto">
          {/* Photo */}
          <div className="animate-fade-in-delay-1">
            <div className="w-72 h-64 sm:w-[26rem] sm:h-[21rem] mx-auto rounded-xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Sara & Bor"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Names */}
          <div className="space-y-1 animate-fade-in-delay-1 flex flex-col items-center">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-[0.35em] uppercase font-light pl-[0.35em]" style={{ color: '#5b5b5b' }}>
              Sara
            </h1>
            <p className="font-serif text-lg sm:text-xl italic" style={{ color: '#c08562' }}>in</p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-[0.35em] uppercase font-light pl-[0.35em]" style={{ color: '#5b5b5b' }}>
              Bor
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm tracking-[0.35em] uppercase animate-fade-in-delay-2" style={{ color: '#5b5b5b' }}>
            Vabiva na najino poroko
          </p>

          {/* Date */}
          <p className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.3em] uppercase font-light animate-fade-in-delay-2" style={{ color: '#bfb499' }}>
            Petek, 5.6.2026
          </p>

          {/* Countdown */}
          <div className="animate-fade-in-delay-2">
            <Countdown />
          </div>

          {/* Scroll hint */}
          <div className="pt-8 animate-fade-in-delay-3">
            <a
              href="#informacije"
              className="inline-block text-white/20 hover:text-white/40 transition-colors"
            >
              <svg
                className="w-5 h-5 mx-auto animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Smooth transition to light */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-warm-50 to-transparent pointer-events-none" />
      </section>

      {/* ───── ČASOVNICA ───── */}
      {sectionEnabled("info") && (
      <section id="informacije" className="py-24 sm:py-32 bg-warm-50">
        <div className="max-w-lg mx-auto px-6">
          <SectionHeader
            label="Informacije"
            title={sectionName("info", "Časovnica")}
          />

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-warm-300" />

            <div className="space-y-16">
              {/* 12:00 — Zbor pri nevesti */}
              <div className="relative flex gap-6 sm:gap-8">
                {/* Icon circle */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-warm-50 border border-warm-300 flex items-center justify-center">
                  {/* Wedding car icon */}
                  <svg className="w-7 h-7 sm:w-9 sm:h-9 text-warm-400" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 30h36v6H6z" />
                    <path d="M10 24l4-8h20l4 8" />
                    <path d="M6 30l-2-6h40l-2 6" />
                    <circle cx="13" cy="36" r="3" />
                    <circle cx="35" cy="36" r="3" />
                    <path d="M24 16v-6M20 12h8" />
                    <path d="M21 10a3 3 0 016 0" />
                  </svg>
                </div>
                {/* Content */}
                <div className="pt-1 sm:pt-3">
                  <p className="font-serif text-2xl sm:text-3xl text-warm-400 tracking-wide">12.00</p>
                  <p className="text-warm-800 font-medium tracking-[0.15em] uppercase text-sm mt-2">
                    Zbor pri nevesti
                  </p>
                  <p className="text-warm-800 tracking-[0.08em] uppercase text-xs mt-0.5">v Dobrepolju</p>
                  <p className="text-warm-500 text-sm mt-2">Mala vas 17, Dobrepolje</p>
                  <a
                    href="https://maps.app.goo.gl/3ztEVoQq429NgazD8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-warm-400 hover:text-warm-600 transition-colors text-xs tracking-wider uppercase border-b border-warm-300 pb-0.5"
                  >
                    Zemljevid
                  </a>
                </div>
              </div>

              {/* 15:30 — Poroka */}
              <div className="relative flex gap-6 sm:gap-8">
                {/* Icon circle */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-warm-50 border border-warm-300 flex items-center justify-center">
                  {/* Church icon */}
                  <svg className="w-7 h-7 sm:w-9 sm:h-9 text-warm-400" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M24 4v8M20 8h8" />
                    <path d="M8 44V24l16-10 16 10v20H8z" />
                    <path d="M18 44V34h12v10" />
                    <circle cx="24" cy="24" r="3" />
                  </svg>
                </div>
                {/* Content */}
                <div className="pt-1 sm:pt-3">
                  <p className="font-serif text-2xl sm:text-3xl text-warm-400 tracking-wide">15.30</p>
                  <p className="text-warm-800 font-medium tracking-[0.15em] uppercase text-sm mt-2">
                    Poroka v cerkvi
                  </p>
                  <p className="text-warm-800 tracking-[0.08em] uppercase text-xs mt-0.5">
                    Sv. Primoža in Felicijana na Jamniku
                  </p>
                  <p className="text-warm-500 text-sm mt-2">Jamnik, Kranj</p>
                  <a
                    href="https://maps.app.goo.gl/JZhVke7yjb2SVfZp6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-warm-400 hover:text-warm-600 transition-colors text-xs tracking-wider uppercase border-b border-warm-300 pb-0.5"
                  >
                    Zemljevid
                  </a>
                </div>
              </div>

              {/* 18:00 — Zabava */}
              <div className="relative flex gap-6 sm:gap-8">
                {/* Icon circle */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-warm-50 border border-warm-300 flex items-center justify-center">
                  {/* Plate & cutlery icon */}
                  <svg className="w-7 h-7 sm:w-9 sm:h-9 text-warm-400" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="24" cy="24" r="12" />
                    <path d="M24 18a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3z" />
                    <path d="M24 24v6" />
                    <path d="M8 10v28M8 10c0 5 3 8 3 12v16" />
                    <path d="M40 10v6c0 2-2 4-2 4v18" />
                    <path d="M40 10v12" />
                  </svg>
                </div>
                {/* Content */}
                <div className="pt-1 sm:pt-3">
                  <p className="font-serif text-2xl sm:text-3xl text-warm-400 tracking-wide">18.00</p>
                  <p className="text-warm-800 font-medium tracking-[0.15em] uppercase text-sm mt-2">
                    Pogostitev in zabava
                  </p>
                  <p className="text-warm-800 tracking-[0.08em] uppercase text-xs mt-0.5">
                    na ranču{" "}
                    <a
                      href="https://www.mackadam.si/nastanitve/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-warm-300 underline-offset-2 hover:text-warm-900 transition-colors"
                    >
                      Mackadam
                    </a>
                  </p>
                  <p className="text-warm-500 text-sm mt-2">Spodnje Duplje 1k</p>
                  <a
                    href="https://maps.app.goo.gl/mqkgPDT2hQiPprJTA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-warm-400 hover:text-warm-600 transition-colors text-xs tracking-wider uppercase border-b border-warm-300 pb-0.5"
                  >
                    Zemljevid
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ───── GLASBA ───── */}
      {sectionEnabled("songs") && (
      <section id="glasba" className="py-24 sm:py-32 bg-warm-100">
        <div className="max-w-2xl mx-auto px-6">
          <SectionHeader
            label="Glasba"
            title={sectionName("songs", "Predlagajte pesem")}
            subtitle="Pomagajte nam sestaviti popoln seznam pesmi za zabavo!"
          />
          <SongsSection initialSongs={songs} />
        </div>
      </section>
      )}

      {/* ───── SEDEŽNI RED ───── */}
      {sectionEnabled("seating") && (
      <section id="sedezni-red" className="py-24 sm:py-32 bg-warm-50">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeader
            label="Razporeditev"
            title={sectionName("seating", "Sedežni red")}
            subtitle="Poiščite svojo mizo za slavje"
          />

          <FloorPlan tables={tablesWithGuests} mode="view" />

          {tablesWithGuests.length > 0 && (
            <div className="mt-12 space-y-3 sm:hidden">
              <h3 className="font-serif text-lg text-warm-700">Vse mize</h3>
              {tablesWithGuests.map((table) => (
                <div
                  key={table.id}
                  className="p-4 bg-white rounded-lg border border-warm-200"
                >
                  <p className="font-serif text-warm-800 font-medium">
                    {table.name}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {table.guests.map((guest) => (
                      <span
                        key={guest.id}
                        className="text-xs px-2.5 py-1 bg-warm-100 rounded-full text-warm-600"
                      >
                        {guest.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* ───── NASTANITEV ───── */}
      {sectionEnabled("accommodation") && accommodations.length > 0 && (
      <section id="nastanitev" className="py-24 sm:py-32 bg-warm-100">
        <div className="max-w-lg mx-auto px-6">
          <SectionHeader
            label="Nastanitev"
            title={sectionName("accommodation", "Prenočišča")}
            subtitle={<>Nastanitve na ranču <a href="https://www.mackadam.si/nastanitve/" target="_blank" rel="noopener noreferrer" className="underline decoration-warm-400 underline-offset-2 hover:text-warm-700 transition-colors">Mackadam</a></>}
          />

          <div className="space-y-4">
            {accommodations.map((acc) => {
              const guests = acc.guest_names
                .split(",")
                .map((n) => n.trim())
                .filter(Boolean);
              return (
                <div
                  key={acc.id}
                  className="bg-white rounded-xl border border-warm-200 p-5"
                >
                  <p className="font-serif text-lg text-warm-800 mb-3">
                    {acc.unit_name}
                  </p>
                  {guests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {guests.map((name, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 bg-warm-100 rounded-full text-warm-600"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* ───── POTRDITEV (RSVP) ───── */}
      {sectionEnabled("rsvp") && (
      <section id="potrditev" className="py-24 sm:py-32 bg-warm-100 relative">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-gold-400 text-xs tracking-[0.35em] uppercase mb-4">Potrditev</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-warm-800 mb-3">
              Bodi z nama
            </h2>
            <p className="text-warm-500 text-sm">
              Potrdi svojo udeležbo do 1. maja 2026
            </p>
            <div className="w-10 h-px bg-gold-300/60 mx-auto mt-6" />
          </div>
          <RsvpSection />
        </div>
      </section>
      )}
    </div>
  );
}

/* ── Shared components ── */

function SectionHeader({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="text-center mb-16">
      <p className="text-gold-400 text-xs tracking-[0.35em] uppercase mb-4">{label}</p>
      <h2 className="font-serif text-4xl sm:text-5xl text-warm-800 mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-warm-500 text-sm">{subtitle}</p>
      )}
      <div className="w-10 h-px bg-gold-300/60 mx-auto mt-6" />
    </div>
  );
}

