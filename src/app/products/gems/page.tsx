export const metadata = {
  title: "Buy Lords Mobile Gems",
  description: "Get the best deals on Lords Mobile gems at Konoha Bazar. Fast, secure, and trusted by gamers.",
  openGraph: {
    title: "Buy Lords Mobile Gems | Konoha Bazar | Buy Gems | Lords Mobile Gems | Free Gems | Lords Mobile Gems Shop | Lords Mobile Gems Free | Lords Mobile Buy Gems",
    description: "Get the best deals on Lords Mobile gems at Konoha Bazar. Fast, secure, and trusted by gamers.",
    url: "https://konohabazar.store/products/gems",
    images: [
      {
        url: "https://konohabazar.store/logo.png",
        width: 1200,
        height: 630,
        alt: "Konoha Bazar Logo",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://konohabazar.store/products/gems",
  },
};

import GemsClient from './GemsClient';

export default function GemsPage() {
  return <GemsClient />;
} 