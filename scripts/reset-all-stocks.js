const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Mise à zéro de tous les stocks...');

  const result = await prisma.productVariant.updateMany({
    data: {
      stock: 0
    }
  });

  console.log(`✓ ${result.count} variants mis à jour - tous les stocks sont à 0`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✓ Terminé avec succès');
  })
  .catch(async (e) => {
    console.error('❌ Erreur:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
