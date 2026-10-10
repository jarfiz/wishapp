import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { UTApi } from "uploadthing/server";

export interface UploadResult {
  url: string;
  key: string;
}

export interface StorageProvider {
  upload(buffer: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}

export class UploadThingStorageProvider implements StorageProvider {
  private utapi: UTApi;

  constructor() {
    this.utapi = new UTApi({
      token: process.env.UPLOADTHING_TOKEN,
    });
  }

  async upload(buffer: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult> {
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    const file = new File([blob], originalFilename, { type: mimeType });

    const response = await this.utapi.uploadFiles(file);
    if (response.error) {
      throw new Error(response.error.message || "UploadThing upload failed");
    }

    const data = response.data;
    if (!data) {
      throw new Error("No data returned from UploadThing");
    }

    return {
      url: data.ufsUrl ?? data.url,
      key: data.key,
    };
  }

  async delete(key: string): Promise<void> {
    try {
      await this.utapi.deleteFiles(key);
    } catch (err) {
      console.warn("UploadThing deletion warning:", err);
    }
  }

  getUrl(key: string): string {
    return `https://utfs.io/f/${key}`;
  }
}

export class LocalDiskStorageProvider implements StorageProvider {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), "public", "uploads");
  }

  private async ensureDir() {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  async upload(buffer: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult> {
    await this.ensureDir();
    const ext = path.extname(originalFilename) || this.getExtensionFromMime(mimeType);
    const randomHex = crypto.randomBytes(16).toString("hex");
    const key = `${randomHex}${ext}`;
    const filePath = path.join(this.uploadsDir, key);

    await fs.writeFile(filePath, buffer);

    return {
      url: `/uploads/${key}`,
      key,
    };
  }

  async delete(key: string): Promise<void> {
    try {
      const safeKey = path.basename(key);
      const filePath = path.join(this.uploadsDir, safeKey);
      await fs.unlink(filePath);
    } catch (err) {
      console.warn("Storage deletion warning:", err);
    }
  }

  getUrl(key: string): string {
    return `/uploads/${path.basename(key)}`;
  }

  private getExtensionFromMime(mime: string): string {
    switch (mime) {
      case "image/jpeg":
        return ".jpg";
      case "image/png":
        return ".png";
      case "image/webp":
        return ".webp";
      case "image/gif":
        return ".gif";
      default:
        return ".jpg";
    }
  }
}

// Factory function returning active storage provider
export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER?.toLowerCase();
  const hasUploadThingToken = Boolean(process.env.UPLOADTHING_TOKEN);

  // Use UploadThing if explicitly configured or token is available
  if (provider === "uploadthing" || hasUploadThingToken) {
    return new UploadThingStorageProvider();
  }

  return new LocalDiskStorageProvider();
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
