import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@config/Supabase/server";

export async function GET() {
  const supabase = await getServerSupabase();

  const { data, error } = await supabase.rpc("posts_get_daily_popular", {
    p_date: "2025-03-22",
    p_limit: 10,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
