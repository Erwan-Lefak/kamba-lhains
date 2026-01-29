import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, checkUserExists } from './prismaUsers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { NextApiRequest } from 'next';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface TokenPayload {
  userId: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        try {
          // Chercher l'utilisateur dans la base de données
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              profile: true
            }
          });

          if (!user || !user.passwordHash) {
            throw new Error('Email ou mot de passe incorrect');
          }

          // Vérifier le mot de passe
          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

          if (!isPasswordValid) {
            throw new Error('Email ou mot de passe incorrect');
          }

          // Retourner l'objet utilisateur pour NextAuth
          return {
            id: user.id,
            email: user.email,
            name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
            firstName: user.profile?.firstName || '',
            lastName: user.profile?.lastName || '',
          };
        } catch (error) {
          console.error('Erreur lors de l\'authentification:', error);
          throw error;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || '',
      clientSecret: process.env.APPLE_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Vérifier si l'utilisateur existe déjà
        const userExists = await checkUserExists(user.email || '');

        if (!userExists) {
          // Créer l'utilisateur dans la base de données
          const firstName = (profile as any)?.given_name || user.name?.split(' ')[0] || '';
          const lastName = (profile as any)?.family_name || user.name?.split(' ').slice(1).join(' ') || '';

          await createUser({
            email: user.email || '',
            firstName,
            lastName,
            provider: account?.provider || '', // google, facebook, apple
            providerId: account?.providerAccountId || '',
          });

          console.log(`✅ Nouvel utilisateur créé via ${account?.provider}: ${user.email}`);
        }

        return true;
      } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde de l'utilisateur:", error);
        // On laisse quand même l'utilisateur se connecter
        return true;
      }
    },
    async jwt({ token, account, profile, user, trigger }) {
      if (account) {
        token.accessToken = account.access_token;
      }

      // Récupérer les infos à jour de la DB à chaque rafraîchissement
      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            include: { profile: true }
          });

          if (dbUser?.profile) {
            token.firstName = dbUser.profile.firstName || undefined;
            token.lastName = dbUser.profile.lastName || undefined;
            token.phone = dbUser.profile.phone || undefined;
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
        }
      }

      // Pour la première connexion OAuth
      if (profile) {
        token.firstName = (profile as any).given_name;
        token.lastName = (profile as any).family_name;
      }
      // Pour la première connexion avec credentials
      if (user) {
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
      }

      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      if (session.user) {
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).phone = token.phone;
      }
      return session;
    },
  },
  pages: {
    signIn: '/connexion',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// JWT Authentication Functions
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return null;

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    if (!dbUser) return null;

    // Transform to match User interface
    return {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.profile?.firstName || '',
      lastName: dbUser.profile?.lastName || '',
      role: dbUser.role,
    };
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check cookies for web authentication
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}
