import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { getUploadsDir } from '@/lib/uploads';
import { randomUUID } from 'crypto';

// POST /api/upload - Upload one or more files
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadsDir = getUploadsDir();
    const urls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} not allowed. Use JPEG, PNG, GIF, WebP, or SVG.` },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 5MB.' },
          { status: 400 }
        );
      }

      // Generate unique filename
      const ext = extname(file.name) || '.jpg';
      const filename = `${randomUUID()}${ext}`;

      // Read file buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Write to persistent uploads directory
      const filePath = join(uploadsDir, filename);
      await writeFile(filePath, buffer);

      // Return the URL path (served by /api/uploads/[...path])
      urls.push(`/api/uploads/${filename}`);
    }

    return NextResponse.json({
      urls,
      url: urls[0], // convenience for single file uploads
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
