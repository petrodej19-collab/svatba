"use client";

import { useState, useEffect } from "react";
import { WEDDING_DATE } from "@/lib/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = Math.max(0, WEDDING_DATE.getTime() - now.getTime());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return <div className="flex justify-center gap-8">&nbsp;</div>;
  }

  const blocks = [
    { value: timeLeft.days, label: "dni" },
    { value: timeLeft.hours, label: "ur" },
    { value: timeLeft.minutes, label: "min" },
    { value: timeLeft.seconds, label: "sek" },
  ];

  return (
    <div className="flex justify-center items-center gap-3 sm:gap-5">
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-3 sm:gap-5">
          <div className="text-center min-w-[3rem]">
            <span className="block font-serif text-3xl sm:text-4xl text-warm-700 tabular-nums">
              {String(block.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-warm-400 uppercase tracking-[0.25em]">
              {block.label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className="text-warm-300 text-lg font-light select-none">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
