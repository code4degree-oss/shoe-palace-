import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Shoe Place',
  description: 'Shipping Policy of Shoe Place.',
};

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-brand-dark">Shipping Policy – Shoe Place</h1>
      
      <div className="space-y-6">
        <p>At Shoe Place, we aim to deliver your orders safely and efficiently across India.</p>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Order Processing</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>All orders are processed only after successful payment confirmation.</li>
          <li>Orders are usually dispatched within 4 working days after placing the order.</li>
          <li>All orders are shipped through India Post.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Delivery Timeline</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Delivery within Maharashtra generally takes approximately 10–12 business days depending on the location and postal service availability.</li>
          <li>Delivery outside Maharashtra may also take approximately 10–12 business days or longer in certain remote areas.</li>
          <li>
            Delivery timelines may occasionally be affected due to:
            <ul className="list-[circle] pl-6 mt-2 space-y-1">
              <li>Festivals</li>
              <li>Public holidays</li>
              <li>Weather conditions</li>
              <li>Postal delays</li>
              <li>Strikes or unforeseen circumstances</li>
            </ul>
          </li>
        </ul>

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Shipping Charges</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Shipping charges, if applicable, will be displayed during checkout before payment confirmation.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Important Customer Information</h2>
        <p>Customers are requested to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Enter the correct full delivery address with PIN code.</li>
          <li>Provide an active mobile number while placing the order to avoid delivery issues.</li>
        </ul>
        <p className="mt-4">If the customer&apos;s phone number is unreachable or the address is incomplete/incorrect:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The parcel may remain at the nearest post office for approximately 5–6 days.</li>
          <li>If unclaimed, the parcel may be returned back to us.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Re-Delivery of Returned Parcels</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Once the returned parcel is received by us, we will contact the customer regarding re-delivery.</li>
          <li>Re-dispatch can be arranged after customer confirmation.</li>
          <li>A re-shipping charge of ₹30 may be applicable for re-dispatch orders.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Contact Information</h2>
        <div className="bg-brand-light/20 p-6 rounded-lg mt-4 border border-brand-light">
          <p><strong>Business Name:</strong> Shoe Place</p>
          <p><strong>Address:</strong> Hivare Tarfe Narayangaon, Taluka – Junnar, District – Pune, Maharashtra – 410504</p>
          <p><strong>Email:</strong> <a href="mailto:support@shoeplace.com" className="text-brand-blue hover:underline">support@shoeplace.com</a></p>
          <p><strong>Phone:</strong> 7447201252 / 9270201252</p>
        </div>
      </div>
    </div>
  );
}
