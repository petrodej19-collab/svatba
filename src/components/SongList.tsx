"use client";

import { SongRequest } from "@/types";

export function SongList({ songs }: { songs: SongRequest[] }) {
  if (songs.length === 0) {
    return (
      <p className="text-center text-warm-400 italic py-8">
        Še ni predlaganih pesmi. Bodite prvi!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {songs.map((song) => (
        <div
          key={song.id}
          className="flex items-start justify-between p-3.5 bg-white rounded-lg
                     border border-warm-200 hover:border-warm-300 transition-colors"
        >
          <div className="min-w-0 flex-1">
            <p className="font-medium text-warm-800 text-sm truncate">
              {song.song_title}
            </p>
            {song.artist && (
              <p className="text-xs text-warm-500 truncate">{song.artist}</p>
            )}
          </div>
          {song.requested_by && (
            <span className="text-xs text-warm-400 shrink-0 ml-4 mt-0.5">
              {song.requested_by}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
