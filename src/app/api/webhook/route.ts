import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '../../../../lib/prisma';

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook error:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    console.log('✅ Webhook received checkout.session.completed');
    const session = event.data.object as Stripe.Checkout.Session;
    //console.log('✅ Stripe checkout completed:', session);

    const email = session.customer_email || 'unknown';
    const amount = session.amount_total || 0;
    const stripeSessionId = session.id;
    const address = session.metadata?.address || 'No address provided';
    const cartJSON = session.metadata?.cart || '[]';

    try {
      const savedOrder = await prisma.order.create({
        data: {
          email,
          amount,
          address,
          stripeSessionId,
          items: cartJSON, // optional: store full cart as raw JSON string
        },
      });

      console.log('✅ Order saved to database', savedOrder);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Failed to save order:', message);
    }
  }

  return NextResponse.json({ received: true });
}
