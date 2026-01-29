import { google } from 'googleapis';

/**
 * Gestion des abonnés newsletter dans Google Sheets
 * Utilise le même Service Account que pour les commandes
 */

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Initialise le client Google Sheets
 */
async function getGoogleSheetsClient() {
  // Use GOOGLE_APPLICATION_CREDENTIALS if set (recommended way for local dev)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: SCOPES,
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client as any });
    return sheets;
  }

  // For Vercel/production: use base64 encoded JSON credentials and write to temp file
  if (process.env.GOOGLE_CREDENTIALS_JSON_BASE64) {
    try {
      const fs = await import('fs/promises');
      const os = await import('os');
      const path = await import('path');

      const jsonString = Buffer.from(process.env.GOOGLE_CREDENTIALS_JSON_BASE64, 'base64').toString('utf-8');

      // Write to temp file (Vercel has /tmp directory)
      const tmpDir = os.tmpdir();
      const keyPath = path.join(tmpDir, 'google-credentials.json');
      await fs.writeFile(keyPath, jsonString, { mode: 0o600 });

      const auth = new google.auth.GoogleAuth({
        keyFile: keyPath,
        scopes: SCOPES,
      });
      const client = await auth.getClient();
      const sheets = google.sheets({ version: 'v4', auth: client as any });
      return sheets;
    } catch (error) {
      console.error('Error using base64 JSON credentials, falling back:', error);
    }
  }

  // Fallback to individual key/email
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (process.env.GOOGLE_PRIVATE_KEY_BASE64) {
    try {
      privateKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8');
    } catch (error) {
      console.error('Error decoding base64 private key, using regular key');
    }
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client as any });

  return sheets;
}

/**
 * Interface pour un abonné newsletter
 */
export interface NewsletterSubscriber {
  email: string;
  firstName?: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
  interests?: string[];
  frequency?: string;
  source?: string; // 'footer' | 'newsletter-page'
}

/**
 * Vérifie si un email est déjà abonné
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_NEWSLETTER_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_NEWSLETTER_ID non défini');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Newsletter!A:A', // Colonne des emails
    });

    const rows = response.data.values || [];

    // Ignorer l'en-tête et chercher l'email
    return rows.slice(1).some((row: any[]) =>
      row[0]?.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error('❌ Erreur vérification email:', error);
    throw error;
  }
}

/**
 * Ajoute un abonné à la newsletter
 */
export async function addSubscriber(subscriber: NewsletterSubscriber) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_NEWSLETTER_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_NEWSLETTER_ID non défini');
    }

    // Vérifier si l'email existe déjà
    const exists = await checkEmailExists(subscriber.email);
    if (exists) {
      return {
        success: false,
        message: 'Cet email est déjà inscrit à la newsletter'
      };
    }

    // Formater les données pour Google Sheets
    const row = [
      subscriber.email,
      subscriber.firstName || '',
      subscriber.subscribedAt,
      subscriber.status,
      subscriber.interests?.join(', ') || '',
      subscriber.frequency || 'weekly',
      subscriber.source || 'unknown',
    ];

    // Ajouter la ligne dans le sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Newsletter!A:G',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    console.log(`✅ Abonné ${subscriber.email} ajouté à la newsletter`);
    return { success: true, message: 'Inscription réussie !' };
  } catch (error: any) {
    console.error('❌ Erreur ajout abonné:', error);
    throw error;
  }
}

/**
 * Désabonne un email de la newsletter
 */
export async function unsubscribeEmail(email: string) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_NEWSLETTER_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_NEWSLETTER_ID non défini');
    }

    // Récupérer tous les abonnés
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Newsletter!A:G',
    });

    const rows = response.data.values || [];
    const headerRow = rows[0];
    const dataRows = rows.slice(1);

    // Trouver l'index de l'email
    const emailIndex = dataRows.findIndex((row: any[]) =>
      row[0]?.toLowerCase() === email.toLowerCase()
    );

    if (emailIndex === -1) {
      return {
        success: false,
        message: 'Email non trouvé dans la newsletter'
      };
    }

    // Mettre à jour le statut (colonne D = index 3)
    const rowNumber = emailIndex + 2; // +1 pour header, +1 pour index 0
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Newsletter!D${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['unsubscribed']],
      },
    });

    console.log(`✅ ${email} désabonné de la newsletter`);
    return { success: true, message: 'Désabonnement réussi' };
  } catch (error) {
    console.error('❌ Erreur désabonnement:', error);
    throw error;
  }
}

/**
 * Récupère tous les abonnés actifs
 */
export async function getActiveSubscribers() {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_NEWSLETTER_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_NEWSLETTER_ID non défini');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Newsletter!A:G',
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

    const [headers, ...dataRows] = rows;

    return dataRows
      .filter((row: any[]) => row[3] === 'active') // Filtrer uniquement les actifs
      .map((row: any[]) => ({
        email: row[0] || '',
        firstName: row[1] || '',
        subscribedAt: row[2] || '',
        status: row[3] || 'active',
        interests: row[4] ? row[4].split(',').map((i: string) => i.trim()) : [],
        frequency: row[5] || 'weekly',
        source: row[6] || 'unknown',
      }));
  } catch (error) {
    console.error('❌ Erreur récupération abonnés:', error);
    return [];
  }
}

/**
 * Récupère les statistiques de la newsletter
 */
export async function getNewsletterStats() {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_NEWSLETTER_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_NEWSLETTER_ID non défini');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Newsletter!A:G',
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      return {
        totalSubscribers: 0,
        activeSubscribers: 0,
        unsubscribed: 0,
        subscribersThisMonth: 0,
      };
    }

    const [headers, ...dataRows] = rows;

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const stats = {
      totalSubscribers: dataRows.length,
      activeSubscribers: dataRows.filter((row: any[]) => row[3] === 'active').length,
      unsubscribed: dataRows.filter((row: any[]) => row[3] === 'unsubscribed').length,
      subscribersThisMonth: dataRows.filter((row: any[]) =>
        row[2]?.startsWith(thisMonth)
      ).length,
    };

    return stats;
  } catch (error) {
    console.error('❌ Erreur stats newsletter:', error);
    return {
      totalSubscribers: 0,
      activeSubscribers: 0,
      unsubscribed: 0,
      subscribersThisMonth: 0,
    };
  }
}
