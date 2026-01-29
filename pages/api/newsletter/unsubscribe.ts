import { NextApiRequest, NextApiResponse } from 'next';
import { unsubscribeEmail } from '../../../lib/googleSheetsNewsletter';

/**
 * API route pour se désabonner de la newsletter
 * POST /api/newsletter/unsubscribe
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée'
    });
  }

  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'L\'email est requis'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    // Désabonner
    const result = await unsubscribeEmail(email.toLowerCase().trim());

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vous avez été désabonné(e) avec succès',
    });

  } catch (error: any) {
    console.error('❌ Erreur désabonnement newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue',
      error: error.message
    });
  }
}
