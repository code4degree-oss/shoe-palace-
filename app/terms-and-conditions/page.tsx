import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Shoe Place',
  description: 'Terms and Conditions of Shoe Place.',
};

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-brand-dark">Terms & Conditions – Shoe Place</h1>
      
      <div className="space-y-6">
        <p>Welcome to Shoe Place. By accessing or using our website and purchasing our products, you agree to comply with the following Terms & Conditions.</p>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Products</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We offer hair care and skin care products made using natural ingredients.</li>
          <li>Due to the presence of the nature of handcrafted products, slight variations in color, fragrance, and texture may occur naturally.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Product Results</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Results may vary from person to person depending on:
            <ul className="list-[circle] pl-6 mt-2 space-y-1">
              <li>Hair type</li>
              <li>Scalp type</li>
              <li>Skin type</li>
              <li>Lifestyle</li>
              <li>Regularity of usage</li>
            </ul>
          </li>
          <li>Customers are advised to use products regularly and patiently, as results may vary based on individual use.</li>
          <li>Customers are strongly advised to perform a patch test before using any product.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Orders & Payments</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>All orders are prepaid only.</li>
          <li>Cash on Delivery (COD) service is currently not available.</li>
          <li>Orders are confirmed only after successful payment completion.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Cancellation</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Orders can be cancelled within 4 hours of placing the order.</li>
          <li>Orders cannot be cancelled once dispatched.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Shipping & Delivery</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We dispatch orders through India Post.</li>
          <li>Delivery timelines are estimated and may vary due to postal or external factors beyond our control.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Damage or Missing Item Claims</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Customers must record a proper unboxing video while opening the parcel.</li>
          <li>
            Unboxing video proof is mandatory for any:
            <ul className="list-[circle] pl-6 mt-2 space-y-1">
              <li>Damage claim</li>
              <li>Leakage claim</li>
              <li>Wrong product claim</li>
              <li>Missing item claim</li>
            </ul>
          </li>
          <li>Claims without video proof may not be accepted.</li>
          <li>Damaged parcel complaints must be reported within 24 hours of delivery.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Intellectual Property</h2>
        <p>All website content including images, logos, product descriptions, and branding belongs to Shoe Place and may not be copied or reused without permission.</p>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Limitation of Liability</h2>
        <p>We shall not be held responsible for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Allergic reactions caused due to individual sensitivity</li>
          <li>Incorrect usage of products</li>
          <li>Delays caused by courier/postal services</li>
          <li>Losses arising from incorrect customer information</li>
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
