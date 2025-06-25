// app/api/save-order/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, items, name, phone, amount, address, stripeSessionId } = await req.json();

    const order = await prisma.order.create({
      data: {
        email,
        name,
        phone,       // ✅ add if in schema
        items: JSON.stringify(items),
        amount,
        address,
        stripeSessionId,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
