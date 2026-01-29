import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import formidable, { File } from 'formidable';
import fs from 'fs';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({ multiples: true, maxFileSize: 10 * 1024 * 1024 }); // 10MB max
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);

    // Extraire les valeurs des champs (formidable retourne des arrays)
    const firstName = Array.isArray(fields.firstName) ? fields.firstName[0] : fields.firstName;
    const lastName = Array.isArray(fields.lastName) ? fields.lastName[0] : fields.lastName;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
    const orderType = Array.isArray(fields.orderType) ? fields.orderType[0] : fields.orderType;
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
    const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Traiter les pièces jointes
    const attachments: Array<{ filename: string; content: Buffer }> = [];
    const uploadedFiles: File[] = [];

    if (files.attachments) {
      const fileArray = Array.isArray(files.attachments) ? files.attachments : [files.attachments];

      for (const file of fileArray) {
        if (file && file.filepath) {
          const fileBuffer = fs.readFileSync(file.filepath);
          attachments.push({
            filename: file.originalFilename || 'attachment',
            content: fileBuffer,
          });
          uploadedFiles.push(file);
        }
      }
    }

    // Préparer le contenu de l'email
    const emailContent = `
Nouveau message de contact depuis kamba-lhains.com

Informations du client:
- Nom: ${lastName}
- Prénom: ${firstName}
- Email: ${email}
- Téléphone: ${phone || 'Non renseigné'}

Type de demande:
- Type de commande: ${orderType || 'Non renseigné'}
- Catégorie: ${category || 'Non renseigné'}

Message:
${message || 'Aucun message'}

${attachments.length > 0 ? `Pièces jointes (${attachments.length}): ${attachments.map(a => a.filename).join(', ')}` : 'Pas de pièce jointe'}
    `;

    // Envoyer l'email avec pièces jointes
    const data = await resend.emails.send({
      from: 'Kamba Lhains <commandes@kambalhaïns.com>',
      to: ['contact@kambalhaïns.com'],
      subject: `Nouveau message de contact - ${category || 'Général'}`,
      text: emailContent,
      replyTo: email,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    // Nettoyer les fichiers temporaires
    uploadedFiles.forEach(file => {
      if (file.filepath) {
        try {
          fs.unlinkSync(file.filepath);
        } catch (err) {
          console.error('Error deleting temp file:', err);
        }
      }
    });

    // Envoyer un email de confirmation au client
    await resend.emails.send({
      from: 'Kamba Lhains <commandes@kambalhaïns.com>',
      to: [email],
      subject: 'Confirmation de votre message - Kamba Lhains',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <div style="background-color: #000000; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 2px;">KAMBA LHAINS</h1>
              </div>
              <div style="padding: 40px 30px;">
                <h2 style="color: #000000; font-size: 22px; margin-bottom: 20px; font-weight: 600;">Message bien reçu !</h2>
                <p style="color: #666; margin-bottom: 20px;">Bonjour ${firstName},</p>
                <p style="color: #666; margin-bottom: 20px;">
                  Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.
                </p>
                <p style="color: #666; margin-bottom: 30px;">
                  Notre équipe reviendra vers vous dans les plus brefs délais.
                </p>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                  <p style="margin: 0; color: #666; font-size: 14px;">
                    <strong>Récapitulatif de votre demande :</strong><br><br>
                    Catégorie : ${category || 'Non spécifiée'}<br>
                    ${attachments.length > 0 ? `Pièces jointes : ${attachments.length} fichier(s)` : ''}
                  </p>
                </div>
                <p style="color: #666; font-size: 14px;">
                  Cordialement,<br>
                  <strong>L'équipe Kamba Lhains</strong>
                </p>
              </div>
              <div style="background-color: #f5f5f5; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                <p style="margin: 0 0 15px 0; color: #666; font-size: 12px;">
                  © ${new Date().getFullYear()} Kamba Lhains. Tous droits réservés.
                </p>
                <p style="margin: 0; color: #999; font-size: 11px;">
                  Ceci est un message automatique, merci de ne pas y répondre.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Email envoyé avec succès',
      id: data?.data?.id || 'unknown'
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return res.status(500).json({
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
