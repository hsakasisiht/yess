import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import '../../../../lib/firebaseAdmin';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    let sessionCookie = cookieStore.get('session')?.value;
    let decoded;
    if (sessionCookie) {
      decoded = await getAuth().verifySessionCookie(sessionCookie, true);
    } else {
      const authHeader = req.headers.get('authorization');
      if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const token = authHeader.replace('Bearer ', '');
      decoded = await getAuth().verifyIdToken(token);
    }
    if (!decoded || !decoded.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const { productId, quantity = 1, mightRange, mightRangeLabel, pricePer100k, gemCost, mode, price, kingdomNumber } = await req.json();
    if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    // Defensive conversion for numeric fields
    const numericPrice = price !== undefined ? Number(price) : undefined;
    const numericPricePer100k = pricePer100k !== undefined ? Number(pricePer100k) : undefined;
    const numericGemCost = gemCost !== undefined ? Number(gemCost) : undefined;
    // Find or create cart
    let cart = await prisma.cart.findUnique({ where: { userEmail: user.email } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userEmail: user.email } });
    }
    // Check if item exists (match on productId and mightRange for gems, kingdomNumber for resources)
    let existing;
    if (mightRange) {
      existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId, mightRange } });
    } else if (kingdomNumber) {
      existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId, kingdomNumber } });
    } else {
      existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    }
    if (existing) {
      // Update quantity and extra fields
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: mode === 'add' ? existing.quantity + quantity : quantity,
          mightRange,
          mightRangeLabel,
          pricePer100k: numericPricePer100k,
          gemCost: numericGemCost,
          price: numericPrice,
          kingdomNumber,
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
          pricePer100k: numericPricePer100k,
          gemCost: numericGemCost,
          price: numericPrice,
          kingdomNumber,
        },
      });
    }
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 