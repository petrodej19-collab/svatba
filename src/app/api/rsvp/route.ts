import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { first_name, last_name, email, attending, meat_menu, vegetarian_menu, accommodation_needed, accommodation_guests, message } = body;

  if (!first_name?.trim() || !last_name?.trim()) {
    return NextResponse.json({ error: "Ime in priimek sta obvezna." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("rsvps").insert({
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    email: email?.trim() || null,
    attending: attending || "da",
    meat_menu: parseInt(meat_menu) || 0,
    vegetarian_menu: parseInt(vegetarian_menu) || 0,
    message: message?.trim() || null,
    accommodation_needed: !!accommodation_needed,
    accommodation_guests: accommodation_needed ? (parseInt(accommodation_guests) || 1) : 0,
  });

  if (error) {
    return NextResponse.json({ error: "Napaka pri shranjevanju." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
