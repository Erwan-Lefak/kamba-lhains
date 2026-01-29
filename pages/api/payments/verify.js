import Stripe from 'stripe';
import { trackCAPIPurchase, extractMetaCookies } from '../../../lib/meta/conversionsAPI';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { payment_intent, email, order_id, event_id, firstName, lastName, phone, city, postalCode, country } = req.query;

  if (!payment_intent) {
    return res.status(400).json({ message: 'Payment Intent ID is required' });
  }

  try {
    // Récupérer le Payment Intent depuis Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    // Envoyer CAPI Purchase depuis le serveur (fonctionne même avec AdBlock)
    if ((paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') && email) {
      const totalValue = paymentIntent.amount / 100;
      const orderNum = order_id || `KL-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      // Utiliser l'eventId passé par le client pour déduplication, ou en générer un nouveau
      const eventId = event_id || `Purchase_${orderNum}_${Date.now()}`;

      // Extraire IP et User-Agent depuis la requête
      const clientIp = (req.headers['x-forwarded-for']?.split(',')[0]) ||
                       req.socket.remoteAddress ||
                       '';
      const userAgent = req.headers['user-agent'] || '';
      const eventSourceUrl = req.headers.referer || req.headers.origin || 'https://kamba-lhains.com';

      // Extraire les cookies Meta (fbc et fbp) pour améliorer Match Quality
      const { fbp, fbc } = extractMetaCookies(req);

      // Envoyer au CAPI (server-side - fonctionne avec AdBlock)
      await trackCAPIPurchase({
        orderId: orderNum,
        totalValue: totalValue,
        currency: 'EUR',
        email: email, // Email depuis query params
        firstName: firstName, // Prénom - améliore le Event Match Quality
        lastName: lastName, // Nom - améliore le Event Match Quality
        phone: phone, // Téléphone - améliore le Event Match Quality
        city: city, // Ville - améliore le Event Match Quality
        zipCode: postalCode, // Code postal - améliore le Event Match Quality
        country: country, // Pays - améliore le Event Match Quality
        clientIp: clientIp,
        userAgent: userAgent,
        eventSourceUrl: eventSourceUrl,
        fbc: fbc, // Click ID - améliore le Event Match Quality
        fbp: fbp, // Browser ID
        eventId: eventId, // Pour déduplication Pixel/CAPI
      });
    }

    res.status(200).json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      payment_method: paymentIntent.payment_method,
    });
  } catch (error) {
    console.error('Error verifying payment intent:', error);
    res.status(500).json({
      message: 'Error verifying payment',
      error: error.message
    });
  }
}
