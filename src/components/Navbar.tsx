"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SECTIONS, ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

interface NavLink {
  href: string;
  label: string;
  enabledKey?: string; // if set, only show when site_content[enabledKey] !== "false"
}

const NAV_LINKS: NavLink[] = [
  { href: SECTIONS.HERO, label: "Domov" },
  { href: SECTIONS.INFO, label: "Časovnica", enabledKey: "section_enabled_info" },
  { href: SECTIONS.SONGS, label: "Glasba", enabledKey: "section_enabled_songs" },
  { href: SECTIONS.SEATING, label: "Sedežni red", enabledKey: "section_enabled_seating" },
  { href: SECTIONS.ACCOMMODATION, label: "Nastanitev", enabledKey: "section_enabled_accommodation" },
  { href: SECTIONS.RSVP, label: "Potrditev", enabledKey: "section_enabled_rsvp" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS.HERO);
  const [scrolled, setScrolled] = useState(false);
  const [disabledKeys, setDisabledKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_content")
      .select("key, value")
      .like("key", "section_enabled_%")
      .then(({ data }) => {
        const disabled = new Set<string>();
        (data || []).forEach((row: { key: string; value: string }) => {
          if (row.value === "false") disabled.add(row.key);
        });
        setDisabledKeys(disabled);
      });
  }, []);

  const visibleLinks = NAV_LINKS.filter(
    (link) => !link.enabledKey || !disabledKeys.has(link.enabledKey)
  );

  const isOnHero = activeSection === SECTIONS.HERO && !scrolled;

  useEffect(() => {
    const sectionIds = Object.values(SECTIONS).map((s) => s.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    function handleScroll() {
      setScrolled(window.scrollY > 100);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (pathname === ROUTES.GATE) return null;
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isOnHero
          ? "bg-warm-900/80 backdrop-blur-md border-b border-white/5"
          : "bg-warm-50/90 backdrop-blur-md border-b border-warm-200"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <a
            href={SECTIONS.HERO}
            className={`font-serif text-lg transition-colors duration-500 ${
              isOnHero
                ? "text-white/90 hover:text-white"
                : "text-warm-800 hover:text-warm-600"
            }`}
          >
            S & B
          </a>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-8">
            {visibleLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-xs tracking-widest uppercase transition-colors duration-500 ${
                  activeSection === link.href
                    ? isOnHero
                      ? "text-white font-medium"
                      : "text-warm-800 font-medium"
                    : isOnHero
                      ? "text-white/50 hover:text-white/80"
                      : "text-warm-500 hover:text-warm-700"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`sm:hidden p-2 transition-colors duration-500 ${
              isOnHero
                ? "text-white/70 hover:text-white"
                : "text-warm-500 hover:text-warm-700"
            }`}
            aria-label="Odpri meni"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className={`sm:hidden pb-4 pt-2 border-t ${
              isOnHero ? "border-white/10" : "border-warm-200"
            }`}
          >
            {visibleLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-xs tracking-widest uppercase transition-colors ${
                  activeSection === link.href
                    ? isOnHero
                      ? "text-white font-medium"
                      : "text-warm-800 font-medium"
                    : isOnHero
                      ? "text-white/50 hover:text-white/80"
                      : "text-warm-500 hover:text-warm-700"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              href={ROUTES.ADMIN_LOGIN}
              onClick={() => setIsOpen(false)}
              className={`block py-2 text-xs transition-colors mt-2 pt-3 ${
                isOnHero
                  ? "text-white/20 hover:text-white/40 border-t border-white/10"
                  : "text-warm-400 hover:text-warm-500 border-t border-warm-200"
              }`}
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
