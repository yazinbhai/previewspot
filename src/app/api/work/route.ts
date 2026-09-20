import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import os from "os";

const DEFAULT_ITEMS: any[] = [];

// Helper paths
const getPublicJsonPath = () => path.join(process.cwd(), "public", "uploads", "work.json");
const getTmpJsonPath = () => path.join(os.tmpdir(), "previewspot_work.json");

async function getWorkItems(): Promise<any[]> {
  const tmpPath = getTmpJsonPath();
  const publicPath = getPublicJsonPath();

  if (existsSync(tmpPath)) {
    try {
      const content = await readFile(tmpPath, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      console.error("Error reading tmp work.json:", e);
    }
  }

  if (existsSync(publicPath)) {
    try {
      const content = await readFile(publicPath, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      console.error("Error reading public work.json:", e);
    }
  }

  return DEFAULT_ITEMS;
}

async function saveWorkItems(items: any[]) {
  const jsonString = JSON.stringify(items, null, 2);

  // 1. Write to /tmp (always writable in Vercel & local environments)
  const tmpPath = getTmpJsonPath();
  await writeFile(tmpPath, jsonString, "utf-8");

  // 2. Try writing to public/uploads/work.json (local dev environment)
  try {
    const publicPath = getPublicJsonPath();
    const publicDir = path.dirname(publicPath);
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }
    await writeFile(publicPath, jsonString, "utf-8");
  } catch (err: any) {
    // Ignore EROFS error in serverless environment
    if (err.code !== "EROFS") {
      console.warn("Could not write to public/uploads:", err);
    }
  }
}

export async function GET() {
  try {
    const items = await getWorkItems();
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

    const contentType = req.headers.get("content-type") || "";
    let title = "";
    let url = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      title = body.title || "Untitled Video";
      url = body.url || "";
    } else {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const youtubeUrl = formData.get("youtubeUrl") as string | null;
      title = formData.get("title") as string || "Untitled Video";

      if (youtubeUrl) {
        url = youtubeUrl;
      } else if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Try writing to public/uploads folder first
        try {
          const uploadDir = path.join(process.cwd(), "public", "uploads");
          if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
          }
          const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
          const filename = `${Date.now()}-${safeName}`;
          const filePath = path.join(uploadDir, filename);

          await writeFile(filePath, buffer);
          url = `/uploads/${filename}`;
        } catch (err: any) {
          // If filesystem is read-only (e.g. Vercel serverless), fallback to Data URL
          const mimeType = file.type || "video/mp4";
          url = `data:${mimeType};base64,${buffer.toString("base64")}`;
        }
      }
    }

    if (!url) {
      return NextResponse.json({ error: "No URL or file provided" }, { status: 400 });
    }

    const items = await getWorkItems();

    const newItem = {
      id: Date.now().toString(),
      title,
      url,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    items.unshift(newItem);
    await saveWorkItems(items);

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
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const targetId = String(id);
    let items = await getWorkItems();

    const initialCount = items.length;
    items = items.filter((item: any) => String(item.id) !== targetId && item.url !== id);

    if (items.length === initialCount) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await saveWorkItems(items);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE work error:", error);
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
