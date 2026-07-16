import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DEFAULT_ITEMS: any[] = [];

const getWorkJsonPath = () => {
  return path.join(process.cwd(), "public", "uploads", "work.json");
};

export async function GET() {
  try {
    const jsonPath = getWorkJsonPath();
    if (!existsSync(jsonPath)) {
      return NextResponse.json(DEFAULT_ITEMS);
    }
    const fileContent = await readFile(jsonPath, "utf-8");
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error: any) {
    console.error("GET work error:", error);
    return NextResponse.json({ error: "Failed to read work items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== (process.env.ADMIN_PASSWORD || "admin123")) {
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

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        // Sanitize filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${Date.now()}-${safeName}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);
        url = `/uploads/${filename}`;
      }
    }

    if (!url) {
      return NextResponse.json({ error: "No URL or file provided" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const jsonPath = getWorkJsonPath();
    let items = [...DEFAULT_ITEMS];

    if (existsSync(jsonPath)) {
      const fileContent = await readFile(jsonPath, "utf-8");
      try {
        items = JSON.parse(fileContent);
      } catch (e) {
        // use default if JSON parse fails
      }
    }

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
    await writeFile(jsonPath, JSON.stringify(items, null, 2), "utf-8");

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error("POST upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== (process.env.ADMIN_PASSWORD || "admin123")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const jsonPath = getWorkJsonPath();
    if (!existsSync(jsonPath)) {
      return NextResponse.json({ error: "Work index not found" }, { status: 404 });
    }

    const fileContent = await readFile(jsonPath, "utf-8");
    let items = JSON.parse(fileContent);
    const itemToDelete = items.find((item: any) => item.id === id);

    if (!itemToDelete) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // If it's an uploaded file (starts with /uploads), delete it from disk
    if (itemToDelete.url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", itemToDelete.url);
      if (existsSync(filePath)) {
        await unlink(filePath).catch((err) => {
          console.warn("Failed to delete local file:", err);
        });
      }
    }

    items = items.filter((item: any) => item.id !== id);
    await writeFile(jsonPath, JSON.stringify(items, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE work error:", error);
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
