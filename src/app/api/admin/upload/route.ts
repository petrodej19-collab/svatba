import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  // Verify admin auth
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Use service role client for storage operations
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `hero.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to storage (overwrite existing)
  const { error: uploadError } = await adminClient.storage
    .from("hero")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = adminClient.storage
    .from("hero")
    .getPublicUrl(fileName);

  const publicUrl = urlData.publicUrl;

  // Save URL to site_content
  await adminClient
    .from("site_content")
    .upsert({ key: "hero_image_url", value: publicUrl, updated_at: new Date().toISOString() });

  return NextResponse.json({ url: publicUrl });
}
