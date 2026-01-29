import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    // Get today's date at midnight for grouping
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert: increment count if exists, create if not
    const analytics = await prisma.productAnalytics.upsert({
      where: {
        productId_event_date: {
          productId,
          event: 'view',
          date: today
        }
      },
      update: {
        count: {
          increment: 1
        }
      },
      create: {
        productId,
        event: 'view',
        date: today,
        count: 1
      }
    });

    res.status(200).json({ success: true, analytics });
  } catch (error) {
    console.error('Error tracking product view:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
