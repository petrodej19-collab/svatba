"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ROUTES } from "@/lib/constants";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Napačen e-naslov ali geslo.");
      setLoading(false);
      return;
    }

    router.push(ROUTES.ADMIN_SEATING);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">E-naslov</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg
                     text-gray-700 focus:outline-none focus:ring-2 focus:ring-sage-300
                     focus:border-sage-300 transition-all text-sm"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Geslo</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg
                     text-gray-700 focus:outline-none focus:ring-2 focus:ring-sage-300
                     focus:border-sage-300 transition-all text-sm"
        />
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-sage-500 text-white rounded-lg text-sm tracking-wide
                   hover:bg-sage-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Prijavljam..." : "Prijava"}
      </button>
    </form>
  );
}
