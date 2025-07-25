import { chromium, FullConfig } from '@playwright/test';

/**
 * Setup global pour les tests E2E
 * Prépare l'environnement de test, les données de test et l'authentification
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Initialisation des tests E2E...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Configuration de l'URL de base
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
  
  try {
    // Vérifier que l'application est accessible
    console.log('🔍 Vérification de l\'accessibilité de l\'application...');
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    
    // Attendre que l'application soit chargée
    await page.waitForSelector('body', { timeout: 30000 });
    console.log('✅ Application accessible');
    
    // Créer des données de test
    await setupTestData(page, baseURL);
    
    // Configurer l'authentification pour les tests
    await setupAuthentication(page, baseURL);
    
    // Vider le cache et les cookies de test
    await setupCleanEnvironment(page);
    
    console.log('✅ Setup global terminé avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors du setup global:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

/**
 * Configuration des données de test
 */
async function setupTestData(page: any, baseURL: string) {
  console.log('📊 Configuration des données de test...');
  
  // Simuler des produits de test
  const testProducts = [
    {
      id: 'test-product-1',
      name: 'Veste Test Premium',
      price: 129.99,
      category: 'vestes',
      inStock: true,
      images: ['/images/test-product-1.jpg']
    },
    {
      id: 'test-product-2', 
      name: 'Pantalon Test Élégant',
      price: 89.99,
      category: 'pantalons',
      inStock: true,
      images: ['/images/test-product-2.jpg']
    },
    {
      id: 'test-product-3',
      name: 'Accessoire Test Unique',
      price: 39.99,
      category: 'accessoires',
      inStock: false,
      images: ['/images/test-product-3.jpg']
    }
  ];
  
  // Stocker dans localStorage pour les tests
  await page.evaluateOnNewDocument((products) => {
    window.localStorage.setItem('test-products', JSON.stringify(products));
  }, testProducts);
  
  // Configurer les données utilisateur de test
  const testUser = {
    id: 'test-user-123',
    email: 'test@example.com',
    name: 'Utilisateur Test',
    preferences: {
      newsletter: true,
      notifications: false,
      language: 'fr'
    },
    cart: [],
    wishlist: [],
    orders: []
  };
  
  await page.evaluateOnNewDocument((user) => {
    window.localStorage.setItem('test-user', JSON.stringify(user));
  }, testUser);
  
  console.log('✅ Données de test configurées');
}

/**
 * Configuration de l'authentification
 */
async function setupAuthentication(page: any, baseURL: string) {
  console.log('🔐 Configuration de l\'authentification...');
  
  // Session de test pour les tests authentifiés
  const testSession = {
    sessionId: 'test-session-' + Date.now(),
    userId: 'test-user-123',
    authenticated: true,
    expires: Date.now() + (24 * 60 * 60 * 1000) // 24h
  };
  
  // Stocker la session de test
  await page.evaluateOnNewDocument((session) => {
    window.localStorage.setItem('test-session', JSON.stringify(session));
    // Simuler les cookies d'authentification
    document.cookie = `auth-token=test-token-${session.sessionId}; path=/; max-age=86400`;
  }, testSession);
  
  console.log('✅ Authentification configurée');
}

/**
 * Nettoyage de l'environnement de test
 */
async function setupCleanEnvironment(page: any) {
  console.log('🧹 Nettoyage de l\'environnement...');
  
  // Nettoyer les données persistantes qui pourraient affecter les tests
  await page.evaluateOnNewDocument(() => {
    // Nettoyer le cache de l'application
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('test')) {
            caches.delete(name);
          }
        });
      });
    }
    
    // Réinitialiser les préférences d'analytics
    window.localStorage.removeItem('analytics-preferences');
    window.localStorage.removeItem('user-behavior-data');
    
    // Désactiver les animations pour les tests plus rapides
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-delay: -0.01ms !important;
        transition-duration: 0.01ms !important;
        transition-delay: -0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  });
  
  console.log('✅ Environnement nettoyé');
}

export default globalSetup;