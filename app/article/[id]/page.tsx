"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchArticle, fetchReviews, submitReview, deleteReview, getToken } from "@/app/lib/api";

type Review = {
  id: string;
  userId: string;
  clarity: number;
  depth: number;
  usefulness: number;
  credibility: number;
  comment: string | null;
  createdAt: string;
};

type Article = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  source: string | null;
};

const FIELDS = ["clarity", "depth", "usefulness", "credibility"] as const;

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [article, setArticle] = useState<Article | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ clarity: 3, depth: 3, usefulness: 3, credibility: 3, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isLoggedIn = !!getToken();

  useEffect(() => {
    fetchArticle(id).then(setArticle);
    fetchReviews(id).then(setReviews);
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { ok, data } = await submitReview({ articleId: id, ...form });

    if (!ok) {
      setError(data.error ?? "Something went wrong");
    } else {
      setSuccess(true);
      setReviews((prev) => [data, ...prev]);
      setForm({ clarity: 3, depth: 3, usefulness: 3, credibility: 3, comment: "" });
    }
    setSubmitting(false);
  }

  async function handleDelete(reviewId: string) {
    const ok = await deleteReview(reviewId);
    if (ok) setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }

  if (!article) return <div style={{ padding: "2rem", fontFamily: "var(--font-mono)" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>

      {/* Article Info */}
      <div style={{ border: "var(--border)", padding: "1.5rem", marginBottom: "2rem", background: "var(--white)" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", opacity: 0.5, marginBottom: "0.5rem" }}>
          {article.source}
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.75rem", marginBottom: "1rem" }}>
          {article.title}
        </h1>
        {article.description && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", opacity: 0.7, marginBottom: "1rem" }}>
            {article.description}
          </p>
        )}
        <a href={article.url} target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--blue)" }}>
          READ ARTICLE →
        </a>
      </div>

      {/* Review Form */}
      {isLoggedIn ? (
        <div style={{ border: "var(--border)", padding: "1.5rem", marginBottom: "2rem", background: "var(--white)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, marginBottom: "1.5rem" }}>
            WRITE A REVIEW
          </h2>
          <form onSubmit={handleSubmit}>
            {FIELDS.map((field) => (
              <div key={field} style={{ marginBottom: "1rem" }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", display: "block", marginBottom: "0.4rem" }}>
                  {field.toUpperCase()} — {form[field]}/5
                </label>
                <input
                  type="range" min={1} max={5} step={1}
                  value={form[field]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field]: Number(e.target.value) }))}
                  style={{ width: "100%" }}
                />
              </div>
            ))}

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", display: "block", marginBottom: "0.4rem" }}>
                COMMENT (optional)
              </label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
                rows={3}
                style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "0.75rem", border: "var(--border)", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            {error && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "red", marginBottom: "1rem" }}>
                {error}
              </p>
            )}
            {success && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "green", marginBottom: "1rem" }}>
                Review submitted!
              </p>
            )}

            <button type="submit" disabled={submitting}
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, background: "var(--black)", color: "var(--yellow)", border: "none", padding: "0.875rem 1.5rem", cursor: "pointer", fontSize: "0.85rem" }}>
              {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ border: "var(--border)", padding: "1.5rem", marginBottom: "2rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            <span style={{ cursor: "pointer", color: "var(--blue)" }} onClick={() => router.push("/login")}>
              Log in
            </span>{" "}
            to write a review.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, marginBottom: "1rem" }}>
        {reviews.length} REVIEW{reviews.length !== 1 ? "S" : ""}
      </h2>

      {reviews.length === 0 ? (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", opacity: 0.6 }}>
          No reviews yet. Be the first!
        </p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} style={{ border: "var(--border)", padding: "1.25rem", marginBottom: "1rem", background: "var(--white)" }}>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              {FIELDS.map((f) => (
                <span key={f} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                  {f.toUpperCase()}: <strong>{review[f]}/5</strong>
                </span>
              ))}
            </div>
            {review.comment && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", opacity: 0.8, marginBottom: "0.75rem" }}>
                {review.comment}
              </p>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", opacity: 0.5 }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              <button onClick={() => handleDelete(review.id)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", background: "none", border: "none", color: "red", cursor: "pointer" }}>
                DELETE
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}