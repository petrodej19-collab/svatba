"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GuestPasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Napačno geslo. Poskusite znova.");
      }
    } catch {
      setError("Nekaj je šlo narobe. Poskusite znova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Vnesite geslo"
          required
          className="w-full px-4 py-3 text-center bg-white border border-warm-300 rounded-lg
                     text-warm-800 placeholder-warm-400 focus:outline-none focus:ring-2
                     focus:ring-sage-300/50 focus:border-sage-300 transition-all font-sans"
        />
      </div>
      {error && (
        <p className="text-sm text-rose-400 text-center animate-fade-in">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-warm-800 text-white rounded-lg font-sans text-sm
                   tracking-wide hover:bg-warm-900 transition-colors disabled:opacity-50
                   disabled:cursor-not-allowed"
      >
        {loading ? "Vstopam..." : "Vstopite"}
      </button>
    </form>
  );
}
