import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '../../../lib/prisma';
import { sendOrderConfirmationEmail } from '../../../lib/resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    const session = event.data.object as Stripe.Checkout.Session | Stripe.PaymentIntent;

    try {
      let customerEmail = '';
      let customerName = '';
      let phone = '';
      let shippingAddress: any = {};
      let amount = 0;
      let items: any[] = [];

      if (event.type === 'checkout.session.completed') {
        const checkoutSession = session as Stripe.Checkout.Session;
        customerEmail = checkoutSession.customer_details?.email || '';
        customerName = checkoutSession.customer_details?.name || '';
        phone = checkoutSession.customer_details?.phone || '';
        shippingAddress = (checkoutSession as any).shipping?.address || checkoutSession.customer_details?.address || {};
        amount = checkoutSession.amount_total ? checkoutSession.amount_total / 100 : 0;

        // Récupérer les line items
        if (checkoutSession.id) {
          const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id);
          items = lineItems.data.map(item => ({
            productName: item.description || '',
            quantity: item.quantity || 1,
            price: item.amount_total ? item.amount_total / 100 : 0,
          }));
        }
      } else {
        const paymentIntent = session as Stripe.PaymentIntent;
        customerEmail = paymentIntent.receipt_email || '';
        amount = paymentIntent.amount ? paymentIntent.amount / 100 : 0;

        // Extraire les informations depuis les metadata ou shipping
        if (paymentIntent.shipping) {
          customerName = paymentIntent.shipping.name || '';
          phone = paymentIntent.shipping.phone || '';
          shippingAddress = paymentIntent.shipping.address || {};
        }
      }

      // Générer un numéro de commande
      const orderNumber = `KL-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      // Préparer l'adresse de livraison
      const formattedAddress = {
        firstName: customerName.split(' ')[0] || '',
        lastName: customerName.split(' ').slice(1).join(' ') || '',
        address1: shippingAddress.line1 || '',
        address2: shippingAddress.line2 || '',
        city: shippingAddress.city || '',
        postalCode: shippingAddress.postal_code || '',
        country: shippingAddress.country || 'FR',
      };

      // Créer la commande dans Prisma
      const order = await prisma.order.create({
        data: {
          orderNumber,
          guestEmail: customerEmail,
          guestPhone: phone,
          status: 'PENDING',
          totalAmount: amount,
          shippingCost: 0,
          taxAmount: 0,
          shippingAddress: formattedAddress,
          paymentMethod: 'stripe',
          paymentStatus: 'PAID',
          stripePaymentId: event.type === 'payment_intent.succeeded'
            ? (session as Stripe.PaymentIntent).id
            : (session as Stripe.Checkout.Session).payment_intent as string,
          confirmedAt: new Date(),
        },
      });

      console.log(`✅ Commande ${orderNumber} créée depuis Stripe webhook (ID: ${order.id})`);

      // Créer les items de commande
      if (items.length > 0) {
        for (const item of items) {
          // Note: Pour le moment on crée des OrderItems sans productId
          // Il faudra mapper les line items Stripe aux produits Prisma
          console.log(`  - ${item.productName} x${item.quantity} = ${item.price}€`);
        }
      }

      // Envoyer email de confirmation
      try {
        await sendOrderConfirmationEmail({
          orderNumber,
          customerEmail,
          customerName,
          totalAmount: amount,
          shippingAddress: formattedAddress,
          items
        });
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi de l\'email (commande créée quand même):', emailError);
        // On ne fait pas échouer le webhook si l'email échoue
      }

    } catch (error: any) {
      console.error('❌ Erreur lors du traitement du webhook:', error);
      return res.status(500).json({ error: 'Webhook handler failed' });
    }
  }

  res.json({ received: true });
}
