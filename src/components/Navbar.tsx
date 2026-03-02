"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SECTIONS, ROUTES } from "@/lib/constants";

const NAV_LINKS = [
  { href: SECTIONS.HERO, label: "Domov" },
  { href: SECTIONS.INFO, label: "Podrobnosti" },
  { href: SECTIONS.SONGS, label: "Glasba" },
  { href: SECTIONS.SEATING, label: "Sedežni red" },
  { href: SECTIONS.RSVP, label: "Potrditev" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS.HERO);
  const [scrolled, setScrolled] = useState(false);

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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isOnHero
          ? "bg-transparent border-b border-transparent"
          : "bg-cream-50/90 backdrop-blur-md border-b border-cream-200"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a
            href={SECTIONS.HERO}
            className={`font-serif text-xl transition-colors ${
              isOnHero
                ? "text-cream-100 hover:text-cream-50"
                : "text-sage-700 hover:text-sage-500"
            }`}
          >
            S & B
          </a>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors ${
                  activeSection === link.href
                    ? isOnHero
                      ? "text-cream-50 font-medium"
                      : "text-sage-700 font-medium"
                    : isOnHero
                      ? "text-cream-200/70 hover:text-cream-50"
                      : "text-gray-500 hover:text-sage-600"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`sm:hidden p-2 transition-colors ${
              isOnHero
                ? "text-cream-200 hover:text-cream-50"
                : "text-gray-500 hover:text-sage-600"
            }`}
            aria-label="Odpri meni"
          >
            <svg
              className="w-6 h-6"
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
            className={`sm:hidden pb-4 pt-2 ${
              isOnHero
                ? "border-t border-[#333]"
                : "border-t border-cream-200"
            }`}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm tracking-wide transition-colors ${
                  activeSection === link.href
                    ? isOnHero
                      ? "text-cream-50 font-medium"
                      : "text-sage-700 font-medium"
                    : isOnHero
                      ? "text-cream-200/70 hover:text-cream-50"
                      : "text-gray-500 hover:text-sage-600"
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
                  ? "text-[#555] hover:text-[#888] border-t border-[#333]"
                  : "text-gray-400 hover:text-gray-500 border-t border-cream-200"
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
