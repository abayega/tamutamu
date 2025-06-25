// app/api/finalize-order/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '../../../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer_details'],
    });
    console.log('✅ Stripe session:', session);
    const email = session.customer_details?.email || 'guest@example.com';
    const amount = (session.amount_total || 0)/100;
    //const address = session.customer_details?.address?.line1 || 'Unknown address';
    const address = session.metadata?.address || 'Unknown address';
    const items = JSON.parse(session.metadata?.cart || '[]');
    const name = session.customer_details?.name || session.metadata?.name || 'Guest';
    const phone = session.customer_details?.phone || session.metadata?.phone || null;


    await prisma.order.create({
      data: {
        email,
        amount,
        name,
        phone,
        items: JSON.stringify(items),
        address,
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error finalizing order:', err);
    return NextResponse.json({ error: 'Failed to finalize order' }, { status: 500 });
  }
}
