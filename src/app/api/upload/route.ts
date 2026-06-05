import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// POST /api/upload - Handle file uploads
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      console.error('[POST /api/upload] No files in request');
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    const uploadedFiles: { url: string; name: string; type: string; size: number }[] = [];

    // Uploads directory: project root /uploads (NOT inside public/)
    // In dev: <project>/uploads  |  In production (Coolify): /app/uploads
    // Coolify volume must be mounted at /app/uploads for persistence
    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    for (const file of files) {
      console.log('[POST /api/upload] File received:', file.name, 'type:', file.type, 'size:', file.size);

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Type de fichier non autorisé: ${file.type}. Types acceptés: JPEG, PNG, GIF, WebP, SVG`,
          },
          { status: 400 }
        );
      }

      // Validate file size (min 500 bytes, max 5MB)
      const minSize = 500;
      const maxSize = 5 * 1024 * 1024; // 5MB — supports JPG/PNG/GIF/WebP up to 5MB
      if (file.size < minSize) {
        console.error('[POST /api/upload] File too small:', file.size, 'bytes');
        return NextResponse.json(
          { error: `Le fichier est trop petit (${file.size} octets). Veuillez sélectionner une image valide.` },
          { status: 400 }
        );
      }
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'La taille du fichier ne doit pas dépasser 5MB' },
          { status: 400 }
        );
      }

      // Generate unique filename
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `${uuidv4()}.${ext}`;
      const filePath = join(uploadsDir, fileName);

      // Write file
      const bytes = await file.arrayBuffer();
      console.log('[POST /api/upload] ArrayBuffer size:', bytes.byteLength);
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      console.log('[POST /api/upload] File saved:', fileName, 'size:', buffer.length);
      uploadedFiles.push({
        url: `/uploads/${fileName}`,
        name: file.name,
        type: file.type,
        size: buffer.length,
      });
    }

    // If single file, return just the URL; if multiple, return array
    if (uploadedFiles.length === 1) {
      return NextResponse.json({
        url: uploadedFiles[0].url,
        name: uploadedFiles[0].name,
        type: uploadedFiles[0].type,
        size: uploadedFiles[0].size,
      });
    }

    return NextResponse.json({
      files: uploadedFiles,
      count: uploadedFiles.length,
    });
  } catch (error) {
    console.error('[POST /api/upload] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du fichier' },
      { status: 500 }
    );
  }
}
