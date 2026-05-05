"use client";

import React, { InputHTMLAttributes, ButtonHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface BrutalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

interface BrutalTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

interface BrutalSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  hint?: string;
}

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

interface BrutalBadgeProps {
  children: React.ReactNode;
  color?: "blue" | "red" | "yellow" | "green" | "default";
}

interface BrutalCardProps {
  children: React.ReactNode;
  accentColor?: string;
  style?: React.CSSProperties;
  className?: string;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const BASE_INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  border: "3px solid #000",
  borderRadius: 0,
  background: "#fff",
  fontFamily: "var(--font-mono, 'Courier New', monospace)",
  fontSize: "0.9rem",
  color: "#000",
  outline: "none",
  boxSizing: "border-box",
  transition: "box-shadow 0.1s ease",
  boxShadow: "4px 4px 0 #000",
  appearance: "none",
  WebkitAppearance: "none",
};

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono, 'Courier New', monospace)",
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: "0.4rem",
  color: "#000",
};

const ERROR_HINT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-mono, 'Courier New', monospace)",
  fontSize: "0.7rem",
  marginTop: "0.35rem",
};

// ─── BRUTALINPUT ──────────────────────────────────────────────────────────────

export function BrutalInput({ id, label, error, hint, style, ...props }: BrutalInputProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor={id} style={LABEL_STYLE}>
        {label}
        {props.required && (
          <span style={{ color: "var(--red, #e00)", marginLeft: "0.25rem" }}>*</span>
        )}
      </label>
      <input
        id={id}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={{
          ...BASE_INPUT_STYLE,
          boxShadow: focused
            ? "6px 6px 0 var(--blue, #0047ff)"
            : error
            ? "4px 4px 0 var(--red, #e00)"
            : "4px 4px 0 #000",
          borderColor: error ? "var(--red, #e00)" : "#000",
          ...style,
        }}
      />
      {error && (
        <span style={{ ...ERROR_HINT_STYLE, color: "var(--red, #e00)" }}>
          ⚠ {error}
        </span>
      )}
      {hint && !error && (
        <span style={{ ...ERROR_HINT_STYLE, opacity: 0.55 }}>{hint}</span>
      )}
    </div>
  );
}

// ─── BRUTALTEXTAREA ───────────────────────────────────────────────────────────

export function BrutalTextarea({ id, label, error, hint, style, ...props }: BrutalTextareaProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor={id} style={LABEL_STYLE}>
        {label}
        {props.required && (
          <span style={{ color: "var(--red, #e00)", marginLeft: "0.25rem" }}>*</span>
        )}
      </label>
      <textarea
        id={id}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={{
          ...BASE_INPUT_STYLE,
          resize: "vertical",
          minHeight: "8rem",
          boxShadow: focused
            ? "6px 6px 0 var(--blue, #0047ff)"
            : error
            ? "4px 4px 0 var(--red, #e00)"
            : "4px 4px 0 #000",
          borderColor: error ? "var(--red, #e00)" : "#000",
          ...style,
        }}
      />
      {error && (
        <span style={{ ...ERROR_HINT_STYLE, color: "var(--red, #e00)" }}>
          ⚠ {error}
        </span>
      )}
      {hint && !error && (
        <span style={{ ...ERROR_HINT_STYLE, opacity: 0.55 }}>{hint}</span>
      )}
    </div>
  );
}

// ─── BRUTALSELECT ─────────────────────────────────────────────────────────────

export function BrutalSelect({ id, label, options, error, hint, style, ...props }: BrutalSelectProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor={id} style={LABEL_STYLE}>
        {label}
        {props.required && (
          <span style={{ color: "var(--red, #e00)", marginLeft: "0.25rem" }}>*</span>
        )}
      </label>
      <div style={{ position: "relative" }}>
        <select
          id={id}
          {...props}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          style={{
            ...BASE_INPUT_STYLE,
            paddingRight: "2.5rem",
            cursor: "pointer",
            boxShadow: focused
              ? "6px 6px 0 var(--blue, #0047ff)"
              : error
              ? "4px 4px 0 var(--red, #e00)"
              : "4px 4px 0 #000",
            borderColor: error ? "var(--red, #e00)" : "#000",
            ...style,
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom arrow */}
        <span
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            fontFamily: "var(--font-mono, monospace)",
            fontWeight: 700,
            fontSize: "0.8rem",
          }}
        >
          ▼
        </span>
      </div>
      {error && (
        <span style={{ ...ERROR_HINT_STYLE, color: "var(--red, #e00)" }}>
          ⚠ {error}
        </span>
      )}
      {hint && !error && (
        <span style={{ ...ERROR_HINT_STYLE, opacity: 0.55 }}>{hint}</span>
      )}
    </div>
  );
}

// ─── BRUTALBUTTON ─────────────────────────────────────────────────────────────

export function BrutalButton({
  variant = "primary",
  size = "md",
  children,
  style,
  disabled,
  ...props
}: BrutalButtonProps) {
  const [pressed, setPressed] = React.useState(false);

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "#000",
      color: "#fff",
      border: "3px solid #000",
    },
    secondary: {
      background: "var(--yellow, #ffe600)",
      color: "#000",
      border: "3px solid #000",
    },
    danger: {
      background: "var(--red, #e00)",
      color: "#fff",
      border: "3px solid #000",
    },
    ghost: {
      background: "transparent",
      color: "#000",
      border: "3px solid #000",
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "0.35rem 0.75rem", fontSize: "0.72rem" },
    md: { padding: "0.6rem 1.25rem", fontSize: "0.82rem" },
    lg: { padding: "0.85rem 1.75rem", fontSize: "0.95rem" },
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        fontFamily: "var(--font-mono, 'Courier New', monospace)",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: 0,
        transition: "box-shadow 0.08s ease, transform 0.08s ease",
        boxShadow: pressed || disabled ? "1px 1px 0 #000" : "4px 4px 0 #000",
        transform: pressed || disabled ? "translate(3px, 3px)" : "translate(0, 0)",
        opacity: disabled ? 0.55 : 1,
        userSelect: "none",
        whiteSpace: "nowrap",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── BRUTALBADGE ──────────────────────────────────────────────────────────────

export function BrutalBadge({ children, color = "default" }: BrutalBadgeProps) {
  const colorMap: Record<string, { bg: string; text: string; shadow: string }> = {
    blue:    { bg: "var(--blue, #0047ff)",   text: "#fff", shadow: "#000" },
    red:     { bg: "var(--red, #e00)",        text: "#fff", shadow: "#000" },
    yellow:  { bg: "var(--yellow, #ffe600)",  text: "#000", shadow: "#000" },
    green:   { bg: "var(--green, #00c853)",   text: "#000", shadow: "#000" },
    default: { bg: "#000",                    text: "#fff", shadow: "#444" },
  };

  const c = colorMap[color];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.2rem 0.55rem",
        background: c.bg,
        color: c.text,
        fontFamily: "var(--font-mono, monospace)",
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        border: "2px solid #000",
        boxShadow: `2px 2px 0 ${c.shadow}`,
        borderRadius: 0,
      }}
    >
      {children}
    </span>
  );
}

// ─── BRUTALCARD ───────────────────────────────────────────────────────────────

export function BrutalCard({ children, accentColor = "#000", style, className }: BrutalCardProps) {
  return (
    <div
      className={className}
      style={{
        border: "3px solid #000",
        boxShadow: `6px 6px 0 ${accentColor}`,
        background: "#fff",
        padding: "1.5rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── BRUTALDIVIDER ────────────────────────────────────────────────────────────

export function BrutalDivider({ label }: { label?: string }) {
  if (!label) {
    return <hr style={{ border: "none", borderTop: "3px solid #000", margin: "1.5rem 0" }} />;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        margin: "1.5rem 0",
        fontFamily: "var(--font-mono, monospace)",
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#000",
      }}
    >
      <div style={{ flex: 1, borderTop: "3px solid #000" }} />
      <span>{label}</span>
      <div style={{ flex: 1, borderTop: "3px solid #000" }} />
    </div>
  );
}