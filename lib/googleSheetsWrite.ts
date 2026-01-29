import { google } from 'googleapis';

/**
 * Utilitaire pour ÉCRIRE dans Google Sheets
 * Nécessite un Service Account avec permissions d'écriture
 */

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Initialise le client Google Sheets pour écriture
 */
async function getGoogleSheetsClient() {
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
 * Ajoute une commande dans le Google Sheet
 */
export async function addOrderToSheet(order: any) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ORDERS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ORDERS_ID non défini');
    }

    // Formater les données de la commande
    const row = [
      order.orderNumber || '',
      order.customerEmail || order.guestEmail || '',
      order.customerName || '',
      order.phone || '',
      new Date().toISOString(),
      order.status || 'PENDING',
      order.totalAmount || 0,
      order.shippingCost || 0,
      order.taxAmount || 0,
      JSON.stringify(order.items || []),
      JSON.stringify(order.shippingAddress || {}),
      order.paymentMethod || 'stripe',
      order.paymentStatus || 'PENDING',
      order.trackingNumber || '',
      order.notes || '',
    ];

    // Ajouter la ligne dans le sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'google-sheets-commandes-template!A:O',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    console.log(`✅ Commande ${order.orderNumber} ajoutée au Google Sheet`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de la commande:', error);
    throw error;
  }
}

/**
 * Met à jour le statut d'une commande
 */
export async function updateOrderStatus(orderNumber: string, status: string, trackingNumber?: string) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ORDERS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ORDERS_ID non défini');
    }

    // Récupérer toutes les commandes
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'google-sheets-commandes-template!A:O',
    });

    const rows = response.data.values || [];
    const headerRow = rows[0];
    const dataRows = rows.slice(1);

    // Trouver l'index de la commande
    const orderIndex = dataRows.findIndex((row: any[]) => row[0] === orderNumber);

    if (orderIndex === -1) {
      throw new Error(`Commande ${orderNumber} non trouvée`);
    }

    // Mettre à jour le statut (colonne F = index 5)
    const rowNumber = orderIndex + 2; // +1 pour header, +1 pour index 0
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `google-sheets-commandes-template!F${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[status]],
      },
    });

    // Mettre à jour le tracking number si fourni (colonne N = index 13)
    if (trackingNumber) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `google-sheets-commandes-template!N${rowNumber}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[trackingNumber]],
        },
      });
    }

    console.log(`✅ Commande ${orderNumber} mise à jour: ${status}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    throw error;
  }
}

/**
 * Récupère toutes les commandes depuis Google Sheets
 */
export async function getOrdersFromSheet() {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ORDERS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ORDERS_ID non défini');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'google-sheets-commandes-template!A:O',
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

    const [headers, ...dataRows] = rows;

    return dataRows.map((row: any[]) => ({
      orderNumber: row[0] || '',
      customerEmail: row[1] || '',
      customerName: row[2] || '',
      phone: row[3] || '',
      createdAt: row[4] || '',
      status: row[5] || 'PENDING',
      totalAmount: parseFloat(row[6]) || 0,
      shippingCost: parseFloat(row[7]) || 0,
      taxAmount: parseFloat(row[8]) || 0,
      items: row[9] ? JSON.parse(row[9]) : [],
      shippingAddress: row[10] ? JSON.parse(row[10]) : {},
      paymentMethod: row[11] || 'stripe',
      paymentStatus: row[12] || 'PENDING',
      trackingNumber: row[13] || '',
      notes: row[14] || '',
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des commandes:', error);
    return [];
  }
}

/**
 * Récupère les commandes d'un utilisateur spécifique par email
 */
export async function getUserOrders(email: string) {
  try {
    const orders = await getOrdersFromSheet();

    // Filtrer les commandes par email
    const userOrders = orders.filter((order: any) =>
      order.customerEmail.toLowerCase() === email.toLowerCase()
    );

    // Trier par date (plus récentes en premier)
    userOrders.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return userOrders;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des commandes utilisateur:', error);
    return [];
  }
}

/**
 * Récupère les statistiques du dashboard
 */
export async function getDashboardStats() {
  try {
    const orders = await getOrdersFromSheet();

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Calculer les stats
    const totalRevenue = orders
      .filter((o: any) => o.status === 'PAID' || o.status === 'DELIVERED')
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

    const ordersToday = orders.filter((o: any) =>
      o.createdAt.startsWith(today)
    ).length;

    const totalOrders = orders.length;

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Commandes récentes (10 dernières)
    const recentOrders = orders.slice(-10).reverse();

    return {
      totalRevenue,
      ordersToday,
      totalOrders,
      averageOrderValue,
      recentOrders,
      conversionRate: 2.5, // À calculer avec Google Analytics
      returningCustomers: 35, // À calculer avec les emails
    };
  } catch (error) {
    console.error('❌ Erreur stats:', error);
    return {
      totalRevenue: 0,
      ordersToday: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      recentOrders: [],
      conversionRate: 0,
      returningCustomers: 0,
    };
  }
}
