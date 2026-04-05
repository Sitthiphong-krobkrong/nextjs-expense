"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setShowMobileMenu(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { href: "/", label: "หน้าหลัก" },
    { href: "/manage", label: "จัดการข้อมูล" },
    { href: "/about", label: "เกี่ยวกับ" },
  ];

  return (
    <nav className="relative z-50 transition-colors duration-300" style={{
      background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0e7490 100%)",
      boxShadow: "0 4px 20px rgba(15, 76, 117, 0.4)",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #38bdf8, #06b6d4)",
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

          {/* Hamburger */}
          {isMobile && (
          <>
            <button
              onClick={() => setShowMobileMenu((prev) => !prev)}
              aria-label="Toggle navigation"
              style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                alignItems: "center", width: "40px", height: "40px",
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer", borderRadius: "8px", padding: 0, zIndex: 1100,
              }}
            >
              {showMobileMenu ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              ) : (
                <>
                  <span style={{ width: "18px", height: "2px", background: "#fff", margin: "2px 0", borderRadius: "2px", display: "block" }}></span>
                  <span style={{ width: "18px", height: "2px", background: "#fff", margin: "2px 0", borderRadius: "2px", display: "block" }}></span>
                  <span style={{ width: "18px", height: "2px", background: "#fff", margin: "2px 0", borderRadius: "2px", display: "block" }}></span>
                </>
              )}
            </button>

            {showMobileMenu && (
              <ul style={{
                position: "absolute", top: "64px", right: "16px",
                background: "linear-gradient(135deg, #0f4c75, #1b6ca8)",
                flexDirection: "column", gap: "0.25rem", padding: "0.75rem",
                borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                zIndex: 1000, listStyle: "none", display: "flex",
                border: "1px solid rgba(255,255,255,0.15)", minWidth: "160px",
              }}>
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setShowMobileMenu(false)}
                      style={{
                        color: pathname === href ? "#fff" : "rgba(255,255,255,0.75)",
                        textDecoration: "none", fontSize: "0.95rem",
                        padding: "0.6rem 1rem", borderRadius: "8px",
                        background: pathname === href ? "rgba(255,255,255,0.15)" : "transparent",
                        display: "block", fontWeight: pathname === href ? "600" : "400",
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
