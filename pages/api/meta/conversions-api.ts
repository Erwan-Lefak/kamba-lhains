import type { NextApiRequest, NextApiResponse } from 'next';
import {
  trackCAPIPurchase,
  trackCAPIInitiateCheckout,
  trackCAPIAddToCart,
  trackCAPIViewContent,
  extractMetaCookies,
} from '../../../lib/meta/conversionsAPI';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { event, params } = req.body;

    if (!event || !params) {
      return res.status(400).json({ message: 'Missing event or params' });
    }

    // Extraire les infos de la requête
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '';
    const userAgent = req.headers['user-agent'] || '';

    // Extraire les cookies Meta
    const { fbp, fbc } = extractMetaCookies(req);

    let success = false;

    switch (event) {
      case 'Purchase':
        success = await trackCAPIPurchase({
          ...params,
          clientIp,
          userAgent,
          fbp,
          fbc,
          eventSourceUrl: params.eventSourceUrl || req.headers.referer || '',
          eventId: params.eventId, // Pour déduplication Pixel/CAPI
        });
        break;

      case 'InitiateCheckout':
        success = await trackCAPIInitiateCheckout({
          ...params,
          clientIp,
          userAgent,
          fbp,
          fbc,
          eventSourceUrl: params.eventSourceUrl || req.headers.referer || '',
          eventId: params.eventId, // Pour déduplication Pixel/CAPI
        });
        break;

      case 'AddToCart':
        success = await trackCAPIAddToCart({
          ...params,
          clientIp,
          userAgent,
          fbp,
          fbc,
          eventSourceUrl: params.eventSourceUrl || req.headers.referer || '',
          eventId: params.eventId, // Pour déduplication Pixel/CAPI
        });
        break;

      case 'ViewContent':
        success = await trackCAPIViewContent({
          ...params,
          clientIp,
          userAgent,
          fbp,
          fbc,
          eventSourceUrl: params.eventSourceUrl || req.headers.referer || '',
          eventId: params.eventId, // Pour déduplication Pixel/CAPI
        });
        break;

      default:
        return res.status(400).json({ message: 'Unsupported event type' });
    }

    if (success) {
      return res.status(200).json({ success: true, message: 'Event sent to Meta CAPI' });
    } else {
      return res.status(500).json({ message: 'Failed to send event to Meta CAPI' });
    }
  } catch (error) {
    console.error('Meta CAPI API Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
