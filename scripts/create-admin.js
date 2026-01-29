const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'admin@kambalhains.com';
    const password = 'Luxury2025!Secure'; // Nouveau mot de passe fort

    console.log('🔐 Création du compte admin...');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà.');
      console.log('   Mise à jour du mot de passe...');

      // Hash du nouveau mot de passe
      const passwordHash = await bcrypt.hash(password, 12);

      // Mettre à jour l'utilisateur existant
      await prisma.user.update({
        where: { email },
        data: {
          passwordHash,
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      });

      console.log('✅ Mot de passe admin mis à jour!');
    } else {
      // Hash du mot de passe
      const passwordHash = await bcrypt.hash(password, 12);

      // Créer le nouvel admin
      await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      });

      console.log('✅ Compte admin créé avec succès!');
    }

    console.log('\n📋 Identifiants Admin:');
    console.log('   Email:', email);
    console.log('   Mot de passe:', password);
    console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
