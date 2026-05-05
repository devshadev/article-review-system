import React from "react";

interface PageShellProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  children: React.ReactNode;
}

export function PageShell({
  title,
  subtitle,
  accentColor = "var(--yellow)",
  children,
}: PageShellProps) {
  return (
    <div style={{ minHeight: "calc(100vh - 57px)" }}>
      {/* Page header */}
      <div
        style={{
          borderBottom: "var(--border)",
          background: accentColor,
          padding: "2.5rem 2rem",
        }}
      >
        <div style={{ maxWidth: "680px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                marginTop: "0.5rem",
                opacity: 0.7,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Page content */}
      <div style={{ padding: "2.5rem 2rem", maxWidth: "680px" }}>
        {children}
      </div>
    </div>
  );
}