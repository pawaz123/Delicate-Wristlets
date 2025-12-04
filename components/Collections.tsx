import React, { useState, useEffect } from 'react';
import { getProducts, getCategories, saveOrder } from '../services/storage';
import { Product, Order } from '../types';
import { Filter, ShoppingBag, X } from 'lucide-react';
import { Link } from "react-router-dom";

const Collections: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('All');
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
    setCategories(getCategories());
  }, []);

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setOrderSuccess(false);
    setCustomerName('');
    setEmail('');
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      customerName,
      email,
      productName: selectedProduct.name,
      price: selectedProduct.price,
      date: new Date().toLocaleDateString(),
      status: 'Pending'
    };

    saveOrder(newOrder);
    setOrderSuccess(true);
    setTimeout(() => setSelectedProduct(null), 2000);
  };

  return (
    <div className="min-h-screen pt-20 bg-stone-50 relative">

      {/* Header */}
      <div className="bg-white border-b border-stone-200 py-12 px-4 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">The Collection</h1>
        <p className="text-stone-500 max-w-2xl mx-auto">
          Explore our exquisitely crafted bangles, designed to add a touch of sophistication to every gesture.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Filter */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-stone-500 mr-4">
            <Filter size={18} />
            <span className="text-sm uppercase tracking-wide">Filter by:</span>
          </div>
          <button
            onClick={() => setFilter('All')}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              filter === 'All' ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            All
          </button>

          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === cat ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {filteredProducts.map((product) => {

            // Use first image if multiple images exist
            const images = Array.isArray(product.image) ? product.image : [product.image];
            const thumbnail = images[0];

            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-stone-200">
                  <img
                    src={thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-xs text-gold-600 uppercase tracking-widest font-semibold mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-serif text-lg text-stone-900 mb-2 truncate">
                    {product.name}
                  </h3>
                  <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-lg font-bold text-stone-900">
                      ₹{product.price.toLocaleString()}
                    </span>

                    {/* Keep Buy button separate for modal if user doesn't click card */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // prevent link navigation
                        handleBuyClick(product);
                      }}
                      className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gold-600 transition-colors"
                    >
                      <ShoppingBag size={16} /> Buy Now
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl text-stone-400 font-serif">No elegant pieces found in this category.</h3>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="font-serif text-xl font-bold text-stone-900">Checkout</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>

            {orderSuccess ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  ✔
                </div>
                <h4 className="text-2xl font-serif text-stone-800 mb-2">Order Confirmed!</h4>
                <p className="text-stone-500">Thank you for your purchase, {customerName}.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-stone-50 rounded-lg">
                  <img
                    src={Array.isArray(selectedProduct.image) ? selectedProduct.image[0] : selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <p className="font-serif font-bold text-stone-900">{selectedProduct.name}</p>
                    <p className="text-gold-600">₹{selectedProduct.price.toLocaleString()}</p>
                  </div>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-stone-900 text-white py-3 rounded-lg hover:bg-stone-800 transition-colors font-bold mt-2"
                  >
                    Complete Purchase
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Collections;
