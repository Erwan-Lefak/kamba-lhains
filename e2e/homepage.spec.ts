import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Vérifier que la page se charge
    await expect(page).toHaveTitle(/Kamba Lhains/);
    
    // Vérifier la présence des éléments clés
    await expect(page.locator('h1')).toBeVisible();
    
    // Vérifier que les images se chargent (pas d'erreurs 404)
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
    }
  });

  test('should have working navigation', async ({ page }) => {
    // Tester la navigation principale
    const navItems = [
      { text: 'Boutique', url: '/boutique' },
      { text: 'Collections', url: '/collections' },
      { text: 'About', url: '/about' },
      { text: 'Contact', url: '/contact' }
    ];

    for (const item of navItems) {
      const link = page.locator(`a[href="${item.url}"]`).first();
      if (await link.isVisible()) {
        await link.click();
        await page.waitForLoadState('networkidle');
        
        // Vérifier que nous sommes sur la bonne page
        expect(page.url()).toContain(item.url);
        
        // Retourner à l'accueil pour le test suivant
        await page.goto('/');
      }
    }
  });

  test('should have responsive design', async ({ page }) => {
    // Test sur desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test sur tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test sur mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Vérifier que le contenu s'adapte
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should load performance metrics', async ({ page }) => {
    // Naviguer vers la page
    const response = await page.goto('/');
    
    // Vérifier que la page se charge rapidement
    expect(response?.status()).toBe(200);
    
    // Mesurer les Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {
          FCP: 0,
          LCP: 0,
          CLS: 0,
          FID: 0
        };

        // First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.FCP = entry.startTime;
            }
          });
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.LCP = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          vitals.CLS = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });

        setTimeout(() => resolve(vitals), 3000);
      });
    });

    console.log('Web Vitals:', webVitals);
    
    // Vérifier que les métriques sont dans des plages acceptables
    // (Ces valeurs peuvent être ajustées selon les besoins)
    expect((webVitals as any).FCP).toBeLessThan(3000); // FCP < 3s
    expect((webVitals as any).LCP).toBeLessThan(4000); // LCP < 4s
    expect((webVitals as any).CLS).toBeLessThan(0.25); // CLS < 0.25
  });
});