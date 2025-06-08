import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verifyIdToken } from '../../../src/lib/firebaseAdmin';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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
    const cart = await prisma.cart.findUnique({
      where: { userEmail: email },
      include: { items: { include: { product: true } } },
    });
    return res.status(200).json({ success: true, items: cart?.items || [] });
  } catch (error) {
    console.error('Error in GET cart:', error);
    return res.status(500).json({ error: 'Server error' });
  }
} 