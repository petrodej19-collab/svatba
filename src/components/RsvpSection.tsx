"use client";

import { useState } from "react";

const inputClass =
  "w-full px-4 py-3 bg-white border border-warm-300 rounded-lg text-warm-800 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-300/50 focus:border-sage-300 transition-all text-sm";

const selectClass =
  "w-full px-4 py-3 bg-white border border-warm-300 rounded-lg text-warm-800 focus:outline-none focus:ring-2 focus:ring-sage-300/50 focus:border-sage-300 transition-all text-sm";

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
      <div className="text-center py-16">
        <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-warm-800 mb-2">Hvala!</h3>
        <p className="text-warm-500">Vaša potrditev je bila uspešno oddana.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Ime"
          value={form.first_name}
          onChange={(e) => update("first_name", e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="text"
          placeholder="Priimek"
          value={form.last_name}
          onChange={(e) => update("last_name", e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="email"
          placeholder="Email naslov"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={inputClass}
        />
        <select
          value={form.attending}
          onChange={(e) => update("attending", e.target.value)}
          className={selectClass}
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
          className={selectClass}
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
          className={selectClass}
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
      <div className="bg-white border border-warm-300 rounded-lg p-4 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.accommodation_needed}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, accommodation_needed: e.target.checked }))
            }
            className="w-4 h-4 rounded border-warm-300 text-sage-500
                       focus:ring-sage-300/50 focus:ring-2 accent-sage-500"
          />
          <span className="text-warm-700 text-sm">Želim prenočitev</span>
        </label>
        {form.accommodation_needed && (
          <div className="flex items-center gap-3 pl-7">
            <label className="text-warm-500 text-sm">Število oseb:</label>
            <select
              value={form.accommodation_guests}
              onChange={(e) => update("accommodation_guests", e.target.value)}
              className="px-3 py-2 bg-white border border-warm-300 rounded-lg text-warm-800
                         focus:outline-none focus:ring-2 focus:ring-sage-300/50 text-sm"
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
        placeholder="Sporočilo (neobvezno)"
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
        rows={3}
        className={`${inputClass} resize-y`}
      />

      {error && <p className="text-rose-400 text-sm">{error}</p>}

      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="px-10 py-3 bg-warm-800 text-white rounded-lg text-sm tracking-wide
                     hover:bg-warm-900 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Pošiljam..." : "Potrdi udeležbo"}
        </button>
      </div>
    </form>
  );
}
