import { NextApiRequest, NextApiResponse } from 'next';
import { addSubscriber, NewsletterSubscriber } from '../../../lib/googleSheetsNewsletter';
import { sendWelcomeEmail } from '../../../lib/newsletterEmails';
import { addNewsletterSubscriber } from '../../../lib/prismaNewsletter';

/**
 * API route pour l'inscription à la newsletter
 * POST /api/newsletter/subscribe
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée'
    });
  }

  try {
    const { email, firstName, interests, frequency, source, language } = req.body;

    // Validation basique
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'L\'email est requis'
      });
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    // Créer l'objet subscriber
    const subscriber: NewsletterSubscriber = {
      email: email.toLowerCase().trim(),
      firstName: firstName?.trim() || '',
      subscribedAt: new Date().toISOString(),
      status: 'active',
      interests: interests || [],
      frequency: frequency || 'weekly',
      source: source || 'unknown',
    };

    // Déterminer la langue (fr par défaut)
    const userLanguage = language === 'en' ? 'en' : 'fr';

    // Envoyer l'email de bienvenue FIRST (priorité absolue)
    const emailResult = await sendWelcomeEmail(subscriber, userLanguage);

    if (!emailResult.success) {
      console.error('❌ Échec envoi email:', emailResult.error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de confirmation'
      });
    }

    console.log(`✅ Email de bienvenue envoyé à ${email}`);

    // Sauvegarder dans la base de données Prisma (PRIORITAIRE)
    const dbResult = await addNewsletterSubscriber({
      email: subscriber.email,
      firstName: subscriber.firstName,
      language: userLanguage,
      interests: subscriber.interests,
      frequency: subscriber.frequency,
      source: subscriber.source,
    });

    if (!dbResult.success) {
      console.error('❌ Échec sauvegarde BDD:', dbResult.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la sauvegarde de votre inscription',
      });
    }

    console.log(`✅ Abonné sauvegardé en BDD: ${email}`);

    // Tenter d'ajouter à Google Sheets (optionnel, ne bloque pas si ça échoue)
    try {
      const sheetsResult = await addSubscriber(subscriber);
      if (sheetsResult.success) {
        console.log(`✅ Ajouté à Google Sheets: ${email}`);
      } else {
        console.warn(`⚠️ Google Sheets failed (non-blocking): ${sheetsResult.message}`);
      }
    } catch (sheetsError) {
      // L'inscription est réussie même si Google Sheets échoue
      console.warn('⚠️ Google Sheets error (non-blocking):', sheetsError);
    }

    res.status(200).json({
      success: true,
      message: 'Inscription réussie ! Vérifiez votre boîte mail.',
    });

  } catch (error: any) {
    console.error('❌ Erreur inscription newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'inscription',
      error: error.message
    });
  }
}
