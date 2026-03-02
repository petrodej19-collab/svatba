"use client";

import { SongRequest } from "@/types";

export function SongList({ songs }: { songs: SongRequest[] }) {
  if (songs.length === 0) {
    return (
      <p className="text-center text-gray-400 italic py-8">
        Še ni predlaganih pesmi. Bodite prvi!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {songs.map((song) => (
        <div
          key={song.id}
          className="flex items-start justify-between p-4 bg-white rounded-lg
                     border border-cream-200 hover:border-cream-300 transition-colors"
        >
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-700 truncate">
              {song.song_title}
            </p>
            {song.artist && (
              <p className="text-sm text-gray-500 truncate">{song.artist}</p>
            )}
          </div>
          {song.requested_by && (
            <span className="text-xs text-sage-400 shrink-0 ml-4 mt-0.5">
              &mdash; {song.requested_by}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
