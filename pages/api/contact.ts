import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, phone, orderType, category, message, attachment } = req.body;

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Préparer le contenu de l'email
    const emailContent = `
Nouveau message de contact depuis kambalhains.com

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

${attachment ? `Pièce jointe: ${attachment}` : 'Pas de pièce jointe'}
    `;

    // Envoyer l'email
    const data = await resend.emails.send({
      from: 'Kamba Lhains <onboarding@resend.dev>', // Vous devrez changer ça avec votre domaine vérifié
      to: ['contact@kambalhains.com'],
      subject: `Nouveau message de contact - ${category || 'Général'}`,
      text: emailContent,
      replyTo: email,
    });

    // Optionnel: Envoyer un email de confirmation au client
    await resend.emails.send({
      from: 'Kamba Lhains <onboarding@resend.dev>',
      to: [email],
      subject: 'Confirmation de votre message - Kamba Lhains',
      text: `Bonjour ${firstName},

Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.

Notre équipe reviendra vers vous dans les plus brefs délais.

Cordialement,
L'équipe Kamba Lhains

---
Ceci est un message automatique, merci de ne pas y répondre.
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
