import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Invoice - Shoe Place',
};

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // GST is inclusive in the total. The sample invoice shows 2.5% CGST and 2.5% SGST (Total 5% GST).
  // Formula for inclusive tax: Tax = Total - (Total / (1 + TaxRate))
  const totalGstPercentage = 0.05;
  const taxableValue = order.total / (1 + totalGstPercentage);
  const totalGstAmount = order.total - taxableValue;
  const cgst = totalGstAmount / 2;
  const sgst = totalGstAmount / 2;

  // Calculate subtotal from items
  const subtotal = order.items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);


/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hide the print button and force colors when actually printing */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .no-print { display: none !important; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `
      }} />

      <div className="max-w-4xl mx-auto p-8 bg-white text-black font-sans">
        {/* Print Button (hidden when printing) */}
        <div className="flex justify-end mb-8 no-print">
          <button 
            id="print-btn"
            type="button"
            className="bg-black text-white px-4 py-2 rounded font-medium shadow hover:bg-gray-800 transition-colors"
            style={{ WebkitAppearance: 'none' }}
            title="Click to print"
          >
            Print / Save as PDF
          </button>
          
          <script
            dangerouslySetInnerHTML={{
              __html: `
                document.getElementById('print-btn').addEventListener('click', function() {
                  window.print();
                });
              `
            }}
          />
        </div>

        {/* Company Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            {/* Can add logo here if needed, but text is fine */}
          </div>
          <div className="text-right text-sm leading-relaxed">
            <h2 className="font-bold text-lg mb-1">Shoe Place</h2>
            <p>Pune 411046</p>
            <p>Maharashtra, India</p>
            <p>+91 1234567890</p>
            <p>shoeplace@gmail.com</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-wider mb-10">INVOICE</h1>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-8 mb-12 text-sm">
          {/* Billed To / Shipped To */}
          <div>
            <p className="mb-1">{order.shippingName}</p>
            <p className="mb-1">{order.shippingAddress1}</p>
            {order.shippingAddress2 && <p className="mb-1">{order.shippingAddress2}</p>}
            <p className="mb-1">{order.shippingCity} {order.shippingPincode}</p>
            <p className="mb-1">{order.shippingState}</p>
            <p className="mb-1">{order.shippingPhone}</p>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-gray-600">Invoice Number:</div>
            <div className="text-right font-medium">KH-{String(order.invoiceNumber || 0).padStart(4, '0')}</div>

            <div className="text-gray-600">Invoice Date:</div>
            <div className="text-right font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>

            <div className="text-gray-600">Order Number:</div>
            <div className="text-right font-medium">{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</div>

            <div className="text-gray-600">Order Date:</div>
            <div className="text-right font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>

            <div className="text-gray-600">Payment Method:</div>
            <div className="text-right font-medium">{order.paymentMethod === 'ONLINE' ? 'Credit Card/Debit Card/NetBanking' : 'Cash on Delivery'}</div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-8 text-sm">
          <thead>
            <tr className="bg-black text-white">
              <th className="text-left py-2 px-3 font-medium">Product</th>
              <th className="text-right py-2 px-3 font-medium w-24">Quantity</th>
              <th className="text-right py-2 px-3 font-medium w-32">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-4 px-3">
                  <p className="font-medium mb-1">{item.product.name}</p>
                  {item.product.sku && <p className="text-xs font-bold text-gray-800">SKU: {item.product.sku}</p>}
                  <p className="text-xs font-bold text-gray-800">Net Content: {item.product.displayWeight || item.product.weightGrams}{item.product.weightUnit || 'g'}</p>
                </td>
                <td className="text-right py-4 px-3 align-top">{item.quantity}</td>
                <td className="text-right py-4 px-3 align-top">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-80 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-bold text-gray-800">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-bold text-gray-800">Shipping</span>
              <span>{order.deliveryCharge === 0 ? 'Free shipping' : `₹${order.deliveryCharge.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between py-2 border-b-2 border-black mt-1">
              <span className="font-bold">Total</span>
              <div className="text-right">
                <span className="font-bold block">₹{order.total.toFixed(2)}</span>
                <span className="text-xs text-gray-600 block mt-1">(includes ₹{cgst.toFixed(2)} CGST 2.5%,</span>
                <span className="text-xs text-gray-600 block">₹{sgst.toFixed(2)} SGST 2.5%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
