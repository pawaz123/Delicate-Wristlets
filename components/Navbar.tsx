import React, { useState } from 'react';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Collections', path: '/collections' },
    { name: 'Stylist', path: '/stylist' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
               {/* Simple SVG Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <img 
                  src="/1.png" 
                  alt="Logo" 
                  className="h-16 w-auto object-contain transition-transform"
                />
              </Link>

               <span className="font-serif text-2xl font-bold text-stone-900 tracking-tight">Delicate-Wristlets</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm uppercase tracking-widest transition-colors duration-200 ${
                  isActive(link.path) ? 'text-gold-600 font-semibold' : 'text-stone-600 hover:text-gold-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            
            <a 
              href="https://www.instagram.com/delicate_wristlets?igsh=aG84c3M3Y3Z5N2Zs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Instagram</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-600 hover:text-stone-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-4 text-base font-medium rounded-md ${
                   isActive(link.path) ? 'bg-gold-50 text-gold-700' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-stone-600 hover:bg-stone-50">Admin</Link>
            <div className="pt-4">
              <a 
                href="https://www.instagram.com/delicate_wristlets?igsh=aG84c3M3Y3Z5N2Zs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full text-center block bg-gradient-to-r from-yellow-500 to-red-500 text-white px-4 py-3 rounded-md font-medium"
              >
                Visit Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;