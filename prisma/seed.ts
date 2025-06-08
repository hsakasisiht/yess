import { PrismaClient, ProductCategory } from '../src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  // Gems (sample, add more as needed)
  await prisma.product.createMany({
    data: [
      {
        name: 'Speed 60 minutes',
        description: 'Speed up your progress by 60 minutes.',
        imageUrl: 'https://i0.wp.com/lordsgems.com/items/s60m.png?ssl=1',
        category: 'GEMS',
        price: 130,
        gemCost: 130,
      },
      {
        name: 'Speed 3 Hours',
        description: 'Speed up your progress by 3 hours.',
        imageUrl: 'https://i0.wp.com/lordsgems.com/items/s3h.png?ssl=1',
        category: 'GEMS',
        price: 300,
        gemCost: 300,
      },
      // ... add more gems as needed ...
    ],
  });

  // Resources
  await prisma.product.createMany({
    data: [
      {
        name: 'Food 20 Million',
        description: '20 million food resources.',
        imageUrl: 'https://i0.wp.com/lordsgems.com/items/f20.png?ssl=1',
        category: 'RESOURCES',
        price: 10000,
        resourceType: 'food',
        resourceAmount: 20000000,
      },
      {
        name: 'Stone 5 Million',
        description: '5 million stone resources.',
        imageUrl: 'https://i0.wp.com/lordsgems.com/items/s5.png?ssl=1',
        category: 'RESOURCES',
        price: 10000,
        resourceType: 'stone',
        resourceAmount: 5000000,
      },
      // ... add more resources as needed ...
    ],
  });

  // Bots
  await prisma.product.createMany({
    data: [
      {
        name: 'Bank Bot',
        description: 'Automate your in-game banking.',
        imageUrl: '',
        category: 'BOTS',
        price: 5000,
        botType: 'bank',
      },
      {
        name: 'War Bot',
        description: 'Get real-time war notifications and analytics.',
        imageUrl: '',
        category: 'BOTS',
        price: 7000,
        botType: 'war',
      },
      {
        name: 'Location Finding Bot',
        description: 'Find player and resource locations easily.',
        imageUrl: '',
        category: 'BOTS',
        price: 6000,
        botType: 'location',
      },
      {
        name: 'WhatsApp Bot',
        description: 'Integrate Lords Mobile with WhatsApp.',
        imageUrl: '',
        category: 'BOTS',
        price: 4000,
        botType: 'whatsapp',
      },
      {
        name: 'Telegram Bot',
        description: 'Integrate Lords Mobile with Telegram.',
        imageUrl: '',
        category: 'BOTS',
        price: 4000,
        botType: 'telegram',
      },
      {
        name: 'Discord Bot',
        description: 'Integrate Lords Mobile with Discord.',
        imageUrl: '',
        category: 'BOTS',
        price: 4000,
        botType: 'discord',
      },
    ],
  });

  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 