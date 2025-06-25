import { NextResponse } from 'next/server';
import { prisma } from '../lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('DB Test Error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}