import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Tests d'accessibilité (a11y)
 * Vérifie la conformité WCAG et l'accessibilité générale
 */

test.describe('Tests d\'Accessibilité', () => {
  test('Accessibilité de la page d\'accueil', async ({ page }) => {
    await page.goto('/');
    
    // Analyse avec axe-core
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Aucune violation critique ou sérieuse
    expect(accessibilityScanResults.violations.filter(v => 
      v.impact === 'critical' || v.impact === 'serious'
    )).toHaveLength(0);
    
    // Vérifications manuelles spécifiques
    
    // 1. Structure des headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings).toHaveLength({ min: 1 });
    
    // Il doit y avoir exactement un h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // 2. Images avec alt text
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const role = await img.getAttribute('role');
      
      // Chaque image doit avoir un alt ou aria-label, sauf si decorative
      if (role !== 'presentation' && role !== 'none') {
        expect(alt !== null || ariaLabel !== null).toBeTruthy();
      }
    }
    
    // 3. Liens avec texte descriptif
    const links = await page.locator('a').all();
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      // Chaque lien doit avoir un texte accessible
      expect(
        (text && text.trim().length > 0) || 
        (ariaLabel && ariaLabel.trim().length > 0) || 
        (title && title.trim().length > 0)
      ).toBeTruthy();
    }
    
    // 4. Boutons avec labels
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      expect(
        (text && text.trim().length > 0) || 
        (ariaLabel && ariaLabel.trim().length > 0)
      ).toBeTruthy();
    }
  });

  test('Navigation au clavier', async ({ page }) => {
    await page.goto('/');
    
    // Test de navigation avec Tab
    await page.keyboard.press('Tab');
    
    // Vérifier qu'un élément a le focus
    let focusedElement = await page.locator(':focus').first();
    await expect(focusedElement).toBeVisible();
    
    // Naviguer à travers plusieurs éléments
    const tabStops = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      
      const currentFocus = await page.evaluate(() => {
        const focused = document.activeElement;
        return {
          tagName: focused?.tagName,
          type: focused?.getAttribute('type'),
          role: focused?.getAttribute('role'),
          ariaLabel: focused?.getAttribute('aria-label'),
          text: focused?.textContent?.trim().substring(0, 50)
        };
      });
      
      tabStops.push(currentFocus);
    }
    
    // Vérifier qu'on peut naviguer entre les éléments
    expect(tabStops.filter(stop => stop.tagName !== 'BODY')).toHaveLength({ min: 5 });
    
    // Test de navigation Shift+Tab (retour)
    await page.keyboard.press('Shift+Tab');
    const previousElement = await page.locator(':focus').first();
    await expect(previousElement).toBeVisible();
    
    // Test d'activation avec Enter/Space
    const interactiveElement = page.locator('button, a, [role="button"]').first();
    if (await interactiveElement.isVisible()) {
      await interactiveElement.focus();
      
      // Tester l'activation avec Enter
      await page.keyboard.press('Enter');
      
      // L'élément doit réagir (changement d'URL, ouverture de modal, etc.)
      await page.waitForTimeout(500);
    }
  });

  test('Contraste des couleurs', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier le contraste via axe
    const contrastResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    const contrastViolations = contrastResults.violations.filter(v => 
      v.id.includes('color-contrast')
    );
    
    expect(contrastViolations).toHaveLength(0);
    
    // Tests manuels de contraste pour les éléments critiques
    const criticalElements = [
      'h1, h2, h3',
      'p',
      'a',
      'button',
      '.price',
      '.product-title'
    ];
    
    for (const selector of criticalElements) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const firstElement = elements.first();
        const styles = await firstElement.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize
          };
        });
        
        // Log pour inspection manuelle si nécessaire
        console.log(`Styles pour ${selector}:`, styles);
      }
    }
  });

  test('Formulaires accessibles', async ({ page }) => {
    // Aller à une page avec des formulaires (checkout ou contact)
    await page.goto('/');
    
    // Chercher une page avec formulaire
    const contactLink = page.locator('text=Contact, a[href*="contact"]').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
    } else {
      // Essayer d'aller au checkout
      await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    }
    
    // Vérifier les champs de formulaire
    const inputs = await page.locator('input, textarea, select').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      
      // Chaque input doit avoir un label associé
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        
        expect(
          hasLabel || 
          ariaLabel !== null || 
          ariaLabelledby !== null
        ).toBeTruthy();
      }
      
      // Vérifier les messages d'erreur
      const ariaDescribedby = await input.getAttribute('aria-describedby');
      if (ariaDescribedby) {
        const errorElement = page.locator(`#${ariaDescribedby}`);
        await expect(errorElement).toBeVisible();
      }
    }
  });

  test('ARIA et sémantique', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier les landmarks ARIA
    const landmarks = [
      'main',
      'header', 
      'nav',
      'footer'
    ];
    
    for (const landmark of landmarks) {
      const element = page.locator(landmark).first();
      if (await element.count() > 0) {
        await expect(element).toBeVisible();
      }
    }
    
    // Vérifier les rôles ARIA appropriés
    const interactiveElements = await page.locator('[role]').all();
    
    for (const element of interactiveElements) {
      const role = await element.getAttribute('role');
      const validRoles = [
        'button', 'link', 'menuitem', 'tab', 'tabpanel',
        'dialog', 'alert', 'status', 'region', 'banner',
        'navigation', 'main', 'complementary', 'contentinfo'
      ];
      
      if (role) {
        expect(validRoles).toContain(role);
      }
    }
    
    // Vérifier les états ARIA
    const statefulElements = await page.locator('[aria-expanded], [aria-selected], [aria-checked]').all();
    
    for (const element of statefulElements) {
      const ariaExpanded = await element.getAttribute('aria-expanded');
      const ariaSelected = await element.getAttribute('aria-selected');
      const ariaChecked = await element.getAttribute('aria-checked');
      
      // Les valeurs doivent être 'true' ou 'false'
      if (ariaExpanded) {
        expect(['true', 'false']).toContain(ariaExpanded);
      }
      if (ariaSelected) {
        expect(['true', 'false']).toContain(ariaSelected);
      }
      if (ariaChecked) {
        expect(['true', 'false', 'mixed']).toContain(ariaChecked);
      }
    }
  });

  test('Lecteurs d\'écran et annonces', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier les régions live pour les annonces dynamiques
    const liveRegions = await page.locator('[aria-live], [role="status"], [role="alert"]').all();
    
    for (const region of liveRegions) {
      const ariaLive = await region.getAttribute('aria-live');
      const role = await region.getAttribute('role');
      
      if (ariaLive) {
        expect(['polite', 'assertive', 'off']).toContain(ariaLive);
      }
    }
    
    // Simuler l'ajout d'un produit au panier pour tester les annonces
    const productCard = page.locator('[data-testid="product-card"]').first();
    if (await productCard.isVisible()) {
      await productCard.click();
      
      const addToCartButton = page.locator('[data-testid="add-to-cart"]');
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();
        
        // Vérifier qu'une annonce est faite
        const notification = page.locator('[role="status"], [role="alert"], .toast');
        await expect(notification).toBeVisible();
        
        const notificationText = await notification.textContent();
        expect(notificationText).toBeTruthy();
        expect(notificationText!.length).toBeGreaterThan(0);
      }
    }
  });

  test('Responsive et accessibilité mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('Test uniquement pour mobile');
    }
    
    await page.goto('/');
    
    // Vérifier que les éléments tactiles ont une taille minimum
    const touchTargets = await page.locator('button, a, [role="button"], input').all();
    
    for (const target of touchTargets) {
      if (await target.isVisible()) {
        const box = await target.boundingBox();
        if (box) {
          // WCAG recommande 44px minimum pour les cibles tactiles
          expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
        }
      }
    }
    
    // Vérifier l'espacement entre les éléments tactiles
    const buttons = await page.locator('button').all();
    if (buttons.length > 1) {
      const firstBox = await buttons[0].boundingBox();
      const secondBox = await buttons[1].boundingBox();
      
      if (firstBox && secondBox) {
        const distance = Math.sqrt(
          Math.pow(secondBox.x - firstBox.x, 2) + 
          Math.pow(secondBox.y - firstBox.y, 2)
        );
        
        // Distance minimum recommandée entre les cibles tactiles
        expect(distance).toBeGreaterThanOrEqual(8);
      }
    }
  });

  test('Mode sombre et préférences d\'accessibilité', async ({ page }) => {
    // Tester avec les préférences système
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    
    // Vérifier que le mode sombre fonctionne
    const bodyStyles = await page.locator('body').evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color
      };
    });
    
    // En mode sombre, l'arrière-plan devrait être sombre
    console.log('Styles en mode sombre:', bodyStyles);
    
    // Tester avec réduction de mouvement
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    
    // Les animations devraient être réduites ou désactivées
    const animatedElement = page.locator('.animated, [class*="motion"], [class*="transition"]').first();
    if (await animatedElement.isVisible()) {
      const animationStyles = await animatedElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          animationDuration: computed.animationDuration,
          transitionDuration: computed.transitionDuration
        };
      });
      
      console.log('Styles avec mouvement réduit:', animationStyles);
    }
    
    // Tester avec contraste élevé
    await page.emulateMedia({ forcedColors: 'active' });
    await page.reload();
    
    // Vérifier que l'interface reste utilisable en mode contraste élevé
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });
});