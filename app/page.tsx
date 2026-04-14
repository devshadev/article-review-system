import { AddArticleForm } from "@/app/components/add-article-form";

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
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:4000";
  let articles: Article[] = [];

  try {
    const response = await fetch(`${apiBaseUrl}/api/articles`, { cache: "no-store" });
    articles = (response.ok ? await response.json() : []) as Article[];
  } catch {
    // Keep UI available even when backend is offline/unreachable.
    articles = [];
  }

  return (
    <div className="min-h-screen bg-[#ebedf0] px-6 py-10 font-sans text-slate-800">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="rounded-3xl border border-slate-200 bg-[#eef1f5] p-6 shadow-[8px_8px_16px_#d1d4d8,-8px_-8px_16px_#ffffff]">
          <h1 className="text-3xl font-semibold">AI-assisted Article Review Platform</h1>
          <p className="mt-2 text-slate-600">
            Add article URLs and start collecting structured reviews.
          </p>
          <div className="mt-6">
            <AddArticleForm />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Article Feed</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((article) => {
              return (
                <article
                  key={article.id}
                  className="rounded-2xl border border-slate-200 bg-[#eef1f5] p-5 shadow-[6px_6px_12px_#d1d4d8,-6px_-6px_12px_#ffffff] transition hover:-translate-y-0.5"
                >
                  <h3 className="text-lg font-semibold">{article.title}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-slate-600">
                    {article.description ?? "No description yet."}
                  </p>
                  <div className="mt-4 text-sm text-slate-500">
                    <p>Source: {article.source ?? "unknown"}</p>
                    <p>
                      Rating: {article.averageRating ? article.averageRating.toFixed(1) : "-"} / 5 (
                      {article.reviewCount} reviews)
                    </p>
                  </div>
                  <a
                    href={article.url}
                    className="mt-4 inline-block text-sm font-medium text-blue-700 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open article
                  </a>
                </article>
              );
            })}
          </div>
          {articles.length === 0 ? (
            <p className="text-sm text-slate-600">No articles yet. Add your first one above.</p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
