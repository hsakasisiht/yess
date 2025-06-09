import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { firebaseUid, email, name } = await req.json();
  if (!firebaseUid || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  let user = await prisma.user.findUnique({ where: { firebaseUid } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid,
        email,
        name: name || null,
      },
    });
  }
  return NextResponse.json({ user });
} 