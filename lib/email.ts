import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envoie un email de confirmation de commande
 */
export async function sendOrderConfirmationEmail(order: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Kamba Lhains <commandes@kambalhains.com>',
      to: [order.customerEmail || order.guestEmail],
      subject: `Confirmation de commande #${order.orderNumber}`,
      html: getOrderConfirmationHTML(order),
    });

    if (error) {
      console.error('❌ Erreur envoi email:', error);
      return { success: false, error };
    }

    console.log(`✅ Email de confirmation envoyé à ${order.customerEmail}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur email:', error);
    return { success: false, error };
  }
}

/**
 * Template HTML pour l'email de confirmation
 */
function getOrderConfirmationHTML(order: any) {
  const items = order.items || [];
  const itemsHTML = items
    .map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.productName || item.name}</strong><br>
          <small style="color: #666;">
            Couleur: ${item.color} | Taille: ${item.size} | Quantité: ${item.quantity}
          </small>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          ${item.price} EUR
        </td>
      </tr>
    `)
    .join('');

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

      <div style="padding: 30px; background: #fff;">
        <h2 style="color: #000; font-size: 20px; font-weight: 400; margin-bottom: 20px;">
          Merci pour votre commande !
        </h2>

        <p style="color: #666; margin-bottom: 30px;">
          Bonjour,<br><br>
          Nous avons bien reçu votre commande <strong>#${order.orderNumber}</strong>.
          Vous recevrez un email de confirmation d'expédition dès que votre colis sera prêt.
        </p>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
          <h3 style="margin-top: 0; font-size: 16px; font-weight: 500;">Détails de la commande</h3>

          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="padding: 12px; text-align: left; font-weight: 500;">Produit</th>
                <th style="padding: 12px; text-align: right; font-weight: 500;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #000;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px 0;">Sous-total:</td>
                <td style="text-align: right; padding: 5px 0;">${order.subtotal || order.totalAmount} EUR</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Frais de livraison:</td>
                <td style="text-align: right; padding: 5px 0;">${order.shippingCost || 0} EUR</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Taxes:</td>
                <td style="text-align: right; padding: 5px 0;">${order.taxAmount || 0} EUR</td>
              </tr>
              <tr style="font-weight: 600; font-size: 18px;">
                <td style="padding: 10px 0;">Total:</td>
                <td style="text-align: right; padding: 10px 0;">${order.totalAmount} EUR</td>
              </tr>
            </table>
          </div>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
          <h3 style="margin-top: 0; font-size: 16px; font-weight: 500;">Adresse de livraison</h3>
          <p style="margin: 0; color: #666; line-height: 1.8;">
            ${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}<br>
            ${order.shippingAddress?.address1}<br>
            ${order.shippingAddress?.address2 ? order.shippingAddress.address2 + '<br>' : ''}
            ${order.shippingAddress?.postalCode} ${order.shippingAddress?.city}<br>
            ${order.shippingAddress?.country}
          </p>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="https://kambalhains.com/suivi-commande?order=${order.orderNumber}"
             style="display: inline-block; background: #000; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 0; font-size: 14px; font-weight: 500; letter-spacing: 1px;">
            SUIVRE MA COMMANDE
          </a>
        </div>

        <p style="color: #999; font-size: 12px; margin-top: 40px; text-align: center;">
          Des questions ? Contactez-nous à <a href="mailto:contact@kambalhains.com" style="color: #000;">contact@kambalhains.com</a>
        </p>
      </div>

      <div style="background: #f0f0f0; padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Kamba Lhains. Tous droits réservés.</p>
        <p style="margin: 10px 0 0 0;">
          <a href="https://kambalhains.com" style="color: #666; text-decoration: none;">www.kambalhains.com</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envoie un email de suivi d'expédition
 */
export async function sendShippingEmail(order: any, trackingNumber: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Kamba Lhains <expeditions@kambalhains.com>',
      to: [order.customerEmail || order.guestEmail],
      subject: `Votre commande #${order.orderNumber} a été expédiée`,
      html: getShippingEmailHTML(order, trackingNumber),
    });

    if (error) {
      console.error('❌ Erreur envoi email expédition:', error);
      return { success: false, error };
    }

    console.log(`✅ Email d'expédition envoyé à ${order.customerEmail}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur email:', error);
    return { success: false, error };
  }
}

/**
 * Template HTML pour l'email d'expédition
 */
function getShippingEmailHTML(order: any, trackingNumber: string) {
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

      <div style="padding: 30px; background: #fff;">
        <h2 style="color: #000; font-size: 20px; font-weight: 400; margin-bottom: 20px;">
          📦 Votre commande a été expédiée !
        </h2>

        <p style="color: #666; margin-bottom: 30px;">
          Bonjour,<br><br>
          Bonne nouvelle ! Votre commande <strong>#${order.orderNumber}</strong> a été expédiée et est en route vers vous.
        </p>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 4px; margin-bottom: 30px; text-align: center;">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Numéro de suivi</p>
          <p style="margin: 0; font-size: 24px; font-weight: 600; color: #000; letter-spacing: 2px;">
            ${trackingNumber}
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://kambalhains.com/suivi-commande?order=${order.orderNumber}&tracking=${trackingNumber}"
             style="display: inline-block; background: #000; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 0; font-size: 14px; font-weight: 500; letter-spacing: 1px;">
            SUIVRE MON COLIS
          </a>
        </div>

        <p style="color: #999; font-size: 12px; margin-top: 40px; text-align: center;">
          Des questions ? Contactez-nous à <a href="mailto:contact@kambalhains.com" style="color: #000;">contact@kambalhains.com</a>
        </p>
      </div>

      <div style="background: #f0f0f0; padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Kamba Lhains. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `;
}
