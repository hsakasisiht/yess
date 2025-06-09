import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const resources = await prisma.product.findMany({ where: { category: 'RESOURCES' } });
  return NextResponse.json(resources);
} 