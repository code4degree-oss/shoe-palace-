import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return & Refund Policy | Shoe Place',
  description: 'Return and Refund Policy of Shoe Place.',
};

export default function ReturnRefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-brand-dark">Return & Refund Policy – Shoe Place</h1>
      
      <div className="space-y-6">
        <p>At Shoe Place, customer satisfaction is important to us. Please read our return and refund guidelines carefully.</p>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Return Eligibility</h2>
        <p>Returns or replacement requests are accepted only in the following cases:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Damaged product received</li>
          <li>Leakage during transit</li>
          <li>Wrong item delivered</li>
          <li>Missing item in parcel</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Mandatory Unboxing Video</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Customers must record a clear and proper unboxing video while opening the parcel.</li>
          <li>The unboxing video is mandatory for any complaint or claim.</li>
          <li>Claims without video proof may not be accepted.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Reporting Time</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Customers must report damaged or incorrect parcels within 24 hours of delivery.</li>
        </ul>

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Non-Returnable Items</h2>
        <p>Due to hygiene and personal care reasons, used or opened products cannot be returned or exchanged unless there is a genuine issue verified by us.</p>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Refund Process</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Approved refunds are generally processed within approximately 7 working days.</li>
          <li>Refunds may be issued through UPI or bank transfer.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Returned Parcels Due to Incorrect Address</h2>
        <p>If a parcel is returned because of:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Incorrect address</li>
          <li>Incomplete address</li>
          <li>Unreachable mobile number</li>
          <li>Non-collection from post office</li>
        </ul>
        <p className="mt-4">Then:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Re-shipping can be arranged after customer confirmation.</li>
          <li>A re-shipping charge of ₹30 may apply.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Contact Information</h2>
        <div className="bg-brand-light/20 p-6 rounded-lg mt-4 border border-brand-light">
          <p><strong>Email:</strong> <a href="mailto:support@shoeplace.com" className="text-brand-blue hover:underline">support@shoeplace.com</a></p>
          <p><strong>Phone:</strong> 7447201252 / 9270201252</p>
        </div>
      </div>
    </div>
  );
}
