import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WeddingTableWithGuests, Guest, SongRequest, SiteContent } from "@/types";
import { SongsSection } from "@/components/SongsSection";
import { FloorPlan } from "@/components/FloorPlan";
import { Countdown } from "@/components/Countdown";
import { RsvpSection } from "@/components/RsvpSection";
import { BotanicalDecor } from "@/components/BotanicalDecor";

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
        className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-[#1a1917] relative overflow-hidden"
      >
        <BotanicalDecor />
        <BotanicalDecor flip />
        {/* Bottom botanicals */}
        <BotanicalDecor position="bottom" />
        <BotanicalDecor position="bottom" flip />
        {/* Subtle warm radial wash */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#2a2520] opacity-40 blur-[180px] pointer-events-none" />
        {/* Subtle grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise" />
        {/* Thin decorative ring behind content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] rounded-full border border-white/[0.02] pointer-events-none" />
        <div className="relative text-center space-y-8 animate-fade-in max-w-2xl mx-auto">
          {/* Photo */}
          <div className="animate-fade-in-delay-1">
            <div className="w-80 h-72 sm:w-[28rem] sm:h-[22rem] mx-auto rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.06]">
              <img
                src={heroImage}
                alt="Sara & Bor"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Names */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-cream-50 tracking-wide animate-fade-in-delay-1">
            Sara & Bor
          </h1>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-4 animate-fade-in-delay-2">
            <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-gold-400/60" />
            <span className="text-gold-400/80 text-sm">&#9829;</span>
            <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-gold-400/60" />
          </div>

          {/* Date */}
          <p className="font-serif text-xl sm:text-2xl text-cream-300/70 tracking-wide animate-fade-in-delay-2">
            5. junij 2026
          </p>

          {/* Countdown */}
          <div className="animate-fade-in-delay-3">
            <Countdown />
          </div>

          {/* Scroll hint */}
          <div className="pt-10 animate-fade-in-delay-3">
            <a
              href="#informacije"
              className="inline-block text-gold-400/40 hover:text-gold-400/70 transition-colors"
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
                  strokeWidth={1}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ───── INFORMACIJE ───── */}
      {sectionEnabled("info") && (
      <section id="informacije" className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-400/70 text-xs tracking-[0.4em] uppercase mb-3">Informacije</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-sage-700 mb-5">
              {sectionName("info", "Podrobnosti")}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-gold-300/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold-300/60" />
              <div className="w-8 h-px bg-gold-300/50" />
            </div>
          </div>

          <div className="space-y-14">
            {sectionEnabled("block_when") && (
            <InfoBlock title={c("block_when_title", "Kdaj")} icon="&#128197;">
              <p className="text-lg font-serif text-sage-600">
                {c("date_time", "[DATUM IN URA]")}
              </p>
            </InfoBlock>
            )}

            {sectionEnabled("block_where") && (
            <InfoBlock title={c("block_where_title", "Kje")} icon="&#128205;">
              <p className="text-lg font-serif text-sage-600">
                {c("venue_name", "[IME LOKACIJE]")}
              </p>
              <p className="text-gray-500 mt-1">
                {c("venue_address", "[NASLOV LOKACIJE]")}
              </p>
            </InfoBlock>
            )}

            {sectionEnabled("block_directions") && (
            <InfoBlock title={c("block_directions_title", "Kako do tja")} icon="&#128663;">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {c("directions", "[NAVODILA / ZEMLJEVID]")}
              </p>
            </InfoBlock>
            )}

            {sectionEnabled("block_schedule") && (
            <InfoBlock title={c("block_schedule_title", "Program")} icon="&#9202;">
              <div className="space-y-4">
                <TimelineItem time={c("schedule_ceremony", "[URA]")} event="Obred" />
                <TimelineItem time={c("schedule_aperitif", "[URA]")} event="Aperitiv" />
                <TimelineItem time={c("schedule_dinner", "[URA]")} event="Večerja" />
                <TimelineItem time={c("schedule_party", "[URA]")} event="Zabava in ples" />
              </div>
            </InfoBlock>
            )}

            {sectionEnabled("block_dresscode") && (
            <InfoBlock title={c("block_dresscode_title", "Oblačilni kod")} icon="&#128087;">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {c("dress_code", "[OBLAČILNI KOD]")}
              </p>
            </InfoBlock>
            )}

            {sectionEnabled("block_accommodation") && (
            <InfoBlock title={c("block_accommodation_title", "Namestitev")} icon="&#127976;">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
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
      <section id="glasba" className="py-20 sm:py-28 bg-sage-50/40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gold-400/70 text-xs tracking-[0.4em] uppercase mb-3">Glasba</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-sage-700 mb-4">
              {sectionName("songs", "Predlagajte pesem")}
            </h2>
            <p className="text-gray-500">
              Pomagajte nam sestaviti popoln seznam pesmi za zabavo!
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="w-8 h-px bg-gold-300/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold-300/60" />
              <div className="w-8 h-px bg-gold-300/50" />
            </div>
          </div>

          <SongsSection initialSongs={songs} />
        </div>
      </section>
      )}

      {/* ───── SEDEŽNI RED ───── */}
      {sectionEnabled("seating") && (
      <section id="sedezni-red" className="py-20 sm:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gold-400/70 text-xs tracking-[0.4em] uppercase mb-3">Razporeditev</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-sage-700 mb-4">
              {sectionName("seating", "Sedežni red")}
            </h2>
            <p className="text-gray-500">
              Poiščite svojo mizo za slavje
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="w-8 h-px bg-gold-300/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold-300/60" />
              <div className="w-8 h-px bg-gold-300/50" />
            </div>
          </div>

          <FloorPlan tables={tablesWithGuests} mode="view" />

          {tablesWithGuests.length > 0 && (
            <div className="mt-12 space-y-4 sm:hidden">
              <h3 className="font-serif text-xl text-sage-600">Vse mize</h3>
              {tablesWithGuests.map((table) => (
                <div
                  key={table.id}
                  className="p-4 bg-cream-50 rounded-lg border border-cream-200"
                >
                  <p className="font-serif text-sage-700 font-medium">
                    {table.name}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {table.guests.map((guest) => (
                      <span
                        key={guest.id}
                        className="text-xs px-2 py-1 bg-cream-100 rounded-full text-gray-600"
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
      <section id="potrditev" className="py-20 sm:py-28 bg-[#1a1917] relative overflow-hidden">
        <BotanicalDecor />
        <BotanicalDecor flip />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise" />
        <div className="relative max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold-400/30" />
              <span className="text-gold-400/50 text-sm">&#9829;</span>
              <div className="w-8 h-px bg-gold-400/30" />
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-cream-100/90 mb-3 italic">
              Bodi z nama
            </h2>
            <p className="text-cream-300/50 uppercase tracking-[0.25em] text-xs sm:text-sm mb-2">
              Potrdi svojo udeležbo
            </p>
            <p className="text-cream-300/25 text-xs tracking-[0.3em]">
              5 &middot; JUNIJ &middot; 2026
            </p>
          </div>

          <RsvpSection />
        </div>
      </section>
      )}
    </div>
  );
}

function InfoBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l-2 border-gold-200/60 pl-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl opacity-70" role="img">
          {icon}
        </span>
        <h3 className="font-serif text-xl text-sage-700 tracking-wide">{title}</h3>
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
}

function TimelineItem({ time, event }: { time: string; event: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-1.5 h-1.5 rounded-full bg-gold-300/70 shrink-0" />
      <div>
        <span className="text-sm text-gold-500/80 font-medium tabular-nums">{time}</span>
        <span className="text-gray-500 ml-3">{event}</span>
      </div>
    </div>
  );
}
