"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { linktable } from "@/types/link";


type StatsPageProps = {
  params: { code?: string };
};

function formatDate(value: string | null) {
  if (!value) return "Never";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function StatsPage({ params }: StatsPageProps) {
  const pathname = usePathname();
  const codeFromPath = pathname?.split("/").filter(Boolean).pop() ?? "";
  const code = params?.code ?? codeFromPath;

  const [link, setLink] = useState<linktable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setLoading(false);
      setError("No code provided in the URL.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/links/${code}`, { cache: "no-store" });

        if (res.status === 404) {
          setLink(null);
          setError(`No link found for code "${code}".`);
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.error || "Failed to load stats.");
          return;
        }

        const data: linktable = await res.json();
        setLink(data);
      } catch {
        setError("Network error while loading stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  if (!code) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
        <div className="max-w-md w-full space-y-3 text-center">
          <h1 className="text-2xl font-semibold">Invalid code</h1>
          <p className="text-sm text-slate-300">
            No code was provided in the URL.
          </p>
          <a href="/" className="inline-block text-sm text-blue-400 hover:underline">
            Back to Dashboard
          </a>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
        <p className="text-sm text-slate-200">
          Loading stats for "<span className="font-mono">{code}</span>"…
        </p>
      </main>
    );
  }

  if (error || !link) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
        <div className="max-w-md w-full space-y-3 text-center">
          <h1 className="text-2xl font-semibold">Stats unavailable</h1>
          <p className="text-sm text-slate-300">
            {error || `No link found for code "${code}".`}
          </p>
          <a href="/" className="inline-block text-sm text-blue-400 hover:underline">
            Back to Dashboard
          </a>
        </div>
      </main>
    );
  }

  const shortUrl = `/${link.code}`;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Stats for <span className="font-mono">"{link.code}"</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Detailed stats for this short link.
          </p>
        </header>

        <section className="bg-white text-slate-900 rounded-lg shadow-md p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Short URL
            </h2>
            <p className="text-sm font-mono text-blue-600 break-all">
              {shortUrl}
            </p>
          </div>

          <div className="space-y-1">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Target URL
            </h2>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 break-words hover:underline"
            >
              {link.url}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total clicks
              </h3>
              <p className="text-base font-medium">{link.clicks}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Last clicked
              </h3>
              <p>{formatDate(link.last_clicked_at)}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created at
              </h3>
              <p>{formatDate(link.created_at)}</p>
            </div>
          </div>
        </section>

        <footer className="text-center">
          <a
            href="/"
            className="text-sm text-blue-400 hover:underline"
          >
            Back to Dashboard
          </a>
        </footer>
      </div>
    </main>
  );
}
