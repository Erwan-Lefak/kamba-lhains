/**
 * Meta Conversions API (CAPI) Service
 * Server-side tracking pour compléter le Meta Pixel client-side
 *
 * Utilise le SDK officiel facebook-nodejs-business-sdk pour:
 * - Normalisation automatique des données PII
 * - Hashage SHA-256 automatique
 * - Meilleure gestion des erreurs
 *
 * Documentation: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import {
  EventRequest,
  UserData,
  CustomData,
  ServerEvent,
  Content
} from 'facebook-nodejs-business-sdk';

interface CAPIEvent {
  event_name: string;
  event_time: number;
  event_source_url: string;
  user_data: {
    em?: string[];
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string;
    fbc?: string;
  };
  custom_data: {
    currency?: string;
    value?: string;
    content_ids?: string[];
    content_name?: string;
    content_type?: string;
    num_items?: string;
    order_id?: string;
  };
  action_source: 'physical_store' | 'app' | 'chat' | 'email' | 'other' | 'phone' | 'system' | 'website';
}

interface CAPIResponse {
  error?: {
    message: string;
    type: string;
    code: number;
  };
  eventsReceived?: number;
  fbTraceId?: string;
  messages?: string[];
  [key: string]: any; // Pour supporter les autres propriétés
}

const META_PIXEL_ID = '1495398438682010';
const META_ACCESS_TOKEN = process.env.META_CONVERSIONS_API_ACCESS_TOKEN || '';
const META_API_VERSION = 'v22.0'; // Dernière version stable Meta Graph API (2025)

/**
 * Envoie un événement à la Meta Conversions API (méthode legacy - garde compatibilité)
 */
export async function sendCAPIEvent(event: CAPIEvent): Promise<boolean> {
  // Vérifier si le token est configuré
  if (!META_ACCESS_TOKEN) {
    console.warn('Meta Conversions API: META_CONVERSIONS_API_ACCESS_TOKEN non configuré');
    return false;
  }

  try {
    const url = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [event],
        access_token: META_ACCESS_TOKEN,
      }),
    });

    const data: CAPIResponse = await response.json();

    if (data.error) {
      console.error('Meta Conversions API Error:', data.error);
      return false;
    }

    if (data.events_received) {
      console.log(`Meta CAPI: ${data.events_received} événement(s) envoyé(s) avec succès`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Meta Conversions API Request Error:', error);
    return false;
  }
}

/**
 * Track Purchase via Conversions API (version améliorée avec SDK)
 * Utilise le SDK officiel pour la normalisation et le hashage automatique
 */
export async function trackCAPIPurchase(params: {
  orderId: string;
  totalValue: number;
  currency?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl: string;
  eventId?: string; // Pour la déduplication
}): Promise<boolean> {
  if (!META_ACCESS_TOKEN) {
    console.warn('Meta Conversions API: META_CONVERSIONS_API_ACCESS_TOKEN non configuré');
    return false;
  }

  try {
    // Créer UserData avec le SDK (normalisation et hashage automatique)
    const userData = new UserData();

    // Email - SDK fait la normalisation et le hashage automatiquement
    if (params.email) {
      userData.setEmails([params.email]);
    }

    // Phone - normalisation et hashage automatique
    if (params.phone) {
      userData.setPhones([params.phone]);
    }

    // First Name - normalisation et hashage automatique
    if (params.firstName) {
      userData.setFirstName(params.firstName);
    }

    // Last Name - normalisation et hashage automatique
    if (params.lastName) {
      userData.setLastName(params.lastName);
    }

    // City - normalisation et hashage automatique
    if (params.city) {
      userData.setCity(params.city);
    }

    // Country - code ISO 3166-1 alpha-2, normalisation et hashage automatique
    if (params.country) {
      userData.setCountryCode(params.country);
    }

    // Zip Code - normalisation et hashage automatique
    if (params.zipCode) {
      userData.setZipCode(params.zipCode);
    }

    // Client IP address (NE PAS hasher)
    if (params.clientIp) {
      userData.setClientIpAddress(params.clientIp);
    }

    // Client User Agent (NE PAS hasher)
    if (params.userAgent) {
      userData.setClientUserAgent(params.userAgent);
    }

    // Facebook Click ID (NE PAS hasher)
    if (params.fbc) {
      userData.setFbc(params.fbc);
    }

    // Facebook Browser ID (NE PAS hasher)
    if (params.fbp) {
      userData.setFbp(params.fbp);
    }

    // Créer CustomData
    const customData = new CustomData()
      .setValue(params.totalValue)
      .setCurrency(params.currency || 'EUR')
      .setOrderId(params.orderId)
      .setContentType('product');

    // Créer ServerEvent
    const event = new ServerEvent()
      .setEventName('Purchase')
      .setEventTime(Math.floor(Date.now() / 1000))
      .setUserData(userData)
      .setCustomData(customData)
      .setEventSourceUrl(params.eventSourceUrl)
      .setActionSource('website');

    // Event ID optionnel pour la déduplication
    if (params.eventId) {
      event.setEventId(params.eventId);
    }

    // Créer et exécuter la requête avec le SDK
    const eventRequest = new EventRequest(META_ACCESS_TOKEN, META_PIXEL_ID)
      .setEvents([event]);

    const response = await eventRequest.execute();

    // Enhanced logging pour debugging
    console.log('Meta CAPI (SDK) Purchase Response:', {
      eventsReceived: response.eventsReceived || 0,
      fbTraceId: response.fbTraceId,
      messages: response.messages,
      eventId: params.eventId || 'none',
      timestamp: new Date().toISOString()
    });

    // Vérifications supplémentaires
    if (response.eventsReceived === 0) {
      console.warn('⚠️ Meta CAPI: Aucun événement reçu par Meta', {
        fbTraceId: response.fbTraceId,
        error: response.error
      });
    }

    if (response.messages && response.messages.length > 0) {
      console.warn('⚠️ Meta CAPI Warnings:', response.messages);
    }

    return (response.eventsReceived || 0) > 0;
  } catch (error) {
    console.error('Meta Conversions API (SDK) Error:', error);
    // Fallback vers l'ancienne méthode si le SDK échoue
    console.warn('Tentative de fallback vers la méthode legacy...');
    return trackCAPIPurchaseLegacy(params);
  }
}

/**
 * Track Purchase via Conversions API (méthode legacy - fallback)
 * Gardée pour compatibilité et fallback
 */
async function trackCAPIPurchaseLegacy(params: {
  orderId: string;
  totalValue: number;
  currency?: string;
  email?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl: string;
}): Promise<boolean> {
  const userData: any = {
    ...(params.clientIp && { client_ip_address: params.clientIp }),
    ...(params.userAgent && { client_user_agent: params.userAgent }),
    ...(params.fbp && { fbp: params.fbp }),
    ...(params.fbc && { fbc: params.fbc }),
  };

  if (params.email) {
    userData.em = [await hashEmail(params.email)];
  }

  const event: CAPIEvent = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: params.eventSourceUrl,
    user_data: userData,
    custom_data: {
      currency: params.currency || 'EUR',
      value: params.totalValue.toFixed(2),
      order_id: params.orderId,
      content_type: 'product',
    },
    action_source: 'website',
  };

  return await sendCAPIEvent(event);
}

/**
 * Track AddToCart via Conversions API (version améliorée avec SDK)
 */
export async function trackCAPIAddToCart(params: {
  productId: string;
  productName: string;
  price: number;
  quantity?: number;
  currency?: string;
  email?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl: string;
  eventId?: string;
}): Promise<boolean> {
  if (!META_ACCESS_TOKEN) {
    console.warn('Meta Conversions API: META_CONVERSIONS_API_ACCESS_TOKEN non configuré');
    return false;
  }

  try {
    const userData = new UserData();

    if (params.email) {
      userData.setEmails([params.email]);
    }

    if (params.clientIp) {
      userData.setClientIpAddress(params.clientIp);
    }

    if (params.userAgent) {
      userData.setClientUserAgent(params.userAgent);
    }

    if (params.fbc) {
      userData.setFbc(params.fbc);
    }

    if (params.fbp) {
      userData.setFbp(params.fbp);
    }

    const customData = new CustomData()
      .setValue(params.price * (params.quantity || 1))
      .setCurrency(params.currency || 'EUR')
      .setContentType('product')
      .setContents([new Content().setId(params.productId).setQuantity(params.quantity || 1)]);

    const event = new ServerEvent()
      .setEventName('AddToCart')
      .setEventTime(Math.floor(Date.now() / 1000))
      .setUserData(userData)
      .setCustomData(customData)
      .setEventSourceUrl(params.eventSourceUrl)
      .setActionSource('website');

    if (params.eventId) {
      event.setEventId(params.eventId);
    }

    const eventRequest = new EventRequest(META_ACCESS_TOKEN, META_PIXEL_ID)
      .setEvents([event]);

    const response = await eventRequest.execute();

    console.log('Meta CAPI (SDK) AddToCart Response:', {
      eventsReceived: response.eventsReceived || 0,
      fbTraceId: response.fbTraceId,
      messages: response.messages,
      eventId: params.eventId || 'none',
      timestamp: new Date().toISOString()
    });

    if (response.eventsReceived === 0) {
      console.warn('⚠️ Meta CAPI: Aucun événement AddToCart reçu', {
        fbTraceId: response.fbTraceId,
        error: response.error
      });
    }

    if (response.messages && response.messages.length > 0) {
      console.warn('⚠️ Meta CAPI Warnings:', response.messages);
    }

    return (response.eventsReceived || 0) > 0;
  } catch (error) {
    console.error('Meta Conversions API (SDK) Error:', error);
    return false;
  }
}

/**
 * Track ViewContent via Conversions API (version améliorée avec SDK)
 */
export async function trackCAPIViewContent(params: {
  productId: string;
  productName: string;
  price: number;
  currency?: string;
  email?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl: string;
  eventId?: string;
}): Promise<boolean> {
  if (!META_ACCESS_TOKEN) {
    console.warn('Meta Conversions API: META_CONVERSIONS_API_ACCESS_TOKEN non configuré');
    return false;
  }

  try {
    const userData = new UserData();

    if (params.email) {
      userData.setEmails([params.email]);
    }

    if (params.clientIp) {
      userData.setClientIpAddress(params.clientIp);
    }

    if (params.userAgent) {
      userData.setClientUserAgent(params.userAgent);
    }

    if (params.fbc) {
      userData.setFbc(params.fbc);
    }

    if (params.fbp) {
      userData.setFbp(params.fbp);
    }

    const customData = new CustomData()
      .setValue(params.price)
      .setCurrency(params.currency || 'EUR')
      .setContentType('product')
      .setContents([new Content().setId(params.productId)]);

    const event = new ServerEvent()
      .setEventName('ViewContent')
      .setEventTime(Math.floor(Date.now() / 1000))
      .setUserData(userData)
      .setCustomData(customData)
      .setEventSourceUrl(params.eventSourceUrl)
      .setActionSource('website');

    if (params.eventId) {
      event.setEventId(params.eventId);
    }

    const eventRequest = new EventRequest(META_ACCESS_TOKEN, META_PIXEL_ID)
      .setEvents([event]);

    const response = await eventRequest.execute();

    console.log('Meta CAPI (SDK) ViewContent Response:', {
      eventsReceived: response.eventsReceived || 0,
      fbTraceId: response.fbTraceId,
      messages: response.messages,
      eventId: params.eventId || 'none',
      timestamp: new Date().toISOString()
    });

    if (response.eventsReceived === 0) {
      console.warn('⚠️ Meta CAPI: Aucun événement ViewContent reçu', {
        fbTraceId: response.fbTraceId,
        error: response.error
      });
    }

    if (response.messages && response.messages.length > 0) {
      console.warn('⚠️ Meta CAPI Warnings:', response.messages);
    }

    return (response.eventsReceived || 0) > 0;
  } catch (error) {
    console.error('Meta Conversions API (SDK) Error:', error);
    return false;
  }
}

/**
 * Track InitiateCheckout via Conversions API (version améliorée avec SDK)
 */
export async function trackCAPIInitiateCheckout(params: {
  totalValue: number;
  numItems: number;
  currency?: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl: string;
  eventId?: string;
}): Promise<boolean> {
  if (!META_ACCESS_TOKEN) {
    console.warn('Meta Conversions API: META_CONVERSIONS_API_ACCESS_TOKEN non configuré');
    return false;
  }

  try {
    const userData = new UserData();

    if (params.email) {
      userData.setEmails([params.email]);
    }

    if (params.phone) {
      userData.setPhones([params.phone]);
    }

    if (params.clientIp) {
      userData.setClientIpAddress(params.clientIp);
    }

    if (params.userAgent) {
      userData.setClientUserAgent(params.userAgent);
    }

    if (params.fbc) {
      userData.setFbc(params.fbc);
    }

    if (params.fbp) {
      userData.setFbp(params.fbp);
    }

    const customData = new CustomData()
      .setValue(params.totalValue)
      .setCurrency(params.currency || 'EUR')
      .setNumItems(params.numItems)
      .setContentType('product');

    const event = new ServerEvent()
      .setEventName('InitiateCheckout')
      .setEventTime(Math.floor(Date.now() / 1000))
      .setUserData(userData)
      .setCustomData(customData)
      .setEventSourceUrl(params.eventSourceUrl)
      .setActionSource('website');

    if (params.eventId) {
      event.setEventId(params.eventId);
    }

    const eventRequest = new EventRequest(META_ACCESS_TOKEN, META_PIXEL_ID)
      .setEvents([event]);

    const response = await eventRequest.execute();

    // Enhanced logging pour debugging
    console.log('Meta CAPI (SDK) InitiateCheckout Response:', {
      eventsReceived: response.eventsReceived || 0,
      fbTraceId: response.fbTraceId,
      messages: response.messages,
      eventId: params.eventId || 'none',
      timestamp: new Date().toISOString()
    });

    if (response.eventsReceived === 0) {
      console.warn('⚠️ Meta CAPI: Aucun événement InitiateCheckout reçu', {
        fbTraceId: response.fbTraceId,
        error: response.error
      });
    }

    if (response.messages && response.messages.length > 0) {
      console.warn('⚠️ Meta CAPI Warnings:', response.messages);
    }

    return (response.eventsReceived || 0) > 0;
  } catch (error) {
    console.error('Meta Conversions API (SDK) Error:', error);
    return false;
  }
}

/**
 * Hash un email selon les spécifications Meta (SHA-256)
 * NOTE: Le SDK fait cela automatiquement, cette fonction est gardée pour compatibilité
 * Documentation: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters
 */
async function hashEmail(email: string): Promise<string> {
  const crypto = require('crypto');

  // Étape 1: Normalisation de l'email
  const normalized = email.trim().toLowerCase();

  // Étape 2: Hash SHA-256
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Extrait le fbp et fbc depuis les cookies
 * Amélioré pour mieux gérer différents formats de cookies
 */
export function extractMetaCookies(req: any): { fbp?: string; fbc?: string } {
  let cookies: Record<string, string> = {};

  // Essayer différentes sources de cookies
  if (req.headers.cookie) {
    // Parser les cookies depuis le header
    req.headers.cookie.split(';').forEach((cookie: string) => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  } else if (req.cookies) {
    // Cookies déjà parsés (Next.js)
    cookies = req.cookies;
  }

  return {
    fbp: cookies._fbp,
    fbc: cookies._fbc,
  };
}

/**
 * Normalise et hash un numéro de téléphone selon les specs Meta
 * Format attendu: +33612345678 ou 0612345678
 */
export async function normalizeAndHashPhone(phone: string): Promise<string> {
  // Utiliser les utilitaires du SDK si disponibles
  const crypto = require('crypto');

  // Normaliser: enlever tout sauf les chiffres et le +
  let normalized = phone.replace(/[^\d+]/g, '');

  // Ajouter le + si absent et si numéro français (06 ou 07)
  if (!normalized.startsWith('+') && normalized.startsWith('0')) {
    normalized = '+33' + normalized.substring(1);
  }

  // Hash SHA-256
  return crypto.createHash('sha256').update(normalized.toLowerCase()).digest('hex');
}

/**
 * Génère un eventID unique pour la déduplication Pixel/CAPI
 * Format: {event_type}_{timestamp}_{random}
 */
export function generateEventId(eventType: string): string {
  return `${eventType}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
