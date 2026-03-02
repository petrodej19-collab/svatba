"use client";

import { useState, useCallback } from "react";
import { SongForm } from "@/components/SongForm";
import { SongList } from "@/components/SongList";
import { createClient } from "@/lib/supabase/client";
import { SongRequest } from "@/types";

export function SongsSection({
  initialSongs,
}: {
  initialSongs: SongRequest[];
}) {
  const [songs, setSongs] = useState(initialSongs);

  const refreshSongs = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("song_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setSongs(data as SongRequest[]);
  }, []);

  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-8">
      <div>
        <h3 className="font-serif text-xl text-sage-600 mb-4">
          Dodajte pesem
        </h3>
        <SongForm onSubmitted={refreshSongs} />
      </div>

      <div>
        <h3 className="font-serif text-xl text-sage-600 mb-4">
          Predlagane pesmi
          <span className="text-sm text-gray-400 font-sans ml-2">
            ({songs.length})
          </span>
        </h3>
        <SongList songs={songs} />
      </div>
    </div>
  );
}
