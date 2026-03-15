"use client";

import { useRef, useState, useCallback } from "react";
import { WeddingTableWithGuests } from "@/types";
import { TableCard } from "./TableCard";

interface FloorPlanProps {
  tables: WeddingTableWithGuests[];
  mode: "view" | "edit";
  selectedTableId?: string | null;
  onSelectTable?: (tableId: string) => void;
  onMoveTable?: (tableId: string, x: number, y: number) => void;
}

export function FloorPlan({
  tables,
  mode,
  selectedTableId,
  onSelectTable,
  onMoveTable,
}: FloorPlanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const handleMouseDown = useCallback(
    (tableId: string) => {
      if (mode !== "edit") return;
      setDragId(tableId);
    },
    [mode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragId || mode !== "edit" || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(5, Math.min(95, x));
      const clampedY = Math.max(5, Math.min(95, y));

      onMoveTable?.(dragId, clampedX, clampedY);
    },
    [dragId, mode, onMoveTable]
  );

  const handleMouseUp = useCallback(() => {
    setDragId(null);
  }, []);

  if (tables.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-warm-300 rounded-xl">
        <p className="text-warm-400 italic">
          {mode === "edit"
            ? 'Kliknite "Dodaj mizo" za začetek'
            : "Sedežni red bo kmalu na voljo!"}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-warm-100 rounded-xl border border-warm-300 overflow-hidden select-none"
      style={{ paddingBottom: "66%" }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {tables.map((table) => (
        <div
          key={table.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-shadow ${
            dragId === table.id ? "z-10" : ""
          }`}
          style={{
            left: `${table.position_x}%`,
            top: `${table.position_y}%`,
            transition: dragId === table.id ? "none" : undefined,
          }}
          onMouseDown={() => handleMouseDown(table.id)}
        >
          <TableCard
            table={table}
            mode={mode}
            isSelected={selectedTableId === table.id}
            onClick={() => onSelectTable?.(table.id)}
          />
        </div>
      ))}
    </div>
  );
}
