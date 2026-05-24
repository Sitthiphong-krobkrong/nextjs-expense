"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLang } from "@/app/hooks/useLanguage";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav_home") },
    { href: "/add", label: t("nav_add") },
    { href: "/calendar", label: t("nav_calendar") },
    { href: "/manage", label: t("nav_manage") },
    { href: "/about", label: t("nav_about") },
  ];

  return (
    <nav className="relative z-50 transition-colors duration-300" style={{
      background: "linear-gradient(135deg, #075985 0%, #0369a1 50%, #0284c7 100%)",
      boxShadow: "0 4px 20px rgba(6, 95, 70, 0.4)",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(56, 189, 248, 0.5)",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <span style={{ color: "#fff", fontWeight: "700", fontSize: "1.25rem", letterSpacing: "0.02em" }}>
              Expense<span style={{ color: "#7dd3fc" }}>Tracker</span>
            </span>
          </div>
        </Link>

        {/* Right Actions Container */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Desktop nav */}
          {!isMobile && (
            <ul style={{ listStyle: "none", display: "flex", gap: "0.5rem", margin: 0, padding: 0, alignItems: "center" }}>
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{
                      color: pathname === href ? "#fff" : "rgba(255,255,255,0.75)",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      fontWeight: pathname === href ? "600" : "400",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      background: pathname === href ? "rgba(255,255,255,0.15)" : "transparent",
                      display: "block",
                    }}
                    onMouseEnter={(e) => {
                      if (pathname !== href) {
                        (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                        (e.target as HTMLElement).style.color = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pathname !== href) {
                        (e.target as HTMLElement).style.background = "transparent";
                        (e.target as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                      }
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Lang Toggle */}
          <button
            onClick={() => setLang(lang === "th" ? "en" : "th")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "40px", height: "40px",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer", borderRadius: "8px", color: "#fff",
              fontSize: "0.8rem", fontWeight: "700", letterSpacing: "0.05em",
            }}
            aria-label="Toggle language"
          >
            {lang === "th" ? "EN" : "TH"}
          </button>

          {/* Hamburger removed — bottom nav handles mobile navigation */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
