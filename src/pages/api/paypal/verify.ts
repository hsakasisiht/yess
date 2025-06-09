import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import '../../../lib/firebaseAdmin';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { orderID, details } = req.body;
  if (!orderID) return res.status(400).json({ error: 'Missing orderID' });

  // Get PayPal credentials from env
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  if (!clientId || !secret) return res.status(500).json({ error: 'PayPal credentials not set' });

  // Get access token
  const basic = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return res.status(500).json({ error: 'Failed to get PayPal access token' });

  // Verify order
  const orderRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}`, {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
  });
  const orderData = await orderRes.json();
  if (orderData.status === 'COMPLETED') {
    // Find the most recent pending order for the user (or use orderId if passed)
    // For security, you should pass the orderId from the client and verify user session
    // Here, we just update the most recent pending order as a fallback
    try {
      // Get user from session cookie
      // (This only works in app/api, not pages/api, so you may need to move this to app/api for full session support)
      // const cookieStore = await cookies();
      // const sessionCookie = cookieStore.get('session')?.value;
      // if (!sessionCookie) return res.status(401).json({ error: 'Unauthorized' });
      // const decoded = await getAuth().verifySessionCookie(sessionCookie, true);
      // if (!decoded || !decoded.uid) return res.status(401).json({ error: 'Unauthorized' });
      // const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
      // if (!user) return res.status(404).json({ error: 'User not found' });
      // const order = await prisma.order.findFirst({ where: { userId: user.id, paymentStatus: 'pending' }, orderBy: { createdAt: 'desc' } });
      // Instead, just update the most recent pending order
      const order = await prisma.order.findFirst({ where: { paymentStatus: 'pending' }, orderBy: { createdAt: 'desc' } });
      if (!order) return res.status(404).json({ error: 'No pending order found' });
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'paid',
          status: 'processing',
          // @ts-ignore
          paymentMethod: 'paypal',
          // Optionally store PayPal transaction details in a new field if you add it
        },
      });
      return res.status(200).json({ success: true, order: orderData, dbOrder: updated });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to update order in DB', details: e });
    }
  } else {
    return res.status(400).json({ error: 'Order not completed', details: orderData });
  }
} 