import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: "Login | Konoha Bazar",
  description: "Login to your Konoha Bazar account to purchase Lords Mobile gems and resources.",
  robots: {
    index: false, // Don't index login page
    follow: true,
  },
  openGraph: {
    title: "Login | Konoha Bazar",
    description: "Login to your Konoha Bazar account",
    url: "https://konohabazar.store/login",
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
