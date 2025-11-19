"use client";
import { linktable } from '@/types/link';
import React, { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [links,setLinks]=useState<linktable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchLinks = async ()=>{
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("api/links",{ cache: "no-store" })
       if (!res.ok) {
        const data = await res.json();
        console.log(data,"check the data")
        setError(data?.error || "Failed to fetch links.");
        return;
      }
      const data: linktable[] = await res.json();
      setLinks(data);
    } catch (err) {
      console.error(err);
      setError("Network error while fetching links.");
    }finally{
      setLoading(false);
    }
  }

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
   <main className="min-h-screen bg-black-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="text-[2rem] font-bold tracking-tight">TinyLink</h1>
          <p className="text-sm text-gray-600">
            Shorten URLs, track clicks, and manage your links.
          </p>
        </header>

        {/* <LinkForm onCreated={handleCreated} />

        <LinkTable
          links={links}
          loading={loading}
          error={error}
          onDeleted={handleDeleted}
        /> */}

        <footer className="mt-6 border-t pt-4 text-xs text-gray-400">
          <p>Assignment demo · Built with Next.js + Postgres</p>
        </footer>
      </div>
    </main>
  );
}