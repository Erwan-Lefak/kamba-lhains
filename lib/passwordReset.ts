import crypto from 'crypto';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

/**
 * Génère un token sécurisé pour la réinitialisation de mot de passe
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Crée un token de réinitialisation pour un utilisateur
 * Le token expire après 1 heure
 */
export async function createPasswordResetToken(email: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      return {
        success: true,
        token: '' // Retourner success même si l'user n'existe pas
      };
    }

    // Vérifier que l'utilisateur n'utilise pas OAuth
    if (user.provider) {
      return {
        success: false,
        error: 'Cet email est associé à une connexion via ' + user.provider + '. Veuillez utiliser cette méthode pour vous connecter.'
      };
    }

    // Générer le token
    const token = generateResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expire dans 1 heure

    // Sauvegarder le token dans la base de données
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expiresAt
      }
    });

    return {
      success: true,
      token
    };
  } catch (error) {
    console.error('Erreur lors de la création du token de réinitialisation:', error);
    return {
      success: false,
      error: 'Une erreur est survenue'
    };
  }
}

/**
 * Vérifie si un token de réinitialisation est valide
 */
export async function verifyResetToken(token: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token }
    });

    if (!user) {
      return {
        valid: false,
        error: 'Token invalide'
      };
    }

    // Vérifier si le token a expiré
    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return {
        valid: false,
        error: 'Le lien de réinitialisation a expiré'
      };
    }

    return {
      valid: true,
      userId: user.id
    };
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return {
      valid: false,
      error: 'Une erreur est survenue'
    };
  }
}

/**
 * Réinitialise le mot de passe d'un utilisateur avec un token valide
 */
export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier le token
    const verification = await verifyResetToken(token);
    if (!verification.valid || !verification.userId) {
      return {
        success: false,
        error: verification.error || 'Token invalide'
      };
    }

    // Hasher le nouveau mot de passe
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe et supprimer le token
    await prisma.user.update({
      where: { id: verification.userId },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la réinitialisation'
    };
  }
}

/**
 * Nettoie les tokens de réinitialisation expirés (à exécuter périodiquement)
 */
export async function cleanupExpiredTokens(): Promise<void> {
  try {
    await prisma.user.updateMany({
      where: {
        passwordResetExpires: {
          lt: new Date()
        }
      },
      data: {
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage des tokens expirés:', error);
  }
}
