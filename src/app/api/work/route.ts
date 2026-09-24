import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Use the Vercel integration variables (or manually added ones)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("work_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const items = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      thumbnailUrl: item.thumbnail_url || "",
      date: new Date(item.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("GET work error:", error);
    return NextResponse.json({ error: "Failed to read work items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== "1996" && password !== (process.env.ADMIN_PASSWORD || "1996")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const title = body.title || "Untitled Video";
    const url = body.url || "";
    const thumbnailUrl = body.thumbnailUrl || body.thumbnail || "";

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("work_items")
      .insert([{ title, url, thumbnail_url: thumbnailUrl }])
      .select()
      .single();

    if (error) throw error;

    const newItem = {
      id: data.id,
      title: data.title,
      url: data.url,
      thumbnailUrl: data.thumbnail_url || "",
      date: new Date(data.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error("POST upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== "1996" && password !== (process.env.ADMIN_PASSWORD || "1996")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const id = body.id;
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const { error } = await supabase
      .from("work_items")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE work error:", error);
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
