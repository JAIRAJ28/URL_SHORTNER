"use client";

import React, { useEffect, useState } from "react";
import LinkForm from "@/components/LinkForm";
import LinkTable from "@/components/LinkTable";
import type { linktable } from "@/types/link";

export default function DashboardPage() {
  const [links, setLinks] = useState<linktable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/links", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Failed to fetch links.");
        return;
      }
      const data: linktable[] = await res.json();
      setLinks(data);
    } catch (err) {
      console.error(err,"Error while fetching links");
      setError("Network error while fetching links.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreated = (link: linktable) => {
    setLinks((prev) => [link, ...prev]);
  };

  const handleDeleted = (code: string) => {
    setLinks((prev) => prev.filter((l) => l.code !== code));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <header className="rounded-2xl bg-white/80 px-4 py-4 shadow-sm ring-1 ring-slate-200 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                TinyLink
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Create short links on your domain, track clicks, and manage them in one place.
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 sm:mt-0">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700 ring-1 ring-emerald-100">
                Live dashboard
              </span>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
            <LinkForm onCreated={handleCreated} />
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
            <LinkTable
              links={links}
              loading={loading}
              error={error}
              onDeleted={handleDeleted}
            />
          </div>
        </section>

        <footer className="mt-4 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:flex-row">
          <p>Assignment demo · Built with Next.js and Postgres</p>
          <p className="text-[11px] text-slate-400">
            Short links: visit <span className="font-mono">/:code</span> to be redirected.
          </p>
        </footer>
      </div>
    </main>
  );
}
