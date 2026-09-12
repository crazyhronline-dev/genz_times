import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const contentType = request.headers.get('content-type') || '';

    // Handle JSON with base64 dataUrl
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { dataUrl, filename: originalFilename } = body;

      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        return NextResponse.json(
          { success: false, error: 'Invalid or missing image dataUrl' },
          { status: 400 }
        );
      }

      // Extract format and base64 content
      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches || matches.length < 3) {
        return NextResponse.json(
          { success: false, error: 'Malformed image data' },
          { status: 400 }
        );
      }

      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1].replace('svg+xml', 'svg');
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      const safeBase = originalFilename
        ? originalFilename.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30)
        : 'image';
      const filename = `genz-${safeBase}-${Date.now()}.${ext}`;
      const filePath = path.join(UPLOAD_DIR, filename);

      await fs.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        filename,
        size: buffer.length,
      });
    }

    // Handle FormData
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided in form data' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.jpg';
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30) || 'upload';
      const filename = `genz-${baseName}-${Date.now()}${ext}`;
      const filePath = path.join(UPLOAD_DIR, filename);

      await fs.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        filename,
        size: buffer.length,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported Content-Type. Use multipart/form-data or application/json' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process image upload' },
      { status: 500 }
    );
  }
}
