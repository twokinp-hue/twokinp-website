"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Save, ArrowLeft, Image as ImageIcon, Type, Layout, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  
  // Simulação de Estado (Num app real, isso viria de um banco de dados)
  const [heroData, setHeroData] = useState({
    title: "FUTURE OF VISUALS",
    subtitle: "Marketing • AI Automation • Signs",
    image: "https://images.unsplash.com/photo-..."
  });

  const handleSave = () => {
    alert("Changes Saved! (Note: Connect a database like Supabase to make this permanent)");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-black">2KINP <span className="text-[#FFC107] text-xs font-normal bg-gray-800 px-2 py-1 rounded">ADMIN</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'home' ? 'bg-[#FFC107] text-black font-bold' : 'text-gray-400 hover:bg-gray-800'}`}>
            <Layout size={18} /> Home Banners
          </button>
          <button onClick={() => setActiveTab('gallery')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'gallery' ? 'bg-[#FFC107] text-black font-bold' : 'text-gray-400 hover:bg-gray-800'}`}>
            <ImageIcon size={18} /> Gallery
          </button>
          <button onClick={() => setActiveTab('footer')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'footer' ? 'bg-[#FFC107] text-black font-bold' : 'text-gray-400 hover:bg-gray-800'}`}>
            <Type size={18} /> Footer Info
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'settings' ? 'bg-[#FFC107] text-black font-bold' : 'text-gray-400 hover:bg-gray-800'}`}>
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition text-sm">
            <ArrowLeft size={16} /> Back to Website
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            {activeTab === 'home' && "Edit Homepage"}
            {activeTab === 'gallery' && "Manage Gallery"}
            {activeTab === 'footer' && "Footer Information"}
          </h2>
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition">
            <Save size={18} /> Save Changes
          </button>
        </header>

        {/* --- HOME EDITOR --- */}
        {activeTab === 'home' && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h3 className="text-[#FFC107] font-bold mb-4 uppercase text-sm">Hero Section</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Main Title</label>
                  <input 
                    value={heroData.title} 
                    onChange={e => setHeroData({...heroData, title: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFC107] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Subtitle</label>
                  <input 
                    value={heroData.subtitle} 
                    onChange={e => setHeroData({...heroData, subtitle: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFC107] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Background Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      value={heroData.image} 
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-gray-500 text-sm" 
                      readOnly
                    />
                    <button className="bg-gray-800 px-4 rounded-lg hover:bg-gray-700"><ImageIcon size={18}/></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- GALLERY EDITOR --- */}
        {activeTab === 'gallery' && (
           <div className="grid grid-cols-3 gap-4">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="aspect-square bg-gray-900 rounded-xl border border-gray-800 flex flex-col items-center justify-center relative group cursor-pointer hover:border-[#FFC107]">
                 <ImageIcon className="text-gray-700 mb-2" size={32} />
                 <span className="text-gray-500 text-xs">Upload Image</span>
                 <div className="absolute top-2 right-2 bg-red-500/20 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"><X size={14}/></div>
               </div>
             ))}
           </div>
        )}

        {/* --- FOOTER EDITOR --- */}
        {activeTab === 'footer' && (
           <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 max-w-2xl">
             <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Contact Phone</label>
                  <input defaultValue="+1 (555) 123-4567" className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Contact Email</label>
                  <input defaultValue="contact@twokinp.com" className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white" />
                </div>
             </div>
           </div>
        )}
      </main>
    </div>
  );
}