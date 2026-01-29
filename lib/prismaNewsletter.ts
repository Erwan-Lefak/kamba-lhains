import { PrismaClient, NewsletterStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface NewsletterSubscriberData {
  email: string;
  firstName?: string;
  language?: string;
  interests?: string[];
  frequency?: string;
  source?: string;
}

/**
 * Vérifie si un email est déjà inscrit à la newsletter
 */
export async function checkNewsletterSubscriberExists(email: string): Promise<boolean> {
  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });
    return !!subscriber && subscriber.status === NewsletterStatus.ACTIVE;
  } catch (error) {
    console.error('❌ Erreur vérification abonné newsletter:', error);
    return false;
  }
}

/**
 * Ajoute un nouvel abonné à la newsletter
 */
export async function addNewsletterSubscriber(data: NewsletterSubscriberData) {
  try {
    // Vérifier si l'email existe déjà
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing && existing.status === NewsletterStatus.ACTIVE) {
      return {
        success: false,
        message: 'Cet email est déjà inscrit à la newsletter',
      };
    }

    // Si l'abonné s'était désabonné, le réactiver
    if (existing && existing.status === NewsletterStatus.UNSUBSCRIBED) {
      const subscriber = await prisma.newsletterSubscriber.update({
        where: { email: data.email.toLowerCase() },
        data: {
          status: NewsletterStatus.ACTIVE,
          firstName: data.firstName || existing.firstName,
          language: data.language || existing.language,
          interests: data.interests || existing.interests,
          frequency: data.frequency || existing.frequency,
          source: data.source || existing.source,
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      });

      console.log(`✅ Abonné réactivé: ${subscriber.email}`);
      return {
        success: true,
        message: 'Réinscription réussie !',
        subscriber,
      };
    }

    // Créer un nouvel abonné
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: data.email.toLowerCase(),
        firstName: data.firstName || null,
        language: data.language || 'fr',
        interests: data.interests || [],
        frequency: data.frequency || 'weekly',
        source: data.source || 'unknown',
        status: NewsletterStatus.ACTIVE,
      },
    });

    console.log(`✅ Nouvel abonné newsletter: ${subscriber.email}`);
    return {
      success: true,
      message: 'Inscription réussie !',
      subscriber,
    };
  } catch (error: any) {
    console.error('❌ Erreur ajout abonné newsletter:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message,
    };
  }
}

/**
 * Désabonne un email de la newsletter
 */
export async function unsubscribeNewsletterEmail(email: string) {
  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!subscriber) {
      return {
        success: false,
        message: 'Cet email n\'est pas inscrit à la newsletter',
      };
    }

    if (subscriber.status === NewsletterStatus.UNSUBSCRIBED) {
      return {
        success: false,
        message: 'Cet email est déjà désabonné',
      };
    }

    await prisma.newsletterSubscriber.update({
      where: { email: email.toLowerCase() },
      data: {
        status: NewsletterStatus.UNSUBSCRIBED,
        unsubscribedAt: new Date(),
      },
    });

    console.log(`✅ Désabonnement: ${email}`);
    return {
      success: true,
      message: 'Désabonnement réussi',
    };
  } catch (error) {
    console.error('❌ Erreur désabonnement newsletter:', error);
    return {
      success: false,
      message: 'Erreur lors du désabonnement',
    };
  }
}

/**
 * Récupère tous les abonnés actifs
 */
export async function getActiveNewsletterSubscribers() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { status: NewsletterStatus.ACTIVE },
      orderBy: { subscribedAt: 'desc' },
    });

    return subscribers;
  } catch (error) {
    console.error('❌ Erreur récupération abonnés newsletter:', error);
    return [];
  }
}

/**
 * Récupère les statistiques de la newsletter
 */
export async function getNewsletterStats() {
  try {
    const total = await prisma.newsletterSubscriber.count();
    const active = await prisma.newsletterSubscriber.count({
      where: { status: NewsletterStatus.ACTIVE },
    });
    const unsubscribed = await prisma.newsletterSubscriber.count({
      where: { status: NewsletterStatus.UNSUBSCRIBED },
    });

    return {
      total,
      active,
      unsubscribed,
    };
  } catch (error) {
    console.error('❌ Erreur récupération stats newsletter:', error);
    return { total: 0, active: 0, unsubscribed: 0 };
  }
}

/**
 * Met à jour la date du dernier email envoyé
 */
export async function updateLastEmailSent(email: string) {
  try {
    await prisma.newsletterSubscriber.update({
      where: { email: email.toLowerCase() },
      data: { lastEmailSent: new Date() },
    });
  } catch (error) {
    console.error('❌ Erreur mise à jour dernier email:', error);
  }
}

export default prisma;
