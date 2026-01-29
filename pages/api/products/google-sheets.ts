import { NextApiRequest, NextApiResponse } from 'next';
import { getProductsFromPublicSheet } from '../../../lib/googleSheetsPublic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const forceRefresh = req.query.refresh === 'true';
    const products = await getProductsFromPublicSheet(forceRefresh);

    res.status(200).json({
      success: true,
      data: products,
      cached: !forceRefresh,
      count: products.length,
    });
  } catch (error: any) {
    console.error('Erreur API Google Sheets:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la récupération des produits',
    });
  }
}
