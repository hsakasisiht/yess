import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verifyIdToken } from '../../../src/lib/firebaseAdmin';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const idToken = authHeader.split(' ')[1];
    const decoded = await verifyIdToken(idToken);
    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const email = decoded.email;
    let body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    const productId = body.productId;
    const quantity = body.quantity || 1;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    const mightRange = body.mightRange || null;
    const mightRangeLabel = body.mightRangeLabel || null;
    const pricePer100k = body.pricePer100k || null;
    const gemCost = body.gemCost || null;
    let cart = await prisma.cart.findUnique({ where: { userEmail: email } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userEmail: email } });
    }
    const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity, mightRange, mightRangeLabel, pricePer100k, gemCost },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity, mightRange, mightRangeLabel, pricePer100k, gemCost },
      });
    }
    const updatedCart = await prisma.cart.findUnique({
      where: { userEmail: email },
      include: { items: { include: { product: true } } },
    });
    return res.status(200).json({ success: true, items: updatedCart?.items || [] });
  } catch (error) {
    console.error('Error in POST cart/add:', error);
    return res.status(500).json({ error: 'Server error' });
  }
} 