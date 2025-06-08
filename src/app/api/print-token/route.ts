import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  // Print the token to the terminal (server logs)
  console.log('Received Firebase ID Token:', token);
  return NextResponse.json({ status: 'ok' });
} 