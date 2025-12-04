import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { addOrderToSheet } from '../../../lib/googleSheetsWrite';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
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
        shippingAddress = checkoutSession.shipping?.address || checkoutSession.customer_details?.address || {};
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

      // Créer l'objet commande
      const order = {
        orderNumber,
        customerEmail,
        customerName,
        phone,
        totalAmount: amount,
        shippingCost: 0,
        taxAmount: 0,
        items: items.length > 0 ? items : [{
          productName: 'Commande Stripe',
          quantity: 1,
          price: amount,
        }],
        shippingAddress: formattedAddress,
        paymentMethod: 'stripe',
        paymentStatus: 'PAID',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      // Sauvegarder dans Google Sheets
      await addOrderToSheet(order);

      console.log(`✅ Commande ${orderNumber} créée depuis Stripe webhook`);

      // TODO: Envoyer email de confirmation si Resend configuré
      // await sendOrderConfirmationEmail(order);

    } catch (error: any) {
      console.error('❌ Erreur lors du traitement du webhook:', error);
      return res.status(500).json({ error: 'Webhook handler failed' });
    }
  }

  res.json({ received: true });
}
