import { NextResponse } from 'next/server';
import prismaModule from '../../../../generated/prisma';
import { verifyIdToken } from '../../../../lib/firebaseAdmin';
import type { NextRequest as NextRequestType } from 'next/server';

const prisma = new prismaModule.PrismaClient();

export async function GET(req: NextRequestType, { params }: { params: { action: string[] } }) {
  // Only proceed if the action is 'get'
  if (params.action[0] !== 'get') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
  
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
  // Fetch or create cart for user
  let cart = await prisma.cart.findUnique({
    where: { userEmail: email },
    include: { items: { include: { product: true } } },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userEmail: email },
      include: { items: { include: { product: true } } },
    });
  }
  return NextResponse.json(cart);
}

export async function POST(req: NextRequestType, { params }: { params: { action: string[] } }) {
  // Only proceed if the action is 'add'
  if (params.action[0] !== 'add') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
  
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
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { productId, quantity, mightRange, mightRangeLabel, pricePer100k, gemCost } = body;
  if (!productId || typeof quantity !== 'number' || quantity < 1) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  // Find or create cart
  let cart = await prisma.cart.findUnique({ where: { userEmail: email } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userEmail: email } });
  }
  // Check if item exists (productId should be a string, not an object)
  const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity,
        ...(mightRange && { mightRange }),
        ...(mightRangeLabel && { mightRangeLabel }),
        ...(pricePer100k && { pricePer100k }),
        ...(gemCost && { gemCost }),
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        ...(mightRange && { mightRange }),
        ...(mightRangeLabel && { mightRangeLabel }),
        ...(pricePer100k && { pricePer100k }),
        ...(gemCost && { gemCost }),
      },
    });
  }
  // Return updated cart
  const updatedCart = await prisma.cart.findUnique({
    where: { userEmail: email },
    include: { items: { include: { product: true } } },
  });
  return NextResponse.json(updatedCart);
}

export async function DELETE(req: NextRequestType, { params }: { params: { action: string[] } }) {
  // Only proceed if the action is 'remove'
  if (params.action[0] !== 'remove') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
  
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
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
  const { productId } = body;
  if (!productId) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
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
  return NextResponse.json(updatedCart);
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 