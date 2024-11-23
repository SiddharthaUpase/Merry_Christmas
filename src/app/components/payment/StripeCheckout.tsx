'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface StripeCheckoutProps {
  cardId: string;
  customUrl: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const CUSTOM_URL_PRICE = 499; // $4.99 in cents
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  cardId,
  customUrl,
  onSuccess,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCustomUrlPurchase = async () => {
    try {
      setIsProcessing(true);
      
      // Create payment intent for custom URL
      const response = await fetch('/api/payment/custom-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId,
          customUrl,
          amount: CUSTOM_URL_PRICE,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }

      onSuccess?.();
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Custom URL Purchase</h3>
        <p className="text-gray-600">
          Get your personalized URL for just ${(CUSTOM_URL_PRICE / 100).toFixed(2)}
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Your custom URL will be:</p>
          <p className="font-medium break-all">
            {`${process.env.NEXT_PUBLIC_BASE_URL}/${customUrl}`}
          </p>
        </div>
        <Button
          onClick={handleCustomUrlPurchase}
          isLoading={isProcessing}
          fullWidth
        >
          {isProcessing ? 'Processing...' : 'Purchase Custom URL'}
        </Button>
        <p className="text-xs text-gray-500">
          Secure payment powered by Stripe
        </p>
      </div>
    </Card>
  );
};

export default StripeCheckout;
