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

    const email = session.customer_details?.email || 'guest@example.com';
    const amount = (session.amount_total || 0)/100;
    //const address = session.customer_details?.address?.line1 || 'Unknown address';
    const address = session.metadata?.address || 'Unknown address';
    const items = JSON.parse(session.metadata?.cart || '[]');
    const name = session.customer_details?.name || session.metadata?.name || 'Guest';
    const phone = session.customer_details?.phone || session.metadata?.phone || null;
    const stripeSessionId = session.id;

    try {
      const savedOrder = await prisma.order.create({
        data: {
          email,
          amount,
          name,
          phone,
          items: JSON.stringify(items),
          address,
          stripeSessionId,
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
