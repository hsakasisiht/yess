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
    const { productId, quantity = 1, mightRange, mightRangeLabel, pricePer100k, gemCost, mode } = await req.json();
    if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    // Find or create cart
    let cart = await prisma.cart.findUnique({ where: { userEmail: user.email } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userEmail: user.email } });
    }
    // Check if item exists
    const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    if (existing) {
      // Update quantity and extra fields
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: mode === 'add' ? existing.quantity + quantity : quantity,
          mightRange,
          mightRangeLabel,
          pricePer100k,
          gemCost,
        },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          mightRange,
          mightRangeLabel,
          pricePer100k,
          gemCost,
        },
      });
    }
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 