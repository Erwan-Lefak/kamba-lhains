import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { csrfProtection } from '../../../lib/middleware/csrf';

const prisma = new PrismaClient();

/**
 * GDPR/RGPD Data Export Endpoint
 * Allows users to download all their personal data
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        provider: true,
        providerId: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        profile: {
          include: {
            addresses: true
          }
        },
        orders: {
          include: {
            orderItems: true
          }
        },
        cartItems: true,
        favorites: {
          include: {
            product: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        },
        analytics: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create comprehensive data export
    const exportData = {
      exportDate: new Date().toISOString(),
      exportType: 'GDPR_DATA_EXPORT',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        provider: user.provider,
        providerId: user.providerId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin,
      },
      profile: user.profile,
      addresses: user.profile?.addresses || [],
      orders: user.orders.map(order => ({
        ...order,
        orderItems: order.orderItems
      })),
      cartItems: user.cartItems,
      favorites: user.favorites.map(fav => ({
        productName: fav.product.name,
        productSlug: fav.product.slug,
        addedAt: fav.createdAt
      })),
      analytics: user.analytics,
      dataRetentionInfo: {
        message: 'Your data is retained for 3 years from your last activity, or 7 years for fiscal records as required by law.',
        canRequestDeletion: true,
        deletionEndpoint: '/api/account/request-deletion'
      }
    };

    // Log the export for audit trail
    console.log('[GDPR] Data export requested:', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });

    // Return as JSON download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="kamba-lhains-data-export-${user.id}-${Date.now()}.json"`
    );

    return res.status(200).json(exportData);

  } catch (error) {
    console.error('Data export error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default csrfProtection(handler);
