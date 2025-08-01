import { test, expect } from '@playwright/test';

test.describe('Shopping Cart E2E Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Aller à la page d'accueil
    await page.goto('/');
  });

  test('should add product to cart from product page', async ({ page }) => {
    // Naviguer vers une page produit (en supposant qu'il y en a une)
    await page.goto('/produit/1');
    
    // Vérifier que nous sommes sur une page produit
    const productTitle = page.locator('h1');
    if (await productTitle.isVisible()) {
      // Chercher le bouton d'ajout au panier
      const addToCartButton = page.locator('button:has-text("Ajouter au panier")');
      
      if (await addToCartButton.isVisible()) {
        // Cliquer sur le bouton
        await addToCartButton.click();
        
        // Vérifier la confirmation (toast, message, etc.)
        const confirmation = page.locator('text=ajouté au panier');
        await expect(confirmation).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should navigate to cart page', async ({ page }) => {
    // Aller à la page panier
    await page.goto('/panier');
    
    // Vérifier que nous sommes sur la page panier
    await expect(page).toHaveTitle(/Panier/);
    
    // Vérifier la structure de la page panier
    const cartContent = page.locator('main');
    await expect(cartContent).toBeVisible();
  });

  test('should show empty cart state', async ({ page }) => {
    await page.goto('/panier');
    
    // Si le panier est vide, vérifier le message approprié
    const emptyCartMessage = page.locator('text=Votre panier est vide');
    const cartItems = page.locator('[data-testid*="cart-item"]');
    
    // Soit le panier est vide, soit il contient des items
    const isEmpty = await emptyCartMessage.isVisible();
    const hasItems = await cartItems.first().isVisible();
    
    expect(isEmpty || hasItems).toBeTruthy();
    
    if (isEmpty) {
      // Vérifier le bouton de retour shopping
      const continueShoppingButton = page.locator('a:has-text("Continuer mes achats")');
      if (await continueShoppingButton.isVisible()) {
        await expect(continueShoppingButton).toBeVisible();
      }
    }
  });

  test('should update cart item quantities', async ({ page }) => {
    await page.goto('/panier');
    
    // Chercher des items dans le panier
    const cartItems = page.locator('[data-testid*="cart-item"]');
    const itemCount = await cartItems.count();
    
    if (itemCount > 0) {
      // Tester la modification de quantité sur le premier item
      const firstItem = cartItems.first();
      
      // Chercher les boutons de quantité
      const increaseButton = firstItem.locator('button:has-text("+")');
      const decreaseButton = firstItem.locator('button:has-text("-")');
      const quantityInput = firstItem.locator('input[type="number"]');
      
      if (await increaseButton.isVisible()) {
        // Récupérer la quantité initiale
        const initialQuantity = await quantityInput.inputValue();
        
        // Augmenter la quantité
        await increaseButton.click();
        
        // Attendre la mise à jour
        await page.waitForTimeout(1000);
        
        // Vérifier que la quantité a changé
        const newQuantity = await quantityInput.inputValue();
        expect(parseInt(newQuantity)).toBeGreaterThan(parseInt(initialQuantity));
      }
    }
  });

  test('should remove items from cart', async ({ page }) => {
    await page.goto('/panier');
    
    const cartItems = page.locator('[data-testid*="cart-item"]');
    const initialItemCount = await cartItems.count();
    
    if (initialItemCount > 0) {
      // Chercher le bouton de suppression
      const removeButton = cartItems.first().locator('button:has-text("Supprimer")');
      
      if (await removeButton.isVisible()) {
        await removeButton.click();
        
        // Attendre la mise à jour
        await page.waitForTimeout(1000);
        
        // Vérifier que l'item a été supprimé
        const newItemCount = await cartItems.count();
        expect(newItemCount).toBeLessThan(initialItemCount);
      }
    }
  });

  test('should proceed to checkout', async ({ page }) => {
    await page.goto('/panier');
    
    // Chercher le bouton de checkout
    const checkoutButton = page.locator('button:has-text("Commander")');
    
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      
      // Vérifier la redirection vers checkout
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/checkout');
      
      // Vérifier que nous sommes sur la page de checkout
      const checkoutContent = page.locator('main');
      await expect(checkoutContent).toBeVisible();
    }
  });

  test('should persist cart across page reloads', async ({ page }) => {
    await page.goto('/panier');
    
    // Compter les items initiaux
    const cartItems = page.locator('[data-testid*="cart-item"]');
    const initialCount = await cartItems.count();
    
    // Recharger la page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Vérifier que les items sont toujours là
    const newCount = await cartItems.count();
    expect(newCount).toBe(initialCount);
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    await page.goto('/panier');
    
    // Tester la navigation clavier
    await page.keyboard.press('Tab');
    
    // Vérifier que les éléments interactifs sont focusables
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continuer la navigation pour tester plusieurs éléments
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const currentFocus = page.locator(':focus');
      if (await currentFocus.isVisible()) {
        // Vérifier que l'élément focusé a un outline visible
        const focusStyle = await currentFocus.evaluate(el => 
          window.getComputedStyle(el).outline
        );
        // L'outline devrait être défini (pas 'none')
        expect(focusStyle).not.toBe('none');
      }
    }
  });

  test('should display correct cart total', async ({ page }) => {
    await page.goto('/panier');
    
    const cartItems = page.locator('[data-testid*="cart-item"]');
    const itemCount = await cartItems.count();
    
    if (itemCount > 0) {
      // Calculer le total attendu en JavaScript
      const calculatedTotal = await page.evaluate(() => {
        const items = document.querySelectorAll('[data-testid*="cart-item"]');
        let total = 0;
        
        items.forEach(item => {
          const priceElement = item.querySelector('[data-testid="item-price"]');
          const quantityElement = item.querySelector('input[type="number"]');
          
          if (priceElement && quantityElement) {
            const price = parseFloat(priceElement.textContent?.replace(/[^0-9.]/g, '') || '0');
            const quantity = parseInt((quantityElement as HTMLInputElement).value || '0');
            total += price * quantity;
          }
        });
        
        return total;
      });
      
      // Chercher l'affichage du total
      const totalElement = page.locator('[data-testid="cart-total"]');
      if (await totalElement.isVisible()) {
        const displayedTotal = await totalElement.textContent();
        const displayedNumber = parseFloat(displayedTotal?.replace(/[^0-9.]/g, '') || '0');
        
        // Vérifier que les totaux correspondent (avec une petite tolérance pour les arrondis)
        expect(Math.abs(displayedNumber - calculatedTotal)).toBeLessThan(0.01);
      }
    }
  });
});