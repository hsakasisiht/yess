import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
 
export async function GET() {
  const gems = await prisma.product.findMany({ where: { category: 'GEMS' } });
  return NextResponse.json(gems);
} 