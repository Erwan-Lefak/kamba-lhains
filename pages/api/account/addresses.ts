import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    if (!user || !user.profile) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // GET - Récupérer toutes les adresses
    if (req.method === 'GET') {
      const addresses = await prisma.userAddress.findMany({
        where: { userId: user.profile.userId },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      return res.status(200).json({
        success: true,
        addresses
      });
    }

    // POST - Créer une nouvelle adresse
    if (req.method === 'POST') {
      const {
        type,
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        postalCode,
        country,
        phone,
        isDefault
      } = req.body;

      // Validation
      if (!firstName || !lastName || !address1 || !city || !postalCode || !country) {
        return res.status(400).json({
          success: false,
          message: 'Les champs prénom, nom, adresse, ville, code postal et pays sont requis'
        });
      }

      // Si cette adresse doit être par défaut, retirer le défaut des autres
      if (isDefault) {
        await prisma.userAddress.updateMany({
          where: { userId: user.profile.userId },
          data: { isDefault: false }
        });
      }

      // Créer l'adresse
      const address = await prisma.userAddress.create({
        data: {
          userId: user.profile.userId,
          type: type || 'BOTH',
          firstName,
          lastName,
          company: company || null,
          address1,
          address2: address2 || null,
          city,
          postalCode,
          country,
          phone: phone || null,
          isDefault: isDefault || false
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Adresse créée avec succès',
        address
      });
    }

    // PUT - Mettre à jour une adresse
    if (req.method === 'PUT') {
      const {
        id,
        type,
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        postalCode,
        country,
        phone,
        isDefault
      } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID de l\'adresse requis'
        });
      }

      // Vérifier que l'adresse appartient bien à l'utilisateur
      const existingAddress = await prisma.userAddress.findFirst({
        where: {
          id,
          userId: user.profile.userId
        }
      });

      if (!existingAddress) {
        return res.status(404).json({
          success: false,
          message: 'Adresse non trouvée'
        });
      }

      // Si cette adresse doit être par défaut, retirer le défaut des autres
      if (isDefault && !existingAddress.isDefault) {
        await prisma.userAddress.updateMany({
          where: {
            userId: user.profile.userId,
            id: { not: id }
          },
          data: { isDefault: false }
        });
      }

      // Mettre à jour l'adresse
      const updatedAddress = await prisma.userAddress.update({
        where: { id },
        data: {
          type: type || existingAddress.type,
          firstName: firstName || existingAddress.firstName,
          lastName: lastName || existingAddress.lastName,
          company: company !== undefined ? company : existingAddress.company,
          address1: address1 || existingAddress.address1,
          address2: address2 !== undefined ? address2 : existingAddress.address2,
          city: city || existingAddress.city,
          postalCode: postalCode || existingAddress.postalCode,
          country: country || existingAddress.country,
          phone: phone !== undefined ? phone : existingAddress.phone,
          isDefault: isDefault !== undefined ? isDefault : existingAddress.isDefault
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Adresse mise à jour avec succès',
        address: updatedAddress
      });
    }

    // DELETE - Supprimer une adresse
    if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID de l\'adresse requis'
        });
      }

      // Vérifier que l'adresse appartient bien à l'utilisateur
      const existingAddress = await prisma.userAddress.findFirst({
        where: {
          id,
          userId: user.profile.userId
        }
      });

      if (!existingAddress) {
        return res.status(404).json({
          success: false,
          message: 'Adresse non trouvée'
        });
      }

      // Supprimer l'adresse
      await prisma.userAddress.delete({
        where: { id }
      });

      // Si c'était l'adresse par défaut, en définir une nouvelle
      if (existingAddress.isDefault) {
        const firstAddress = await prisma.userAddress.findFirst({
          where: { userId: user.profile.userId },
          orderBy: { createdAt: 'asc' }
        });

        if (firstAddress) {
          await prisma.userAddress.update({
            where: { id: firstAddress.id },
            data: { isDefault: true }
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Adresse supprimée avec succès'
      });
    }

    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });

  } catch (error) {
    console.error('Erreur addresses API:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la gestion des adresses'
    });
  }
}
