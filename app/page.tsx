import { AddArticleForm } from "@/app/components/add-article-form";

const articles = [
  {
    id: "demo-1",
    title: "Demo Article",
    description: "UI-only mode. No database connected.",
    url: "https://example.com",
    source: "example.com",
    reviews: [{ clarity: 4, depth: 4, usefulness: 5, credibility: 4 }],
  },
];

export default async function Home() {
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
              const count = article.reviews.length;
              const average =
                count === 0
                  ? null
                  : article.reviews.reduce((sum, review) => {
                      const reviewAverage =
                        (review.clarity + review.depth + review.usefulness + review.credibility) /
                        4;
                      return sum + reviewAverage;
                    }, 0) / count;

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
                      Rating: {average ? average.toFixed(1) : "-"} / 5 ({count} reviews)
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
