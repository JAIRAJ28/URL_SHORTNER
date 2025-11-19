"use client";
import React, { useMemo, useState } from "react";
import type { linktable } from "@/types/link";

type LinkTableProps = {
  links: linktable[];
  loading: boolean;
  error: string | null;
  onDeleted: (code: string) => void;
};

const LinkTable = ({ links, loading, error, onDeleted }: LinkTableProps) => {
  const [search, setSearch] = useState("");
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return links;
    return links.filter(
      (l) =>
        l.code.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q)
    );
  }, [links, search]);

  const handleDelete = async (code: string) => {
    if (!confirm(`Delete link "${code}"? This cannot be undone.`)) return;
    setDeletingCode(code);
    try {
      const res = await fetch(`/api/links/${code}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Failed to delete link.");
        return;
      }
      onDeleted(code);
    } catch (err) {
      console.error(err);
      alert("Network error while deleting.");
    } finally {
      setDeletingCode(null);
    }
  };

  const formatDate = (s: string | null) => {
    if (!s) return "—";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  };
  const baseUrl =  typeof window !== "undefined" ? window.location.origin : "";
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold">All links</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or URL"
          className="w-full max-w-xs rounded border px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && <p className="text-sm text-gray-600">Loading links…</p>}

      {error && !loading && (
        <p className="text-sm text-red-600">Error: {error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="rounded border border-dashed p-3 text-sm text-gray-600">
          No links found. Create your first short link using the form above.
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-x-auto rounded border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b px-3 py-2 text-left font-medium">
                  Code
                </th>
                <th className="border-b px-3 py-2 text-left font-medium">
                  Target URL
                </th>
                <th className="border-b px-3 py-2 text-left font-medium">
                  Clicks
                </th>
                <th className="border-b px-3 py-2 text-left font-medium">
                  Last clicked
                </th>
                <th className="border-b px-3 py-2 text-left font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((link) => {
                console.log(link,"linklink")
                const shortUrl = baseUrl ? `${baseUrl}/${link.code}` : `/${link.code}`;
                return (
                  <tr key={link.id} className="border-t">
                    <td className="px-3 py-2 align-top">
                      <a
                        href={`/code/${link?.code}`}
                        className="font-mono text-blue-600 hover:underline"
                      >
                        {link.code}
                      </a>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-blue-700 hover:underline"
                        title={link.url}
                      >
                        {link.url}
                      </a>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                        <span className="truncate" title={shortUrl}>
                          {shortUrl}
                        </span>
                        <button
                          type="button"
                          className="rounded border px-2 py-0.5 text-[11px] hover:bg-gray-100"
                          onClick={() => {
                            navigator.clipboard.writeText(shortUrl).catch(() => {});
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">{link.clicks}</td>
                    <td className="px-3 py-2 align-top">
                      {formatDate(link.last_clicked_at)}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <button
                        type="button"
                        onClick={() => handleDelete(link.code)}
                        disabled={deletingCode === link.code}
                        className="rounded border border-red-400 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingCode === link.code ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LinkTable;
