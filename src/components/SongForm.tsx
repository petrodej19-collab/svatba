"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SongForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("song_requests")
      .insert({
        song_title: songTitle.trim(),
        artist: artist.trim() || null,
        requested_by: requestedBy.trim() || null,
      });

    if (insertError) {
      setError("Prišlo je do napake. Poskusite znova.");
      setLoading(false);
      return;
    }

    setSongTitle("");
    setArtist("");
    setRequestedBy("");
    setSuccess(true);
    setLoading(false);
    onSubmitted?.();

    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Naslov pesmi <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          required
          placeholder="Katero pesem naj zavrtimo?"
          className="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg
                     text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2
                     focus:ring-sage-300 focus:border-sage-300 transition-all text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Izvajalec</label>
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Kdo jo poje?"
          className="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg
                     text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2
                     focus:ring-sage-300 focus:border-sage-300 transition-all text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Vaše ime</label>
        <input
          type="text"
          value={requestedBy}
          onChange={(e) => setRequestedBy(e.target.value)}
          placeholder="Neobvezno"
          className="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg
                     text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2
                     focus:ring-sage-300 focus:border-sage-300 transition-all text-sm"
        />
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      {success && (
        <p className="text-sm text-sage-500 animate-fade-in">
          Pesem je dodana! Hvala za predlog!
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !songTitle.trim()}
        className="w-full py-2.5 bg-sage-500 text-white rounded-lg text-sm tracking-wide
                   hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Pošiljam..." : "Predlagajte pesem"}
      </button>
    </form>
  );
}
