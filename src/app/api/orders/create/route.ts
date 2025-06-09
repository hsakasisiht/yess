import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import '../../../../lib/firebaseAdmin';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = await getAuth().verifySessionCookie(sessionCookie, true);
    if (!decoded || !decoded.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // Fetch cart
    const cart = await prisma.cart.findUnique({
      where: { userEmail: user.email },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            gemCost: item.gemCost,
            pricePer100k: item.pricePer100k,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });
    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 