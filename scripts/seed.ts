import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Bananas',
        description: 'Fresh organic bananas',
        price: 1.99,
        image: 'https://via.placeholder.com/300x200?text=Bananas',
      },
      {
        name: 'Tomatoes',
        description: 'Ripe red tomatoes',
        price: 2.49,
        image: 'https://via.placeholder.com/300x200?text=Tomatoes',
      },
      {
        name: 'Milk',
        description: '2% Dairy milk, 1L',
        price: 3.29,
        image: 'https://via.placeholder.com/300x200?text=Milk',
      },
    ],
  });

  console.log('Seeded successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
