import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import '../../../../lib/firebaseAdmin';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = await getAuth().verifySessionCookie(sessionCookie, true);
  if (!decoded || !decoded.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user });
} 