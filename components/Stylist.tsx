import React, { useState } from 'react';
import { getStylistAdvice } from '../services/geminiService';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Stylist: React.FC = () => {
  const [input, setInput] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setAdvice(null);
    
    const result = await getStylistAdvice(input);
    
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Visuals */}
        <div className="relative bg-stone-900 text-white p-8 md:p-12 flex flex-col justify-between">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-gold-400 mb-4">
              <Sparkles size={24} />
              <span className="uppercase tracking-widest text-sm font-bold">AI Stylist</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Let us curate your <br /><span className="text-gold-300">perfect look.</span>
            </h2>
            <p className="text-stone-300 text-lg leading-relaxed">
              Describe your outfit, the occasion, or your mood, and our intelligent stylist will recommend the perfect Delicate-Wristlet to match.
            </p>
          </div>
          <div className="relative z-10 mt-8">
            <div className="flex -space-x-4">
              <img className="w-10 h-10 rounded-full border-2 border-stone-800" src="https://picsum.photos/100/100?random=10" alt="Avatar" />
              <img className="w-10 h-10 rounded-full border-2 border-stone-800" src="https://picsum.photos/100/100?random=11" alt="Avatar" />
              <img className="w-10 h-10 rounded-full border-2 border-stone-800" src="https://picsum.photos/100/100?random=12" alt="Avatar" />
              <div className="w-10 h-10 rounded-full border-2 border-stone-800 bg-stone-700 flex items-center justify-center text-xs font-bold">+2k</div>
            </div>
            <p className="text-xs text-stone-400 mt-2">Join thousands of styled customers.</p>
          </div>
        </div>

        {/* Right Side: Interaction */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {!advice ? (
            <div className="animate-fade-in">
              <h3 className="font-serif text-2xl text-stone-800 mb-6">How can we help you shine today?</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-500 mb-2">Tell us about your occasion</label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., I'm wearing a navy blue velvet dress to a winter wedding..."
                    className="w-full h-40 p-4 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none bg-stone-50 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-full bg-stone-900 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-stone-800 disabled:bg-stone-300 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Analyzing Style...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} /> Get Recommendation
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-fade-in space-y-6">
              <div className="bg-gold-50 p-6 rounded-xl border border-gold-100">
                <h4 className="font-serif text-xl text-stone-800 mb-2 flex items-center gap-2">
                  <Sparkles className="text-gold-600" size={20} />
                  Stylist's Choice
                </h4>
                <p className="text-stone-700 leading-relaxed italic">
                  "{advice}"
                </p>
              </div>
              
              <div className="space-y-3">
                <Link 
                  to="/collections"
                  className="block w-full bg-stone-900 text-center text-white py-4 rounded-xl font-semibold hover:bg-stone-800 transition-colors"
                >
                  Browse Collection
                </Link>
                <button
                  onClick={() => { setAdvice(null); setInput(''); }}
                  className="block w-full text-center text-stone-500 py-2 hover:text-stone-800 transition-colors text-sm"
                >
                  Ask another question
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Stylist;