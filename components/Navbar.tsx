"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLang } from "@/app/hooks/useLanguage";

const Navbar = () => {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();

  const navLinks = [
    { href: "/", label: t("nav_home") },
    { href: "/add", label: t("nav_add") },
    { href: "/calendar", label: t("nav_calendar") },
    { href: "/manage", label: t("nav_manage") },
    { href: "/about", label: t("nav_about") },
  ];

  return (
    <nav
      className="relative z-50 transition-colors duration-300"
      style={{ background: "linear-gradient(135deg, #075985 0%, #0369a1 50%, #0284c7 100%)", boxShadow: "0 4px 20px rgba(6,95,70,0.4)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-sky-300 to-sky-500 flex items-center justify-center shadow-[0_2px_8px_rgba(56,189,248,0.5)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-wide">
            Expense<span className="text-sky-200">Tracker</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Desktop nav — hidden on mobile (BottomNav handles mobile) */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`px-4 py-2 rounded-lg text-[0.95rem] transition-all no-underline block ${
                      active
                        ? "bg-white/15 text-white font-semibold"
                        : "text-white/75 font-normal hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <ThemeToggle />

          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === "th" ? "en" : "th")}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white text-xs font-bold tracking-wider hover:bg-white/20 transition-colors"
            aria-label="Toggle language"
          >
            {lang === "th" ? "EN" : "TH"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
