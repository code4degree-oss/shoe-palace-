import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const unwrappedParams = await params;
  const filename = unwrappedParams.filename;
  const filepath = path.join(process.cwd(), 'public', 'uploads', 'banners', filename);
  
  if (!fs.existsSync(filepath)) {
    return new NextResponse('Image Not found', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filepath);
  
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
  };
  
  const contentType = ext && mimeTypes[ext] ? mimeTypes[ext] : 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
