export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prismaModule from '../../../../generated/prisma';
import { verifyIdToken } from '../../../../lib/firebaseAdmin';

const prisma = new prismaModule.PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const idToken = authHeader.split(' ')[1];
    const decoded = await verifyIdToken(idToken);
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const email = decoded.email;
    
    // Parse body with safeguards
    let body;
    try {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const productId = body.productId;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    // Find cart
    const cart = await prisma.cart.findUnique({ where: { userEmail: email } });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }
    
    // Delete the cart item
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    
    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userEmail: email },
      include: { items: { include: { product: true } } },
    });
    
    return NextResponse.json({ success: true, items: updatedCart?.items || [] });
  } catch (error) {
    console.error('Error in DELETE cart/remove:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 