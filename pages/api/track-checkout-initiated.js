import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sessionId, userId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    // Track checkout initiated event
    await prisma.userAnalytics.create({
      data: {
        userId: userId || null,
        event: 'checkout_initiated',
        sessionId,
        userAgent: req.headers['user-agent'] || null,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking checkout initiated:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
