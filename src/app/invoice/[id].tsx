import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';

const WHATSAPP_URL = 'https://wa.me/message/MELAKEM7S4MRO1';
const LINE_URL = 'https://line.me/ti/p/i8bWEMStVS';
const TELEGRAM_URL = 'http://t.me/blackfurry0505';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [invoice, setInvoice] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load invoice data from localStorage (replace with backend fetch if needed)
    const data = localStorage.getItem(`invoice_${id}`);
    if (data) setInvoice(JSON.parse(data));
    else setInvoice({ id, items: [], total: 0 });
  }, [id]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Invoice #${id}`, 10, 10);
    if (invoice && invoice.items) {
      invoice.items.forEach((item: any, idx: number) => {
        doc.text(`${item.name} x${item.quantity} - $${item.price * item.quantity}`, 10, 20 + idx * 10);
      });
    }
    doc.text(`Total: $${invoice?.total || 0}`, 10, 30 + (invoice?.items?.length || 0) * 10);
    doc.save(`invoice_${id}.pdf`);
  };

  const handlePayNow = () => setShowModal(true);

  const handlePaymentRedirect = (type: 'whatsapp' | 'line' | 'telegram') => {
    const invoiceLink = `${window.location.origin}/invoice/${id}`;
    let url = '';
    if (type === 'whatsapp') {
      url = `${WHATSAPP_URL}?text=Here%20is%20my%20invoice:%20${encodeURIComponent(invoiceLink)}`;
    } else if (type === 'line') {
      url = LINE_URL;
    } else if (type === 'telegram') {
      url = `${TELEGRAM_URL}?text=Here%20is%20my%20invoice:%20${encodeURIComponent(invoiceLink)}`;
    }
    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6">
      <div className="w-full max-w-lg bg-[#23232b] border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col gap-6" ref={invoiceRef}>
        <h1 className="text-3xl font-bold text-center">Invoice</h1>
        <div className="text-gray-400 text-center">Invoice ID: {id}</div>
        <div className="mt-4">
          {invoice && invoice.items && invoice.items.length > 0 ? (
            <ul className="divide-y divide-white/10">
              {invoice.items.map((item: any, idx: number) => (
                <li key={idx} className="py-2 flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 text-center">No items found.</div>
          )}
        </div>
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total:</span>
          <span>${invoice?.total?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex gap-4 mt-6">
          <button onClick={handleDownloadPDF} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">Download PDF</button>
          <button onClick={handlePayNow} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold">PAY NOW</button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#23232b] p-8 rounded-2xl shadow-xl flex flex-col gap-6 w-full max-w-xs">
            <h2 className="text-xl font-bold text-center mb-2">Send Invoice Via</h2>
            <button onClick={() => handlePaymentRedirect('whatsapp')} className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold">WhatsApp</button>
            <button onClick={() => handlePaymentRedirect('line')} className="bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold">Line App</button>
            <button onClick={() => handlePaymentRedirect('telegram')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">Telegram</button>
            <button onClick={() => setShowModal(false)} className="mt-2 text-gray-400 hover:text-white">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
} 