import { NextApiRequest, NextApiResponse } from 'next';

/**
 * SECURE DEBUG ENDPOINT - Only accessible in development mode
 * Shows configuration status without exposing sensitive values
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CRITICAL: Only allow in development, never in production
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' }); // Return 404 to hide endpoint existence
  }

  // Additional security: Require a debug token in development
  const debugToken = req.headers['x-debug-token'];
  if (debugToken !== process.env.DEBUG_TOKEN && process.env.DEBUG_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Only show boolean flags and masked info - never actual values
  const envVars = {
    environment: process.env.NODE_ENV,
    database: {
      hasConnectionString: !!process.env.DATABASE_URL,
      isPrismaConfigured: !!process.env.PRISMA_DATABASE_URL,
    },
    authentication: {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    },
    stripe: {
      hasPublicKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      mode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'LIVE' : 'TEST',
    },
    google: {
      hasServiceAccountEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasOAuthClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasOAuthClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasSheetsId: !!process.env.GOOGLE_SHEETS_ID,
      hasNewsletterSheetId: !!process.env.GOOGLE_SHEETS_NEWSLETTER_ID,
    },
    email: {
      hasResendKey: !!process.env.RESEND_API_KEY,
    },
    cloudinary: {
      configured: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(envVars);
}
