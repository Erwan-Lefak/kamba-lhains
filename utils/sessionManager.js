/**
 * Gestionnaire de session pour le tracking des visiteurs
 */

const SESSION_KEY = 'visitor_session_id';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Génère un ID de session unique
 */
export function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Récupère ou crée un ID de session
 */
export function getSessionId() {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(SESSION_KEY);

    if (stored) {
      const { sessionId, timestamp } = JSON.parse(stored);
      const now = Date.now();

      // Vérifier si la session n'a pas expiré
      if (now - timestamp < SESSION_DURATION) {
        // Mettre à jour le timestamp pour prolonger la session
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
          sessionId,
          timestamp: now
        }));
        return sessionId;
      }
    }

    // Créer une nouvelle session
    const newSessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      sessionId: newSessionId,
      timestamp: Date.now()
    }));

    return newSessionId;
  } catch (error) {
    console.error('Error managing session:', error);
    return generateSessionId();
  }
}

/**
 * Track une vue de page
 * @param {string} page - The page path
 * @param {string|null|undefined} userId - The user ID if logged in
 */
export async function trackPageView(page, userId) {
  if (typeof window === 'undefined') return;

  try {
    const sessionId = getSessionId();

    await fetch('/api/track-page-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        page,
        userId: userId || null,
        userAgent: navigator.userAgent
      })
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track un ajout au panier
 * @param {string} productId - The product ID
 * @param {string|null|undefined} userId - The user ID if logged in
 */
export async function trackAddToCart(productId, userId) {
  if (typeof window === 'undefined') return;

  try {
    const sessionId = getSessionId();

    await fetch('/api/track-add-to-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        productId,
        userId: userId || null
      })
    });
  } catch (error) {
    console.error('Error tracking add to cart:', error);
  }
}

/**
 * Track un paiement initié (checkout)
 * @param {string|null|undefined} userId - The user ID if logged in
 */
export async function trackCheckoutInitiated(userId) {
  if (typeof window === 'undefined') return;

  try {
    const sessionId = getSessionId();

    await fetch('/api/track-checkout-initiated', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        userId: userId || null
      })
    });
  } catch (error) {
    console.error('Error tracking checkout initiated:', error);
  }
}
