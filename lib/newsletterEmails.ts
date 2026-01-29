import { Resend } from 'resend';
import { NewsletterSubscriber } from './googleSheetsNewsletter';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envoie un email de bienvenue après inscription à la newsletter
 */
export async function sendWelcomeEmail(subscriber: NewsletterSubscriber, language: string = 'fr') {
  try {
    const isFrench = language === 'fr';
    const subject = isFrench
      ? 'Bienvenue chez KAMBA LHAINS'
      : 'Welcome to KAMBA LHAINS';

    const { data, error } = await resend.emails.send({
      from: 'Kamba Lhains <newsletter@kamba-lhains.com>',
      to: [subscriber.email],
      subject: subject,
      html: getWelcomeEmailHTML(subscriber, language),
    });

    if (error) {
      console.error('❌ Erreur envoi email bienvenue:', error);
      return { success: false, error };
    }

    console.log(`✅ Email de bienvenue envoyé à ${subscriber.email} (${language})`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur email bienvenue:', error);
    return { success: false, error };
  }
}

/**
 * Template HTML pour l'email de bienvenue
 */
function getWelcomeEmailHTML(subscriber: NewsletterSubscriber, language: string = 'fr') {
  const isFrench = language === 'fr';

  if (isFrench) {
    return getWelcomeEmailHTML_FR(subscriber);
  } else {
    return getWelcomeEmailHTML_EN(subscriber);
  }
}

/**
 * Template français
 */
function getWelcomeEmailHTML_FR(subscriber: NewsletterSubscriber) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez KAMBA LHAINS</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Container principal -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                    <!-- Header avec logo -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background-color: #000000;">
                            <img src="https://res.cloudinary.com/diibzuu9j/image/upload/v1765047412/kamba-images/kamba-images/logo-transparent.jpg" alt="KAMBA LHAINS" style="max-width: 180px; height: auto;">
                        </td>
                    </tr>

                    <!-- Contenu principal -->
                    <tr>
                        <td style="padding: 50px 40px;">

                            <h1 style="margin: 0 0 25px; font-size: 28px; font-weight: 300; color: #1a1a1a; letter-spacing: 1px;">
                                Bienvenue dans l'univers<br>KAMBA LHAINS
                            </h1>

                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Bonjour,
                            </p>

                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Merci de rejoindre l'univers KAMBA LHAINS.
                            </p>

                            <!-- Bloc cadeau -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0; background-color: #f8f8f8; border-left: 4px solid #1a1a1a;">
                                <tr>
                                    <td style="padding: 30px;">
                                        <p style="margin: 0 0 15px; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
                                            🎁 Votre cadeau de bienvenue
                                        </p>
                                        <p style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #1a1a1a;">
                                            10% de réduction sur votre première commande
                                        </p>
                                        <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">
                                            Code promo :
                                        </p>
                                        <div style="display: inline-block; padding: 12px 30px; background-color: #1a1a1a; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: 2px;">
                                            BIENVENUE10
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                En vous abonnant, vous accédez à :
                            </p>

                            <ul style="margin: 0 0 30px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #333333;">
                                <li style="margin-bottom: 10px;">Les lancements en avant-première</li>
                                <li style="margin-bottom: 10px;">Des contenus exclusifs sur nos collections <em>Aube</em>, <em>Zenith</em>, <em>Crépuscule</em> et <em>Denim</em></li>
                                <li style="margin-bottom: 10px;">Des événements privés</li>
                                <li style="margin-bottom: 10px;">Les coulisses de notre atelier</li>
                            </ul>

                            <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Notre promesse ? Des pièces authentiques, pensées pour durer, <strong>créées pour des générations</strong>.
                            </p>

                            <!-- Bouton CTA -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="https://www.kamba-lhains.com/" style="display: inline-block; padding: 16px 50px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
                                            Découvrir nos collections
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                À très vite,<br>
                                <strong>L'équipe KAMBA LHAINS</strong>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 40px; background-color: #1a1a1a; color: #ffffff; text-align: center;">

                            <!-- Réseaux sociaux -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.instagram.com/kambalhains/" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 14px;">Instagram</a>
                                        <span style="color: #666666;">|</span>
                                        <a href="https://www.facebook.com/share/1QP2wxTkDe/" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 14px;">Facebook</a>
                                        <span style="color: #666666;">|</span>
                                        <a href="https://www.tiktok.com/@kambalhains" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 14px;">TikTok</a>
                                        <span style="color: #666666;">|</span>
                                        <a href="https://x.com/kambalhains" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 14px;">X</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 15px; font-size: 13px; line-height: 1.6; color: #999999;">
                                Vous recevez cet email car vous vous êtes inscrit(e) à notre newsletter.
                            </p>

                            <p style="margin: 0; font-size: 12px; color: #666666;">
                                <a href="https://www.kamba-lhains.com/newsletter" style="color: #999999; text-decoration: underline;">Se désabonner</a> |
                                <a href="https://www.kamba-lhains.com/politique-confidentialite" style="color: #999999; text-decoration: underline;">Politique de confidentialité</a>
                            </p>

                            <p style="margin: 20px 0 0; font-size: 12px; color: #666666;">
                                © KAMBA LHAINS ${new Date().getFullYear()}
                            </p>

                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}

/**
 * Template anglais
 */
function getWelcomeEmailHTML_EN(subscriber: NewsletterSubscriber) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to KAMBA LHAINS</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                    <!-- Header with logo -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background-color: #000000;">
                            <img src="https://res.cloudinary.com/diibzuu9j/image/upload/v1765047412/kamba-images/kamba-images/logo-transparent.jpg" alt="KAMBA LHAINS" style="max-width: 180px; height: auto;">
                        </td>
                    </tr>

                    <!-- Main content -->
                    <tr>
                        <td style="padding: 50px 40px;">

                            <h1 style="margin: 0 0 25px; font-size: 28px; font-weight: 300; color: #1a1a1a; letter-spacing: 1px;">
                                Welcome to the<br>KAMBA LHAINS universe
                            </h1>

                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Hello,
                            </p>

                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Thank you for joining the KAMBA LHAINS universe.
                            </p>

                            <!-- Gift Block -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0; background-color: #f8f8f8; border-left: 4px solid #1a1a1a;">
                                <tr>
                                    <td style="padding: 30px;">
                                        <p style="margin: 0 0 15px; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
                                            🎁 Your welcome gift
                                        </p>
                                        <p style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #1a1a1a;">
                                            10% off your first order
                                        </p>
                                        <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">
                                            Promo code:
                                        </p>
                                        <div style="display: inline-block; padding: 12px 30px; background-color: #1a1a1a; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: 2px;">
                                            BIENVENUE10
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                By subscribing, you get access to:
                            </p>

                            <ul style="margin: 0 0 30px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #333333;">
                                <li style="margin-bottom: 10px;">Early access to new launches</li>
                                <li style="margin-bottom: 10px;">Exclusive content on our <em>Aube</em>, <em>Zenith</em>, <em>Crépuscule</em> and <em>Denim</em> collections</li>
                                <li style="margin-bottom: 10px;">Private events</li>
                                <li style="margin-bottom: 10px;">Behind-the-scenes from our workshop</li>
                            </ul>

                            <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Our promise? Authentic pieces, designed to last, <strong>created for generations</strong>.
                            </p>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="https://www.kamba-lhains.com/" style="display: inline-block; padding: 16px 50px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
                                            Discover our collections
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                See you soon,<br>
                                <strong>The KAMBA LHAINS team</strong>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 40px; background-color: #1a1a1a; color: #ffffff; text-align: center;">

                            <!-- Social media -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.instagram.com/kambalhains/" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 14px;">Instagram</a>
                                        <span style="color: #666666;">|</span>
                                        <a href="https://www.facebook.com/share/1QP2wxTkDe/" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 14px;">Facebook</a>
                                        <span style="color: #666666;">|</span>
                                        <a href="https://www.tiktok.com/@kambalhains" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 14px;">TikTok</a>
                                        <span style="color: #666666;">|</span>
                                        <a href="https://x.com/kambalhains" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 14px;">X</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 15px; font-size: 13px; line-height: 1.6; color: #999999;">
                                You are receiving this email because you signed up for our newsletter.
                            </p>

                            <p style="margin: 0; font-size: 12px; color: #666666;">
                                <a href="https://www.kamba-lhains.com/newsletter" style="color: #999999; text-decoration: underline;">Unsubscribe</a> |
                                <a href="https://www.kamba-lhains.com/politique-confidentialite" style="color: #999999; text-decoration: underline;">Privacy Policy</a>
                            </p>

                            <p style="margin: 20px 0 0; font-size: 12px; color: #666666;">
                                © KAMBA LHAINS ${new Date().getFullYear()}
                            </p>

                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}


/**
 * Envoie un email de confirmation de désabonnement
 */
export async function sendUnsubscribeConfirmationEmail(email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Kamba Lhains <newsletter@kamba-lhains.com>',
      to: [email],
      subject: 'Désabonnement confirmé - Kamba Lhains',
      html: getUnsubscribeEmailHTML(email),
    });

    if (error) {
      console.error('❌ Erreur envoi email désabonnement:', error);
      return { success: false, error };
    }

    console.log(`✅ Email de désabonnement envoyé à ${email}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur email désabonnement:', error);
    return { success: false, error };
  }
}

/**
 * Template HTML pour l'email de désabonnement
 */
function getUnsubscribeEmailHTML(email: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Manrope', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #000; color: #fff; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px;">KAMBA LHAINS</h1>
      </div>

      <div style="padding: 40px 30px; background: #fff; text-align: center;">
        <h2 style="color: #000; font-size: 20px; font-weight: 400; margin-bottom: 20px;">
          Vous avez été désabonné(e)
        </h2>

        <p style="color: #666; margin-bottom: 25px; font-size: 15px;">
          Nous regrettons de vous voir partir.<br>
          Vous ne recevrez plus d'emails de notre part.
        </p>

        <p style="color: #999; font-size: 13px; margin-bottom: 30px;">
          Vous pouvez toujours vous réabonner à tout moment sur notre site.
        </p>

        <a href="https://kamba-lhains.com/newsletter"
           style="display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">
          Retour sur le site
        </a>
      </div>

      <div style="background: #f0f0f0; padding: 20px; text-align: center; color: #666; font-size: 11px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Kamba Lhains</p>
      </div>
    </body>
    </html>
  `;
}
