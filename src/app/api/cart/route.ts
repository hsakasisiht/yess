import { NextRequest, NextResponse } from 'next/server';
import prismaModule from '../../../generated/prisma';
import { verifyIdToken } from '../../../lib/firebaseAdmin';

const prisma = new prismaModule.PrismaClient();

// Simple GET handler for cart
export async function GET(req: NextRequest) {
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
    
    // Fetch cart
    const cart = await prisma.cart.findUnique({
      where: { userEmail: email },
      include: { items: { include: { product: true } } },
    });
    
    return NextResponse.json({ success: true, items: cart?.items || [] });
  } catch (error) {
    console.error('Error in GET cart:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 