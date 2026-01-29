import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});

interface ShippingRates {
  [key: string]: number;
}

interface TaxRates {
  [key: string]: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  orderId: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
}

export const calculateShipping = (shippingMethod: string, totalAmount: number): number => {
  const rates: ShippingRates = {
    standard: 0, // Free shipping
    express: 15.00, // Express shipping
  };
  
  return rates[shippingMethod] || 0;
};

export const calculateTax = (subtotal: number, country: string = 'FR'): number => {
  const taxRates: TaxRates = {
    FR: 0.20, // 20% VAT in France
    EU: 0.20, // Default EU rate
    US: 0.08, // Example US rate
    DEFAULT: 0.20
  };
  
  const rate = taxRates[country] || taxRates.DEFAULT;
  return Math.round(subtotal * rate * 100) / 100;
};

export async function createPaymentIntent({
  amount,
  currency = 'eur',
  orderId,
  customerEmail,
  shippingAddress,
}: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId,
        customerEmail,
      },
      shipping: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        address: {
          line1: shippingAddress.address,
          line2: shippingAddress.address2 || undefined,
          city: shippingAddress.city,
          postal_code: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
}

export async function confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    throw new Error('Failed to confirm payment');
  }
}