import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, checkUserExists } from '../../../lib/prismaUsers';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée'
    });
  }

  try {
    const { firstName, lastName, email, password } = req.body as RegisterRequest;

    // Validation basique
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    // Validation mot de passe
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Créer l'utilisateur dans la base de données
    const result = await createUser({
      email,
      firstName,
      lastName,
      password
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Envoyer l'email de bienvenue
    try {
      const { data, error } = await resend.emails.send({
        from: 'KAMBA LHAINS <noreply@kamba-lhains.com>',
        to: [email],
        subject: 'Bienvenue sur KAMBA LHAINS',
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                padding: 40px 0;
                border-bottom: 2px solid #000;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 2px;
                color: #000;
              }
              .content {
                padding: 40px 0;
              }
              .greeting {
                font-size: 18px;
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
                color: #fff !important;
                text-decoration: none;
                font-weight: bold;
                letter-spacing: 1px;
                text-transform: uppercase;
                font-size: 12px;
              }
              .footer {
                text-align: center;
                padding: 30px 0;
                border-top: 1px solid #ddd;
                color: #999;
                font-size: 12px;
              }
              .benefits {
                background: #f8f8f8;
                padding: 30px;
                margin: 30px 0;
              }
              .benefits h3 {
                margin-top: 0;
                font-size: 16px;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .benefits ul {
                list-style: none;
                padding: 0;
              }
              .benefits li {
                padding: 8px 0;
                padding-left: 25px;
                position: relative;
              }
              .benefits li:before {
                content: "✓";
                position: absolute;
                left: 0;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">KAMBA LHAINS</div>
            </div>

            <div class="content">
              <p class="greeting">Bonjour ${firstName} ${lastName},</p>

              <p>Bienvenue dans l'univers KAMBA LHAINS !</p>

              <p>Nous sommes ravis de vous compter parmi nous. Votre compte a été créé avec succès.</p>

              <div class="benefits">
                <h3>Vos avantages</h3>
                <ul>
                  <li>Accès prioritaire aux nouvelles collections</li>
                  <li>Suivi de vos commandes en temps réel</li>
                  <li>Gestion de vos adresses de livraison</li>
                  <li>Historique complet de vos achats</li>
                  <li>Offres exclusives réservées aux membres</li>
                </ul>
              </div>

              <div class="cta">
                <a href="https://kamba-lhains.com/boutique" class="button">Découvrir la collection</a>
              </div>

              <p>Si vous avez des questions, notre équipe est à votre disposition.</p>

              <p>À très bientôt,<br>L'équipe KAMBA LHAINS</p>
            </div>

            <div class="footer">
              <p>KAMBA LHAINS - Mode Premium</p>
              <p>Vous recevez cet email car vous avez créé un compte sur kamba-lhains.com</p>
            </div>
          </body>
          </html>
        `,
      });

      if (error) {
        console.error('❌ Erreur envoi email de bienvenue:', error);
        // On ne bloque pas l'inscription si l'email échoue
      } else {
        console.log(`✅ Email de bienvenue envoyé à ${email}`);
      }
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError);
      // On ne bloque pas l'inscription si l'email échoue
    }

    res.status(201).json(result);

  } catch (error: any) {
    console.error('❌ Erreur registration:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du compte'
    });
  }
}