const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:4000";

export function getToken(): string | null {
  return localStorage.getItem("authToken");
}

export async function fetchArticle(id: string) {
  const res = await fetch(`${API_BASE}/api/articles/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchReviews(articleId: string) {
  const res = await fetch(`${API_BASE}/api/articles/${articleId}/reviews`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function submitReview(data: {
  articleId: string;
  clarity: number;
  depth: number;
  usefulness: number;
  credibility: number;
  comment: string;
}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function deleteReview(reviewId: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/reviews/${reviewId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}