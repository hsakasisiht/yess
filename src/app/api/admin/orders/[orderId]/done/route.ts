import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import '@/lib/firebaseAdmin';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = await getAuth().verifySessionCookie(sessionCookie, true);
    if (!decoded || !decoded.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const orderId = params.orderId;
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'done', paymentStatus: 'paid' },
    });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 