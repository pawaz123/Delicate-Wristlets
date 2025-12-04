import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck, Clock } from 'lucide-react';
import { getProducts } from '../services/storage';
import { Product } from '../types';

const Hero: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products dynamically so admin changes are reflected on the home page
    const allProducts = getProducts();
    // Show the first 4 products, or all if less than 4
    setFeaturedProducts(allProducts.slice(0, 4));
  }, []);

  return (
    <div className="w-full bg-stone-50">
      {/* 1. HERO SECTION */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[20s] hover:scale-100"
          style={{ 
            backgroundImage: 'url("public/hero-large.jpeg")',
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div> {/* Overlay */}
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-wide mb-6 animate-fade-in-up drop-shadow-lg">
            Adorn Your Wrists <br />
            <span className="italic font-light text-gold-300">With Elegance</span>
          </h1>
          
          <p className="text-stone-200 text-lg md:text-xl max-w-2xl mb-10 font-light tracking-wider animate-fade-in-up delay-200">
            Discover the handcrafted collection where luxury meets timeless beauty.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
            <Link 
              to="/collections" 
              className="px-8 py-4 bg-white text-stone-900 font-semibold uppercase tracking-widest hover:bg-gold-50 transition-colors shadow-lg"
            >
              Shop Collection
            </Link>
            <Link 
              to="/stylist" 
              className="px-8 py-4 border border-white text-white font-semibold uppercase tracking-widest hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Ask AI Stylist
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* 2. FEATURES / ICONS SECTION */}
      <section className="py-12 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-stone-50 rounded-full mb-4 text-gold-600">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Lifetime Warranty</h3>
            <p className="text-stone-500 text-sm mt-2">Quality that lasts forever, guaranteed.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-stone-50 rounded-full mb-4 text-gold-600">
              <Truck size={32} />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Free Global Shipping</h3>
            <p className="text-stone-500 text-sm mt-2">Complimentary delivery on all orders.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-stone-50 rounded-full mb-4 text-gold-600">
              <Clock size={32} />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">30-Day Returns</h3>
            <p className="text-stone-500 text-sm mt-2">Shop with confidence and peace of mind.</p>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC TRENDING SECTION */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-12">
             <div>
               <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">Trending Now</h2>
               <p className="text-stone-500">The most coveted pieces this season.</p>
             </div>
             <Link to="/collections" className="hidden md:flex items-center gap-2 text-stone-900 hover:text-gold-600 transition-colors font-medium">
               View All <ArrowRight size={16} />
             </Link>
           </div>
           
           {featuredProducts.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {featuredProducts.map(product => (
                 <Link key={product.id} to="/collections" className="group bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square overflow-hidden bg-stone-100 mb-4 rounded-lg relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 text-xs font-bold uppercase tracking-widest rounded text-stone-900">
                        {product.category}
                      </div>
                    </div>
                    <h3 className="font-serif text-lg text-stone-900 group-hover:text-gold-600 transition-colors truncate">{product.name}</h3>
                    <p className="text-stone-500 font-medium mt-1">${product.price.toLocaleString()}</p>
                 </Link>
               ))}
             </div>
           ) : (
             <div className="text-center py-12 text-stone-400 italic">
               Loading collection...
             </div>
           )}

           <div className="mt-12 text-center md:hidden">
             <Link to="/collections" className="inline-flex items-center gap-2 text-stone-900 border-b border-stone-900 pb-1 hover:text-gold-600 hover:border-gold-600 transition-all">
               View All Collections <ArrowRight size={16} />
             </Link>
           </div>
        </div>
      </section>

      {/* 4. STORY / IMAGE SECTION */}
      <section className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-gold-200 rounded-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?q=80&w=2070&auto=format&fit=crop" 
                alt="Craftsmanship" 
                className="rounded-lg shadow-xl relative z-10 w-full" 
              />
            </div>
            <div className="w-full md:w-1/2">
               <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6 leading-tight">
                 Artistry in <br/><span className="text-gold-600">Every Detail</span>
               </h2>
               <div className="h-1 w-20 bg-gold-500 mb-8"></div>
               <p className="text-stone-600 text-lg leading-relaxed mb-8">
                 Each Delicate-Wristlet piece is a testament to superior craftsmanship. We combine traditional techniques with modern aesthetics to create bangles that are not just accessories, but heirlooms.
               </p>
               <div className="grid grid-cols-2 gap-6 mb-8">
                 <div>
                   <h4 className="font-bold text-stone-900 text-xl">24k Gold</h4>
                   <p className="text-sm text-stone-500">Premium plating thickness</p>
                 </div>
                 <div>
                   <h4 className="font-bold text-stone-900 text-xl">Hand-Finished</h4>
                   <p className="text-sm text-stone-500">By master artisans</p>
                 </div>
               </div>
               <Link to="/about" className="inline-block px-8 py-3 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                 Our Story
               </Link>
            </div>
         </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <Star className="w-10 h-10 text-gold-400 mx-auto mb-8" fill="currentColor" />
            <h3 className="font-serif text-2xl md:text-4xl leading-snug mb-10 text-gold-50">
              "I have never received so many compliments. The AI Stylist recommended the Rose Blush Bracelet for my gala, and it was absolute perfection."
            </h3>
            <div className="flex items-center justify-center gap-4">
              <img src="https://picsum.photos/100/100?random=20" alt="User" className="w-12 h-12 rounded-full border-2 border-gold-500" />
              <div className="text-left">
                <p className="font-bold text-white uppercase tracking-widest text-sm">Sophia V.</p>
                <p className="text-xs text-gold-400">Verified Buyer</p>
              </div>
            </div>
         </div>
      </section>

      {/* 6. NEWSLETTER CTA */}
      <section className="py-20 bg-gold-50">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-stone-900 mb-4">Join the Inner Circle</h2>
          <p className="text-stone-600 mb-8">Subscribe to receive exclusive offers, early access to new collections, and styling tips.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 border border-stone-300 rounded focus:ring-2 focus:ring-gold-500 focus:outline-none bg-white"
            />
            <button className="px-6 py-3 bg-stone-900 text-white font-semibold rounded hover:bg-stone-800 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;