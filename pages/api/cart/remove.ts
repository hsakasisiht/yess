import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verifyIdToken } from '../../../src/lib/firebaseAdmin';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
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
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    const cart = await prisma.cart.findUnique({ where: { userEmail: email } });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    const updatedCart = await prisma.cart.findUnique({
      where: { userEmail: email },
      include: { items: { include: { product: true } } },
    });
    return res.status(200).json({ success: true, items: updatedCart?.items || [] });
  } catch (error) {
    console.error('Error in DELETE cart/remove:', error);
    return res.status(500).json({ error: 'Server error' });
  }
} 