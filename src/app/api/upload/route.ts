import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  getStorageProvider,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed formats: JPEG, PNG, WebP, GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds maximum size limit of 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const storage = getStorageProvider();
    const result = await storage.upload(buffer, file.name, file.type);

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Upload handler error:", err);
    const message = err instanceof Error ? err.message : "Failed to upload file";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
