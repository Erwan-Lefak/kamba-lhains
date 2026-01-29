import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { updateUserInfo } from '../../../lib/prismaUsers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  try {
    // Vérifier l'authentification
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    const { firstName, lastName, phone } = req.body;

    // Validation basique
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Le prénom et le nom sont requis'
      });
    }

    // Mettre à jour les informations
    const result = await updateUserInfo(session.user.email, {
      firstName,
      lastName,
      phone: phone || ''
    });

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Erreur update-info:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour'
    });
  }
}
