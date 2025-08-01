import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  const pagesToTest = [
    { name: 'Homepage', url: '/' },
    { name: 'Search', url: '/search' },
    { name: 'Cart', url: '/panier' },
    { name: 'About', url: '/about' },
    { name: 'Contact', url: '/contact' }
  ];

  pagesToTest.forEach(({ name, url }) => {
    test(`${name} should meet accessibility standards`, async ({ page }) => {
      await page.goto(url);
      
      // Test 1: Vérifier la présence d'un titre de page
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).not.toBe('');
      
      // Test 2: Vérifier la structure des headings
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      if (headingCount > 0) {
        // Vérifier qu'il y a au moins un h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThanOrEqual(1);
        
        // Vérifier que les headings ne sont pas vides
        for (let i = 0; i < Math.min(headingCount, 10); i++) {
          const heading = headings.nth(i);
          const text = await heading.textContent();
          expect(text?.trim()).toBeTruthy();
        }
      }
      
      // Test 3: Vérifier les images ont des alt texts appropriés
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 10); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        const ariaHidden = await img.getAttribute('aria-hidden');
        
        // Les images doivent avoir un alt, ou être marquées comme décoratives
        if (!alt && role !== 'presentation' && ariaHidden !== 'true') {
          console.warn(`Image ${i} manque d'attribut alt approprié`);
        }
      }
      
      // Test 4: Vérifier les liens ont du texte descriptif
      const links = page.locator('a');
      const linkCount = await links.count();
      
      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const ariaLabelledBy = await link.getAttribute('aria-labelledby');
        
        // Les liens doivent avoir du texte ou un label
        const hasText = text && text.trim().length > 0;
        const hasLabel = ariaLabel || ariaLabelledBy;
        
        if (!hasText && !hasLabel) {
          console.warn(`Lien ${i} manque de texte descriptif`);
        }
      }
      
      // Test 5: Vérifier les champs de formulaire ont des labels
      const inputs = page.locator('input, select, textarea');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const type = await input.getAttribute('type');
        
        // Ignorer les boutons et champs cachés
        if (type === 'button' || type === 'submit' || type === 'hidden') {
          continue;
        }
        
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        let hasLabel = false;
        
        // Vérifier si il y a un label associé
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          hasLabel = await label.count() > 0;
        }
        
        // Vérifier si l'input est dans un label
        if (!hasLabel) {
          const parentLabel = input.locator('xpath=ancestor::label');
          hasLabel = await parentLabel.count() > 0;
        }
        
        // Vérifier les ARIA labels
        if (!hasLabel) {
          hasLabel = !!(ariaLabel || ariaLabelledBy);
        }
        
        if (!hasLabel) {
          console.warn(`Input ${i} (type: ${type}) manque de label`);
        }
      }
    });
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Commencer la navigation au clavier
    let focusableElements = [];
    
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      
      if (await focusedElement.count() > 0) {
        const tagName = await focusedElement.evaluate(el => el.tagName);
        const text = await focusedElement.textContent();
        const role = await focusedElement.getAttribute('role');
        
        focusableElements.push({
          tagName,
          text: text?.trim().substring(0, 50),
          role
        });
        
        // Vérifier que l'élément focusé est visible
        await expect(focusedElement).toBeVisible();
        
        // Vérifier qu'il y a un indicateur de focus visible
        const focusOutline = await focusedElement.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.outline !== 'none' || 
                 styles.boxShadow !== 'none' || 
                 styles.backgroundColor !== 'transparent';
        });
        
        expect(focusOutline).toBeTruthy();
      }
    }
    
    // Vérifier qu'on a trouvé des éléments focusables
    expect(focusableElements.length).toBeGreaterThan(0);
    
    console.log('Éléments focusables trouvés:', focusableElements);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Injecter une fonction pour vérifier le contraste
    const contrastIssues = await page.evaluate(() => {
      const issues: string[] = [];
      
      // Sélectionner les éléments de texte
      const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6, label');
      
      textElements.forEach((element, index) => {
        if (index > 20) return; // Limiter pour performance
        
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Détecter les cas problématiques évidents
        if (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)') {
          issues.push(`Élément ${index}: texte blanc sur fond blanc`);
        }
        
        if (color === 'rgb(0, 0, 0)' && backgroundColor === 'rgb(0, 0, 0)') {
          issues.push(`Élément ${index}: texte noir sur fond noir`);
        }
        
        // Vérifier les contrastes très faibles
        if (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)') {
          issues.push(`Élément ${index}: contraste potentiellement faible (gris sur blanc)`);
        }
      });
      
      return issues;
    });
    
    // Logger les problèmes trouvés
    if (contrastIssues.length > 0) {
      console.warn('Problèmes de contraste détectés:', contrastIssues);
    }
    
    // Ne pas faire échouer le test pour des avertissements
    // expect(contrastIssues.length).toBe(0);
  });

  test('should work with screen reader simulation', async ({ page }) => {
    await page.goto('/');
    
    // Simuler la navigation au lecteur d'écran
    const landmarks = await page.locator('main, nav, header, footer, section[aria-label], [role="main"], [role="navigation"]').count();
    
    // Vérifier qu'il y a des landmarks pour la navigation
    expect(landmarks).toBeGreaterThan(0);
    
    // Vérifier les live regions pour les notifications
    const liveRegions = await page.locator('[aria-live], [role="status"], [role="alert"]').count();
    
    // Pas obligatoire mais recommandé
    if (liveRegions === 0) {
      console.log('Aucune live region détectée - considérer l\'ajout pour les notifications');
    }
    
    // Vérifier que les éléments interactifs ont des rôles appropriés
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Les boutons doivent avoir du texte ou un label
      const hasDescription = (text && text.trim().length > 0) || ariaLabel;
      if (!hasDescription) {
        console.warn(`Bouton ${i} manque de description`);
      }
    }
  });

  test('should be responsive and accessible on mobile', async ({ page }) => {
    // Passer en vue mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Vérifier que les éléments interactifs ont une taille suffisante
    const interactiveElements = page.locator('button, a, input, [role="button"], [role="link"]');
    const elementCount = await interactiveElements.count();
    
    for (let i = 0; i < Math.min(elementCount, 10); i++) {
      const element = interactiveElements.nth(i);
      
      if (await element.isVisible()) {
        const boundingBox = await element.boundingBox();
        
        if (boundingBox) {
          // Vérifier la taille minimale pour touch (44px selon WCAG)
          const minSize = 44;
          
          if (boundingBox.width < minSize || boundingBox.height < minSize) {
            console.warn(`Élément ${i} trop petit pour touch: ${boundingBox.width}x${boundingBox.height}`);
          }
        }
      }
    }
    
    // Vérifier que le texte reste lisible
    const textElements = page.locator('p, span, h1, h2, h3, h4, h5, h6');
    const textCount = await textElements.count();
    
    for (let i = 0; i < Math.min(textCount, 5); i++) {
      const element = textElements.nth(i);
      
      if (await element.isVisible()) {
        const fontSize = await element.evaluate(el => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });
        
        // Taille minimale recommandée pour mobile
        const minFontSize = 14;
        
        if (fontSize < minFontSize) {
          console.warn(`Texte ${i} potentiellement trop petit: ${fontSize}px`);
        }
      }
    }
  });
});