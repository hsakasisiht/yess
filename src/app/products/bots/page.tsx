import { PrismaClient } from '@prisma/client';
import Image from 'next/image';

async function getBots() {
  const prisma = new PrismaClient();
  const bots = await prisma.product.findMany({ where: { category: 'BOTS' } });
  await prisma.$disconnect();
  return bots;
}

export default async function BotsPage() {
  const bots = await getBots();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Bots</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {bots.map((bot) => (
          <div key={bot.id} className="bg-[#171717] rounded-lg shadow-lg p-6 flex flex-col items-center gap-4 hover:bg-[#222] transition-transform hover:scale-105">
            {bot.imageUrl && <Image src={bot.imageUrl} alt={bot.name} width={80} height={80} className="w-20 h-20 object-contain" />}
            <div className="text-xl font-semibold">{bot.name}</div>
            <div className="text-blue-400 font-bold">{bot.price.toString()} Gems</div>
            <div className="text-gray-400 text-sm text-center">{bot.description}</div>
            <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
} 