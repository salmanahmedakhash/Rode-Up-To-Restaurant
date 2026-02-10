
import React, { useState } from 'react';
import { AestheticStyle, Dish } from './types';
import { parseMenuFromText, generateFoodImage } from './geminiService';
import { DishCard } from './components/DishCard';

const App: React.FC = () => {
  const [menuText, setMenuText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<AestheticStyle>(AestheticStyle.BRIGHT_MODERN);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParseMenu = async () => {
    if (!menuText.trim()) return;
    setIsParsing(true);
    setError(null);
    try {
      const result = await parseMenuFromText(menuText);
      const newDishes: Dish[] = result.dishes.map((d, idx) => ({
        id: `dish-${Date.now()}-${idx}`,
        name: d.name,
        description: d.description,
        status: 'pending'
      }));
      setDishes(newDishes);
    } catch (err) {
      setError('গুগল সার্চ ও এসইও ফ্রেন্ডলি মেনু পার্স করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsParsing(false);
    }
  };

  const handleGeneratePhotos = async () => {
    setError(null);
    const pendingDishes = dishes.filter(d => d.status === 'pending' || d.status === 'error');
    setDishes(prev => prev.map(d => pendingDishes.some(p => p.id === d.id) ? { ...d, status: 'generating' } : d));
    for (const dish of pendingDishes) {
      try {
        const imageUrl = await generateFoodImage(dish.name, dish.description, selectedStyle);
        setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, imageUrl, status: 'completed' } : d));
      } catch (err) {
        setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, status: 'error' } : d));
      }
    }
  };

  const handleRegenerateSingle = async (dishId: string) => {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;
    setDishes(prev => prev.map(d => d.id === dishId ? { ...d, status: 'generating' } : d));
    try {
      const imageUrl = await generateFoodImage(dish.name, dish.description, selectedStyle);
      setDishes(prev => prev.map(d => d.id === dishId ? { ...d, imageUrl, status: 'completed' } : d));
    } catch (err) {
      setDishes(prev => prev.map(d => d.id === dishId ? { ...d, status: 'error' } : d));
    }
  };

  return (
    <div className="min-h-screen pb-20 flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <span className="font-bold text-2xl tracking-tight">Rode Up To <span className="text-emerald-600">Restaurant</span></span>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-bold uppercase tracking-widest text-stone-500">
            <a href="#" className="hover:text-emerald-700">Mawna Service</a>
            <a href="#" className="hover:text-emerald-700">Gazipur SEO</a>
            <a href="#" className="hover:text-emerald-700">Premium Menu</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 flex-1">
        <section className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 mb-6 leading-tight">
            The #1 AI Food Photographer in <br/><span className="text-gradient underline decoration-emerald-200">Mawna, Gazipur</span>
          </h1>
          <p className="text-xl text-stone-500 max-w-3xl mx-auto leading-relaxed font-medium">
            মাওনা ও গাজীপুরের রেস্টুরেন্ট মালিকদের জন্য সেরা ডিজিটাল সলিউশন। 
            আপনার মেনু টেক্সট থেকে হাই-কোয়ালিটি রিয়ালিস্টিক ছবি তৈরি করুন মুহূর্তেই।
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-5 space-y-8">
            <section className="bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
              <h2 className="text-2xl font-black mb-6 flex items-center text-stone-800">
                <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mr-4 border border-emerald-100">1</span>
                আপনার মেনু দিন
              </h2>
              <textarea
                value={menuText}
                onChange={(e) => setMenuText(e.target.value)}
                placeholder="আপনার মেনুর নাম এখানে লিখুন... (যেমন: কাচ্চি বিরিয়ানি, চিকেন ফ্রাই)"
                className="w-full h-40 p-5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
              />
              <button
                onClick={handleParseMenu}
                disabled={isParsing || !menuText.trim()}
                className="w-full mt-6 bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center space-x-2"
              >
                {isParsing ? 'বিশ্লেষণ করা হচ্ছে...' : 'মেনু প্রসেস করুন'}
              </button>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
              <h2 className="text-2xl font-black mb-6 flex items-center text-stone-800">
                <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mr-4 border border-emerald-100">2</span>
                ফটোগ্রাফি স্টাইল
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {Object.values(AestheticStyle).map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`p-4 rounded-xl border-2 font-bold text-left transition-all ${
                      selectedStyle === style ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-stone-100 bg-stone-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </section>

            {dishes.length > 0 && (
              <button
                onClick={handleGeneratePhotos}
                className="w-full bg-emerald-600 text-white font-black text-xl py-6 rounded-3xl hover:bg-emerald-700 shadow-2xl transition-all flex items-center justify-center space-x-3"
              >
                <span>ফটো জেনারেট করুন</span>
              </button>
            )}
          </aside>

          <section className="lg:col-span-7 bg-white/50 rounded-[3rem] p-8 border-2 border-dashed border-stone-200 min-h-[500px]">
            {dishes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-stone-400 py-20 text-center">
                <svg className="w-20 h-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-bold">ফটোগ্রাফি গ্যালারি</h3>
                <p>মাওনা, গাজীপুরের সেরা রেস্টুরেন্টগুলোর জন্য ডিজিটাল মেনু কার্ড।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {dishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} onRegenerate={handleRegenerateSingle} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-20 bg-stone-900 text-stone-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h4 className="text-white text-xl font-bold mb-4 italic">Rode Up To Restaurant</h4>
            <p className="text-sm">গাজীপুরের শ্রীপুর ও মাওনা এলাকার রেস্টুরেন্টগুলোর ডিজিটাল ব্র্যান্ডিং পার্টনার।</p>
          </div>
          <div>
            <h4 className="text-white text-lg font-bold mb-4">গাজীপুর লোকেশন</h4>
            <p className="text-sm">মাওনা চৌরাস্তা, শ্রীপুর, গাজীপুর<br/>ঢাকা, বাংলাদেশ।</p>
          </div>
          <div>
            <h4 className="text-white text-lg font-bold mb-4">সার্ভিসসমূহ</h4>
            <ul className="text-sm space-y-2">
              <li>AI ফুড ফটোগ্রাফি</li>
              <li>গুগল ম্যাপস এসইও</li>
              <li>রেস্টুরেন্ট মেনু ডিজাইন</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-stone-800 text-xs">
          © 2024 Rode Up To Restaurant. Ultra-Fast AI Engine Powered by Google Gemini. Optimized for Local Search Indexing.
        </div>
      </footer>
    </div>
  );
};

export default App;
