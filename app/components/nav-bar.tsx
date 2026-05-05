"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Read on mount
    setUserEmail(window.localStorage.getItem("authUserEmail"));

    // Listen for changes from other tabs
    const handleStorage = () => {
      setUserEmail(window.localStorage.getItem("authUserEmail"));
    };
    window.addEventListener("storage", handleStorage);

    // Listen for changes in the SAME tab via custom event
    const handleAuthChange = () => {
      setUserEmail(window.localStorage.getItem("authUserEmail"));
    };
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("authUserEmail");
    setUserEmail(null);
    window.dispatchEvent(new Event("authChange"));
    router.push("/");
    router.refresh();
  };

  const links = [
    { href: "/", label: "FEED" },
    { href: "/add-article", label: "+ ADD" },
  ];

  return (
    <nav
      style={{
        borderBottom: "var(--border)",
        background: "var(--yellow)",
        display: "flex",
        alignItems: "stretch",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "1rem",
          textDecoration: "none",
          padding: "1rem 1.5rem",
          borderRight: "var(--border)",
          display: "flex",
          alignItems: "center",
          letterSpacing: "-0.02em",
          background: "var(--black)",
          color: "var(--yellow)",
        }}
      >
        ARS
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.75rem",
              textDecoration: "none",
              padding: "1rem 1.25rem",
              borderRight: "var(--border)",
              display: "flex",
              alignItems: "center",
              background: pathname === link.href ? "var(--black)" : "transparent",
              color: pathname === link.href ? "var(--yellow)" : "var(--black)",
              transition: "background 0.1s",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Auth area */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "stretch" }}>
        {userEmail ? (
          <>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                padding: "1rem 1.25rem",
                borderLeft: "var(--border)",
                display: "flex",
                alignItems: "center",
                color: "var(--black)",
                opacity: 0.7,
              }}
            >
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.75rem",
                background: "var(--red)",
                color: "var(--white)",
                border: "none",
                borderLeft: "var(--border)",
                padding: "1rem 1.25rem",
                cursor: "pointer",
              }}
            >
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.75rem",
                textDecoration: "none",
                padding: "1rem 1.25rem",
                borderLeft: "var(--border)",
                display: "flex",
                alignItems: "center",
                background: pathname === "/login" ? "var(--black)" : "transparent",
                color: pathname === "/login" ? "var(--yellow)" : "var(--black)",
              }}
            >
              LOGIN
            </Link>
            <Link
              href="/signup"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.75rem",
                textDecoration: "none",
                padding: "1rem 1.25rem",
                borderLeft: "var(--border)",
                display: "flex",
                alignItems: "center",
                background: "var(--blue)",
                color: "var(--white)",
              }}
            >
              SIGN UP
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}