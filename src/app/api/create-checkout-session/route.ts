import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: '10 Christmas Cards Bundle',
              description: 'Create 10 personalized AI-powered LinkedIn Christmas cards',
            //   images: ['https://your-domain.com/card-preview-image.jpg'], // Add your product image
            },
            unit_amount: 500, // $5.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/create?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/create?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('Stripe API error:', err);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
