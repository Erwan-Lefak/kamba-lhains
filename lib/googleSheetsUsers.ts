import { google } from 'googleapis';
import * as bcrypt from 'bcryptjs';

/**
 * Gestion des utilisateurs dans Google Sheets
 * Structure : Email | Prénom | Nom | Password (hashé) | Date création | Dernière connexion | Statut | Provider | Provider ID
 */

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Initialise le client Google Sheets
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
 * Interface pour un utilisateur
 */
export interface User {
  email: string;
  firstName: string;
  lastName: string;
  password: string; // Sera hashé avant stockage (vide pour OAuth)
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'suspended';
  provider?: string; // 'google', 'facebook', 'apple', ou vide pour email
  providerId?: string; // ID du provider OAuth
}

/**
 * Vérifie si un email existe déjà
 */
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_USERS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_USERS_ID non défini');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Users!A:A', // Colonne des emails
    });

    const rows = response.data.values || [];

    // Ignorer l'en-tête et chercher l'email
    return rows.slice(1).some((row: any[]) =>
      row[0]?.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error('❌ Erreur vérification utilisateur:', error);
    throw error;
  }
}

/**
 * Crée un nouvel utilisateur
 */
export async function createUser(user: User) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_USERS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_USERS_ID non défini');
    }

    // Vérifier si l'utilisateur existe déjà
    const exists = await checkUserExists(user.email);
    if (exists) {
      return {
        success: false,
        message: 'Un compte avec cet email existe déjà'
      };
    }

    // Hasher le mot de passe (seulement si présent - vide pour OAuth)
    const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : '';

    // Formater les données pour Google Sheets
    const row = [
      user.email,
      user.firstName,
      user.lastName,
      hashedPassword,
      user.createdAt,
      user.lastLogin || '',
      user.status,
      user.provider || '', // Colonne H
      user.providerId || '', // Colonne I
    ];

    // Ajouter la ligne dans le sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Users!A:I',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    console.log(`✅ Utilisateur ${user.email} créé avec succès`);
    return {
      success: true,
      message: 'Compte créé avec succès !',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      }
    };
  } catch (error: any) {
    console.error('❌ Erreur création utilisateur:', error);
    throw error;
  }
}

/**
 * Récupère un utilisateur par email
 */
export async function getUserByEmail(email: string) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_USERS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_USERS_ID non défini');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Users!A:I',
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return null;

    const [headers, ...dataRows] = rows;

    // Trouver l'utilisateur
    const userRow = dataRows.find((row: any[]) =>
      row[0]?.toLowerCase() === email.toLowerCase()
    );

    if (!userRow) return null;

    return {
      email: userRow[0] || '',
      firstName: userRow[1] || '',
      lastName: userRow[2] || '',
      password: userRow[3] || '', // Password hashé
      createdAt: userRow[4] || '',
      lastLogin: userRow[5] || '',
      status: userRow[6] || 'active',
      provider: userRow[7] || '',
      providerId: userRow[8] || '',
    };
  } catch (error) {
    console.error('❌ Erreur récupération utilisateur:', error);
    return null;
  }
}

/**
 * Vérifie les credentials d'un utilisateur (login)
 */
export async function verifyUserCredentials(email: string, password: string) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message: 'Email ou mot de passe incorrect'
      };
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return {
        success: false,
        message: 'Email ou mot de passe incorrect'
      };
    }

    // Mettre à jour la dernière connexion
    await updateLastLogin(email);

    return {
      success: true,
      message: 'Connexion réussie',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        status: user.status,
      }
    };
  } catch (error) {
    console.error('❌ Erreur vérification credentials:', error);
    throw error;
  }
}

/**
 * Met à jour la date de dernière connexion
 */
export async function updateLastLogin(email: string) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_USERS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_USERS_ID non défini');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Users!A:I',
    });

    const rows = response.data.values || [];
    const dataRows = rows.slice(1);

    // Trouver l'index de l'utilisateur
    const userIndex = dataRows.findIndex((row: any[]) =>
      row[0]?.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) return;

    // Mettre à jour la dernière connexion (colonne F = index 5)
    const rowNumber = userIndex + 2; // +1 pour header, +1 pour index 0
    const now = new Date().toISOString();

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Users!F${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[now]],
      },
    });

    console.log(`✅ Dernière connexion mise à jour pour ${email}`);
  } catch (error) {
    console.error('❌ Erreur mise à jour dernière connexion:', error);
  }
}

/**
 * Met à jour les informations d'un utilisateur
 */
export async function updateUserInfo(email: string, updates: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_USERS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_USERS_ID non défini');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Users!A:J', // Ajout d'une colonne J pour le téléphone
    });

    const rows = response.data.values || [];
    const dataRows = rows.slice(1);

    // Trouver l'index de l'utilisateur
    const userIndex = dataRows.findIndex((row: any[]) =>
      row[0]?.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) {
      return {
        success: false,
        message: 'Utilisateur non trouvé'
      };
    }

    const rowNumber = userIndex + 2; // +1 pour header, +1 pour index 0
    const userRow = dataRows[userIndex];

    // Préparer les mises à jour
    const updateData: any[] = [];

    if (updates.firstName !== undefined) {
      updateData.push({
        range: `Users!B${rowNumber}`,
        values: [[updates.firstName]]
      });
    }

    if (updates.lastName !== undefined) {
      updateData.push({
        range: `Users!C${rowNumber}`,
        values: [[updates.lastName]]
      });
    }

    if (updates.phone !== undefined) {
      updateData.push({
        range: `Users!J${rowNumber}`,
        values: [[updates.phone]]
      });
    }

    // Effectuer toutes les mises à jour
    if (updateData.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'RAW',
          data: updateData
        }
      });
    }

    console.log(`✅ Informations mises à jour pour ${email}`);
    return {
      success: true,
      message: 'Informations mises à jour avec succès'
    };
  } catch (error) {
    console.error('❌ Erreur mise à jour utilisateur:', error);
    return {
      success: false,
      message: 'Erreur lors de la mise à jour'
    };
  }
}

/**
 * Change le mot de passe d'un utilisateur
 */
export async function updateUserPassword(email: string, currentPassword: string, newPassword: string) {
  try {
    // Vérifier d'abord le mot de passe actuel
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur non trouvé'
      };
    }

    // Si l'utilisateur s'est connecté via OAuth, il n'a pas de mot de passe
    if (!user.password) {
      return {
        success: false,
        message: 'Vous êtes connecté via un réseau social. Vous ne pouvez pas changer de mot de passe.'
      };
    }

    // Vérifier le mot de passe actuel
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return {
        success: false,
        message: 'Mot de passe actuel incorrect'
      };
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour dans Google Sheets
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_USERS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_USERS_ID non défini');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Users!A:I',
    });

    const rows = response.data.values || [];
    const dataRows = rows.slice(1);

    const userIndex = dataRows.findIndex((row: any[]) =>
      row[0]?.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) {
      return {
        success: false,
        message: 'Utilisateur non trouvé'
      };
    }

    const rowNumber = userIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Users!D${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[hashedPassword]],
      },
    });

    console.log(`✅ Mot de passe mis à jour pour ${email}`);
    return {
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    };
  } catch (error) {
    console.error('❌ Erreur changement mot de passe:', error);
    return {
      success: false,
      message: 'Erreur lors du changement de mot de passe'
    };
  }
}

/**
 * Supprime un utilisateur (soft delete en changeant le statut)
 */
export async function deleteUser(email: string) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_USERS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_USERS_ID non défini');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Users!A:I',
    });

    const rows = response.data.values || [];
    const dataRows = rows.slice(1);

    const userIndex = dataRows.findIndex((row: any[]) =>
      row[0]?.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) {
      return {
        success: false,
        message: 'Utilisateur non trouvé'
      };
    }

    const rowNumber = userIndex + 2;

    // Soft delete: changer le statut en "deleted"
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Users!G${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['deleted']],
      },
    });

    console.log(`✅ Compte supprimé pour ${email}`);
    return {
      success: true,
      message: 'Compte supprimé avec succès'
    };
  } catch (error) {
    console.error('❌ Erreur suppression compte:', error);
    return {
      success: false,
      message: 'Erreur lors de la suppression du compte'
    };
  }
}

/**
 * Récupère les statistiques des utilisateurs
 */
export async function getUserStats() {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_USERS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_USERS_ID non défini');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Users!A:I',
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        usersThisMonth: 0,
      };
    }

    const [headers, ...dataRows] = rows;

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const stats = {
      totalUsers: dataRows.length,
      activeUsers: dataRows.filter((row: any[]) => row[6] === 'active').length,
      usersThisMonth: dataRows.filter((row: any[]) =>
        row[4]?.startsWith(thisMonth)
      ).length,
    };

    return stats;
  } catch (error) {
    console.error('❌ Erreur stats utilisateurs:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      usersThisMonth: 0,
    };
  }
}
