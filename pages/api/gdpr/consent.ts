import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { csrfProtection } from '../../../lib/middleware/csrf';

const prisma = new PrismaClient();

/**
 * GDPR/RGPD Consent Management Endpoint
 * Records and manages user consent for data processing
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get current consent status
    return getConsentStatus(req, res);
  } else if (req.method === 'POST') {
    // Update consent preferences
    return updateConsent(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getConsentStatus(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Note: GDPR consent fields are not yet in the schema
    // For now, consent is implicit by account creation
    return res.status(200).json({
      consent: {
        gdpr: true, // Implicit by account creation
        gdprDate: user.createdAt,
        marketing: false, // Default opt-out
        analytics: true, // Default opt-in for analytics
      },
      dataRetentionPolicy: {
        userDataRetention: '3 years from last activity',
        fiscalRecordsRetention: '7 years as required by law',
        rightToAccess: true,
        rightToRectification: true,
        rightToErasure: true,
        rightToDataPortability: true,
        rightToObject: true
      },
      note: 'GDPR consent tracking will be enhanced in a future update with dedicated schema fields.'
    });

  } catch (error) {
    console.error('Get consent error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateConsent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { gdprConsent, marketingConsent, analyticsConsent } = req.body;

    // GDPR consent is mandatory for account creation
    if (gdprConsent === false) {
      return res.status(400).json({
        error: 'GDPR consent is required to use our services'
      });
    }

    // Note: Since GDPR fields are not yet in schema, we just log the preferences
    // In a future update, these will be stored in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Log consent change for audit trail
    console.log('[GDPR] Consent updated:', {
      userId: user.id,
      email: user.email,
      gdprConsent: gdprConsent ?? true,
      marketingConsent: marketingConsent ?? false,
      analyticsConsent: analyticsConsent ?? true,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });

    return res.status(200).json({
      success: true,
      message: 'Consent preferences logged successfully',
      consent: {
        gdpr: gdprConsent ?? true,
        marketing: marketingConsent ?? false,
        analytics: analyticsConsent ?? true,
        updatedAt: new Date().toISOString()
      },
      note: 'GDPR consent tracking will be enhanced in a future update with dedicated schema fields.'
    });

  } catch (error) {
    console.error('Update consent error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default csrfProtection(handler);
