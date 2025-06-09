"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] text-white p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#181c24] rounded-2xl shadow-2xl p-8 border border-white/10">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Contact Us</h1>
        <section className="mb-6">
          <p className="text-white/90 mb-4 text-lg">We're here to help! Whether you have questions about your order, need assistance with our products, or just want to say hello, our team is ready to assist you.</p>
          <p className="text-white/80 mb-4">You can reach out to us for:</p>
          <ul className="list-disc pl-6 text-white/80 space-y-1 mb-4">
            <li>Order support and product inquiries</li>
            <li>Requests to change your order items</li>
            <li>Feedback, suggestions, or partnership opportunities</li>
            <li>Any other questions about Konoha Shop</li>
          </ul>
          <p className="text-white/70 mb-4">We aim to respond to all messages within 24 hours. For urgent matters, please use WhatsApp for a quicker reply.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">Contact Information</h2>
          <div className="flex flex-col gap-3 text-lg">
            <div>
              <span className="font-semibold text-white">Email: </span>
              <a href="mailto:shakyaakash1324@konohabazar.store" className="text-blue-400 underline">shakyaakash1324@konohabazar.store</a>
            </div>
            <div>
              <span className="font-semibold text-white">WhatsApp: </span>
              <a href="https://wa.me/917599318577" target="_blank" rel="noopener noreferrer" className="text-green-400 underline">+91 7599318577</a>
            </div>
          </div>
        </section>
        <section className="mt-8 text-center text-white/60 text-sm">
          <p>Thank you for choosing Konoha Shop. We look forward to assisting you!</p>
        </section>
      </div>
    </div>
  );
} 