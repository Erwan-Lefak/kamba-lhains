import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Export orders to CSV
 * GET /api/admin/export-orders
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { range = '30d', status } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Build filter
    const where: any = {
      createdAt: {
        gte: startDate
      }
    };

    if (status) {
      where.status = status;
    }

    // Fetch orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Generate CSV
    const csvRows: string[] = [];

    // Header
    csvRows.push([
      'Numéro commande',
      'Date',
      'Client',
      'Email',
      'Statut',
      'Statut paiement',
      'Montant total',
      'Frais de port',
      'Taxes',
      'Produits',
      'Adresse de livraison'
    ].join(','));

    // Data rows
    orders.forEach(order => {
      const shippingAddress = typeof order.shippingAddress === 'object'
        ? order.shippingAddress as any
        : {};

      const products = order.orderItems
        .map(item => `${item.productName} (${item.color} / ${item.size}) x${item.quantity}`)
        .join(' | ');

      const addressStr = shippingAddress.address1
        ? `${shippingAddress.address1} ${shippingAddress.postalCode} ${shippingAddress.city}`
        : 'N/A';

      csvRows.push([
        order.orderNumber,
        new Date(order.createdAt).toLocaleDateString('fr-FR'),
        order.guestEmail ? 'Invité' : (order.user?.email || 'N/A'),
        order.guestEmail || order.user?.email || 'N/A',
        order.status,
        order.paymentStatus,
        order.totalAmount.toString(),
        order.shippingCost.toString(),
        order.taxAmount.toString(),
        `"${products}"`,
        `"${addressStr}"`
      ].join(','));
    });

    const csv = csvRows.join('\n');

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=commandes-${range}.csv`);

    // Add BOM for Excel UTF-8 compatibility
    res.write('\uFEFF');
    res.write(csv);
    res.end();

  } catch (error: any) {
    console.error('❌ Erreur export commandes:', error);
    res.status(500).json({
      message: 'Erreur lors de l\'export',
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
