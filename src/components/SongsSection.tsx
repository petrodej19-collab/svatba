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
    <div className="grid gap-12 md:grid-cols-2 md:gap-10">
      <div>
        <h3 className="text-xs text-warm-500 uppercase tracking-widest mb-5">
          Dodaj pesem
        </h3>
        <SongForm onSubmitted={refreshSongs} />
      </div>

      <div>
        <h3 className="text-xs text-warm-500 uppercase tracking-widest mb-5">
          Seznam pesmi
          <span className="text-warm-400 ml-2">
            ({songs.length})
          </span>
        </h3>
        <SongList songs={songs} />
      </div>
    </div>
  );
}
