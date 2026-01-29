import { NextApiRequest, NextApiResponse } from 'next';
import { verifyUserCredentials } from '../../../lib/prismaUsers';

interface LoginRequest {
  email: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée'
    });
  }

  try {
    const { email, password } = req.body as LoginRequest;

    // Validation basique
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Vérifier les credentials
    const result = await verifyUserCredentials(email, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.status(200).json(result);

  } catch (error: any) {
    console.error('❌ Erreur login:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
}