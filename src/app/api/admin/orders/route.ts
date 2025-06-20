import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import '../../../../lib/firebaseAdmin';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = await getAuth().verifySessionCookie(sessionCookie, true);
    if (!decoded || !decoded.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const orders = await prisma.order.findMany({
      include: { user: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 