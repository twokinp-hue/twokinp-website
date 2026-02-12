// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, LayoutDashboard, Lock, Phone, Pencil, 
  ChevronDown, MapPin, Mail, ArrowRight, Trash2,
  Instagram, Facebook, ChevronLeft, ChevronRight
} from 'lucide-react';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, addDoc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';

const VERCEL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCxRhZLz3H4zeEEvNkxh4U_ZjeTEGg6PPE",
  authDomain: "the-gsi-catalog.firebaseapp.com",
  projectId: "the-gsi-catalog",
  storageBucket: "the-gsi-catalog.firebasestorage.app",
  messagingSenderId: "434905220729",
  appId: "1:434905220729:web:69f23b774cf711a5df6aa8",
  measurementId: "G-FHDQQKEE7E"
};

const DEFAULT_SETTINGS = {
  companyName: "Twokinp",
  logoUrl: "https://raw.githubusercontent.com/twokinp-hue/twokinp-website/main/logo.jpg",
  address: "Kissimmee, FL - USA",
  whatsapp: "14075550199",
  email: "twokinp@gmail.com",
  instagramUrl: "https://instagram.com/twokinp",
  facebookUrl: "https://facebook.com",
  aboutUs: "Twokinp Agency LLC provides high-end visual solutions and digital marketing services.",
  copyright: "© 2026 Twokinp Agency LLC. All Rights Reserved.",
  badgeText: "PREMIUM SOLUTIONS",
  adminPassword: "admin"
};

const SERVICES_DATA = [
  { category: "Art Design", products: ["Custom Canvas Print", "Acrylic Print", "DTF T-Shirts", "Cartoon Design", "Photo Design"] },
  { category: "Marketing Digital", products: ["Google Ads", "Meta Ads", "SEO", "E-mail Marketing", "website", "Landing page", "Ecommerce", "AI Automation", "Social Media Management", "Graphic Design"] },
  { category: "Signs", products: ["Car Wrap", "Banners", "Backdrop", "Retractable Banner", "Illuminated Signs", "Window Graphics", "Wall Graphics", "Street Signs", "Promotion signs", "Outdoor Signs", "ADA Signs", "Trade Show", "Storefront Signs", "Monument Signs", "3D Lettering", "Light Box Signs", "Wide Format Print & More"] },
  { category: "Printing", products: ["Brochure", "Business Card", "Flyers", "Hang Door", "Post Card", "Table Menu", "Tri Fold", "Poster"] }
];

let db = null;
const appId = 'twokinp-final-v21';

try {
  const app = getApps().length === 0 ? initializeApp(VERCEL_FIREBASE_CONFIG) : getApps()[0];
  db = getFirestore(app);
} catch (e) { console.error(e); }

// Componente de Carrossel por Categoria
const CategoryRow = ({ title, items, onSelect }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="mb-16 relative group">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic text-black border-l-4 border-[#FFC107] pl-4">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-gray-100 rounded-full hover:bg-[#FFC107] transition-all"><ChevronLeft size={20}/></button>
          <button onClick={() => scroll('right')} className="p-2 bg-gray-100 rounded-full hover:bg-[#FFC107] transition-all"><ChevronRight size={20}/></button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map(p => (
          <div 
            key={p.id} 
            onClick={() => onSelect(p)}
            className="min-w-[280px] md:min-w-[320px] snap-start group/card cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border mb-3">
              <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white text-black px-4 py-2 rounded-full font-black uppercase text-[8px]">View Details</div>
              </div>
            </div>
            {/* Texto reduzido em 65% (de text-2xl para text-[10px]/text-xs) */}
            <h3 className="text-[11px] font-black uppercase text-black italic leading-tight px-1">{p.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);
  const [filter, setFilter] = useState("All");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [adminTab, setAdminTab] = useState("banners");

  const [editingBannerId, setEditingBannerId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);

  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Signs', image: '', description: '', price: '' });
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', image: '' });

  useEffect(() => {
    if (!db) return;
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), s => setProducts(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'videos'), s => setVideos(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), s => setBanners(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), s => s.exists() && setSiteSettings(prev => ({...prev, ...s.data()})));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % banners.length), 3000);
    return () => clearInterval(t);
  }, [banners]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if(editingProjectId) await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', editingProjectId), newProduct);
    else await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'products'), { ...newProduct, createdAt: new Date().toISOString() });
    setNewProduct({ name: '', category: 'Signs', image: '', description: '', price: '' }); setEditingProjectId(null);
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if(editingBannerId) await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'banners', editingBannerId), newBanner);
    else await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), { ...newBanner, createdAt: new Date().toISOString() });
    setNewBanner({ title: '', subtitle: '', image: '' }); setEditingBannerId(null);
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if(editingVideoId) await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'videos', editingVideoId), newVideo);
    else await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'videos'), { ...newVideo, createdAt: new Date().toISOString() });
    setNewVideo({title: '', url: ''}); setEditingVideoId(null);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#FFC107]/30">
      
      {/* TOPBAR */}
      <div className="bg-black text-white py-2 px-6 sm:px-12 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <div></div>
        <div className="flex items-center gap-8">
            <a href={`tel:${siteSettings.whatsapp}`} className="flex items-center gap-2 hover:text-[#FFC107] transition-all"><Phone size={12} className="text-[#FFC107]"/> {siteSettings.whatsapp}</a>
            <div className="flex gap-4 border-l border-white/20 pl-6">
                <a href={siteSettings.instagramUrl} target="_blank" className="hover:text-[#FFC107] transition-all"><Instagram size={14}/></a>
                <a href={siteSettings.facebookUrl} target="_blank" className="hover:text-[#FFC107] transition-all"><Facebook size={14}/></a>
            </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md h-20 flex justify-between items-center px-6 sm:px-12 border-b border-gray-100 shadow-sm">
        <div className="cursor-pointer shrink-0" onClick={() => {setFilter("All"); window.scrollTo(0,0)}}>
          <img src={siteSettings.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
        </div>

        <nav className="hidden lg:flex gap-8">
            {SERVICES_DATA.map(cat => (
                <div key={cat.category} className="relative group">
                    <button className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest ${filter === cat.category ? 'text-[#FFC107]' : 'text-gray-400'}`}>
                        {cat.category} <ChevronDown size={12} />
                    </button>
                    <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-xl py-4 border opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-2 transition-all">
                        {cat.products.map(p => (<button key={p} onClick={() => {setFilter(cat.category); setIsQuoteModalOpen(true);}} className="w-full text-left px-6 py-2 text-[9px] font-bold text-gray-400 hover:text-[#FFC107] uppercase tracking-widest">{p}</button>))}
                    </div>
                </div>
            ))}
        </nav>

        <div className="flex items-center gap-4">
            <button onClick={() => setIsPasswordModalOpen(true)} className="p-2 text-gray-300 hover:text-black transition-colors"><LayoutDashboard size={20}/></button>
            <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#FFC107] shadow-lg">Get Quote</button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-12 text-left">
        
        {/* SLIDER (3s) */}
        {!isAdminMode && banners.length > 0 && (
            <div className="mb-20 relative h-[550px] rounded-xl overflow-hidden shadow-xl bg-gray-50 border">
                {banners.map((s, i) => (
                    <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={s.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/10 to-transparent flex items-center px-12 sm:px-20">
                            <div className="max-w-xl animate-in slide-in-from-left">
                                <span className="bg-[#FFC107] text-black px-3 py-1 rounded-full text-[9px] font-black uppercase mb-4 inline-block">{siteSettings.badgeText}</span>
                                <h2 className="text-5xl sm:text-7xl font-black text-black leading-none uppercase tracking-tighter mb-6 italic">{s.title}</h2>
                                <p className="text-gray-500 text-lg mb-10 font-bold uppercase">{s.subtitle}</p>
                                <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-8 py-4 rounded-full font-black text-[10px] uppercase flex items-center gap-2">Start Project <ArrowRight/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* PROJETOS ORGANIZADOS POR CATEGORIA COM CARROSSEL */}
        {!isAdminMode && (
          <div className="space-y-4">
            {SERVICES_DATA.map(cat => (
              <CategoryRow 
                key={cat.category} 
                title={cat.category} 
                items={products.filter(p => p.category === cat.category)}
                onSelect={setSelectedDetails}
              />
            ))}
          </div>
        )}

        {/* VIDEOS */}
        {!isAdminMode && videos.length > 0 && (
            <div className="mt-20 mb-20">
                <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter italic border-l-4 border-black pl-4">Visual <span className="text-[#FFC107]">Highlights</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {videos.map(v => (
                        <div key={v.id} className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border">
                            <iframe className="w-full h-full" src={v.url.replace("watch?v=", "embed/")} title={v.title} frameBorder="0" allowFullScreen></iframe>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-50 py-24 px-12 border-t border-gray-100 text-left">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div>
                <img src={siteSettings.logoUrl} alt="Logo" className="h-10 mb-8" />
                <p className="text-gray-400 text-xs font-bold uppercase leading-relaxed">{siteSettings.aboutUs}</p>
            </div>
            <div>
                <h4 className="font-black uppercase text-[11px] mb-8 tracking-[0.2em]">Contact</h4>
                <div className="space-y-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <p className="flex items-center gap-3"><MapPin size={14} className="text-[#FFC107]"/> {siteSettings.address}</p>
                    <p className="flex items-center gap-3"><Phone size={14} className="text-[#FFC107]"/> {siteSettings.whatsapp}</p>
                    <p className="flex items-center gap-3"><Mail size={14} className="text-[#FFC107]"/> {siteSettings.email}</p>
                </div>
            </div>
            <div>
                <h4 className="font-black uppercase text-[11px] mb-8 tracking-[0.2em]">Social</h4>
                <div className="flex gap-4">
                    <a href={siteSettings.instagramUrl} target="_blank" className="p-3 bg-white border rounded-full shadow-sm hover:bg-[#FFC107]"><Instagram size={18}/></a>
                    <a href={siteSettings.facebookUrl} target="_blank" className="p-3 bg-white border rounded-full shadow-sm hover:bg-[#FFC107]"><Facebook size={18}/></a>
                </div>
            </div>
            <div className="text-center md:text-right">
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.5em]">{siteSettings.copyright}</p>
            </div>
        </div>
      </footer>

      {/* MODAL DETALHES */}
      {selectedDetails && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
              <div className="bg-white rounded-xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row shadow-2xl relative text-left">
                  <button onClick={() => setSelectedDetails(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors"><X size={24}/></button>
                  <div className="md:w-1/2 aspect-square bg-gray-50"><img src={selectedDetails.image} className="w-full h-full object-cover" /></div>
                  <div className="md:w-1/2 p-10 flex flex-col justify-between">
                      <div>
                          <span className="text-[10px] font-black uppercase text-[#FFC107] bg-black px-3 py-1 rounded-full mb-4 inline-block">{selectedDetails.category}</span>
                          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6">{selectedDetails.name}</h2>
                          <div className="bg-gray-50 p-6 rounded-xl mb-6 border">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price starting at:</p>
                              <p className="text-4xl font-black text-black">${selectedDetails.price || "TBA"}</p>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed mb-6">{selectedDetails.description || "High-quality visual solution for your business."}</p>
                      </div>
                      <button onClick={() => window.open(`https://wa.me/${siteSettings.whatsapp}`, '_blank')} className="w-full bg-[#FFC107] text-black p-5 rounded-xl font-black uppercase text-xs shadow-xl">Order Now</button>
                  </div>
              </div>
          </div>
      )}

      {/* ADMIN DASHBOARD (MANTIDO COMPLETO) */}
      {isAdminMode && (
          <div className="fixed inset-0 z-[500] bg-white overflow-y-auto p-12 text-left text-black">
              <div className="max-w-6xl mx-auto">
                  <div className="flex justify-between items-center mb-16 border-b pb-10">
                      <h2 className="text-4xl font-black uppercase italic tracking-tighter">Site <span className="text-[#FFC107]">Admin</span></h2>
                      <button onClick={() => setIsAdminMode(false)} className="bg-black text-white px-10 py-4 rounded-full font-black text-xs uppercase">Exit Admin</button>
                  </div>

                  <div className="flex gap-3 mb-12 bg-gray-50 p-2 rounded-full w-fit">
                      {["banners", "projects", "videos", "settings"].map(t => (
                          <button key={t} onClick={() => setAdminTab(t)} className={`px-10 py-4 rounded-full font-black text-[11px] uppercase transition-all ${adminTab === t ? 'bg-white text-black shadow-lg' : 'text-gray-400'}`}>{t}</button>
                      ))}
                  </div>

                  {/* SETTINGS FORM */}
                  {adminTab === "settings" && (
                      <form onSubmit={async (e) => { e.preventDefault(); await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), siteSettings); alert("Settings Updated!"); }} className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50 p-12 rounded-[2.5rem] border shadow-sm">
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400">Logo URL</label><input className="w-full p-5 bg-white border rounded-2xl font-bold" value={siteSettings.logoUrl} onChange={e => setSiteSettings({...siteSettings, logoUrl: e.target.value})} /></div>
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400">WhatsApp</label><input className="w-full p-5 bg-white border rounded-2xl font-bold" value={siteSettings.whatsapp} onChange={e => setSiteSettings({...siteSettings, whatsapp: e.target.value})} /></div>
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400">Email</label><input className="w-full p-5 bg-white border rounded-2xl font-bold" value={siteSettings.email} onChange={e => setSiteSettings({...siteSettings, email: e.target.value})} /></div>
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400">Address</label><input className="w-full p-5 bg-white border rounded-2xl font-bold" value={siteSettings.address} onChange={e => setSiteSettings({...siteSettings, address: e.target.value})} /></div>
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400">Instagram</label><input className="w-full p-5 bg-white border rounded-2xl font-bold" value={siteSettings.instagramUrl} onChange={e => setSiteSettings({...siteSettings, instagramUrl: e.target.value})} /></div>
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400">Facebook</label><input className="w-full p-5 bg-white border rounded-2xl font-bold" value={siteSettings.facebookUrl} onChange={e => setSiteSettings({...siteSettings, facebookUrl: e.target.value})} /></div>
                          <div className="space-y-3 md:col-span-2"><label className="text-[10px] font-black uppercase text-gray-400">About Us</label><textarea className="w-full p-5 bg-white border rounded-2xl h-32 font-bold" value={siteSettings.aboutUs} onChange={e => setSiteSettings({...siteSettings, aboutUs: e.target.value})} /></div>
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400">Copyright</label><input className="w-full p-5 bg-white border rounded-2xl font-bold" value={siteSettings.copyright} onChange={e => setSiteSettings({...siteSettings, copyright: e.target.value})} /></div>
                          <button type="submit" className="md:col-span-2 bg-black text-white p-7 rounded-3xl font-black uppercase hover:bg-[#FFC107]">Save All Changes</button>
                      </form>
                  )}

                  {/* PROJECTS FORM */}
                  {adminTab === "projects" && (
                      <div className="space-y-12">
                          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-12 rounded-[2.5rem] border shadow-sm">
                              <input placeholder="Name" className="p-5 rounded-2xl border font-bold" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                              <select className="p-5 rounded-2xl border font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>{SERVICES_DATA.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}</select>
                              <input placeholder="Image URL" className="p-5 rounded-2xl border font-bold" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} required />
                              <input placeholder="Price" className="p-5 rounded-2xl border font-bold" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                              <textarea placeholder="Info" className="p-5 rounded-2xl border font-bold md:col-span-2 h-24" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                              <button type="submit" className="md:col-span-2 bg-black text-white p-6 rounded-2xl font-black uppercase">{editingProjectId ? "Update" : "Add"}</button>
                          </form>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                              {products.map(p => (<div key={p.id} className="bg-white p-2 rounded-xl border group relative"><img src={p.image} className="w-full aspect-square object-cover rounded-lg" /><div className="flex gap-2 mt-2"><button onClick={() => { setEditingProjectId(p.id); setNewProduct({...p}); window.scrollTo(0,0); }} className="text-[#FFC107]"><Pencil size={14}/></button><button onClick={async () => { if(confirm("Del?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', p.id)); }} className="text-red-500"><Trash2 size={14}/></button></div></div>))}
                          </div>
                      </div>
                  )}

                  {/* VIDEOS FORM */}
                  {adminTab === "videos" && (
                      <div className="space-y-12">
                          <form onSubmit={handleAddVideo} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-12 rounded-[2.5rem] border shadow-sm">
                              <input placeholder="Title" className="p-5 rounded-2xl border font-bold" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} required />
                              <input placeholder="URL" className="p-5 rounded-2xl border font-bold" value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} required />
                              <button type="submit" className="md:col-span-2 bg-black text-white p-6 rounded-2xl font-black uppercase">{editingVideoId ? "Update" : "Add"}</button>
                          </form>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {videos.map(v => (<div key={v.id} className="p-4 bg-gray-50 rounded-xl border flex flex-col gap-2"><iframe className="w-full aspect-video rounded-lg" src={v.url.replace("watch?v=", "embed/")}></iframe><div className="flex justify-between"><span className="text-xs font-bold">{v.title}</span><div className="flex gap-2"><button onClick={() => { setEditingVideoId(v.id); setNewVideo({...v}); window.scrollTo(0,0); }} className="text-[#FFC107]"><Pencil size={14}/></button><button onClick={async () => { if(confirm("Del?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'videos', v.id)); }} className="text-red-500"><Trash2 size={14}/></button></div></div></div>))}
                          </div>
                      </div>
                  )}

                  {/* BANNERS FORM */}
                  {adminTab === "banners" && (
                      <div className="space-y-12">
                          <form onSubmit={handleAddBanner} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-12 rounded-[2.5rem] border shadow-sm">
                              <input placeholder="Title" className="p-5 rounded-2xl border font-bold" value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} required />
                              <input placeholder="Image URL" className="p-5 rounded-2xl border font-bold" value={newBanner.image} onChange={e => setNewBanner({...newBanner, image: e.target.value})} required />
                              <textarea placeholder="Subtitle" className="md:col-span-2 p-5 rounded-2xl border font-bold h-20" value={newBanner.subtitle} onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})} />
                              <button type="submit" className="md:col-span-2 bg-black text-white p-6 rounded-2xl font-black uppercase">Save Banner</button>
                          </form>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {banners.map(b => (<div key={b.id} className="relative aspect-video rounded-xl overflow-hidden border"><img src={b.image} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 hover:opacity-100 transition-all"><button onClick={() => { setEditingBannerId(b.id); setNewBanner({...b}); window.scrollTo(0,0); }} className="bg-white p-2 rounded-full text-blue-500"><Pencil size={18}/></button><button onClick={async () => { if(confirm("Del?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'banners', b.id)); }} className="bg-white p-2 rounded-full text-red-500"><Trash2 size={18}/></button></div></div>))}
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* LOGIN MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in">
            <div className="w-full max-w-sm p-12 text-center">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm border border-gray-200"><Lock size={32} /></div>
                <h2 className="text-3xl font-black uppercase mb-10 tracking-tighter italic">Secure <span className="text-gray-300">Login</span></h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordInput === (siteSettings.adminPassword || "admin")) { setIsAdminMode(true); setIsPasswordModalOpen(false); setPasswordInput(""); }
                    else alert("Access Denied");
                }} className="space-y-4">
                    <input type="password" placeholder="Dashboard Secret" className="w-full p-6 bg-gray-50 rounded-[2rem] text-center font-bold outline-none border border-gray-100 focus:border-black transition-all" autoFocus onChange={e => setPasswordInput(e.target.value)} />
                    <button type="submit" className="w-full bg-black text-white p-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-[#FFC107]">Authenticate</button>
                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="text-[10px] text-gray-300 uppercase font-black mt-10 hover:text-black transition-all underline underline-offset-8">Return Home</button>
                </form>
            </div>
        </div>
      )}

      {isQuoteModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <div className="bg-white p-10 rounded-2xl w-full max-w-xl relative shadow-2xl text-left">
                  <button onClick={() => setIsQuoteModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X /></button>
                  <h2 className="text-2xl font-black uppercase mb-8">Free Request</h2>
                  <div className="space-y-4">
                      <input placeholder="Your Name" className="w-full p-4 bg-gray-50 border rounded-xl font-bold" />
                      <input placeholder="Your Email" className="w-full p-4 bg-gray-50 border rounded-xl font-bold" />
                      <button onClick={() => window.open(`https://wa.me/${siteSettings.whatsapp}`, '_blank')} className="w-full bg-black text-white p-5 rounded-xl font-black uppercase tracking-widest hover:bg-[#FFC107]">Connect via WhatsApp</button>
                  </div>
              </div>
          </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
// TWOKINP V21.0 - CATEGORY SLIDERS & TEXT SIZE OPTIMIZED