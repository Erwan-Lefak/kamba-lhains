import { test, expect } from '@playwright/test';

/**
 * Tests de performance E2E
 * Vérifie les Core Web Vitals et les métriques de performance
 */

test.describe('Tests de Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Configuration pour mesurer les performances
    await page.addInitScript(() => {
      // Observer les Core Web Vitals
      (window as any).performanceMetrics = {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        ttfb: 0
      };
      
      // Observer LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            (window as any).performanceMetrics.lcp = lastEntry.startTime;
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {}
      }
      
      // Observer FID (First Input Delay)
      if ('PerformanceObserver' in window) {
        try {
          const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              (window as any).performanceMetrics.fid = entry.processingStart - entry.startTime;
            }
          });
          fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (e) {}
      }
      
      // Observer CLS (Cumulative Layout Shift)
      if ('PerformanceObserver' in window) {
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            (window as any).performanceMetrics.cls = clsValue;
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {}
      }
    });
  });

  test('Performance de la page d\'accueil', async ({ page }) => {
    const startTime = Date.now();
    
    // Naviguer vers la page d'accueil
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Vérifier que la page se charge en moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
    
    // Attendre que les métriques soient collectées
    await page.waitForTimeout(2000);
    
    // Récupérer les métriques de performance
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      const customMetrics = (window as any).performanceMetrics || {};
      
      return {
        // Métriques de navigation
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        
        // Métriques de paint
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        
        // Core Web Vitals
        lcp: customMetrics.lcp || 0,
        fid: customMetrics.fid || 0,
        cls: customMetrics.cls || 0,
        
        // Métriques de ressources
        totalResources: performance.getEntriesByType('resource').length
      };
    });
    
    console.log('Métriques de performance page d\'accueil:', metrics);
    
    // Assertions sur les Core Web Vitals
    expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s (bon)
    expect(metrics.fcp).toBeLessThan(1800); // FCP < 1.8s
    expect(metrics.cls).toBeLessThan(0.1);  // CLS < 0.1 (bon)
    expect(metrics.ttfb).toBeLessThan(800); // TTFB < 800ms
    
    // Vérifier le nombre de ressources (éviter trop de requêtes)
    expect(metrics.totalResources).toBeLessThan(50);
  });

  test('Performance de la page produit', async ({ page }) => {
    await page.goto('/boutique');
    
    // Cliquer sur le premier produit
    const productCard = page.locator('[data-testid="product-card"]').first();
    await expect(productCard).toBeVisible();
    
    const startTime = Date.now();
    await productCard.click();
    
    // Attendre que la page produit soit chargée
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    // La navigation vers une page produit doit être rapide
    expect(loadTime).toBeLessThan(2000);
    
    // Vérifier les métriques spécifiques à la page produit
    const metrics = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      let imagesLoaded = 0;
      
      images.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
          imagesLoaded++;
        }
      });
      
      return {
        totalImages: images.length,
        imagesLoaded,
        imageLoadRatio: imagesLoaded / images.length
      };
    });
    
    // Au moins 80% des images doivent être chargées
    expect(metrics.imageLoadRatio).toBeGreaterThan(0.8);
  });

  test('Performance du moteur de recherche', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('[data-testid="search-input"]');
    
    if (await searchInput.isVisible()) {
      // Mesurer le temps de réponse de la recherche
      const startTime = Date.now();
      
      await searchInput.fill('veste');
      
      // Attendre les résultats de recherche
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
      
      const searchTime = Date.now() - startTime;
      
      // La recherche doit être rapide (< 1s)
      expect(searchTime).toBeLessThan(1000);
      
      // Vérifier qu'il y a des résultats
      const resultCount = await page.locator('[data-testid="product-card"]').count();
      expect(resultCount).toBeGreaterThan(0);
    } else {
      test.skip('Fonction de recherche non disponible');
    }
  });

  test('Performance du panier et checkout', async ({ page }) => {
    await page.goto('/boutique');
    
    // Ajouter un produit au panier
    const productCard = page.locator('[data-testid="product-card"]').first();
    await productCard.click();
    
    const addToCartButton = page.locator('[data-testid="add-to-cart"]');
    if (await addToCartButton.isVisible()) {
      const startTime = Date.now();
      await addToCartButton.click();
      
      // Attendre la confirmation d'ajout
      await expect(page.locator('.toast, [data-testid="cart-notification"]')).toBeVisible();
      const addToCartTime = Date.now() - startTime;
      
      // L'ajout au panier doit être instantané
      expect(addToCartTime).toBeLessThan(500);
      
      // Tester l'ouverture du panier
      const cartStartTime = Date.now();
      await page.click('[data-testid="cart-button"]');
      await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
      const cartOpenTime = Date.now() - cartStartTime;
      
      // L'ouverture du panier doit être rapide
      expect(cartOpenTime).toBeLessThan(300);
    }
  });

  test('Performance responsive mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('Test uniquement pour mobile');
    }
    
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Sur mobile, la performance peut être légèrement réduite mais reste acceptable
    expect(loadTime).toBeLessThan(4000);
    
    // Tester le scroll performance
    const scrollStartTime = Date.now();
    
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    // Attendre la fin du scroll
    await page.waitForTimeout(1000);
    const scrollTime = Date.now() - scrollStartTime;
    
    // Le scroll doit être fluide
    expect(scrollTime).toBeLessThan(2000);
  });

  test('Performance des animations et interactions', async ({ page }) => {
    await page.goto('/');
    
    // Tester les animations au hover
    const animatedElements = page.locator('[data-testid="product-card"], .interactive-button, .hover-effect');
    
    if (await animatedElements.count() > 0) {
      const element = animatedElements.first();
      
      // Mesurer le temps de réponse au hover
      const hoverStartTime = Date.now();
      await element.hover();
      
      // Attendre que l'animation se termine
      await page.waitForTimeout(300);
      const hoverTime = Date.now() - hoverStartTime;
      
      // Les animations doivent être fluides et rapides
      expect(hoverTime).toBeLessThan(500);
    }
    
    // Tester les micro-interactions
    const interactiveButtons = page.locator('.interactive-button, [data-testid="interactive-element"]');
    
    if (await interactiveButtons.count() > 0) {
      const button = interactiveButtons.first();
      
      const clickStartTime = Date.now();
      await button.click();
      await page.waitForTimeout(100);
      const clickTime = Date.now() - clickStartTime;
      
      // Les interactions doivent être immédiates
      expect(clickTime).toBeLessThan(200);
    }
  });

  test('Performance du système de recommandations', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que le système de recommandations se charge
    const recommendationEngine = page.locator('[data-testid="recommendation-engine"]');
    
    if (await recommendationEngine.isVisible()) {
      const startTime = Date.now();
      
      // Attendre que les recommandations soient chargées
      await expect(page.locator('[data-testid="recommended-product"]')).toHaveCount({ min: 1 });
      
      const recommendationTime = Date.now() - startTime;
      
      // Les recommandations doivent charger rapidement
      expect(recommendationTime).toBeLessThan(2000);
      
      // Vérifier qu'il y a bien des recommandations
      const recommendationCount = await page.locator('[data-testid="recommended-product"]').count();
      expect(recommendationCount).toBeGreaterThan(0);
      expect(recommendationCount).toBeLessThan(20); // Pas trop pour éviter la surcharge
    }
  });

  test('Analyse des ressources et optimisations', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Analyser les ressources chargées
    const resourceMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      
      const analysis = {
        totalResources: resources.length,
        images: resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)).length,
        scripts: resources.filter(r => r.name.match(/\.js$/i)).length,
        styles: resources.filter(r => r.name.match(/\.css$/i)).length,
        fonts: resources.filter(r => r.name.match(/\.(woff|woff2|ttf|otf)$/i)).length,
        totalSize: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0),
        largestResource: Math.max(...resources.map(r => r.transferSize || 0)),
        slowestResource: Math.max(...resources.map(r => r.duration || 0))
      };
      
      return analysis;
    });
    
    console.log('Analyse des ressources:', resourceMetrics);
    
    // Assertions sur l'optimisation des ressources
    expect(resourceMetrics.totalSize).toBeLessThan(5 * 1024 * 1024); // < 5MB total
    expect(resourceMetrics.largestResource).toBeLessThan(1024 * 1024); // < 1MB par ressource
    expect(resourceMetrics.slowestResource).toBeLessThan(3000); // < 3s pour charger une ressource
    
    // Vérifier un ratio raisonnable de types de ressources
    expect(resourceMetrics.images).toBeLessThan(30); // Pas trop d'images
    expect(resourceMetrics.scripts).toBeLessThan(20); // Pas trop de scripts
  });
});