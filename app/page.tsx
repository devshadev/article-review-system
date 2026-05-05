import Link from "next/link";
import { ArticleCard } from "@/app/components/article-card";

type Article = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  source: string | null;
  reviewCount: number;
  averageRating: number | null;
};

export default async function Home() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  let articles: Article[] = [];

  try {
    const response = await fetch(`${apiBaseUrl}/api/articles`, { cache: "no-store" });
    articles = (response.ok ? await response.json() : []) as Article[];
  } catch {
    articles = [];
  }

  return (
    <div style={{ padding: "0", minHeight: "calc(100vh - 57px)" }}>
      {/* Hero strip */}
      <div
        style={{
          borderBottom: "var(--border)",
          background: "var(--black)",
          color: "var(--yellow)",
          padding: "3rem 2rem",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              opacity: 0.6,
              marginBottom: "0.5rem",
              letterSpacing: "0.15em",
            }}
          >
            — ARTICLE REVIEW SYSTEM
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 4rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            READ.<br />REVIEW.<br />REPEAT.
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem" }}>
          <div
            style={{
              border: "3px solid var(--yellow)",
              padding: "1rem 1.5rem",
              textAlign: "right",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "2.5rem",
                lineHeight: 1,
                display: "block",
              }}
            >
              {articles.length}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", opacity: 0.7 }}>
              ARTICLES INDEXED
            </span>
          </div>
          <Link
            href="/add-article"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.85rem",
              background: "var(--yellow)",
              color: "var(--black)",
              padding: "0.875rem 1.5rem",
              textDecoration: "none",
              display: "inline-block",
              boxShadow: "4px 4px 0 var(--yellow)",
              border: "3px solid var(--yellow)",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
          >
            + ADD ARTICLE
          </Link>
        </div>
      </div>

      {/* Feed */}
      <div style={{ padding: "2rem" }}>
        {articles.length === 0 ? (
          <div
            style={{
              border: "var(--border)",
              padding: "4rem 2rem",
              textAlign: "center",
              background: "var(--white)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.25rem",
                marginBottom: "0.5rem",
              }}
            >
              NO ARTICLES YET
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", opacity: 0.6 }}>
              Be the first to add one →{" "}
              <Link href="/add-article" style={{ color: "var(--blue)" }}>
                ADD ARTICLE
              </Link>
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "0",
              border: "var(--border)",
            }}
          >
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}