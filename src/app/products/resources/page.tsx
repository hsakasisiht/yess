import React from 'react';

export const metadata = {
  title: "Buy Lords Mobile Resources",
  description: "Shop for Lords Mobile resources at Konoha Bazar. Fast delivery, secure payment, and trusted by gamers.",
  openGraph: {
    title: "Buy Lords Mobile Resources | Konoha Bazar Buy Lords Mobile Gems | Konoha Bazar | Buy Gems | Lords Mobile Gems | Free Gems | Lords Mobile Gems Shop | Lords Mobile Gems Free | Lords Mobile Buy Gems",
    description: "Shop for Lords Mobile resources at Konoha Bazar. Fast delivery, secure payment, and trusted by gamers.",
    url: "https://konohabazar.store/products/resources",
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
    canonical: "https://konohabazar.store/products/resources",
  },
};

import ResourcesClient from './ResourcesClient';

export default function ResourcesPage() {
  return <ResourcesClient />;
} 