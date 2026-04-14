import { NextRequest, NextResponse } from "next/server";

type Article = {
  id: string;
  title: string;
  description?: string;
  url: string;
  image?: string;
  source?: string;
  createdAt: string;
  reviewCount: number;
  averageRating: number | null;
};

const mockArticles: Article[] = [];

const domainFromUrl = (value: string): string | undefined => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
};

export async function GET() {
  return NextResponse.json(mockArticles);
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    url?: string;
    title?: string;
    description?: string;
    image?: string;
  };

  if (!payload.url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const normalizedUrl = payload.url.trim();
  if (mockArticles.some((article) => article.url === normalizedUrl)) {
    return NextResponse.json({ error: "article already exists for this URL" }, { status: 409 });
  }

  const article: Article = {
    id: crypto.randomUUID(),
    url: normalizedUrl,
    title: payload.title?.trim() || "Untitled article",
    description: payload.description?.trim(),
    image: payload.image?.trim(),
    source: domainFromUrl(normalizedUrl),
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    averageRating: null,
  };

  mockArticles.unshift(article);
  return NextResponse.json(article, { status: 201 });
}
