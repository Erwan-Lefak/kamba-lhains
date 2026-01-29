import { google } from 'googleapis';

// Configuration Google Sheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

/**
 * Initialise le client Google Sheets avec les credentials
 */
export async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client as any });

  return sheets;
}

/**
 * Récupère les données d'une feuille Google Sheets
 */
export async function getSheetData(spreadsheetId: string, range: string) {
  try {
    const sheets = await getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error('Erreur lors de la lecture de Google Sheets:', error);
    throw error;
  }
}

/**
 * Convertit les données de Google Sheets en produits
 */
export function parseProductsFromSheet(rows: any[][]) {
  // Ignorer la ligne d'en-tête
  const [headers, ...dataRows] = rows;

  return dataRows.map((row) => {
    return {
      id: row[0] || '',
      name: row[1] || '',
      price: parseFloat(row[2]) || 0,
      description: row[3] || '',
      category: row[4] || '',
      subCategory: row[5] || '',
      colors: row[6] ? row[6].split(',').map((c: string) => c.trim()) : [],
      sizes: row[7] ? row[7].split(',').map((s: string) => s.trim()) : [],
      images: row[8] ? row[8].split(',').map((img: string) => img.trim()) : [],
      inStock: row[9] === 'TRUE' || row[9] === 'true' || row[9] === '1',
      featured: row[10] === 'TRUE' || row[10] === 'true' || row[10] === '1',
    };
  });
}

/**
 * Récupère tous les produits depuis Google Sheets avec cache
 */
let cachedProducts: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getProductsFromGoogleSheets(forceRefresh = false) {
  const now = Date.now();

  // Utiliser le cache si disponible et pas expiré
  if (!forceRefresh && cachedProducts && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedProducts;
  }

  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_PRODUCTS_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_PRODUCTS_ID non défini');
    }

    const rows = await getSheetData(spreadsheetId, 'Produits!A1:K100');
    const products = parseProductsFromSheet(rows);

    // Mettre à jour le cache
    cachedProducts = products;
    cacheTimestamp = now;

    return products;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);

    // En cas d'erreur, retourner le cache si disponible
    if (cachedProducts) {
      console.log('Utilisation du cache suite à une erreur');
      return cachedProducts;
    }

    throw error;
  }
}
