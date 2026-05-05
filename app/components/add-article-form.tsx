"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AddArticleForm() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:4000";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("authToken");
    const savedUserEmail = window.localStorage.getItem("authUserEmail");
    if (savedToken) {
      setToken(savedToken);
      setUserEmail(savedUserEmail);
    }
  }, []);

  const storeAuth = (value: { token: string; user: { email: string } }) => {
    window.localStorage.setItem("authToken", value.token);
    window.localStorage.setItem("authUserEmail", value.user.email);
    setToken(value.token);
    setUserEmail(value.user.email);
  };

  const onSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsAuthLoading(true);
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
      storeAuth({ token: payload.token, user: payload.user });
    } catch {
      setError("Network error while signing up");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const onLogin = async () => {
    setError(null);
    setIsAuthLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as {
        error?: string;
        token?: string;
        user?: { email: string };
      };
      if (!response.ok || !payload.token || !payload.user) {
        setError(payload.error ?? "Login failed");
        return;
      }
      storeAuth({ token: payload.token, user: payload.user });
    } catch {
      setError("Network error while logging in");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const onLogout = () => {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("authUserEmail");
    setToken(null);
    setUserEmail(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!token) {
        setError("Please login first to add an article");
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
      router.refresh();
    } catch {
      setError("Network error while creating article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onSignup} className="space-y-3 rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-medium">Authentication</p>
        {token ? <p className="text-sm text-green-700">Logged in as {userEmail}</p> : null}
        <input
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 shadow-[inset_2px_2px_6px_#d7d7d7,inset_-2px_-2px_6px_#ffffff] outline-none"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 shadow-[inset_2px_2px_6px_#d7d7d7,inset_-2px_-2px_6px_#ffffff] outline-none"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
        <input
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 shadow-[inset_2px_2px_6px_#d7d7d7,inset_-2px_-2px_6px_#ffffff] outline-none"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name (optional)"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isAuthLoading}
            className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 font-medium shadow-[4px_4px_8px_#d6d6d6,-4px_-4px_8px_#ffffff] transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {isAuthLoading ? "Please wait..." : "Sign up"}
          </button>
          <button
            type="button"
            disabled={isAuthLoading}
            onClick={onLogin}
            className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 font-medium shadow-[4px_4px_8px_#d6d6d6,-4px_-4px_8px_#ffffff] transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            Login
          </button>
          {token ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 font-medium shadow-[4px_4px_8px_#d6d6d6,-4px_-4px_8px_#ffffff] transition hover:-translate-y-0.5"
            >
              Logout
            </button>
          ) : null}
        </div>
      </form>

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
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
