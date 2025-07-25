import { test, expect } from '@playwright/test';

/**
 * Tests du parcours utilisateur complet
 * Simule les scénarios réels d'utilisation de l'e-commerce
 */

test.describe('Parcours utilisateur e-commerce', () => {
  test.beforeEach(async ({ page }) => {
    // Charger les données de test
    await page.addInitScript(() => {
      const testProducts = JSON.parse(localStorage.getItem('test-products') || '[]');
      const testUser = JSON.parse(localStorage.getItem('test-user') || '{}');
      
      // Simuler l'API des produits
      (window as any).mockAPI = {
        products: testProducts,
        user: testUser
      };
    });
  });

  test('Parcours complet : Découverte → Achat → Confirmation', async ({ page }) => {
    // Étape 1: Arrivée sur la page d'accueil
    await page.goto('/');
    await expect(page).toHaveTitle(/Kamba Lhains/);
    
    // Vérifier que les éléments principaux sont chargés
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Étape 2: Navigation vers la collection
    await page.click('text=Nouvelle Collection');
    await page.waitForURL('/nouvelle-collection');
    
    // Vérifier le chargement de la page collection
    await expect(page.locator('h1')).toContainText('Nouvelle Collection');
    
    // Étape 3: Exploration des produits
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
    
    // Cliquer sur le premier produit
    await productCards.first().click();
    
    // Vérifier la navigation vers la page produit
    await expect(page.url()).toMatch(/\/produit\/[^\/]+$/);
    
    // Étape 4: Interaction avec le produit
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-image"]')).toBeVisible();
    
    // Sélectionner une taille
    const sizeSelector = page.locator('[data-testid="size-selector"]');
    if (await sizeSelector.isVisible()) {
      await sizeSelector.selectOption('M');
    }
    
    // Ajouter au panier
    const addToCartButton = page.locator('[data-testid="add-to-cart"]');
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
    
    // Vérifier la confirmation d'ajout
    await expect(page.locator('.toast, [data-testid="cart-notification"]')).toBeVisible();
    
    // Étape 5: Vérification du panier
    await page.click('[data-testid="cart-button"]');
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
    
    // Étape 6: Procédure de checkout
    await page.click('[data-testid="checkout-button"]');
    await page.waitForURL('/checkout');
    
    // Remplir les informations de livraison
    await page.fill('[data-testid="shipping-name"]', 'Test User');
    await page.fill('[data-testid="shipping-email"]', 'test@example.com');
    await page.fill('[data-testid="shipping-address"]', '123 Rue de Test');
    await page.fill('[data-testid="shipping-city"]', 'Paris');
    await page.fill('[data-testid="shipping-postal"]', '75001');
    
    // Sélectionner le mode de livraison
    await page.click('[data-testid="shipping-method-standard"]');
    
    // Sélectionner le mode de paiement
    await page.click('[data-testid="payment-method-card"]');
    
    // Remplir les informations de paiement (simulé)
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');
    
    // Confirmer la commande
    await page.click('[data-testid="place-order"]');
    
    // Étape 7: Confirmation de commande
    await page.waitForURL('/confirmation');
    await expect(page.locator('[data-testid="order-confirmed"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
  });

  test('Parcours de navigation sans achat', async ({ page }) => {
    await page.goto('/');
    
    // Navigation dans les différentes sections
    const menuItems = [
      { link: 'Nouvelle Collection', url: '/nouvelle-collection' },
      { link: 'Boutique', url: '/boutique' },
      { link: 'À propos', url: '/about' }
    ];
    
    for (const item of menuItems) {
      await page.click(`text=${item.link}`);
      await page.waitForURL(item.url);
      await expect(page.url()).toContain(item.url);
    }
  });

  test('Parcours de recherche de produits', async ({ page }) => {
    await page.goto('/');
    
    // Utiliser la barre de recherche
    const searchInput = page.locator('[data-testid="search-input"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('veste');
      await page.keyboard.press('Enter');
      
      // Vérifier les résultats de recherche
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount({ min: 1 });
    }
  });

  test('Parcours de gestion du panier', async ({ page }) => {
    await page.goto('/boutique');
    
    // Ajouter plusieurs produits au panier
    const productCards = page.locator('[data-testid="product-card"]');
    const productCount = Math.min(await productCards.count(), 3);
    
    for (let i = 0; i < productCount; i++) {
      await productCards.nth(i).click();
      
      // Ajouter au panier depuis la page produit
      const addToCartButton = page.locator('[data-testid="add-to-cart"]');
      if (await addToCartButton.isVisible() && await addToCartButton.isEnabled()) {
        await addToCartButton.click();
        await page.waitForTimeout(1000); // Attendre l'animation
      }
      
      // Retourner à la boutique
      await page.goBack();
    }
    
    // Ouvrir le panier
    await page.click('[data-testid="cart-button"]');
    
    // Vérifier que les produits sont dans le panier
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount({ min: 1 });
    
    // Modifier la quantité d'un produit
    const quantityInput = cartItems.first().locator('[data-testid="quantity-input"]');
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('2');
      await page.keyboard.press('Enter');
    }
    
    // Supprimer un produit du panier
    const removeButton = cartItems.last().locator('[data-testid="remove-item"]');
    if (await removeButton.isVisible()) {
      await removeButton.click();
    }
  });

  test('Parcours de liste de souhaits', async ({ page }) => {
    await page.goto('/boutique');
    
    // Ajouter des produits à la liste de souhaits
    const productCards = page.locator('[data-testid="product-card"]');
    if (await productCards.count() > 0) {
      // Survoler le premier produit pour révéler le bouton wishlist
      await productCards.first().hover();
      
      const wishlistButton = productCards.first().locator('[data-testid="wishlist-button"]');
      if (await wishlistButton.isVisible()) {
        await wishlistButton.click();
        
        // Vérifier la confirmation
        await expect(page.locator('.toast')).toBeVisible();
      }
    }
    
    // Accéder à la liste de souhaits
    const wishlistLink = page.locator('[data-testid="wishlist-link"]');
    if (await wishlistLink.isVisible()) {
      await wishlistLink.click();
      await expect(page.locator('[data-testid="wishlist-item"]')).toBeVisible();
    }
  });

  test('Parcours responsive mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('Test uniquement pour mobile');
    }
    
    await page.goto('/');
    
    // Vérifier que le menu mobile fonctionne
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-toggle"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
      
      // Naviguer via le menu mobile
      await page.click('[data-testid="mobile-menu"] text=Boutique');
      await page.waitForURL('/boutique');
    }
    
    // Tester le scroll et l'affichage sur mobile
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Vérifier que les éléments sont toujours visibles après scroll
    await expect(page.locator('footer')).toBeVisible();
  });
});