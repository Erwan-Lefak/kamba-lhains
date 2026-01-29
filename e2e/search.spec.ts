import { test, expect } from '@playwright/test';

test.describe('Product Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
  });

  test('should load search page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Recherche de produits/);
    
    // Vérifier la présence du champ de recherche
    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    await expect(searchInput).toBeVisible();
    
    // Vérifier la présence du bouton filtres
    const filtersButton = page.locator('button:has-text("Filtres")');
    await expect(filtersButton).toBeVisible();
  });

  test('should perform basic search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    
    // Saisir un terme de recherche
    await searchInput.fill('test');
    
    // Attendre que la recherche se déclenche (debounce)
    await page.waitForTimeout(500);
    
    // Vérifier qu'il y a un état de chargement ou des résultats
    const loadingIndicator = page.locator('text=Recherche en cours');
    const noResults = page.locator('text=Aucun résultat trouvé');
    const results = page.locator('[data-testid*="product-"]');
    
    // Au moins un de ces éléments devrait être visible
    const hasLoadingOrResults = await Promise.race([
      loadingIndicator.isVisible(),
      noResults.isVisible(),
      results.first().isVisible()
    ]);
    
    expect(hasLoadingOrResults).toBeTruthy();
  });

  test('should open and use filters', async ({ page }) => {
    const filtersButton = page.locator('button:has-text("Filtres")');
    
    // Ouvrir les filtres
    await filtersButton.click();
    
    // Vérifier que le panneau de filtres s'ouvre
    const categorySelect = page.locator('select').first();
    await expect(categorySelect).toBeVisible();
    
    // Tester le filtre par catégorie
    await categorySelect.selectOption('BENGA CLASSIC');
    
    // Vérifier que les filtres sont appliqués
    await page.waitForTimeout(500);
    
    // Fermer les filtres
    await filtersButton.click();
    
    // Le panneau devrait se fermer
    await page.waitForTimeout(500);
  });

  test('should handle empty search results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    
    // Rechercher quelque chose qui n'existe pas
    await searchInput.fill('produitinexistant123');
    await page.waitForTimeout(500);
    
    // Vérifier le message d'absence de résultats
    const noResultsMessage = page.locator('text=Aucun résultat trouvé');
    await expect(noResultsMessage).toBeVisible();
    
    // Vérifier la suggestion d'aide
    const helpText = page.locator('text=Essayez de modifier');
    await expect(helpText).toBeVisible();
  });

  test('should clear search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    
    // Saisir du texte
    await searchInput.fill('test recherche');
    
    // Vérifier que le bouton de suppression apparaît
    const clearButton = page.locator('button svg').first();
    await expect(clearButton).toBeVisible();
    
    // Cliquer sur le bouton de suppression
    await clearButton.click();
    
    // Vérifier que le champ est vidé
    await expect(searchInput).toHaveValue('');
    
    // Vérifier le retour à l'état initial
    const initialMessage = page.locator('text=Commencez votre recherche');
    await expect(initialMessage).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Passer en vue mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Vérifier que les éléments sont visibles et utilisables
    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    await expect(searchInput).toBeVisible();
    
    const filtersButton = page.locator('button:has-text("Filtres")');
    await expect(filtersButton).toBeVisible();
    
    // Tester l'ouverture des filtres sur mobile
    await filtersButton.click();
    
    const filtersPanel = page.locator('select').first();
    await expect(filtersPanel).toBeVisible();
    
    // Vérifier que les éléments ont une taille suffisante pour le touch
    const buttonBox = await filtersButton.boundingBox();
    if (buttonBox) {
      expect(buttonBox.height).toBeGreaterThanOrEqual(44); // 44px minimum pour touch
      expect(buttonBox.width).toBeGreaterThanOrEqual(44);
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Naviguer avec Tab
    await page.keyboard.press('Tab');
    
    // Le champ de recherche devrait avoir le focus
    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    await expect(searchInput).toBeFocused();
    
    // Continuer la navigation
    await page.keyboard.press('Tab');
    
    // Le bouton filtres devrait avoir le focus
    const filtersButton = page.locator('button:has-text("Filtres")');
    await expect(filtersButton).toBeFocused();
    
    // Tester l'activation avec Enter
    await page.keyboard.press('Enter');
    
    // Les filtres devraient s'ouvrir
    const filtersPanel = page.locator('select').first();
    await expect(filtersPanel).toBeVisible();
  });
});