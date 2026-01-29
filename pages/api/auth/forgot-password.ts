import type { NextApiRequest, NextApiResponse } from 'next';
import { createPasswordResetToken } from '../../../lib/passwordReset';
import { sendPasswordResetEmail } from '../../../lib/email';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validation
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email requis'
      });
    }

    // Vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    console.log(`🔄 Demande de réinitialisation pour: ${email}`);

    // Créer le token de réinitialisation
    const result = await createPasswordResetToken(email);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }

    // Si l'utilisateur existe, envoyer l'email
    if (result.token) {
      // Récupérer le prénom de l'utilisateur pour personnaliser l'email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          profile: true
        }
      });

      const firstName = user?.profile?.firstName || undefined;

      // Envoyer l'email de réinitialisation
      await sendPasswordResetEmail(email, result.token, firstName);
      console.log(`✅ Email de réinitialisation envoyé à ${email}`);
    }

    // Toujours retourner succès pour ne pas révéler si l'email existe
    return res.status(200).json({
      success: true,
      message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation sous peu.'
    });

  } catch (error) {
    console.error('❌ Erreur forgot-password:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue. Veuillez réessayer.'
    });
  }
}
