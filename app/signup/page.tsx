"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrutalButton, BrutalInput } from "@/app/components/brutal-ui";
import { PageShell } from "@/app/components/page-shell";

export default function SignupPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:4000";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const payload = (await response.json()) as {
        error?: string;
        token?: string;
        user?: { email: string };
      };
      if (!response.ok || !payload.token || !payload.user) {
        setError(payload.error ?? "Signup failed");
        return;
      }
      window.localStorage.setItem("authToken", payload.token);
      window.localStorage.setItem("authUserEmail", payload.user.email);
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell
      title="CREATE ACCOUNT."
      subtitle="Join the platform and start reviewing articles."
      accentColor="var(--green)"
    >
      <form
        onSubmit={onSignup}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        <BrutalInput
          id="name"
          label="DISPLAY NAME (OPTIONAL)"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          autoComplete="name"
        />
        <BrutalInput
          id="email"
          label="EMAIL ADDRESS"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <BrutalInput
          id="password"
          label="PASSWORD"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />

        {error && (
          <div
            style={{
              border: "3px solid var(--red)",
              background: "#fff0f0",
              padding: "0.75rem 1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--red)",
              boxShadow: "4px 4px 0 var(--red)",
            }}
          >
            ⚠ {error}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <BrutalButton type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "CREATING..." : "CREATE ACCOUNT →"}
          </BrutalButton>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", opacity: 0.6 }}>
            Have an account?{" "}
            <Link href="/login" style={{ color: "var(--blue)", fontWeight: 700 }}>
              LOGIN
            </Link>
          </span>
        </div>
      </form>

      <div
        style={{
          marginTop: "3rem",
          borderTop: "var(--border)",
          paddingTop: "1.5rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          opacity: 0.4,
          letterSpacing: "0.05em",
        }}
      >
        — ARTICLE REVIEW SYSTEM · SIGNUP MODULE
      </div>
    </PageShell>
  );
}