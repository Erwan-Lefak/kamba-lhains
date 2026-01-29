import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyResetToken, resetPassword } from '../../../lib/passwordReset';
import { sendPasswordChangedEmail } from '../../../lib/email';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET: Vérifier si un token est valide
  if (req.method === 'GET') {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        return res.status(400).json({
          valid: false,
          error: 'Token manquant'
        });
      }

      const verification = await verifyResetToken(token);

      return res.status(200).json(verification);
    } catch (error) {
      console.error('❌ Erreur vérification token:', error);
      return res.status(500).json({
        valid: false,
        error: 'Une erreur est survenue'
      });
    }
  }

  // POST: Réinitialiser le mot de passe
  if (req.method === 'POST') {
    try {
      const { token, password } = req.body;

      // Validation
      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: 'Token et mot de passe requis'
        });
      }

      if (typeof token !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Données invalides'
        });
      }

      // Validation du mot de passe
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe doit contenir au moins 6 caractères'
        });
      }

      console.log(`🔄 Réinitialisation de mot de passe avec token...`);

      // Vérifier le token et obtenir l'ID de l'utilisateur
      const verification = await verifyResetToken(token);

      if (!verification.valid || !verification.userId) {
        return res.status(400).json({
          success: false,
          message: verification.error || 'Token invalide'
        });
      }

      // Réinitialiser le mot de passe
      const result = await resetPassword(token, password);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      // Récupérer les informations de l'utilisateur pour l'email de confirmation
      const user = await prisma.user.findUnique({
        where: { id: verification.userId },
        include: {
          profile: true
        }
      });

      if (user) {
        // Envoyer l'email de confirmation
        await sendPasswordChangedEmail(user.email, user.profile?.firstName || undefined);
        console.log(`✅ Mot de passe réinitialisé pour ${user.email}`);
      }

      return res.status(200).json({
        success: true,
        message: 'Votre mot de passe a été réinitialisé avec succès'
      });

    } catch (error) {
      console.error('❌ Erreur reset-password:', error);
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer.'
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}
