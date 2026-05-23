import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV !== 'development' && process.env.NEXT_PHASE !== 'phase-production-build') {
  console.warn('WARNING: JWT_SECRET environment variable is required for admin authentication');
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Validate credentials
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = (password === ADMIN_PASSWORD);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


    const token = jwt.sign(
      { email, role: 'admin' },
      JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    const isHttps = request.headers.get('x-forwarded-proto') === 'https' || request.nextUrl.protocol === 'https:';
    
    // Set httpOnly cookie
    const response = NextResponse.json({ success: true, message: 'Login successful' });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
