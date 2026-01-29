const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Reset des vues de produits...');

  const result = await prisma.productAnalytics.deleteMany({
    where: {
      event: 'view'
    }
  });

  console.log(`✓ ${result.count} entrées de vues supprimées`);
  console.log('✓ Les compteurs de vues repartent de zéro');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
