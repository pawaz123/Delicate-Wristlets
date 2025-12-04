import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Collections from './components/Collections';
import Stylist from './components/Stylist';
import About from './components/About';
import Admin from './components/Admin';
import ProductPage from "./components/ProductPage";



const Footer: React.FC = () => (
  <footer className="bg-stone-900 text-stone-400 py-12">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
      <div>
        <h3 className="font-serif text-white text-xl mb-4">Delicate-Wristlets</h3>
        <p className="text-sm">Adorning your wrists with elegance since 2024.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#/collections" className="hover:text-gold-400 transition-colors">Collections</a></li>
          <li><a href="#/stylist" className="hover:text-gold-400 transition-colors">AI Stylist</a></li>
          <li><a href="#/about" className="hover:text-gold-400 transition-colors">About Us</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Connect</h4>
        <a 
          href="https://www.instagram.com/delicate_wristlets?igsh=aG84c3M3Y3Z5N2Zs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-gold-400 transition-colors text-sm"
        >
          Instagram
        </a>
      </div>
    </div>
    <div className="text-center mt-12 text-xs border-t border-stone-800 pt-8">
      &copy; {new Date().getFullYear()} Delicate-Wristlets. All rights reserved.
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/stylist" element={<Stylist />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/product/:id" element={<ProductPage />} />   {/* THIS LINE */}
          </Routes>

        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;