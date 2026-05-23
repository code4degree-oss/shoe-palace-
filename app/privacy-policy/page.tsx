import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Shoe Place',
  description: 'Privacy Policy of Shoe Place.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-brand-dark">Privacy Policy – Shoe Place</h1>
      
      <div className="space-y-6">
        <p>At Shoe Place, we respect your privacy and are committed to protecting your personal information.</p>
        
        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Information We Collect</h2>
        <p>We may collect the following information from customers:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name</li>
          <li>Mobile number</li>
          <li>Email address</li>
          <li>Shipping address</li>
          <li>Payment information (processed securely through payment gateways)</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">How We Use Your Information</h2>
        <p>Customer information is used for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Order processing</li>
          <li>Shipping and delivery</li>
          <li>Customer support</li>
          <li>Order updates and communication</li>
          <li>Improving our services</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Payment Security</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>All payments are processed through secure payment gateways.</li>
          <li>We do not store customers&apos; debit/credit card information on our servers.</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Information Sharing</h2>
        <p>We do not sell, rent, or trade customer personal information to third parties.</p>
        <p>Information may only be shared with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Courier/postal partners for delivery purposes</li>
          <li>Payment gateway providers for transaction processing</li>
          <li>Government authorities if legally required</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Cookies</h2>
        <p>Our website may use cookies to improve user experience and website functionality.</p>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Customer Responsibility</h2>
        <p>Customers are responsible for providing accurate delivery and contact information while placing orders.</p>

        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4 text-brand-dark">Policy Updates</h2>
        <p>We reserve the right to update or modify this Privacy Policy at any time without prior notice.</p>

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
