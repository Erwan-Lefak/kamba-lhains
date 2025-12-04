import { NextApiRequest, NextApiResponse } from 'next';
import { getDashboardStats, getOrdersFromSheet } from '../../../lib/googleSheetsWrite';
import { getProductsFromPublicSheet } from '../../../lib/googleSheetsPublic';

/**
 * Dashboard admin alimenté par Google Sheets
 * GET /api/admin/dashboard-sheets
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Récupérer les stats depuis Google Sheets
    const stats = await getDashboardStats();
    const products = await getProductsFromPublicSheet();

    // Calculer les produits populaires basés sur les commandes
    const topProducts = products.slice(0, 5).map((product, index) => ({
      id: product.id,
      name: product.name,
      sales: Math.floor(Math.random() * 50) + 10, // À remplacer par de vraies données
      revenue: product.price * (Math.floor(Math.random() * 50) + 10),
      price: product.price,
      image: product.image,
      views: Math.floor(Math.random() * 500) + 100,
    }));

    // Articles en rupture de stock
    const lowStockItems = products
      .filter(p => !p.inStock)
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        name: p.name,
        stock: 0,
        color: p.colors[0] || 'N/A',
        size: p.sizes[0] || 'N/A',
      }));

    res.status(200).json({
      totalRevenue: stats.totalRevenue,
      ordersToday: stats.ordersToday,
      totalOrders: stats.totalOrders,
      averageOrderValue: stats.averageOrderValue,
      conversionRate: stats.conversionRate,
      returningCustomers: stats.returningCustomers,
      recentOrders: stats.recentOrders,
      topProducts,
      lowStockItems,
    });
  } catch (error: any) {
    console.error('❌ Erreur dashboard:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des données',
      error: error.message,
    });
  }
}
