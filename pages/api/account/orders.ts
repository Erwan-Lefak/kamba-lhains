import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { getUserOrders } from '../../../lib/prismaUsers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  try {
    // Vérifier l'authentification
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    // Récupérer les commandes de l'utilisateur
    const orders = await getUserOrders(session.user.email);

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des commandes',
      orders: []
    });
  }
}
