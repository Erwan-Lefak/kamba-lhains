import type { NextApiRequest, NextApiResponse } from 'next';
import { updateOrderStatus } from '../../../lib/googleSheetsWrite';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderNumber, status, trackingNumber } = req.body;

    if (!orderNumber || !status) {
      return res.status(400).json({
        error: 'orderNumber et status sont requis'
      });
    }

    await updateOrderStatus(orderNumber, status, trackingNumber);

    res.status(200).json({
      success: true,
      message: 'Statut mis à jour avec succès',
    });
  } catch (error: any) {
    console.error('❌ Erreur update order:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour',
      details: error.message,
    });
  }
}
