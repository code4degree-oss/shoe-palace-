import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return unauthorizedResponse();

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 });
  }

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'banners');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const rawExt = file.name.split('.').pop() || 'jpg';
  const ext = rawExt.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5) || 'jpg';
  const filename = `banner-${Date.now()}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  const bytes = await file.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(bytes));

  // Return a public URL path
  const publicUrl = `/uploads/banners/${filename}`;
  return NextResponse.json({ url: publicUrl });
}
