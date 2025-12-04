import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-8">Our Story</h1>
        
        <div className="relative mb-12 aspect-video overflow-hidden rounded-xl shadow-xl">
           <img 
             src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=2070&auto=format&fit=crop" 
             alt="Jewelry Workshop" 
             className="w-full h-full object-cover"
           />
        </div>

        <div className="space-y-6 text-lg text-stone-600 leading-relaxed font-light">
          <p>
            <span className="font-serif font-bold text-xl text-stone-900">Delicate-Wristlets</span> was born from a simple belief: that the right accessory can transform not just an outfit, but a moment.
          </p>
          <p>
            Founded by a collective of artisans passionate about timeless elegance, we curate bangles that bridge the gap between modern minimalism and classic luxury. Every piece in our collection is selected to adorn your wrists with grace, sophistication, and a touch of brilliance.
          </p>
          <p>
            Whether you are celebrating a milestone, dressing for an evening gala, or simply elevating your everyday style, Delicate-Wristlets is here to ensure you shine.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-serif text-xl mb-2">Quality</h3>
                <p className="text-sm text-stone-500">Ethically sourced materials and premium craftsmanship in every curve.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-serif text-xl mb-2">Elegance</h3>
                <p className="text-sm text-stone-500">Designs that speak in whispers, not shouts. Subtle, yet unforgettable.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-serif text-xl mb-2">Service</h3>
                <p className="text-sm text-stone-500">From our AI stylist to our packaging, your experience is our masterpiece.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;