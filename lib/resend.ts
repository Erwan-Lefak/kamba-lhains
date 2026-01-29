import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderConfirmationData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items?: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
  const {
    orderNumber,
    customerEmail,
    customerName,
    totalAmount,
    shippingAddress,
    items = []
  } = data;

  const itemsHtml = items.length > 0
    ? items.map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.productName}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} €</td>
        </tr>
      `).join('')
    : '<tr><td colspan="3" style="padding: 12px; text-align: center; color: #666;">Détails des produits à venir</td></tr>';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de commande - Kamba Lhains</title>
      </head>
      <body style="font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background-color: #000000; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 2px;">KAMBA LHAINS</h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #000000; font-size: 22px; margin-bottom: 20px; font-weight: 600;">Merci pour votre commande !</h2>

            <p style="color: #666; margin-bottom: 25px;">
              Bonjour ${customerName},
            </p>

            <p style="color: #666; margin-bottom: 25px;">
              Nous avons bien reçu votre commande et nous vous remercions pour votre confiance. Votre commande est en cours de traitement.
            </p>

            <!-- Order Number -->
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <p style="margin: 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Numéro de commande</p>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 20px; font-weight: 600;">${orderNumber}</p>
            </div>

            <!-- Order Items -->
            <h3 style="color: #000000; font-size: 18px; margin-bottom: 15px; font-weight: 600;">Récapitulatif de la commande</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666;">Produit</th>
                  <th style="padding: 12px; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666;">Qté</th>
                  <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 20px 12px 12px 12px; text-align: right; font-weight: 600; font-size: 16px;">Total</td>
                  <td style="padding: 20px 12px 12px 12px; text-align: right; font-weight: 600; font-size: 16px;">${totalAmount.toFixed(2)} €</td>
                </tr>
              </tfoot>
            </table>

            <!-- Shipping Address -->
            <h3 style="color: #000000; font-size: 18px; margin-bottom: 15px; font-weight: 600;">Adresse de livraison</h3>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <p style="margin: 0; color: #333; line-height: 1.8;">
                <strong>${shippingAddress.firstName} ${shippingAddress.lastName}</strong><br>
                ${shippingAddress.address1}<br>
                ${shippingAddress.address2 ? `${shippingAddress.address2}<br>` : ''}
                ${shippingAddress.postalCode} ${shippingAddress.city}<br>
                ${shippingAddress.country}
              </p>
            </div>

            <!-- Next Steps -->
            <div style="background-color: #f9f9f9; border-left: 4px solid #9f0909; padding: 20px; margin-bottom: 30px;">
              <h4 style="margin: 0 0 10px 0; color: #000000; font-size: 16px; font-weight: 600;">Et maintenant ?</h4>
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                Nous préparons votre commande avec soin. Vous recevrez un email de confirmation d'expédition avec un numéro de suivi dès que votre colis sera en route.
              </p>
            </div>

            <!-- Support -->
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
              Pour toute question concernant votre commande, n'hésitez pas à nous contacter à
              <a href="mailto:contact@kambalhaïns.com" style="color: #9f0909; text-decoration: none;">contact@kambalhaïns.com</a>
            </p>

            <p style="color: #666; font-size: 14px;">
              Merci de faire partie de la communauté Kamba Lhains.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f5f5f5; padding: 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0 0 15px 0; color: #666; font-size: 12px;">
              © ${new Date().getFullYear()} Kamba Lhains. Tous droits réservés.
            </p>
            <p style="margin: 0; color: #999; font-size: 11px;">
              Cet email a été envoyé à ${customerEmail}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: 'Kamba Lhains <commandes@kambalhaïns.com>',
      to: customerEmail,
      subject: `Confirmation de commande ${orderNumber} - Kamba Lhains`,
      html: htmlContent,
    });

    console.log(`✅ Email de confirmation envoyé à ${customerEmail} (ID: ${result.data?.id})`);
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
}
