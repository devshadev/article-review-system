"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/app/components/page-shell";
import { BrutalButton, BrutalInput, BrutalTextarea } from "@/app/components/brutal-ui";

export default function AddArticlePage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:4000";
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("authToken");
    const savedEmail = window.localStorage.getItem("authUserEmail");
    if (savedToken) {
      setToken(savedToken);
      setUserEmail(savedEmail);
    }
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      if (!token) {
        setError("You must be logged in to add an article.");
        return;
      }

      const response = await fetch(`${apiBaseUrl}/api/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url,
          title: title || undefined,
          description: description || undefined,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setError(payload.error ?? "Failed to create article");
        return;
      }

      setUrl("");
      setTitle("");
      setDescription("");
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Network error while submitting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell
      title="ADD ARTICLE."
      subtitle="Submit a URL to index it in the review system."
      accentColor="var(--yellow)"
    >
      {/* Auth status strip */}
      <div
        style={{
          border: "var(--border)",
          padding: "0.875rem 1rem",
          marginBottom: "2rem",
          background: token ? "#f0fff4" : "#fff0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          boxShadow: "4px 4px 0 var(--black)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: token ? "#006620" : "var(--red)",
          }}
        >
          {token ? `● LOGGED IN AS ${userEmail?.toUpperCase()}` : "● NOT LOGGED IN"}
        </span>
        {!token && (
          <Link
            href="/login"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.7rem",
              color: "var(--black)",
              textDecoration: "none",
              border: "2px solid var(--black)",
              padding: "0.25rem 0.75rem",
              background: "var(--yellow)",
            }}
          >
            LOGIN →
          </Link>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        <BrutalInput
          id="url"
          label="ARTICLE URL *"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          required
        />
        <BrutalInput
          id="title"
          label="TITLE (OPTIONAL FALLBACK)"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Manual title if auto-detection fails"
        />
        <BrutalTextarea
          id="description"
          label="DESCRIPTION (OPTIONAL FALLBACK)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Manual description if auto-detection fails..."
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

        {success && (
          <div
            style={{
              border: "3px solid var(--green)",
              background: "#f0fff4",
              padding: "0.75rem 1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "#006620",
              boxShadow: "4px 4px 0 var(--green)",
            }}
          >
            ✓ Article added successfully!{" "}
            <Link href="/" style={{ color: "var(--blue)", fontWeight: 700 }}>
              VIEW FEED →
            </Link>
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
          <BrutalButton type="submit" variant="primary" disabled={isSubmitting || !token}>
            {isSubmitting ? "SUBMITTING..." : "ADD ARTICLE →"}
          </BrutalButton>
          <BrutalButton
            type="button"
            variant="ghost"
            onClick={() => router.push("/")}
          >
            ← BACK TO FEED
          </BrutalButton>
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
        — ARTICLE REVIEW SYSTEM · SUBMIT MODULE
      </div>
    </PageShell>
  );
}