import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  const resources = await prisma.product.findMany({ where: { category: 'RESOURCES' } });
  return NextResponse.json(resources);
} 