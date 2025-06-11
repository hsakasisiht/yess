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
    const body = await req.json();
    const data: any = {};
    if (body.status) data.status = body.status;
    if (body.paymentStatus) data.paymentStatus = body.paymentStatus;
    if (Object.keys(data).length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    const order = await prisma.order.update({
      where: { id: orderId },
      data,
    });
    // If paymentStatus is updated and order has invoiceId, update invoice status too
    if (order.invoiceId && body.paymentStatus) {
      let invoiceStatus = undefined;
      if (body.paymentStatus === 'paid') invoiceStatus = 'PAID';
      else if (body.paymentStatus === 'failed') invoiceStatus = 'FAILED';
      else if (body.paymentStatus === 'pending') invoiceStatus = 'UNPAID';
      if (invoiceStatus) {
        await prisma.invoice.update({ where: { id: order.invoiceId }, data: { status: invoiceStatus } });
      }
    }
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 