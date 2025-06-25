// app/api/stripe-webhook/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text(); // raw body for signature
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const email = session.customer_email || 'guest@example.com';
      const items = JSON.parse(session.metadata?.cart || '[]');
      const amount = session.amount_total || 0;

      await prisma.order.create({
        data: {
          email,
          amount,
          items: JSON.stringify(items), // ✅ stringify the cart array,
          address: session.customer_details?.address?.line1 || 'Unknown address',
          stripeSessionId: session.id,
        },
      });

      console.log('✅ Order saved to database');
    } catch (err) {
      console.error('❌ Failed to save order:', err);
    }
  }

  return NextResponse.json({ received: true });
}
