import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Disable default body parser is not needed in App router for formData,
// but we just read the file directly and write to disk without any compression.
// Note: If hosted on Vercel, serverless function payload limit (4.5MB) may still apply,
// but for standard Node.js hosting this will allow large files.

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Allow large files. We only restrict the type.
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.' }, { status: 400 });
    }

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'reviews');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const rawExt = file.name.split('.').pop() || 'jpg';
    const ext = rawExt.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5) || 'jpg';
    const filename = `review-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(bytes));

    const publicUrl = `/uploads/reviews/${filename}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Review image upload failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
