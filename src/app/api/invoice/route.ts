import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userEmail, userName, items, total, kingdomNumber } = body;
  if (!userEmail || !userName || !items || typeof total !== 'number') {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  // Find or create user
  let user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    user = await prisma.user.create({ data: { email: userEmail, name: userName } });
  }
  // Create invoice
  const invoice = await prisma.invoice.create({
    data: {
      userId: user.id,
      items,
      total,
      status: 'UNPAID',
      kingdomNumber: kingdomNumber || null,
    },
  });
  // Create order linked to invoice
  await prisma.order.create({
    data: {
      userId: user.id,
      invoiceId: invoice.id,
      items: {
        create: items.map(item => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          gemCost: item.gemCost,
          pricePer100k: item.pricePer100k,
        })),
      },
      total,
    },
  });
  return NextResponse.json({ id: invoice.id });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing invoice id' }, { status: 400 });
  }
  const invoice = await prisma.invoice.findUnique({ where: { id }, include: { user: true } });
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }
  return NextResponse.json({
    ...invoice,
    userName: invoice.user?.name || '',
    userEmail: invoice.user?.email || '',
  });
} 