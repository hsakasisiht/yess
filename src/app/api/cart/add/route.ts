import { NextRequest, NextResponse } from 'next/server';
import prismaModule from '../../../../generated/prisma';
import { verifyIdToken } from '../../../../lib/firebaseAdmin';

const prisma = new prismaModule.PrismaClient();

export async function POST(req: NextRequest) {
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
    const quantity = body.quantity || 1;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    // Get additional optional fields with defaults
    const mightRange = body.mightRange || null;
    const mightRangeLabel = body.mightRangeLabel || null;
    const pricePer100k = body.pricePer100k || null;
    const gemCost = body.gemCost || null;
    
    // Find or create cart
    let cart = await prisma.cart.findUnique({ where: { userEmail: email } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userEmail: email } });
    }
    
    // Update or create cart item
    const existingItem = await prisma.cartItem.findFirst({ 
      where: { cartId: cart.id, productId } 
    });
    
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity,
          mightRange,
          mightRangeLabel,
          pricePer100k,
          gemCost
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          mightRange,
          mightRangeLabel,
          pricePer100k,
          gemCost
        },
      });
    }
    
    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userEmail: email },
      include: { items: { include: { product: true } } },
    });
    
    return NextResponse.json({ success: true, items: updatedCart?.items || [] });
  } catch (error) {
    console.error('Error in POST cart/add:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 