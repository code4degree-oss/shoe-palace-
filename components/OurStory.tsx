import { Leaf } from 'lucide-react';

export function OurStory() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white border-b border-brand-dark/5">
      <div className="px-4 md:px-16 lg:px-24 text-center max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <Leaf className="text-brand-accent w-12 h-12" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-6">Our Story</h2>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          At Shoe Place, we craft our natural herbal oils using authentic Ayurvedic methods. 
          We slowly sun-infuse cold-pressed base oils with pure, wild-harvested herbs for weeks to 
          extract maximum healing potency—completely free from artificial heat, mineral oils, or harmful chemicals.
        </p>
      </div>
    </section>
  );
}
