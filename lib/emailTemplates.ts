/**
 * Système de gestion des templates d'email
 * Permet de gérer et modifier les templates depuis le dashboard admin
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  variables: string[]; // Variables disponibles comme {firstName}, {orderNumber}, etc.
  htmlContent: string;
  category: 'newsletter' | 'order' | 'welcome' | 'marketing' | 'notification';
  isActive: boolean;
  lastModified: string;
}

// Templates par défaut
export const defaultTemplates: EmailTemplate[] = [
  {
    id: 'newsletter-welcome',
    name: 'Bienvenue Newsletter',
    subject: 'Bienvenue dans la communauté Kamba Lhains',
    description: 'Email envoyé automatiquement lors de l\'inscription à la newsletter',
    variables: ['firstName', 'frequency'],
    category: 'newsletter',
    isActive: true,
    lastModified: new Date().toISOString(),
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez Kamba Lhains</title>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9f9f9;">
  <!-- Header -->
  <div style="background: #000; color: #fff; padding: 40px 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 3px;">KAMBA LHAINS</h1>
    <p style="margin: 10px 0 0 0; font-size: 12px; letter-spacing: 2px; color: #999;">MODE INTEMPORELLE & ÉCORESPONSABLE</p>
  </div>

  <!-- Main Content -->
  <div style="padding: 40px 30px; background: #fff;">
    <h2 style="color: #000; font-size: 22px; font-weight: 400; margin-bottom: 20px; text-align: center;">
      Bienvenue {firstName}
    </h2>

    <p style="color: #666; margin-bottom: 25px; font-size: 15px; line-height: 1.8;">
      Merci de rejoindre la communauté <strong>Kamba Lhains</strong>. Nous sommes ravis de vous compter parmi nous.
    </p>

    <p style="color: #666; margin-bottom: 25px; font-size: 15px; line-height: 1.8;">
      En vous inscrivant à notre newsletter, vous bénéficiez de :
    </p>

    <!-- Benefits List -->
    <div style="background: #f9f9f9; padding: 25px; border-left: 4px solid #000; margin-bottom: 30px;">
      <ul style="margin: 0; padding: 0 0 0 20px; color: #333; font-size: 14px; line-height: 2;">
        <li><strong>Avant-premières exclusives</strong> de nos nouvelles collections</li>
        <li><strong>Offres spéciales</strong> réservées à nos abonnés</li>
        <li><strong>Coulisses de la création</strong> et notre engagement écoresponsable</li>
        <li><strong>Conseils mode</strong> et tendances durables</li>
        <li><strong>Invitations privilégiées</strong> à nos événements</li>
      </ul>
    </div>

    <!-- Call to Action -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="https://kamba-lhains.com"
         style="display: inline-block; background: #000; color: #fff; padding: 15px 40px; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">
        DÉCOUVRIR LA COLLECTION
      </a>
    </div>

    <!-- Social Media -->
    <div style="text-align: center; margin: 40px 0 20px 0; padding-top: 30px; border-top: 1px solid #eee;">
      <p style="margin: 0 0 15px 0; color: #999; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">
        Suivez-nous
      </p>
      <div style="display: inline-block;">
        <a href="https://www.instagram.com/kambalhains/" style="display: inline-block; margin: 0 10px; color: #000; text-decoration: none; font-size: 13px;">Instagram</a>
        <span style="color: #ddd;">•</span>
        <a href="https://www.facebook.com/share/1QP2wxTkDe/?mibextid=wwXIfr" style="display: inline-block; margin: 0 10px; color: #000; text-decoration: none; font-size: 13px;">Facebook</a>
        <span style="color: #ddd;">•</span>
        <a href="https://www.tiktok.com/@kambalhains?_t=ZN-90okin6RHYk&_r=1" style="display: inline-block; margin: 0 10px; color: #000; text-decoration: none; font-size: 13px;">TikTok</a>
        <span style="color: #ddd;">•</span>
        <a href="https://x.com/kambalhains?s=21" style="display: inline-block; margin: 0 10px; color: #000; text-decoration: none; font-size: 13px;">X</a>
      </div>
    </div>

    <!-- Frequency Info -->
    <div style="background: #f9f9f9; padding: 20px; text-align: center; margin-top: 30px;">
      <p style="margin: 0; color: #666; font-size: 12px; line-height: 1.6;">
        Vous recevrez nos actualités <strong>{frequency}</strong>.<br>
        Nous respectons votre boîte mail, pas de spam, promis !
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="background: #f0f0f0; padding: 30px 20px; text-align: center; color: #666; font-size: 11px;">
    <p style="margin: 0 0 10px 0;">
      <a href="https://kamba-lhains.com" style="color: #333; text-decoration: none; font-weight: 500;">www.kamba-lhains.com</a>
    </p>
    <p style="margin: 0 0 15px 0; color: #999;">
      © {year} Kamba Lhains. Tous droits réservés.
    </p>
    <p style="margin: 0; color: #999;">
      Vous recevez cet email car vous vous êtes inscrit(e) à notre newsletter.<br>
      <a href="https://kamba-lhains.com/newsletter" style="color: #666; text-decoration: underline;">Se désabonner</a>
    </p>
  </div>
</body>
</html>`
  },
  {
    id: 'order-confirmation',
    name: 'Confirmation de commande',
    subject: 'Commande confirmée #{orderNumber}',
    description: 'Email envoyé lors de la confirmation d\'une commande',
    variables: ['firstName', 'orderNumber', 'totalAmount', 'orderDate'],
    category: 'order',
    isActive: true,
    lastModified: new Date().toISOString(),
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9f9f9;">
  <!-- Header -->
  <div style="background: #000; color: #fff; padding: 40px 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 3px;">KAMBA LHAINS</h1>
    <p style="margin: 10px 0 0 0; font-size: 12px; letter-spacing: 2px; color: #999;">CONFIRMATION DE COMMANDE</p>
  </div>

  <!-- Main Content -->
  <div style="padding: 40px 30px; background: #fff;">
    <h2 style="color: #000; font-size: 22px; font-weight: 400; margin-bottom: 20px;">
      Merci pour votre commande {firstName} !
    </h2>

    <p style="color: #666; margin-bottom: 25px; font-size: 15px; line-height: 1.8;">
      Votre commande <strong>#{orderNumber}</strong> a été confirmée et est en cours de préparation.
    </p>

    <div style="background: #f9f9f9; padding: 25px; border-left: 4px solid #000; margin-bottom: 30px;">
      <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">Numéro de commande</p>
      <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 500; color: #000;">#{orderNumber}</p>

      <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">Date de commande</p>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #000;">{orderDate}</p>

      <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">Montant total</p>
      <p style="margin: 0; font-size: 20px; font-weight: 500; color: #000;">{totalAmount} €</p>
    </div>

    <p style="color: #666; margin-bottom: 25px; font-size: 15px;">
      Vous recevrez un email de confirmation dès l'expédition de votre colis avec un numéro de suivi.
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a href="https://kamba-lhains.com"
         style="display: inline-block; background: #000; color: #fff; padding: 15px 40px; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">
        RETOUR SUR LE SITE
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="background: #f0f0f0; padding: 30px 20px; text-align: center; color: #666; font-size: 11px;">
    <p style="margin: 0 0 10px 0;">
      <a href="https://kamba-lhains.com" style="color: #333; text-decoration: none; font-weight: 500;">www.kamba-lhains.com</a>
    </p>
    <p style="margin: 0 0 15px 0; color: #999;">
      © {year} Kamba Lhains. Tous droits réservés.
    </p>
  </div>
</body>
</html>`
  },
  {
    id: 'order-shipped',
    name: 'Commande expédiée',
    subject: 'Votre commande #{orderNumber} a été expédiée',
    description: 'Email envoyé lorsqu\'une commande est expédiée avec le tracking',
    variables: ['firstName', 'orderNumber', 'trackingNumber', 'carrier'],
    category: 'order',
    isActive: true,
    lastModified: new Date().toISOString(),
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9f9f9;">
  <div style="background: #000; color: #fff; padding: 40px 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 3px;">KAMBA LHAINS</h1>
    <p style="margin: 10px 0 0 0; font-size: 12px; letter-spacing: 2px; color: #999;">COMMANDE EXPÉDIÉE</p>
  </div>

  <div style="padding: 40px 30px; background: #fff;">
    <h2 style="color: #000; font-size: 22px; font-weight: 400; margin-bottom: 20px;">
      Bonne nouvelle {firstName} !
    </h2>

    <p style="color: #666; margin-bottom: 25px; font-size: 15px; line-height: 1.8;">
      Votre commande <strong>#{orderNumber}</strong> a été expédiée et sera bientôt chez vous.
    </p>

    <div style="background: #f9f9f9; padding: 25px; border-left: 4px solid #000; margin-bottom: 30px;">
      <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">Transporteur</p>
      <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 500; color: #000;">{carrier}</p>

      <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">Numéro de suivi</p>
      <p style="margin: 0; font-size: 18px; font-weight: 500; color: #000;">{trackingNumber}</p>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="https://kamba-lhains.com"
         style="display: inline-block; background: #000; color: #fff; padding: 15px 40px; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">
        SUIVRE MA COMMANDE
      </a>
    </div>
  </div>

  <div style="background: #f0f0f0; padding: 30px 20px; text-align: center; color: #666; font-size: 11px;">
    <p style="margin: 0;">© {year} Kamba Lhains. Tous droits réservés.</p>
  </div>
</body>
</html>`
  },
  {
    id: 'christmas-2025',
    name: 'Campagne Noël 2025',
    subject: 'Collection de Noël - Offres Spéciales',
    description: 'Email marketing pour la période de Noël',
    variables: ['firstName'],
    category: 'marketing',
    isActive: false,
    lastModified: new Date().toISOString(),
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9f9f9;">
  <div style="background: #000; color: #fff; padding: 40px 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 3px;">KAMBA LHAINS</h1>
    <p style="margin: 10px 0 0 0; font-size: 12px; letter-spacing: 2px; color: #999;">✨ COLLECTION DE NOËL ✨</p>
  </div>

  <div style="padding: 40px 30px; background: #fff;">
    <h2 style="color: #000; font-size: 22px; font-weight: 400; margin-bottom: 20px; text-align: center;">
      Bonjour {firstName},
    </h2>

    <p style="color: #666; margin-bottom: 25px; font-size: 15px; line-height: 1.8; text-align: center;">
      Découvrez notre collection exclusive pour les fêtes de fin d'année.<br>
      Des pièces uniques pour briller pendant les fêtes.
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a href="https://kamba-lhains.com"
         style="display: inline-block; background: #000; color: #fff; padding: 15px 40px; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">
        DÉCOUVRIR LA COLLECTION
      </a>
    </div>
  </div>

  <div style="background: #f0f0f0; padding: 30px 20px; text-align: center; color: #666; font-size: 11px;">
    <p style="margin: 0;">© {year} Kamba Lhains. Tous droits réservés.</p>
  </div>
</body>
</html>`
  }
];

/**
 * Charge un template depuis le stockage (localStorage côté client ou fichier côté serveur)
 */
export function getTemplate(templateId: string): EmailTemplate | undefined {
  // Pour l'instant, on retourne depuis defaultTemplates
  // Plus tard, on pourra charger depuis une base de données
  return defaultTemplates.find(t => t.id === templateId);
}

/**
 * Charge tous les templates
 */
export function getAllTemplates(): EmailTemplate[] {
  return defaultTemplates;
}

/**
 * Remplace les variables dans un template
 */
export function replaceVariables(htmlContent: string, variables: Record<string, string>): string {
  let result = htmlContent;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{${key}}`, 'g');
    result = result.replace(regex, value);
  }

  // Remplacer l'année automatiquement
  result = result.replace(/{year}/g, new Date().getFullYear().toString());

  return result;
}
