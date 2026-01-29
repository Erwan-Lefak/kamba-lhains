import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface NewsletterEmailOptions {
  email: string;
  lang: 'fr' | 'en';
}

/**
 * Envoie un email de confirmation d'inscription à la newsletter
 */
export async function sendNewsletterConfirmationEmail({
  email,
  lang,
}: NewsletterEmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const subject = lang === 'fr'
      ? '✨ Bienvenue dans l\'univers Kamba Lhains'
      : '✨ Welcome to the Kamba Lhains Universe';

    const htmlContent = lang === 'fr'
      ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 30px 0;
      border-bottom: 2px solid #000;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .content {
      padding: 40px 20px;
    }
    h1 {
      color: #000;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .cta {
      text-align: center;
      margin: 40px 0;
    }
    .button {
      display: inline-block;
      padding: 15px 40px;
      background-color: #000;
      color: #fff;
      text-decoration: none;
      font-weight: bold;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #eee;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">KAMBA LHAINS</div>
  </div>
  <div class="content">
    <h1>Merci de votre inscription !</h1>
    <p>Nous sommes ravis de vous accueillir dans l'univers Kamba Lhains.</p>
    <p>Vous recevrez en avant-première :</p>
    <ul>
      <li>Nos nouvelles collections</li>
      <li>Des offres exclusives</li>
      <li>Des conseils de style</li>
      <li>Les coulisses de la marque</li>
    </ul>
    <div class="cta">
      <a href="https://www.kamba-lhains.com" class="button">Découvrir nos collections</a>
    </div>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} Kamba Lhains. Tous droits réservés.</p>
    <p>Vous recevez cet email car vous vous êtes inscrit(e) à notre newsletter.</p>
  </div>
</body>
</html>
      `
      : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 30px 0;
      border-bottom: 2px solid #000;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .content {
      padding: 40px 20px;
    }
    h1 {
      color: #000;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .cta {
      text-align: center;
      margin: 40px 0;
    }
    .button {
      display: inline-block;
      padding: 15px 40px;
      background-color: #000;
      color: #fff;
      text-decoration: none;
      font-weight: bold;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #eee;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">KAMBA LHAINS</div>
  </div>
  <div class="content">
    <h1>Thank you for subscribing!</h1>
    <p>We're thrilled to welcome you to the Kamba Lhains universe.</p>
    <p>You'll receive exclusive access to:</p>
    <ul>
      <li>New collection launches</li>
      <li>Exclusive offers</li>
      <li>Style tips</li>
      <li>Behind-the-scenes content</li>
    </ul>
    <div class="cta">
      <a href="https://www.kamba-lhains.com" class="button">Discover our collections</a>
    </div>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} Kamba Lhains. All rights reserved.</p>
    <p>You're receiving this email because you subscribed to our newsletter.</p>
  </div>
</body>
</html>
      `;

    const { data, error } = await resend.emails.send({
      from: 'Kamba Lhains <noreply@kamba-lhains.com>',
      to: [email],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
