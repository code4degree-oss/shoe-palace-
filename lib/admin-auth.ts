import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV !== 'development' && process.env.NEXT_PHASE !== 'phase-production-build') {
  console.warn('WARNING: JWT_SECRET environment variable is required for admin authentication');
}

/**
 * Verify admin JWT token from cookies.
 * Returns the decoded payload if valid, or null if invalid/missing.
 */

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

export function verifyAdminToken(request: NextRequest): { email: string; role: string } | null {
  try {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      console.error('[AUTH DEBUG] No token found in cookies');
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as { email: string; role: string };
    if (decoded.role !== 'admin') {
      console.error('[AUTH DEBUG] Role is not admin');
      return null;
    }

    return decoded;
  } catch (err: any) {
    console.error(`[AUTH DEBUG] JWT verify failed: ${err.message}`);
    return null;
  }
}

export function unauthorizedResponse(debugInfo?: string) {
  return NextResponse.json(
    { error: 'Unauthorized. Please log in to the admin panel.', debug: debugInfo },
    { status: 401 }
  );
}


