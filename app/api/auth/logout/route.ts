import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const isHttps = request.headers.get('x-forwarded-proto') === 'https' || request.nextUrl.protocol === 'https:';
  
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
