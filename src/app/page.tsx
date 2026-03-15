import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WeddingTableWithGuests, Guest, SongRequest, SiteContent } from "@/types";
import { SongsSection } from "@/components/SongsSection";
import { FloorPlan } from "@/components/FloorPlan";
import { Countdown } from "@/components/Countdown";
import { RsvpSection } from "@/components/RsvpSection";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createServerSupabaseClient();

  const [songsResult, tablesResult, guestsResult] = await Promise.all([
    supabase
      .from("song_requests")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("wedding_tables")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase.from("guests").select("*"),
  ]);

  // site_content may not exist yet — query separately and handle gracefully
  const contentResult = await supabase.from("site_content").select("*");

  const songs = (songsResult.data as SongRequest[]) || [];
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
          <div className="space-y-4 animate-fade-in-delay-1">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-white/95 tracking-wide">
              Sara & Bor
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-gold-400/60" />
              <span className="text-gold-400/80 text-sm animate-heartbeat">&#9829;</span>
              <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-gold-400/60" />
            </div>
          </div>

          {/* Date */}
          <p className="font-serif text-xl sm:text-2xl text-white/50 tracking-wider animate-fade-in-delay-2">
            5. junij 2026
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

      {/* ───── INFORMACIJE ───── */}
      {sectionEnabled("info") && (
      <section id="informacije" className="py-24 sm:py-32 bg-warm-50">
        <div className="max-w-xl mx-auto px-6">
          <SectionHeader
            label="Informacije"
            title={sectionName("info", "Podrobnosti")}
          />

          <div className="space-y-16">
            {sectionEnabled("block_when") && (
            <InfoBlock label={c("block_when_title", "Kdaj")}>
              <p className="text-lg font-serif text-warm-800">
                {c("date_time", "[DATUM IN URA]")}
              </p>
            </InfoBlock>
            )}

            {sectionEnabled("block_where") && (
            <InfoBlock label={c("block_where_title", "Kje")}>
              <p className="text-lg font-serif text-warm-800">
                {c("venue_name", "[IME LOKACIJE]")}
              </p>
              <p className="text-warm-600 mt-1">
                {c("venue_address", "[NASLOV LOKACIJE]")}
              </p>
            </InfoBlock>
            )}

            {sectionEnabled("block_directions") && (
            <InfoBlock label={c("block_directions_title", "Kako do tja")}>
              <p className="text-warm-600 leading-relaxed whitespace-pre-line">
                {c("directions", "[NAVODILA / ZEMLJEVID]")}
              </p>
            </InfoBlock>
            )}

            {sectionEnabled("block_schedule") && (
            <InfoBlock label={c("block_schedule_title", "Program")}>
              <div className="space-y-3">
                <TimelineItem time={c("schedule_ceremony", "[URA]")} event="Obred" />
                <TimelineItem time={c("schedule_aperitif", "[URA]")} event="Aperitiv" />
                <TimelineItem time={c("schedule_dinner", "[URA]")} event="Večerja" />
                <TimelineItem time={c("schedule_party", "[URA]")} event="Zabava in ples" />
              </div>
            </InfoBlock>
            )}

            {sectionEnabled("block_dresscode") && (
            <InfoBlock label={c("block_dresscode_title", "Oblačilni kod")}>
              <p className="text-warm-600 leading-relaxed whitespace-pre-line">
                {c("dress_code", "[OBLAČILNI KOD]")}
              </p>
            </InfoBlock>
            )}

            {sectionEnabled("block_accommodation") && (
            <InfoBlock label={c("block_accommodation_title", "Namestitev")}>
              <p className="text-warm-600 leading-relaxed whitespace-pre-line">
                {c("accommodation", "[PREDLOGI ZA NAMESTITEV]")}
              </p>
            </InfoBlock>
            )}
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
  subtitle?: string;
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

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-gold-500 text-xs tracking-[0.25em] uppercase mb-3">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function TimelineItem({ time, event }: { time: string; event: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gold-500 font-medium tabular-nums w-14">{time}</span>
      <div className="w-1 h-1 rounded-full bg-warm-300" />
      <span className="text-warm-700">{event}</span>
    </div>
  );
}
