import { useEffect } from 'react';
import { useRouter } from 'next/router';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export const MetaPixel = () => {
  // Le composant ne fait plus rien - tout est géré dans _document.tsx et les pages individuelles
  return null;
};

// Helper functions to track Meta Pixel events

/**
 * Génère un eventId unique pour la déduplication Pixel/CAPI
 * Format: {event_type}_{timestamp}_{random}
 */
export const generateMetaEventId = (eventType: string): string => {
  return `${eventType}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

/**
 * Track un événement Meta Pixel basique
 */
export const trackMetaEvent = (eventName: string, parameters: any = {}, eventId?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    if (eventId) {
      // Avec eventID pour déduplication Pixel/CAPI
      window.fbq('track', eventName, parameters, { eventID: eventId });
    } else {
      // Sans eventID
      window.fbq('track', eventName, parameters);
    }
  }
};

/**
 * Track ViewContent - AVEC déduplication Pixel/CAPI
 * @returns eventId à passer au CAPI pour déduplication
 */
export const trackMetaViewContent = (productId: string, productName: string, price: number, currency: string = 'EUR', metaContentId?: string): string => {
  const eventId = generateMetaEventId('ViewContent');

  // Utiliser metaContentId si disponible, sinon productId
  const contentId = metaContentId || productId;

  trackMetaEvent('ViewContent', {
    content_ids: [contentId],
    content_name: productName,
    content_type: 'product',
    value: price,
    currency: currency
  }, eventId);

  return eventId; // Retourner pour utilisation CAPI
};

/**
 * Track AddToCart - AVEC déduplication Pixel/CAPI
 * @returns eventId à passer au CAPI pour déduplication
 */
export const trackMetaAddToCart = (productId: string, productName: string, price: number, quantity: number = 1, currency: string = 'EUR', metaContentId?: string): string => {
  const eventId = `AddToCart_${productId}_${Date.now()}`;

  // Utiliser metaContentId si disponible, sinon productId
  const contentId = metaContentId || productId;

  trackMetaEvent('AddToCart', {
    content_ids: [contentId],
    content_name: productName,
    content_type: 'product',
    value: price * quantity,
    currency: currency
  }, eventId);

  return eventId; // Retourner pour utilisation CAPI
};

/**
 * Track InitiateCheckout - AVEC déduplication Pixel/CAPI
 * @returns eventId à passer au CAPI pour déduplication
 */
export const trackMetaInitiateCheckout = (totalValue: number, numItems: number, currency: string = 'EUR'): string => {
  const eventId = generateMetaEventId('InitiateCheckout');

  trackMetaEvent('InitiateCheckout', {
    value: totalValue,
    currency: currency,
    num_items: numItems,
    content_type: 'product'
  }, eventId);

  return eventId; // Retourner pour utilisation CAPI
};

/**
 * Track Purchase - AVEC déduplication Pixel/CAPI
 * @returns eventId à passer au CAPI pour déduplication
 */
export const trackMetaPurchase = (orderId: string, totalValue: number, currency: string = 'EUR'): string => {
  const eventId = `Purchase_${orderId}_${Date.now()}`; // Basé sur orderId pour cohérence

  trackMetaEvent('Purchase', {
    value: totalValue,
    currency: currency,
    content_type: 'product',
    order_id: orderId
  }, eventId);

  return eventId; // Retourner pour utilisation CAPI
};
