import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Apples',
        description: 'Fresh and juicy red apples',
        price: 2.99,
        image: '/images/apples.jpg',
      },
      {
        name: 'Bananas',
        description: 'Ripe bananas for smoothies or snacks',
        price: 1.99,
        image: '/images/bananas.jpg',
      },
      // add more products here
    ],
  });
}

main()
  .then(() => {
    console.log('Seeding complete');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
