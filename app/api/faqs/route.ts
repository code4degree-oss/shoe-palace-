import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

const DATA_FILE = path.join(process.cwd(), 'data', 'faqs.json');

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

export async function GET() {
  ensureDataDir();
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return NextResponse.json(JSON.parse(data));
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return unauthorizedResponse();
  ensureDataDir();
  const faqs = await request.json();
  fs.writeFileSync(DATA_FILE, JSON.stringify(faqs, null, 2), 'utf-8');
  return NextResponse.json({ success: true });
}
