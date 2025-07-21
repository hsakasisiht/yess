"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useCurrency } from '../../../context/CurrencyContext';

const COMPANY_NAME = 'KONOHA BAZAR';
const COMPANY_CONTACT = '+91 7599318577';
const WHATSAPP_URL = 'https://wa.me/message/MELAKEM7S4MRO1';
const LINE_URL = 'https://line.me/ti/p/i8bWEMStVS';
const TELEGRAM_URL = 'http://t.me/blackfurry0505';

function getItemTotal(item: any) {
  if (item.category === 'GEMS' && item.pricePer100k && item.gemCost) {
    return ((item.gemCost * item.quantity) / 100000) * item.pricePer100k;
  }
  return item.price * item.quantity;
}

function formatDate(dateStr: any) {
  const date = dateStr ? new Date(dateStr) : new Date();
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getResourcePrice(resourceName: string, kingdomNumber: string | null): number | null {
  if (!kingdomNumber) return null;
  const k = parseInt(kingdomNumber, 10);
  if (isNaN(k)) return null;
  const codeMap: { [name: string]: string } = {
    'FULL BANK (4B EACH TYPE)': '44444',
    'FULL BANK NO GOLD (4B EACH BUT NO GOLD)': '44440',
    'HALF BANK (2B EACH TYPE)': '22222',
    'HALF BANK (2B EACH BUT NO GOLD)': '22220',
    '11111 (1B EACH TYPE RESOURCES)': '11111',
    '4B FOOD ONLY': '40000',
  };
  const code = codeMap[resourceName];
  if (!code) return null;
  const priceTable: { [range: string]: { [code: string]: number | null } } = {
    '1-1665': {
      '44444': 3.2,
      '44440': 2.5,
      '22222': 2,
      '22220': 1.7,
      '11111': 1.7,
      '40000': 1.4,
    },
    '1666-1712': {
      '44444': 3.5,
      '44440': 2.8,
      '22222': null,
      '22220': null,
      '11111': 2,
      '40000': null,
    },
    '1713-1732': {
      '44444': 3.9,
      '44440': 3.4,
      '22222': null,
      '22220': null,
      '11111': 2.15,
      '40000': null,
    },
    '1733-1755': {
      '44444': 4.1,
      '44440': 3.6,
      '22222': null,
      '22220': null,
      '11111': 2.3,
      '40000': null,
    },
  };
  let range: string | null = null;
  if (k >= 1 && k <= 1665) range = '1-1665';
  else if (k >= 1666 && k <= 1712) range = '1666-1712';
  else if (k >= 1713 && k <= 1732) range = '1713-1732';
  else if (k >= 1733 && k <= 1755) range = '1733-1755';
  if (!range) return null;
  return priceTable[range][code] ?? null;
}

export default function InvoicePage() {
  const params = useParams();
  const id = (params?.id as string) ?? '';
  const { dbUser } = useAuth();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [manualCopyLink, setManualCopyLink] = useState<string | null>(null);
  const [kingdomNumber, setKingdomNumber] = useState<string | null>(null);
  const { currency, convert, currencySymbol } = useCurrency();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/invoice?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setInvoice(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (invoice && invoice.kingdomNumber) setKingdomNumber(invoice.kingdomNumber);
    else setKingdomNumber(localStorage.getItem('kingdomNumber'));
  }, [invoice]);

  // Calculate subtotal for gems using locked-in pricePer100k and gemCost
  const gemsSubtotal = invoice?.items?.filter((i: any) => i.category === 'GEMS').reduce((sum: number, item: any) => {
    if (item.pricePer100k && item.gemCost) {
      return sum + ((item.gemCost * item.quantity) / 100000) * item.pricePer100k;
    }
    return sum;
  }, 0) || 0;

  // Calculate subtotal for resources using locked-in price
  const resourcesSubtotal = invoice?.items?.filter((i: any) => i.category === 'RESOURCES').reduce((sum: number, item: any) => {
    const price = item.price ?? 0;
    return sum + price * item.quantity;
  }, 0) || 0;

  const handleDownloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF();

    // Header
    const logoImg = new Image();
    logoImg.src = '/1.png'; // Make sure this path is correct and accessible
    await new Promise(resolve => { logoImg.onload = resolve; });
    doc.addImage(logoImg, 'PNG', 14, 8, 40, 16); // x, y, width, height
    doc.setFontSize(18);
    doc.setFontSize(12);
    doc.setTextColor('#FFA500');
    doc.text(invoice?.status || 'UNPAID', 180, 18, { align: 'right' });
    doc.setTextColor('#000000');
    doc.setFontSize(10);
    doc.text(`Invoice #: ${id ?? ''}`, 14, 28);
    doc.text(`Invoice Date: ${formatDate(invoice?.date ?? '')}`, 14, 34);
    doc.text(`Payment Method: Manual`, 150, 28);
    // Billed To / Pay To
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To', 14, 44);
    doc.text('Pay To', 110, 44);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice?.userName || 'Customer', 14, 50);
    doc.text(invoice?.userEmail || '', 14, 56);
    doc.text(COMPANY_NAME, 110, 50);
    doc.text(COMPANY_CONTACT, 110, 56);
    // Table
    const tableColumn = ['Description', 'Amount'];
    const tableRows = invoice.items.map((item: any) => [
      `${item.name} x${item.quantity}`,
      item.category === 'GEMS' && item.pricePer100k && item.gemCost
        ? `${currencySymbol}${convert(getItemTotal(item)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        : `${currencySymbol}${convert(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ]);
    // Add subtotal rows
    tableRows.push([
      { content: 'Sub Total (Gems)', styles: { halign: 'right', fontStyle: 'bold' } },
      { content: `${currencySymbol}${convert(gemsSubtotal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, styles: { fontStyle: 'bold', halign: 'right' } }
    ]);
    tableRows.push([
      { content: 'Sub Total (Resources)', styles: { halign: 'right', fontStyle: 'bold' } },
      { content: `${currencySymbol}${convert(resourcesSubtotal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, styles: { fontStyle: 'bold', halign: 'right' } }
    ]);
    tableRows.push([
      { content: 'Total', styles: { halign: 'right', fontStyle: 'bold' } },
      { content: `${currencySymbol}${convert(invoice?.total).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, styles: { fontStyle: 'bold', halign: 'right' } }
    ]);
    // Draw table
    autoTable(doc, {
      startY: 65,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: 'bold' },
      bodyStyles: { textColor: 20 },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: { 1: { halign: 'right' } },
    });
    doc.save(`invoice_${id}.pdf`);
  };

  const handlePayNow = () => setShowModal(true);

  const handlePaymentRedirect = (type: 'whatsapp' | 'line' | 'telegram') => {
    const invoiceLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/invoice/${id}`;
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

  const billedToName = invoice?.userName || 'Customer';
  const billedToEmail = invoice?.userEmail || '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-white">
        <div className="text-xl">Loading invoice...</div>
      </div>
    );
  }

  if (!invoice || invoice.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-white">
        <div className="text-xl text-red-400">Invoice not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#18181b] text-white p-2 sm:p-4 print:bg-black">
      {/* Hide everything except invoice on print */}
      <style>{`
        @media print {
          body { background: #000 !important; }
          nav, .print\:hidden, .print\:hidden * { display: none !important; }
          .print\:bg-black { background: #000 !important; }
          .print\:text-white { color: #fff !important; }
          .print\:shadow-none, .print\:border-none { box-shadow: none !important; border: none !important; }
        }
      `}</style>
      <div className="w-full max-w-3xl mx-auto bg-[#18181b] border border-[#23232b] rounded-2xl shadow-2xl p-0 sm:p-0 mt-18 lg:mt-0 overflow-hidden">
        {/* Header with logo and status */}
        <div className="flex flex-row items-center justify-between gap-2 bg-[#23232b] px-4 sm:px-8 py-0 border-b border-[#23232b]">
          <div className="flex items-center gap-3">
            <img src="/1.png" alt="KONOHA BAZAR Logo" className="h-25 w-32 object-contain" />
          </div>
          <div className={`font-bold text-base sm:text-xl
            ${invoice?.status === 'PAID' ? 'text-green-400' : invoice?.status === 'FAILED' ? 'text-red-400' : 'text-yellow-400'}`}
          >
            {invoice?.status || 'UNPAID'}
          </div>
        </div>
        {/* Invoice Info Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 px-8 py-6 border-b border-[#23232b] bg-[#18181b]">
          {/* Invoiced To */}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white/90 mb-1">Invoiced To</div>
            <div className="text-white/80 text-sm mb-1">{invoice?.userName || '-'}</div>
            <div className="text-white/60 text-xs mb-1 break-all">{invoice?.userEmail || '-'}</div>
          </div>
          {/* Pay To */}
          <div className="flex-1 min-w-0 sm:text-right">
            <div className="font-bold text-white/90 mb-1">Pay To</div>
            <div className="text-white/80 text-sm mb-1">{COMPANY_NAME}</div>
            <div className="text-white/60 text-xs mb-1">{COMPANY_CONTACT}</div>
          </div>
        </div>
        {/* Invoice Meta Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 px-8 py-4 border-b border-[#23232b] bg-[#18181b]">
          <div className="flex flex-col gap-1">
            <div className="text-xs text-white/60">Invoice #</div>
            <div className="font-mono text-white/90 text-sm">{id || ''}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-white/60">Invoice Date</div>
            <div className="text-white/90 text-sm">{formatDate(invoice?.date || '')}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-white/60">Payment Method</div>
            <div className="text-white/90 text-sm">Manual</div>
          </div>
        </div>
        {/* Items Table */}
        <div className="px-2 sm:px-8 py-6 bg-[#1a1a22]">
          <div className="font-bold text-lg text-white mb-4">Invoice Items</div>
          <table className="w-full border border-[#23232b] rounded-lg overflow-hidden text-sm bg-[#202027]">
            <thead>
              <tr className="bg-[#23232b] text-white/90">
                <th className="text-left px-4 py-2 font-semibold">Description</th>
                <th className="text-right px-4 py-2 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item: any, idx: number) => (
                <tr key={idx} className="border-t border-[#23232b]">
                  <td className="px-4 py-2 text-left text-white/90 whitespace-pre-line ml-2 sm:ml-0 align-top">
                    {item.category === 'RESOURCES' ? (
                      <>
                        <div>{item.name}</div>
                        {item.kingdomNumber && (
                          <div className="text-xs text-green-400 mt-1">Kingdom: {item.kingdomNumber}</div>
                        )}
                      </>
                    ) : (
                      <>
                        {item.name}
                        {item.category === 'GEMS' && item.mightRangeLabel && (
                          <div className="text-xs text-blue-400 mt-1">Might Range: {item.mightRangeLabel}</div>
                        )}
                      </>
                    )}
                    {item.description && <div className="text-xs text-white/60 mt-1">{item.description}</div>}
                  </td>
                  <td className="px-4 py-2 text-right text-white/90 ml-2 sm:ml-0 align-top">
                    <div className="font-bold">x{item.quantity}</div>
                    <div className="text-xs text-white/70 mt-1">
                      {item.category === 'GEMS' && item.pricePer100k && item.gemCost ? (
                        <>{currencySymbol}{convert(getItemTotal(item)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</>
                      ) : (
                        <>{currencySymbol}{convert(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#23232b]">
              <tr>
                <td className="px-4 py-2 text-right font-bold text-white/80">Sub Total (Gems)</td>
                <td className="px-4 py-2 text-right font-bold text-white/90">{currencySymbol}{convert(gemsSubtotal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-right font-bold text-white/80">Sub Total (Resources)</td>
                <td className="px-4 py-2 text-right font-bold text-white/90">{currencySymbol}{convert(resourcesSubtotal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
              {/* Example: taxes/credit, only show if present in data */}
              {invoice.cgst && (
                <tr>
                  <td className="px-4 py-2 text-right font-bold text-white/80">9.00% CGST</td>
                  <td className="px-4 py-2 text-right text-white/90">{currencySymbol}{convert(invoice.cgst).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
              )}
              {invoice.sgst && (
                <tr>
                  <td className="px-4 py-2 text-right font-bold text-white/80">9.00% SGST</td>
                  <td className="px-4 py-2 text-right text-white/90">{currencySymbol}{convert(invoice.sgst).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
              )}
              {invoice.credit && (
                <tr>
                  <td className="px-4 py-2 text-right font-bold text-white/80">Credit</td>
                  <td className="px-4 py-2 text-right text-white/90">{currencySymbol}{convert(invoice.credit).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
              )}
              <tr>
                <td className="px-4 py-2 text-right font-bold text-white">Total</td>
                <td className="px-4 py-2 text-right font-bold text-white">{currencySymbol}{convert(invoice?.total).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            </tfoot>
          </table>
          {/* Taxed item note */}
          {invoice.items.some((item: any) => item.taxed) && (
            <div className="text-xs text-white/60 mt-2">* Indicates a taxed item.</div>
          )}
        </div>
        {/* Transaction Section (optional, can be hidden if not available) */}
        <div className="px-2 sm:px-8 py-4 bg-[#18181b] border-t border-[#23232b] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-xs text-white/60">To Pay</div>
            <div className="text-white/90 text-base font-bold">{currencySymbol}{convert(invoice?.total).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="flex flex-row gap-2 sm:gap-4 print:hidden mt-2 sm:mt-0 justify-end">
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg font-semibold text-base shadow transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Download PDF
            </button>
            <button onClick={handlePayNow} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-semibold text-base shadow transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              PAY NOW
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 print:hidden">
          <div className="bg-[#23232b] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col gap-4 sm:gap-6 w-full max-w-xs">
            <div className="text-xs text-gray-400 text-center mb-1">Copy the link and send via any one contact below.</div>
            <h2 className="text-xl font-bold text-center mb-2 text-white">Send Invoice Via</h2>
            <button onClick={() => handlePaymentRedirect('whatsapp')} className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold">WhatsApp</button>
            <button onClick={() => handlePaymentRedirect('line')} className="bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold">Line App</button>
            <button onClick={() => handlePaymentRedirect('telegram')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">Telegram</button>
            <button
              onClick={async () => {
                const invoiceLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/invoice/${id}`;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  await navigator.clipboard.writeText(invoiceLink);
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 1500);
                } else {
                  setManualCopyLink(invoiceLink);
                }
              }}
              className="bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold"
            >
              {copySuccess ? 'Copied!' : 'Copy Link'}
            </button>
            <button onClick={() => setShowModal(false)} className="mt-2 text-gray-400 hover:text-white">Cancel</button>
          </div>
        </div>
      )}
      {manualCopyLink && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#23232b] p-6 rounded-2xl shadow-xl flex flex-col gap-4 w-full max-w-xs">
            <div className="text-white text-center mb-2">Copy this link manually:</div>
            <input
              type="text"
              value={manualCopyLink}
              readOnly
              className="w-full p-2 rounded bg-[#18181b] text-white border border-blue-400 text-center"
              onFocus={e => e.target.select()}
            />
            <button onClick={() => setManualCopyLink(null)} className="mt-2 text-gray-400 hover:text-white">Close</button>
          </div>
        </div>
      )}
    </div>
  );
} 