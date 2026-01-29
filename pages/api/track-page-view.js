import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sessionId, page, userId, userAgent } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    // Create analytics entry
    const analytics = await prisma.userAnalytics.create({
      data: {
        sessionId,
        event: 'page_view',
        page: page || '/',
        userId: userId || null,
        userAgent: userAgent || req.headers['user-agent'],
      }
    });

    res.status(200).json({ success: true, analytics });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
