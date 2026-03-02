"use client";

import { useState } from "react";

export function RsvpSection() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    attending: "da",
    meat_menu: "0",
    vegetarian_menu: "0",
    accommodation_needed: false,
    accommodation_guests: "1",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Prišlo je do napake.");
      }
    } catch {
      setError("Prišlo je do napake.");
    }

    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl mb-4 block">&#127881;</span>
        <h3 className="font-serif text-2xl text-cream-100 mb-2">Hvala!</h3>
        <p className="text-cream-300">Vaša potrditev je bila uspešno oddana.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Ime"
          value={form.first_name}
          onChange={(e) => update("first_name", e.target.value)}
          required
          className="w-full px-4 py-3 bg-[#24231f] border border-[#33312b] rounded-lg text-cream-100
                     placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-sage-500/50"
        />
        <input
          type="text"
          placeholder="Priimek"
          value={form.last_name}
          onChange={(e) => update("last_name", e.target.value)}
          required
          className="w-full px-4 py-3 bg-[#24231f] border border-[#33312b] rounded-lg text-cream-100
                     placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-sage-500/50"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="email"
          placeholder="Email naslov"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full px-4 py-3 bg-[#24231f] border border-[#33312b] rounded-lg text-cream-100
                     placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-sage-500/50"
        />
        <select
          value={form.attending}
          onChange={(e) => update("attending", e.target.value)}
          className="w-full px-4 py-3 bg-[#24231f] border border-[#33312b] rounded-lg text-cream-100
                     focus:outline-none focus:ring-2 focus:ring-sage-500/50"
        >
          <option value="da">Pridem</option>
          <option value="ne">Ne morem priti</option>
          <option value="mogoce">Še ne vem</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <select
          value={form.meat_menu}
          onChange={(e) => update("meat_menu", e.target.value)}
          className="w-full px-4 py-3 bg-[#24231f] border border-[#33312b] rounded-lg text-cream-100
                     focus:outline-none focus:ring-2 focus:ring-sage-500/50"
        >
          <option value="0">Mesni meni — 0</option>
          <option value="1">Mesni meni — 1</option>
          <option value="2">Mesni meni — 2</option>
          <option value="3">Mesni meni — 3</option>
          <option value="4">Mesni meni — 4</option>
          <option value="5">Mesni meni — 5</option>
        </select>
        <select
          value={form.vegetarian_menu}
          onChange={(e) => update("vegetarian_menu", e.target.value)}
          className="w-full px-4 py-3 bg-[#24231f] border border-[#33312b] rounded-lg text-cream-100
                     focus:outline-none focus:ring-2 focus:ring-sage-500/50"
        >
          <option value="0">Vegetarijanski meni — 0</option>
          <option value="1">Vegetarijanski meni — 1</option>
          <option value="2">Vegetarijanski meni — 2</option>
          <option value="3">Vegetarijanski meni — 3</option>
          <option value="4">Vegetarijanski meni — 4</option>
          <option value="5">Vegetarijanski meni — 5</option>
        </select>
      </div>

      {/* Accommodation */}
      <div className="bg-[#24231f] border border-[#33312b] rounded-lg p-4 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.accommodation_needed}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, accommodation_needed: e.target.checked }))
            }
            className="w-5 h-5 rounded border-[#33312b] bg-[#1c1b18] text-sage-500
                       focus:ring-sage-500/50 focus:ring-2 accent-[#7A9F80]"
          />
          <span className="text-cream-200 text-sm">Želim prenočitev</span>
        </label>
        {form.accommodation_needed && (
          <div className="flex items-center gap-3 pl-8">
            <label className="text-cream-400 text-sm">Število oseb:</label>
            <select
              value={form.accommodation_guests}
              onChange={(e) => update("accommodation_guests", e.target.value)}
              className="px-3 py-2 bg-[#1c1b18] border border-[#33312b] rounded-lg text-cream-100
                         focus:outline-none focus:ring-2 focus:ring-sage-500/50 text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <textarea
        placeholder="Sporočilo"
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
        rows={4}
        className="w-full px-4 py-3 bg-[#24231f] border border-[#33312b] rounded-lg text-cream-100
                   placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-sage-500/50 resize-y"
      />

      {error && <p className="text-rose-400 text-sm">{error}</p>}

      <div className="text-center pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-sage-500 text-white rounded-lg font-medium
                     hover:bg-sage-600 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Pošiljam..." : "Potrdi udeležbo"}
        </button>
      </div>
    </form>
  );
}
