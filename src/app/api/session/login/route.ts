import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import '../../../../lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === 'production';
    console.log('Setting session cookie. Secure:', isProd);
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: isProd, // false for localhost, true for production
      maxAge: expiresIn / 1000,
      path: '/',
      sameSite: 'lax',
    });
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
} 