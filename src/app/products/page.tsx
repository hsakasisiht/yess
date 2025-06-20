import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { name: 'Gems', href: '/products/gems', icon: '/gem.svg' },
  { name: 'Resources', href: '/products/resources', icon: '/resources.svg' },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white gap-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
      <div className="flex flex-wrap gap-8 justify-center">
        {categories.map((cat) => (
          <Link key={cat.name} href={cat.href} className="bg-[#171717] rounded-lg shadow-lg p-8 flex flex-col items-center gap-4 hover:bg-[#222] transition-transform hover:scale-105">
            <Image src={cat.icon} alt={cat.name} width={64} height={64} className="w-16 h-16" />
            <span className="text-xl font-semibold">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
} 