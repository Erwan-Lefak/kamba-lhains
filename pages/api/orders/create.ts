import { NextApiRequest, NextApiResponse } from 'next';
import { addOrderToSheet } from '../../../lib/googleSheetsWrite';
import { sendOrderConfirmationEmail } from '../../../lib/email';

/**
 * API pour créer une nouvelle commande
 * POST /api/orders/create
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const orderData = req.body;

    // Générer un numéro de commande unique
    const orderNumber = `KL-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const order = {
      ...orderData,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      paymentStatus: 'PENDING',
    };

    // 1. Enregistrer dans Google Sheets
    try {
      await addOrderToSheet(order);
    } catch (sheetError) {
      console.error('⚠️ Erreur Google Sheets (non bloquant):', sheetError);
      // On continue même si Google Sheets échoue
    }

    // 2. Envoyer l'email de confirmation
    try {
      await sendOrderConfirmationEmail(order);
    } catch (emailError) {
      console.error('⚠️ Erreur email (non bloquant):', emailError);
      // On continue même si l'email échoue
    }

    // 3. Retourner la commande créée
    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error: any) {
    console.error('❌ Erreur création commande:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la création de la commande',
    });
  }
}
