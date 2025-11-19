"use client";

import React ,{ useState } from 'react'
import type { linktable } from "@/types/link";
type LinkFormProps = {
  onCreated: (link: linktable) => void;
};
const LinkForm = ({ onCreated }: LinkFormProps) => {
 const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const handleSubmit =async(e:React.FormEvent)=>{
    e.preventDefault();
    setError(null);
    setSuccess(null);
     if (!url.trim()) {
      setError("URL is required.");
      return;
    }
    try {
     new URL(url);
    } catch{
     setError("Please enter a valid URL starting with http or https.");
      return;
    }
    setLoading(true);
    try {
     const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), code: code.trim() || undefined }),
      });
       if (res.status === 409) {
        setError("That code already exists. Please choose another one.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Something went wrong.");
        return;
      }
     const data: linktable = await res.json();
      onCreated(data);
      setSuccess("Short link created!");
      setUrl("");
      setCode("");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    }finally{
       setLoading(false);
    }
  }

  return (
    <div>
      <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-md border border-gray-200 p-4 shadow-sm"
      >
      <h2 className="text-lg font-semibold">Create a new link</h2>
      <div className="space-y-1">
        <label className="block text-sm font-medium">Target URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very/long/url"
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">
          Custom code <span className="text-xs text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. docs123"
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500">
          6–8 characters, letters and numbers only. Example URL:{" "}
          <code className="rounded bg-gray-100 px-1">
            yourdomain.com/mycode
          </code>
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-600" role="status">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {loading ? "Creating..." : "Create link"}
      </button>
      </form>
    </div>
  )
}

export default LinkForm
