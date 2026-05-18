import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation Policy | Shoe Place Herbal Products',
  description: 'Cancellation Policy of Shoe Place Herbal Products.',
};

export default function CancellationPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-brand-dark">Cancellation Policy – Shoe Place Herbal Products</h1>
      
      <div className="space-y-6">
        <p>At Shoe Place Herbal Products, we understand that customers may occasionally need to cancel an order.</p>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Order Cancellation</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Customers may request order cancellation within 4 hours of placing the order.</li>
          <li>Cancellation requests received after 4 hours may not be accepted if the order has already been processed or dispatched.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Non-Cancellable Orders</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Orders cannot be cancelled once dispatched from our facility.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Refund After Cancellation</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>After successful cancellation approval, refunds will be processed within approximately 7 working days.</li>
          <li>
            Refunds may be issued through:
            <ul className="list-[circle] pl-6 mt-2 space-y-1">
              <li>UPI Transfer</li>
              <li>Bank Transfer</li>
            </ul>
          </li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Contact for Cancellation</h2>
        <p>To request cancellation, customers can contact us during support hours.</p>
        <div className="bg-brand-light/20 p-6 rounded-lg mt-4 border border-brand-light">
          <p><strong>Customer Support Timing:</strong></p>
          <ul className="list-none mb-4 space-y-1">
            <li>Monday to Saturday – 10:00 AM to 5:00 PM</li>
            <li>Sunday – Closed</li>
          </ul>
          <p><strong>Email:</strong> <a href="mailto:Shoe Placeherbalproducts@gmail.com" className="text-brand-blue hover:underline">Shoe Placeherbalproducts@gmail.com</a></p>
          <p><strong>Phone:</strong> 7447201252 / 9270201252</p>
        </div>
      </div>
    </div>
  );
}
