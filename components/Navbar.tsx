"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setShowMobileMenu(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link href="/" style={styles.link}>
          ExpenseTracker
        </Link>
      </div>
      <ul
        style={
          isMobile ? { ...styles.navLinks, display: "none" } : styles.navLinks
        }
      >
        <li>
          <Link href="/" style={styles.link}>
            หน้าหลัก
          </Link>
        </li>
        <li>
          <Link href="/manage" style={styles.link}>
            จัดการข้อมูล
          </Link>
        </li>
        <li>
          <Link href="/about" style={styles.link}>
            เกี่ยวกับ
          </Link>
        </li>
      </ul>
      {isMobile && (
        <>
          <button
            style={styles.hamburger}
            onClick={() => setShowMobileMenu((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span style={styles.bar}></span>
            <span style={styles.bar}></span>
            <span style={styles.bar}></span>
          </button>
          {showMobileMenu && (
            <ul style={styles.mobileNavLinks}>
              <li>
                <Link
                  href="/"
                  style={styles.link}
                  onClick={() => setShowMobileMenu(false)}
                >
                  หน้าหลัก
                </Link>
              </li>
              <li>
                <Link
                  href="/manage"
                  style={styles.link}
                  onClick={() => setShowMobileMenu(false)}
                >
                  จัดการข้อมูล
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  style={styles.link}
                  onClick={() => setShowMobileMenu(false)}
                >
                  เกี่ยวกับ
                </Link>
              </li>
            </ul>
          )}
        </>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#222",
    color: "#fff",
    position: "relative" as const,
  },
  logo: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "1.5rem",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
  },
  hamburger: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    width: "32px",
    height: "32px",
    background: "none",
    border: "none",
    cursor: "pointer",
    marginLeft: "1rem",
    padding: 0,
    zIndex: 1100,
  },
  bar: {
    width: "24px",
    height: "3px",
    background: "#fff",
    margin: "3px 0",
    borderRadius: "2px",
    display: "block",
  },
  mobileNavLinks: {
    position: "absolute" as const,
    top: "60px",
    right: "20px",
    background: "#222",
    flexDirection: "column" as const,
    gap: "1rem",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    zIndex: 1000,
    listStyle: "none",
    display: "flex",
  },
};

export default Navbar;
