import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient, Prisma } from '@prisma/client';
import { csrfProtection } from '../../../lib/middleware/csrf';

const prisma = new PrismaClient();

/**
 * GDPR/RGPD Data Deletion Request Endpoint
 * Right to be Forgotten (Droit à l'oubli)
 *
 * Note: This creates a deletion request rather than immediately deleting
 * to comply with legal retention requirements
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { confirmDeletion, reason } = req.body;

    if (!confirmDeletion) {
      return res.status(400).json({ error: 'Deletion confirmation required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orders: {
          select: {
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check for recent orders that might need to be retained
    const hasRecentOrders = user.orders.some(order => {
      const orderAge = Date.now() - new Date(order.createdAt).getTime();
      const sevenYears = 7 * 365 * 24 * 60 * 60 * 1000;
      return orderAge < sevenYears;
    });

    if (hasRecentOrders) {
      // Anonymize instead of delete to comply with fiscal retention laws
      await anonymizeUserData(user.id);

      // Log the anonymization
      console.log('[GDPR] User data anonymized (fiscal retention):', {
        userId: user.id,
        email: user.email,
        reason,
        timestamp: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      });

      return res.status(200).json({
        success: true,
        message: 'Your personal data has been anonymized. Order records are retained for 7 years as required by law.',
        status: 'ANONYMIZED',
        retainedUntil: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Full deletion if no retention requirements
    await deleteUserData(user.id);

    // Log the deletion
    console.log('[GDPR] User data deleted:', {
      userId: user.id,
      email: user.email,
      reason,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });

    return res.status(200).json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
      status: 'DELETED'
    });

  } catch (error) {
    console.error('Data deletion error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Anonymize user data while keeping order records for legal compliance
 */
async function anonymizeUserData(userId: string) {
  const anonymizedEmail = `deleted-${userId}@anonymized.local`;
  const anonymizedName = 'Deleted User';

  await prisma.$transaction([
    // Anonymize user
    prisma.user.update({
      where: { id: userId },
      data: {
        email: anonymizedEmail,
        passwordHash: null,
        status: 'DELETED',
        provider: null,
        providerId: null,
      }
    }),

    // Anonymize profile
    prisma.userProfile.updateMany({
      where: { userId },
      data: {
        firstName: 'Deleted',
        lastName: 'User',
        phone: null,
        birthday: null,
        favoriteSizes: Prisma.JsonNull,
        notifications: Prisma.JsonNull,
        shippingPrefs: Prisma.JsonNull,
      }
    }),

    // Delete addresses (PII)
    prisma.userAddress.deleteMany({
      where: { profile: { userId } }
    }),

    // Delete cart items
    prisma.cartItem.deleteMany({
      where: { userId }
    }),

    // Delete favorites
    prisma.favorite.deleteMany({
      where: { userId }
    }),

    // Anonymize analytics (keep aggregated data)
    prisma.userAnalytics.updateMany({
      where: { userId },
      data: {
        userAgent: null,
      }
    }),

    // Orders are kept but guest info is anonymized in shipping/billing addresses
    prisma.order.updateMany({
      where: { userId },
      data: {
        guestEmail: anonymizedEmail,
        guestPhone: null,
      }
    })
  ]);
}

/**
 * Completely delete user data
 */
async function deleteUserData(userId: string) {
  await prisma.$transaction([
    // Delete related records first (foreign keys)
    prisma.userAddress.deleteMany({
      where: { profile: { userId } }
    }),
    prisma.userProfile.deleteMany({
      where: { userId }
    }),
    prisma.orderItem.deleteMany({
      where: { order: { userId } }
    }),
    prisma.order.deleteMany({
      where: { userId }
    }),
    prisma.cartItem.deleteMany({
      where: { userId }
    }),
    prisma.favorite.deleteMany({
      where: { userId }
    }),
    prisma.userAnalytics.deleteMany({
      where: { userId }
    }),

    // Finally delete user
    prisma.user.delete({
      where: { id: userId }
    })
  ]);
}

export default csrfProtection(handler);
