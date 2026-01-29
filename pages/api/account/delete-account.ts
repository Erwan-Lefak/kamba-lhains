import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { deleteUser } from '../../../lib/prismaUsers';

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

    // Supprimer le compte (soft delete)
    const result = await deleteUser(session.user.email);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Erreur delete-account:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du compte'
    });
  }
}
