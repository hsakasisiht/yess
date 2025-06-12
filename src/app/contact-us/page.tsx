import React from 'react';

export const metadata = {
  title: "Contact Us",
  description: "Contact Konoha Bazar for support, questions, or partnership inquiries. We're here to help you!",
  openGraph: {
    title: "Contact Us | Konoha Bazar Buy Lords Mobile Gems | Konoha Bazar | Buy Gems | Lords Mobile Gems | Free Gems | Lords Mobile Gems Shop | Lords Mobile Gems Free | Lords Mobile Buy Gems",
    description: "Contact Konoha Bazar for support, questions, or partnership inquiries. We're here to help you!",
    url: "https://konohabazar.store/contact-us",
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
    canonical: "https://konohabazar.store/contact-us",
  },
};

import ContactClient from './ContactClient';

export default function ContactPage() {
  return <ContactClient />;
} 