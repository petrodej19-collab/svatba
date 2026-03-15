"use client";

import { WeddingTableWithGuests } from "@/types";

interface TableCardProps {
  table: WeddingTableWithGuests;
  isSelected?: boolean;
  onClick?: () => void;
  mode: "view" | "edit";
}

export function TableCard({ table, isSelected, onClick, mode }: TableCardProps) {
  const emptySeats = table.seat_count - table.guests.length;

  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center
        w-32 h-32 sm:w-36 sm:h-36 rounded-full
        border-2 transition-all cursor-default
        ${mode === "edit" ? "cursor-pointer" : ""}
        ${
          isSelected
            ? "border-sage-500 bg-sage-50 shadow-lg scale-105"
            : "border-warm-300 bg-white hover:border-warm-400"
        }
      `}
    >
      <p className="font-serif text-sm text-warm-800 font-medium mb-1">
        {table.name}
      </p>

      <div className="text-center max-h-14 overflow-hidden">
        {table.guests.slice(0, 4).map((guest) => (
          <p key={guest.id} className="text-xs text-warm-600 leading-tight truncate max-w-24">
            {guest.name}
          </p>
        ))}
        {table.guests.length > 4 && (
          <p className="text-xs text-warm-400">+{table.guests.length - 4} še</p>
        )}
      </div>

      {emptySeats > 0 && (
        <p className="absolute -bottom-5 text-xs text-warm-400">
          še {emptySeats} {emptySeats === 1 ? "mesto" : emptySeats === 2 ? "mesti" : emptySeats <= 4 ? "mesta" : "mest"}
        </p>
      )}
    </div>
  );
}
