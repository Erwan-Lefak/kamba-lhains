/**
 * Meta Conversions API Helper Functions
 * Fonctions pour envoyer des événements serveur depuis le client
 */

/**
 * Envoie un événement Purchase à la Conversions API
 * @param {Object} params - Paramètres de l'achat
 * @param {string} params.orderId - ID de la commande
 * @param {number} params.totalValue - Montant total
 * @param {string} [params.currency='EUR'] - Devise
 * @param {string} [params.email] - Email client (optionnel)
 * @param {string} [params.eventId] - Event ID pour déduplication Pixel/CAPI (optionnel)
 */
export async function sendCAPIPurchase(params) {
  try {
    await fetch('/api/meta/conversions-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'Purchase',
        params: {
          ...params,
          eventSourceUrl: window.location.href,
        },
      }),
    });
  } catch (error) {
    console.error('Erreur envoi CAPI Purchase:', error);
  }
}

/**
 * Envoie un événement InitiateCheckout à la Conversions API
 * @param {Object} params - Paramètres du checkout
 * @param {number} params.totalValue - Montant total
 * @param {number} params.numItems - Nombre d'articles
 * @param {string} [params.currency='EUR'] - Devise
 * @param {string} [params.email] - Email client (optionnel)
 * @param {string} [params.eventId] - Event ID pour déduplication Pixel/CAPI (optionnel)
 */
export async function sendCAPIInitiateCheckout(params) {
  try {
    await fetch('/api/meta/conversions-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'InitiateCheckout',
        params: {
          ...params,
          eventSourceUrl: window.location.href,
        },
      }),
    });
  } catch (error) {
    console.error('Erreur envoi CAPI InitiateCheckout:', error);
  }
}

/**
 * Envoie un événement AddToCart à la Conversions API
 * @param {Object} params - Paramètres de l'ajout au panier
 * @param {string} params.productId - ID du produit
 * @param {string} params.productName - Nom du produit
 * @param {number} params.price - Prix unitaire
 * @param {number} [params.quantity=1] - Quantité
 * @param {string} [params.currency='EUR'] - Devise
 * @param {string} [params.eventId] - Event ID pour déduplication Pixel/CAPI (optionnel)
 */
export async function sendCAPIAddToCart(params) {
  try {
    await fetch('/api/meta/conversions-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'AddToCart',
        params: {
          ...params,
          eventSourceUrl: window.location.href,
        },
      }),
    });
  } catch (error) {
    console.error('Erreur envoi CAPI AddToCart:', error);
  }
}

/**
 * Envoie un événement ViewContent à la Conversions API
 * @param {Object} params - Paramètres de la vue
 * @param {string} params.productId - ID du produit
 * @param {string} params.productName - Nom du produit
 * @param {number} params.price - Prix
 * @param {string} [params.currency='EUR'] - Devise
 * @param {string} [params.eventId] - Event ID pour déduplication Pixel/CAPI (optionnel)
 */
export async function sendCAPIViewContent(params) {
  try {
    await fetch('/api/meta/conversions-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'ViewContent',
        params: {
          ...params,
          eventSourceUrl: window.location.href,
        },
      }),
    });
  } catch (error) {
    console.error('Erreur envoi CAPI ViewContent:', error);
  }
}
