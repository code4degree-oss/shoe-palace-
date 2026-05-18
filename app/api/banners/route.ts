import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

const DATA_FILE = path.join(process.cwd(), 'data', 'banners.json');

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

// GET — Read all banners
export async function GET() {
  ensureDataDir();
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return NextResponse.json(JSON.parse(data));
}

// POST — Save all banners (full replace)
export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return unauthorizedResponse();
  ensureDataDir();
  const banners = await request.json();
  fs.writeFileSync(DATA_FILE, JSON.stringify(banners, null, 2), 'utf-8');
  return NextResponse.json({ success: true });
}
