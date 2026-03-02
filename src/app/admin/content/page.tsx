"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { SiteContent, Rsvp, WeddingTableWithGuests, Guest } from "@/types";
import { FloorPlan } from "@/components/FloorPlan";

interface ContentField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

const FIELDS: ContentField[] = [
  { key: "date_time", label: "Datum in ura", placeholder: "npr. 5. junij 2026 ob 15:00" },
  { key: "venue_name", label: "Ime lokacije", placeholder: "npr. Grad Otočec" },
  { key: "venue_address", label: "Naslov lokacije", placeholder: "npr. Grajska cesta 2, 8222 Otočec" },
  { key: "directions", label: "Navodila za pot", placeholder: "Kako pridete do lokacije...", multiline: true },
  { key: "schedule_ceremony", label: "Ura — Obred", placeholder: "npr. 15:00" },
  { key: "schedule_aperitif", label: "Ura — Aperitiv", placeholder: "npr. 16:00" },
  { key: "schedule_dinner", label: "Ura — Večerja", placeholder: "npr. 18:00" },
  { key: "schedule_party", label: "Ura — Zabava in ples", placeholder: "npr. 20:00" },
  { key: "dress_code", label: "Oblačilni kod", placeholder: "npr. Elegantno", multiline: true },
  { key: "accommodation", label: "Namestitev", placeholder: "Predlogi za prenočišče...", multiline: true },
];

interface SectionConfig {
  id: string;
  defaultLabel: string;
  nameKey: string;
  enabledKey: string;
}

const SECTIONS: SectionConfig[] = [
  { id: "informacije", defaultLabel: "Podrobnosti", nameKey: "section_name_info", enabledKey: "section_enabled_info" },
  { id: "glasba", defaultLabel: "Glasba", nameKey: "section_name_songs", enabledKey: "section_enabled_songs" },
  { id: "sedezni-red", defaultLabel: "Sedežni red", nameKey: "section_name_seating", enabledKey: "section_enabled_seating" },
  { id: "potrditev", defaultLabel: "Potrditev", nameKey: "section_name_rsvp", enabledKey: "section_enabled_rsvp" },
];

interface InfoBlockConfig {
  enabledKey: string;
  titleKey: string;
  defaultTitle: string;
}

const INFO_BLOCKS: InfoBlockConfig[] = [
  { enabledKey: "section_enabled_block_when", titleKey: "block_when_title", defaultTitle: "Kdaj" },
  { enabledKey: "section_enabled_block_where", titleKey: "block_where_title", defaultTitle: "Kje" },
  { enabledKey: "section_enabled_block_directions", titleKey: "block_directions_title", defaultTitle: "Kako do tja" },
  { enabledKey: "section_enabled_block_schedule", titleKey: "block_schedule_title", defaultTitle: "Program" },
  { enabledKey: "section_enabled_block_dresscode", titleKey: "block_dresscode_title", defaultTitle: "Oblačilni kod" },
  { enabledKey: "section_enabled_block_accommodation", titleKey: "block_accommodation_title", defaultTitle: "Namestitev" },
];

type Tab = "vsebina" | "rsvp" | "seating";

export default function AdminContentPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("vsebina");
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [tables, setTables] = useState<WeddingTableWithGuests[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [newGuestName, setNewGuestName] = useState("");
  const [seatingLoading, setSeatingLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase.from("site_content").select("*");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row: SiteContent) => {
          map[row.key] = row.value;
        });
        setValues(map);
        if (map.hero_image_url) {
          setHeroPreview(map.hero_image_url);
        }
      }
      setLoading(false);
    }
    fetchContent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRsvps = useCallback(async () => {
    setRsvpLoading(true);
    const { data } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });
    setRsvps((data as Rsvp[]) || []);
    setRsvpLoading(false);
  }, [supabase]);

  const fetchSeating = useCallback(async () => {
    setSeatingLoading(true);
    const { data: tablesData } = await supabase
      .from("wedding_tables")
      .select("*")
      .order("sort_order", { ascending: true });
    const { data: guestsData } = await supabase.from("guests").select("*");
    const withGuests: WeddingTableWithGuests[] = (tablesData || []).map(
      (table) => ({
        ...table,
        guests: (guestsData || []).filter((g: Guest) => g.table_id === table.id),
      })
    );
    setTables(withGuests);
    setSeatingLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (tab === "rsvp") fetchRsvps();
    if (tab === "seating") fetchSeating();
  }, [tab, fetchRsvps, fetchSeating]);

  const selectedTable = tables.find((t) => t.id === selectedTableId);

  async function addTable() {
    const name = `Miza ${tables.length + 1}`;
    const { data } = await supabase
      .from("wedding_tables")
      .insert({
        name,
        seat_count: 8,
        position_x: 30 + Math.random() * 40,
        position_y: 30 + Math.random() * 40,
        sort_order: tables.length,
      })
      .select()
      .single();
    if (data) {
      setTables([...tables, { ...data, guests: [] }]);
      setSelectedTableId(data.id);
    }
  }

  async function updateTable(field: string, value: string | number) {
    if (!selectedTableId) return;
    await supabase
      .from("wedding_tables")
      .update({ [field]: value })
      .eq("id", selectedTableId);
    setTables(
      tables.map((t) =>
        t.id === selectedTableId ? { ...t, [field]: value } : t
      )
    );
  }

  async function deleteTable() {
    if (!selectedTableId || !confirm("Ali želite izbrisati to mizo in vse njene goste?"))
      return;
    await supabase.from("wedding_tables").delete().eq("id", selectedTableId);
    setTables(tables.filter((t) => t.id !== selectedTableId));
    setSelectedTableId(null);
  }

  async function moveTable(tableId: string, x: number, y: number) {
    setTables(
      tables.map((t) =>
        t.id === tableId ? { ...t, position_x: x, position_y: y } : t
      )
    );
    await supabase
      .from("wedding_tables")
      .update({ position_x: x, position_y: y })
      .eq("id", tableId);
  }

  async function addGuest() {
    if (!selectedTableId || !newGuestName.trim()) return;
    const { data } = await supabase
      .from("guests")
      .insert({ table_id: selectedTableId, name: newGuestName.trim() })
      .select()
      .single();
    if (data) {
      setTables(
        tables.map((t) =>
          t.id === selectedTableId
            ? { ...t, guests: [...t.guests, data as Guest] }
            : t
        )
      );
      setNewGuestName("");
    }
  }

  async function removeGuest(guestId: string) {
    await supabase.from("guests").delete().eq("id", guestId);
    setTables(
      tables.map((t) => ({
        ...t,
        guests: t.guests.filter((g) => g.id !== guestId),
      }))
    );
  }

  function updateField(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSection(enabledKey: string) {
    setValues((prev) => ({
      ...prev,
      [enabledKey]: prev[enabledKey] === "false" ? "true" : prev[enabledKey] === "true" ? "false" : "false",
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const allKeys = [
      ...FIELDS.map((f) => f.key),
      ...SECTIONS.flatMap((s) => [s.nameKey, s.enabledKey]),
      ...INFO_BLOCKS.flatMap((b) => [b.enabledKey, b.titleKey]),
    ];

    const updates = allKeys.map((key) => ({
      key,
      value: values[key] || "",
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("site_content").upsert(updates);

    if (error) {
      setMessage("Napaka pri shranjevanju.");
    } else {
      setMessage("Shranjeno!");
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setHeroPreview(url);
        setValues((prev) => ({ ...prev, hero_image_url: url }));
        setMessage("Slika naložena!");
      } else {
        const { error } = await res.json();
        setMessage(`Napaka: ${error}`);
      }
    } catch {
      setMessage("Napaka pri nalaganju slike.");
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(() => setMessage(null), 3000);
  }

  async function deleteRsvp(id: string) {
    if (!confirm("Ali želite izbrisati to potrditev?")) return;
    await supabase.from("rsvps").delete().eq("id", id);
    setRsvps(rsvps.filter((r) => r.id !== id));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push(ROUTES.HOME);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Nalagam...</p>
      </div>
    );
  }

  return (
    <div className={`${tab === "seating" ? "max-w-7xl" : "max-w-3xl"} mx-auto px-4 py-8`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-sage-700">Urejanje vsebine</h1>
        <div className="flex gap-3">
          {tab === "seating" && (
            <button
              onClick={addTable}
              className="px-4 py-2 bg-sage-500 text-white rounded-lg text-sm hover:bg-sage-600 transition-colors"
            >
              + Dodaj mizo
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 text-gray-500 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Odjava
          </button>
        </div>
      </div>

      {/* Admin nav */}
      <div className="flex gap-2 mb-8 border-b border-cream-200 pb-3">
        <button
          onClick={() => setTab("vsebina")}
          className={`px-4 py-2 text-sm transition-colors ${
            tab === "vsebina"
              ? "font-medium text-sage-700 border-b-2 border-sage-500"
              : "text-gray-400 hover:text-sage-600"
          }`}
        >
          Vsebina
        </button>
        <button
          onClick={() => setTab("rsvp")}
          className={`px-4 py-2 text-sm transition-colors ${
            tab === "rsvp"
              ? "font-medium text-sage-700 border-b-2 border-sage-500"
              : "text-gray-400 hover:text-sage-600"
          }`}
        >
          Potrditve ({rsvps.length > 0 ? rsvps.length : "..."})
        </button>
        <button
          onClick={() => setTab("seating")}
          className={`px-4 py-2 text-sm transition-colors ${
            tab === "seating"
              ? "font-medium text-sage-700 border-b-2 border-sage-500"
              : "text-gray-400 hover:text-sage-600"
          }`}
        >
          Sedežni red
        </button>
      </div>

      {tab === "vsebina" && (
        <>
          {/* Section toggles */}
          <div className="bg-white rounded-xl border border-cream-200 p-6 mb-8">
            <h2 className="font-serif text-xl text-sage-700 mb-4">Razdelki</h2>
            <p className="text-sm text-gray-500 mb-4">Vklopite ali izklopite posamezne razdelke in jih preimenujte.</p>
            <div className="space-y-3">
              {SECTIONS.map((section) => {
                const enabled = values[section.enabledKey] !== "false";
                return (
                  <div key={section.id} className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSection(section.enabledKey)}
                      className={`w-10 h-6 rounded-full relative transition-colors flex-shrink-0 ${
                        enabled ? "bg-sage-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          enabled ? "left-[18px]" : "left-0.5"
                        }`}
                      />
                    </button>
                    <input
                      type="text"
                      value={values[section.nameKey] || ""}
                      onChange={(e) => updateField(section.nameKey, e.target.value)}
                      placeholder={section.defaultLabel}
                      className="flex-1 px-3 py-1.5 border border-cream-300 rounded-lg text-sm
                                 focus:outline-none focus:ring-2 focus:ring-sage-300"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hero image upload */}
          <div className="bg-white rounded-xl border border-cream-200 p-6 mb-8">
            <h2 className="font-serif text-xl text-sage-700 mb-4">Naslovna fotografija</h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-48 h-36 rounded-lg overflow-hidden bg-cream-100 border border-cream-200 flex-shrink-0">
                {heroPreview ? (
                  <img src={heroPreview} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic">
                    Ni slike
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Naložite fotografijo, ki bo prikazana na vrhu strani.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm text-gray-500 file:mr-3 file:px-4 file:py-2 file:rounded-lg
                             file:border-0 file:text-sm file:bg-sage-500 file:text-white
                             file:cursor-pointer hover:file:bg-sage-600"
                />
                {uploading && <p className="text-sm text-sage-500">Nalagam...</p>}
              </div>
            </div>
          </div>

          {/* Info block toggles */}
          <div className="bg-white rounded-xl border border-cream-200 p-6 mb-8">
            <h2 className="font-serif text-xl text-sage-700 mb-4">Podrobnosti — prikaz in imena</h2>
            <p className="text-sm text-gray-500 mb-4">Vklopite ali izklopite posamezne bloke v razdelku Podrobnosti in jih preimenujte.</p>
            <div className="space-y-3">
              {INFO_BLOCKS.map((block) => {
                const enabled = values[block.enabledKey] !== "false";
                return (
                  <div key={block.enabledKey} className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSection(block.enabledKey)}
                      className={`w-10 h-6 rounded-full relative transition-colors flex-shrink-0 ${
                        enabled ? "bg-sage-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          enabled ? "left-[18px]" : "left-0.5"
                        }`}
                      />
                    </button>
                    <input
                      type="text"
                      value={values[block.titleKey] || ""}
                      onChange={(e) => updateField(block.titleKey, e.target.value)}
                      placeholder={block.defaultTitle}
                      className="flex-1 px-3 py-1.5 border border-cream-300 rounded-lg text-sm
                                 focus:outline-none focus:ring-2 focus:ring-sage-300"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content fields */}
          <div className="bg-white rounded-xl border border-cream-200 p-6 space-y-6">
            <h2 className="font-serif text-xl text-sage-700 mb-2">Podrobnosti — vsebina</h2>

            {FIELDS.map((field) => (
              <div key={field.key}>
                <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                {field.multiline ? (
                  <textarea
                    value={values[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-sage-300 resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={values[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-sage-300"
                  />
                )}
              </div>
            ))}

            <div className="flex items-center gap-4 pt-4 border-t border-cream-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-sage-500 text-white rounded-lg text-sm
                           hover:bg-sage-600 disabled:opacity-50 transition-colors"
              >
                {saving ? "Shranjujem..." : "Shrani"}
              </button>
              {message && (
                <p className={`text-sm ${message.includes("Napaka") ? "text-rose-500" : "text-sage-600"}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "seating" && (
        seatingLoading ? (
          <p className="text-gray-400 text-sm py-8 text-center">Nalagam...</p>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <FloorPlan
              tables={tables}
              mode="edit"
              selectedTableId={selectedTableId}
              onSelectTable={setSelectedTableId}
              onMoveTable={moveTable}
            />

            <div className="bg-white rounded-xl border border-cream-200 p-6">
              {selectedTable ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Ime mize</label>
                    <input
                      type="text"
                      value={selectedTable.name}
                      onChange={(e) => updateTable("name", e.target.value)}
                      className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm
                                 focus:outline-none focus:ring-2 focus:ring-sage-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Število sedežev</label>
                    <input
                      type="number"
                      value={selectedTable.seat_count}
                      onChange={(e) => updateTable("seat_count", parseInt(e.target.value) || 1)}
                      min={1}
                      max={20}
                      className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm
                                 focus:outline-none focus:ring-2 focus:ring-sage-300"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-600">
                        Gostje ({selectedTable.guests.length}/{selectedTable.seat_count})
                      </label>
                      <span className="text-xs text-gray-400">
                        še {selectedTable.seat_count - selectedTable.guests.length} mest
                      </span>
                    </div>

                    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                      {selectedTable.guests.map((guest) => (
                        <div
                          key={guest.id}
                          className="flex items-center justify-between px-3 py-1.5 bg-cream-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">{guest.name}</span>
                          <button
                            onClick={() => removeGuest(guest.id)}
                            className="text-gray-400 hover:text-rose-400 transition-colors text-lg leading-none"
                            title="Odstrani gosta"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>

                    {selectedTable.guests.length < selectedTable.seat_count && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newGuestName}
                          onChange={(e) => setNewGuestName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addGuest()}
                          placeholder="Ime gosta"
                          className="flex-1 px-3 py-2 border border-cream-300 rounded-lg text-sm
                                     focus:outline-none focus:ring-2 focus:ring-sage-300"
                        />
                        <button
                          onClick={addGuest}
                          disabled={!newGuestName.trim()}
                          className="px-3 py-2 bg-sage-500 text-white rounded-lg text-sm
                                     hover:bg-sage-600 disabled:opacity-50 transition-colors"
                        >
                          Dodaj
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={deleteTable}
                    className="w-full py-2 border border-rose-300 text-rose-400 rounded-lg text-sm
                               hover:bg-rose-50 transition-colors"
                  >
                    Izbriši mizo
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">
                    Izberite mizo za urejanje ali dodajte novo.
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {tab === "rsvp" && (
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-sage-700">Potrditve udeležbe</h2>
            <button
              onClick={fetchRsvps}
              className="text-sm text-sage-500 hover:text-sage-600"
            >
              Osveži
            </button>
          </div>

          {rsvpLoading ? (
            <p className="text-gray-400 text-sm py-8 text-center">Nalagam...</p>
          ) : rsvps.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">Ni še nobene potrditve.</p>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-sage-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-serif text-sage-700">
                    {rsvps.filter((r) => r.attending === "da").length}
                  </p>
                  <p className="text-xs text-sage-500">Pridejo</p>
                </div>
                <div className="bg-cream-100 rounded-lg p-3 text-center">
                  <p className="text-2xl font-serif text-gray-600">
                    {rsvps.filter((r) => r.attending === "mogoce").length}
                  </p>
                  <p className="text-xs text-gray-500">Morda</p>
                </div>
                <div className="bg-rose-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-serif text-rose-500">
                    {rsvps.filter((r) => r.attending === "ne").length}
                  </p>
                  <p className="text-xs text-rose-400">Ne pridejo</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-cream-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-serif text-sage-700">
                    {rsvps.reduce((sum, r) => sum + r.meat_menu, 0)}
                  </p>
                  <p className="text-xs text-gray-500">Mesni meni</p>
                </div>
                <div className="bg-cream-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-serif text-sage-700">
                    {rsvps.reduce((sum, r) => sum + r.vegetarian_menu, 0)}
                  </p>
                  <p className="text-xs text-gray-500">Vegetarijanski</p>
                </div>
                <div className="bg-cream-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-serif text-sage-700">
                    {rsvps.filter((r) => r.accommodation_needed).reduce((sum, r) => sum + r.accommodation_guests, 0)}
                  </p>
                  <p className="text-xs text-gray-500">Prenočitev (oseb)</p>
                </div>
              </div>

              {/* List */}
              <div className="space-y-3">
                {rsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="p-4 bg-cream-50 rounded-lg border border-cream-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sage-700">
                          {rsvp.first_name} {rsvp.last_name}
                        </p>
                        {rsvp.email && (
                          <p className="text-xs text-gray-400">{rsvp.email}</p>
                        )}
                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              rsvp.attending === "da"
                                ? "bg-sage-100 text-sage-600"
                                : rsvp.attending === "ne"
                                ? "bg-rose-100 text-rose-500"
                                : "bg-cream-200 text-gray-600"
                            }`}
                          >
                            {rsvp.attending === "da"
                              ? "Pridem"
                              : rsvp.attending === "ne"
                              ? "Ne pridem"
                              : "Mogoče"}
                          </span>
                          {rsvp.meat_menu > 0 && (
                            <span>Mesni: {rsvp.meat_menu}</span>
                          )}
                          {rsvp.vegetarian_menu > 0 && (
                            <span>Veg: {rsvp.vegetarian_menu}</span>
                          )}
                          {rsvp.accommodation_needed && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                              Prenočitev: {rsvp.accommodation_guests}
                            </span>
                          )}
                        </div>
                        {rsvp.message && (
                          <p className="text-sm text-gray-500 mt-2 italic">
                            &ldquo;{rsvp.message}&rdquo;
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteRsvp(rsvp.id)}
                        className="text-gray-400 hover:text-rose-400 transition-colors text-lg leading-none"
                        title="Izbriši"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
