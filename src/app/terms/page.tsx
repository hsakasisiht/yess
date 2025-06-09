"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] text-white p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#181c24] rounded-2xl shadow-2xl p-8 border border-white/10">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Terms & Conditions</h1>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">1. Introduction</h2>
          <p className="text-white/90">Welcome to Konoha Shop. By accessing or using our website, you agree to be bound by these Terms & Conditions. Please read them carefully before making any purchase.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">2. Eligibility</h2>
          <p className="text-white/90">You must be at least 18 years old or have the involvement of a parent or guardian to use this site and make purchases.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">3. Products & Orders</h2>
          <ul className="list-disc pl-6 text-white/90 space-y-2">
            <li>All product descriptions and prices are subject to change without notice.</li>
            <li>We reserve the right to refuse or cancel any order at our sole discretion.</li>
            <li>Orders are not final until payment is received and confirmed.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">4. Payments</h2>
          <ul className="list-disc pl-6 text-white/90 space-y-2">
            <li>All payments must be made through the available payment methods on our site.</li>
            <li>We do not store your payment information. All transactions are processed securely.</li>
            <li>Orders will only be processed after successful payment confirmation.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">5. Refunds & Cancellations</h2>
          <ul className="list-disc pl-6 text-white/90 space-y-2">
            <li>All sales are final. Refunds or cancellations are only provided at our discretion or if required by law.</li>
            <li>If you believe there has been an error with your order, please contact our support team within 24 hours.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">6. User Conduct</h2>
          <ul className="list-disc pl-6 text-white/90 space-y-2">
            <li>You agree not to use the site for any unlawful purpose or in violation of any applicable laws.</li>
            <li>Any fraudulent, abusive, or otherwise illegal activity may be grounds for termination of your account.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">7. Limitation of Liability</h2>
          <p className="text-white/90">Konoha Shop is not liable for any indirect, incidental, or consequential damages arising from your use of the site or purchase of products.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">8. Changes to Terms</h2>
          <p className="text-white/90">We reserve the right to update or modify these Terms & Conditions at any time. Changes will be posted on this page. Continued use of the site constitutes acceptance of the new terms.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">9. Contact Us</h2>
          <p className="text-white/90">If you have any questions about these Terms & Conditions, please contact us at <a href="mailto:shakyaakash1324@konohabazar.store" className="text-blue-400 underline">support@konoha.shop</a>.</p>
        </section>
      </div>
    </div>
  );
} 