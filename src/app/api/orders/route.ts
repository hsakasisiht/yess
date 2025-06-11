import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userEmail, userName, items, total, invoiceId } = body;
  if (!userEmail || !userName || !items || typeof total !== 'number') {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  // Find or create user
  let user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    user = await prisma.user.create({ data: { email: userEmail, name: userName } });
  }
  // Create order
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      invoiceId: invoiceId || undefined,
      items,
      total,
    },
  });
  return NextResponse.json({ id: order.id });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('userEmail');
  if (!userEmail) {
    return NextResponse.json({ error: 'Missing userEmail' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    return NextResponse.json({ orders: [] });
  }
  const userOrders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
    });
  return NextResponse.json({ orders: userOrders });
} 