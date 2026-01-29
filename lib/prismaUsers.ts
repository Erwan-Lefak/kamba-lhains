import { PrismaClient, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Interface pour créer un utilisateur
 */
export interface CreateUserData {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  provider?: string;
  providerId?: string;
  phone?: string;
}

/**
 * Vérifie si un email existe déjà
 */
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return !!user;
  } catch (error) {
    console.error('❌ Erreur vérification utilisateur:', error);
    return false;
  }
}

/**
 * Crée un nouvel utilisateur avec profil
 */
export async function createUser(data: CreateUserData) {
  try {
    // Vérifier si l'utilisateur existe déjà
    const exists = await checkUserExists(data.email);
    if (exists) {
      return {
        success: false,
        message: 'Un compte avec cet email existe déjà',
      };
    }

    // Hasher le mot de passe si présent
    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : null;

    // Créer l'utilisateur avec son profil
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: hashedPassword,
        provider: data.provider || null,
        providerId: data.providerId || null,
        profile: {
          create: {
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            phone: data.phone || null,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.log(`✅ Utilisateur ${user.email} créé avec succès`);
    return {
      success: true,
      message: 'Compte créé avec succès !',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        createdAt: user.createdAt.toISOString(),
      },
    };
  } catch (error: any) {
    console.error('❌ Erreur création utilisateur:', error);
    return {
      success: false,
      message: 'Erreur lors de la création du compte',
    };
  }
}

/**
 * Récupère un utilisateur par email
 */
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      password: user.passwordHash,
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      phone: user.profile?.phone || '',
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString() || '',
      status: user.status,
      provider: user.provider || '',
      providerId: user.providerId || '',
    };
  } catch (error) {
    console.error('❌ Erreur récupération utilisateur:', error);
    return null;
  }
}

/**
 * Vérifie les credentials d'un utilisateur (login)
 */
export async function verifyUserCredentials(email: string, password: string) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message: 'Email ou mot de passe incorrect',
      };
    }

    // Vérifier si le compte n'est pas supprimé
    if (user.status === 'DELETED') {
      return {
        success: false,
        message: 'Ce compte a été supprimé',
      };
    }

    // Si l'utilisateur s'est inscrit via OAuth, il n'a pas de mot de passe
    if (!user.password) {
      return {
        success: false,
        message: 'Veuillez vous connecter avec ' + user.provider,
      };
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return {
        success: false,
        message: 'Email ou mot de passe incorrect',
      };
    }

    // Mettre à jour la dernière connexion
    await updateLastLogin(email);

    return {
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        status: user.status,
      },
    };
  } catch (error) {
    console.error('❌ Erreur vérification credentials:', error);
    return {
      success: false,
      message: 'Erreur lors de la connexion',
    };
  }
}

/**
 * Met à jour la date de dernière connexion
 */
export async function updateLastLogin(email: string) {
  try {
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { lastLogin: new Date() },
    });
    console.log(`✅ Dernière connexion mise à jour pour ${email}`);
  } catch (error) {
    console.error('❌ Erreur mise à jour dernière connexion:', error);
  }
}

/**
 * Met à jour les informations d'un utilisateur
 */
export async function updateUserInfo(
  email: string,
  updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur non trouvé',
      };
    }

    // Mettre à jour ou créer le profil
    if (user.profile) {
      await prisma.userProfile.update({
        where: { userId: user.id },
        data: {
          firstName: updates.firstName,
          lastName: updates.lastName,
          phone: updates.phone,
        },
      });
    } else {
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          firstName: updates.firstName,
          lastName: updates.lastName,
          phone: updates.phone,
        },
      });
    }

    console.log(`✅ Informations mises à jour pour ${email}`);
    return {
      success: true,
      message: 'Informations mises à jour avec succès',
    };
  } catch (error) {
    console.error('❌ Erreur mise à jour utilisateur:', error);
    return {
      success: false,
      message: 'Erreur lors de la mise à jour',
    };
  }
}

/**
 * Change le mot de passe d'un utilisateur
 */
export async function updateUserPassword(
  email: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur non trouvé',
      };
    }

    // Si l'utilisateur s'est connecté via OAuth, il n'a pas de mot de passe
    if (!user.password) {
      return {
        success: false,
        message:
          'Vous êtes connecté via un réseau social. Vous ne pouvez pas changer de mot de passe.',
      };
    }

    // Vérifier le mot de passe actuel
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return {
        success: false,
        message: 'Mot de passe actuel incorrect',
      };
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { passwordHash: hashedPassword },
    });

    console.log(`✅ Mot de passe mis à jour pour ${email}`);
    return {
      success: true,
      message: 'Mot de passe mis à jour avec succès',
    };
  } catch (error) {
    console.error('❌ Erreur changement mot de passe:', error);
    return {
      success: false,
      message: 'Erreur lors du changement de mot de passe',
    };
  }
}

/**
 * Supprime un utilisateur (soft delete en changeant le statut)
 */
export async function deleteUser(email: string) {
  try {
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { status: UserStatus.DELETED },
    });

    console.log(`✅ Compte supprimé pour ${email}`);
    return {
      success: true,
      message: 'Compte supprimé avec succès',
    };
  } catch (error) {
    console.error('❌ Erreur suppression compte:', error);
    return {
      success: false,
      message: 'Erreur lors de la suppression du compte',
    };
  }
}

/**
 * Récupère les commandes d'un utilisateur
 */
export async function getUserOrders(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) return [];

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: user.id },
          { guestEmail: email.toLowerCase() },
        ],
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => ({
      orderNumber: order.orderNumber,
      customerEmail: user.email,
      customerName: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
      phone: user.profile?.phone || order.guestPhone || '',
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      totalAmount: parseFloat(order.totalAmount.toString()),
      shippingCost: parseFloat(order.shippingCost.toString()),
      taxAmount: parseFloat(order.taxAmount.toString()),
      items: order.orderItems.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
        size: item.size,
        color: item.color,
      })),
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod || 'stripe',
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber || '',
      notes: order.specialInstructions || '',
    }));
  } catch (error) {
    console.error('❌ Erreur récupération commandes utilisateur:', error);
    return [];
  }
}

export default prisma;
