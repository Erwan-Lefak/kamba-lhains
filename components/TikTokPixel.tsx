import { useEffect } from 'react';
import { useRouter } from 'next/router';

declare global {
  interface Window {
    ttq: any;
  }
}

const TIKTOK_PIXEL_ID = 'D3UBE0BC77U413QPA75G';

export const TikTokPixel = () => {
  const router = useRouter();

  useEffect(() => {
    // Initialize TikTok Pixel
    if (typeof window !== 'undefined') {
      (function(w: any, d: Document, t: string) {
        w.TiktokAnalyticsObject = t;
        const ttq = w[t] = w[t] || [];
        ttq.methods = [
          'page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'
        ];
        ttq.setAndDefer = function(t: any, e: any) {
          t[e] = function() {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        for (let i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(ttq, ttq.methods[i]);
        }
        ttq.instance = function(t: string) {
          const e = ttq._i[t] || [];
          for (let n = 0; n < ttq.methods.length; n++) {
            ttq.setAndDefer(e, ttq.methods[n]);
          }
          return e;
        };
        ttq.load = function(e: string, n?: any) {
          const i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
          ttq._i = ttq._i || {};
          ttq._i[e] = [];
          ttq._i[e]._u = i;
          ttq._t = ttq._t || {};
          ttq._t[e] = +new Date();
          ttq._o = ttq._o || {};
          ttq._o[e] = n || {};
          const o = document.createElement('script');
          o.type = 'text/javascript';
          o.async = true;
          o.src = i + '?sdkid=' + e + '&lib=' + t;
          const a = document.getElementsByTagName('script')[0];
          a.parentNode?.insertBefore(o, a);
        };

        ttq.load(TIKTOK_PIXEL_ID);
        ttq.page();
      })(window, document, 'ttq');
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      if (window.ttq) {
        window.ttq.page();
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return null;
};

// Helper functions to track events with value parameter
export const trackTikTokEvent = (eventName: string, properties: any = {}) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(eventName, properties);
  }
};

export const trackViewContent = (productId: string, productName: string, price: number, currency: string = 'EUR') => {
  trackTikTokEvent('ViewContent', {
    content_type: 'product',
    content_id: productId,
    content_name: productName,
    value: price,
    currency: currency
  });
};

export const trackAddToCart = (productId: string, productName: string, price: number, quantity: number = 1, currency: string = 'EUR') => {
  trackTikTokEvent('AddToCart', {
    content_type: 'product',
    content_id: productId,
    content_name: productName,
    quantity: quantity,
    value: price * quantity,
    currency: currency
  });
};

export const trackInitiateCheckout = (totalValue: number, numItems: number, currency: string = 'EUR') => {
  trackTikTokEvent('InitiateCheckout', {
    value: totalValue,
    currency: currency,
    num_items: numItems
  });
};

export const trackCompletePayment = (orderId: string, totalValue: number, currency: string = 'EUR') => {
  trackTikTokEvent('CompletePayment', {
    value: totalValue,
    currency: currency,
    content_type: 'product',
    order_id: orderId
  });
};

export const trackSearch = (searchQuery: string) => {
  trackTikTokEvent('Search', {
    query: searchQuery
  });
};
