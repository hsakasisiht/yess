import { Metadata } from 'next';
import SignupClient from './SignupClient';

export const metadata: Metadata = {
  title: "Sign Up | Konoha Bazar",
  description: "Create your Konoha Bazar account to purchase Lords Mobile gems and resources.",
  robots: {
    index: false, // Don't index signup page
    follow: true,
  },
  openGraph: {
    title: "Sign Up | Konoha Bazar",
    description: "Create your Konoha Bazar account",
    url: "https://konohabazar.store/signup",
  },
};

export default function SignupPage() {
  return <SignupClient />;
}
