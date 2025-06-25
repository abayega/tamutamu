import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: Request) {
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);
  const sig = req.headers.get('stripe-signature')!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('✅ Stripe checkout completed:', session);

    // Example: Save order to database
    try {
      const savedOrder = await prisma.order.create({
        data: {
          email: session.customer_email || 'unknown',
          amount: session.amount_total!,
          stripeSessionId: session.id,
        },
      });

      console.log('✅ Order saved to database', savedOrder);
    } catch (err) {
      console.error('❌ Failed to save order:', err);
    }
  }

  return NextResponse.json({ received: true });
}
