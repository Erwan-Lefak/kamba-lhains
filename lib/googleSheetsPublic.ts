/**
 * Lecture de Google Sheets PUBLIC (sans authentification)
 * 100% gratuit et aucune configuration nécessaire !
 */

/**
 * Récupère les données d'un Google Sheet PUBLIC
 * Le sheet doit être "Accessible à tous ceux qui ont le lien"
 */
export async function getPublicSheetData(spreadsheetId: string, sheetName: string = 'Produits') {
  try {
    // Format CSV export URL pour Google Sheets public
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur lors de la lecture du Google Sheet: ${response.status}`);
    }

    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Erreur lors de la lecture de Google Sheets:', error);
    throw error;
  }
}

/**
 * Parse un CSV en tableau
 */
function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n');
  const result: string[][] = [];

  for (const line of lines) {
    if (line.trim()) {
      // Parse CSV simple (gère les virgules dans les guillemets)
      const row: string[] = [];
      let currentField = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(currentField.trim());
          currentField = '';
        } else {
          currentField += char;
        }
      }

      row.push(currentField.trim());
      result.push(row);
    }
  }

  return result;
}

/**
 * Convertit les données de Google Sheets en produits
 */
export function parseProductsFromSheet(rows: string[][]) {
  if (rows.length === 0) return [];

  // Ignorer la ligne d'en-tête
  const [headers, ...dataRows] = rows;

  return dataRows.map((row) => {
    // Nettoyer les guillemets des valeurs
    const cleanRow = row.map(cell => cell.replace(/^"|"$/g, ''));

    return {
      id: cleanRow[0] || '',
      name: cleanRow[1] || '',
      price: parseFloat(cleanRow[2]) || 0,
      description: cleanRow[3] || '',
      category: cleanRow[4] || '',
      subCategory: cleanRow[5] || '',
      colors: cleanRow[6] ? cleanRow[6].split(',').map((c: string) => c.trim()) : [],
      sizes: cleanRow[7] ? cleanRow[7].split(',').map((s: string) => s.trim()) : [],
      images: cleanRow[8] ? cleanRow[8].split(',').map((img: string) => img.trim()) : [],
      image: cleanRow[8] ? cleanRow[8].split(',')[0].trim() : '', // Première image
      inStock: cleanRow[9] === 'TRUE' || cleanRow[9] === 'true' || cleanRow[9] === '1',
      featured: cleanRow[10] === 'TRUE' || cleanRow[10] === 'true' || cleanRow[10] === '1',
    };
  });
}

/**
 * Récupère tous les produits depuis Google Sheets PUBLIC avec cache
 */
let cachedProducts: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getProductsFromPublicSheet(forceRefresh = false) {
  const now = Date.now();

  // Utiliser le cache si disponible et pas expiré
  if (!forceRefresh && cachedProducts && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📦 Utilisation du cache produits');
    return cachedProducts;
  }

  try {
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;

    if (!spreadsheetId) {
      console.warn('⚠️ NEXT_PUBLIC_GOOGLE_SHEETS_ID non défini, utilisation des produits par défaut');
      // Fallback sur les produits du fichier products.ts
      const { products: defaultProducts } = await import('../data/products');
      return defaultProducts;
    }

    console.log('🔄 Récupération des produits depuis Google Sheets...');
    const rows = await getPublicSheetData(spreadsheetId, 'Produits');
    const products = parseProductsFromSheet(rows);

    // Mettre à jour le cache
    cachedProducts = products;
    cacheTimestamp = now;

    console.log(`✅ ${products.length} produits récupérés depuis Google Sheets`);
    return products;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des produits:', error);

    // En cas d'erreur, retourner le cache si disponible
    if (cachedProducts) {
      console.log('📦 Utilisation du cache suite à une erreur');
      return cachedProducts;
    }

    // Sinon, fallback sur les produits par défaut
    console.log('🔄 Fallback sur les produits par défaut');
    const { products: defaultProducts } = await import('../data/products');
    return defaultProducts;
  }
}
