"use client";

import Link from "next/link";

const RATING_COLORS = ["#e63329", "#e63329", "#ff8c00", "#f5e642", "#00c853", "#00c853"];

type Article = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  source: string | null;
  reviewCount: number;
  averageRating: number | null;
};

export function ArticleCard({ article, index }: { article: Article; index: number }) {
  const rating = article.averageRating;
  const ratingColor = rating
    ? RATING_COLORS[Math.round(rating)] ?? "var(--black)"
    : "var(--black)";

  return (
    <article
      style={{
        border: "var(--border)",
        margin: "-1px",
        padding: "1.5rem",
        background: index % 3 === 0 ? "var(--white)" : index % 3 === 1 ? "#f0ede5" : "#e8e5dd",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        transition: "transform 0.1s",
      }}
    >
      {article.source && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            background: "var(--black)",
            color: "var(--yellow)",
            padding: "0.2rem 0.5rem",
            display: "inline-block",
            width: "fit-content",
          }}
        >
          {article.source.toUpperCase()}
        </span>
      )}

      {/* ✅ Title now links to the article detail page */}
      <Link href={`/article/${article.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.95rem",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.textDecoration = "none";
          }}
        >
          {article.title}
        </h3>
      </Link>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--black)",
          opacity: 0.65,
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {article.description ?? "No description available."}
      </p>

      <div
        style={{
          borderTop: "2px solid var(--black)",
          paddingTop: "0.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "1.5rem",
              color: ratingColor,
              WebkitTextStroke: "1.5px var(--black)",
            }}
          >
            {rating ? rating.toFixed(1) : "—"}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              opacity: 0.6,
              marginLeft: "0.25rem",
            }}
          >
            / 5 · {article.reviewCount} reviews
          </span>
        </div>

        {/* ✅ Two buttons: REVIEW links to detail page, READ opens the article */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link
            href={`/article/${article.id}`}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.7rem",
              color: "var(--black)",
              textDecoration: "none",
              border: "2px solid var(--black)",
              padding: "0.3rem 0.75rem",
              background: "var(--white)",
              boxShadow: "3px 3px 0 var(--black)",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "5px 5px 0 var(--black)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0 var(--black)";
            }}
          >
            REVIEW
          </Link>

          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.7rem",
              color: "var(--black)",
              textDecoration: "none",
              border: "2px solid var(--black)",
              padding: "0.3rem 0.75rem",
              background: "var(--yellow)",
              boxShadow: "3px 3px 0 var(--black)",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "5px 5px 0 var(--black)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0 var(--black)";
            }}
          >
            READ →
          </a>
        </div>
      </div>
    </article>
  );
}