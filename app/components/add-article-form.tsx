"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AddArticleForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      router.refresh();
    } catch {
      setError("Network error while creating article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 shadow-[inset_2px_2px_6px_#d7d7d7,inset_-2px_-2px_6px_#ffffff] outline-none"
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://example.com/article"
        required
      />
      <input
        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 shadow-[inset_2px_2px_6px_#d7d7d7,inset_-2px_-2px_6px_#ffffff] outline-none"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Manual title (optional fallback)"
      />
      <textarea
        className="min-h-24 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 shadow-[inset_2px_2px_6px_#d7d7d7,inset_-2px_-2px_6px_#ffffff] outline-none"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Manual description (optional fallback)"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 font-medium shadow-[4px_4px_8px_#d6d6d6,-4px_-4px_8px_#ffffff] transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {isSubmitting ? "Adding..." : "Add article"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
