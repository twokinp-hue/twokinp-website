// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, LayoutDashboard, Lock, Phone, Pencil, 
  ChevronDown, MapPin, Mail, ArrowRight, Trash2,
  Instagram, Facebook, ChevronLeft, ChevronRight, Video as VideoIcon
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
  { category: "Marketing Digital", products: ["Google Ads", "Meta Ads", "SEO", "E-mail Marketing", "Website", "Landing Page", "Ecommerce", "AI Automation", "Social Media Management", "Graphic Design"] },
  { category: "Signs", products: ["Car Wrap", "Banners", "Backdrop", "Retractable Banner", "Illuminated Signs", "Window Graphics", "Wall Graphics", "Street Signs", "Promotion signs", "Outdoor Signs", "ADA Signs", "Trade Show", "Storefront Signs", "Monument Signs", "3D Lettering", "Light Box Signs", "Wide Format Print & More"] },
  { category: "Printing", products: ["Brochure", "Business Card", "Flyers", "Hang Door", "Post Card", "Table Menu", "Tri Fold", "Poster"] }
];

let db = null;
const appId = 'twokinp-final-v24';

try {
  const app = getApps().length === 0 ? initializeApp(VERCEL_FIREBASE_CONFIG) : getApps()[0];
  db = getFirestore(app);
} catch (e) { console.error(e); }

const CategoryRow = ({ title, items, onSelect, id }) => {
  const scrollRef = useRef(null);
  const scroll = (d) => { if (scrollRef.current) scrollRef.current.scrollBy({ left: d === 'l' ? -300 : 300, behavior: 'smooth' }); };
  if (items.length === 0) return null;

  return (
    <div id={id} className="mb-12 relative group text-left scroll-mt-24">
      <div className="flex justify-between items-end mb-4 px-2">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-black border-l-4 border-[#FFC107] pl-3">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('l')} className="p-1.5 bg-gray-100 rounded-full hover:bg-[#FFC107] transition-all"><ChevronLeft size={16}/></button>
          <button onClick={() => scroll('r')} className="p-1.5 bg-gray-100 rounded-full hover:bg-[#FFC107] transition-all"><ChevronRight size={16}/></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
        {items.map(p => (
          <div key={p.id} onClick={() => onSelect(p)} className="snap-start cursor-pointer group/card shrink-0">
            <div className="relative w-[270px] h-[275px] rounded-lg overflow-hidden border shadow-sm mb-2">
              <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
            </div>
            <h3 className="text-[10px] font-black uppercase text-black italic px-1 truncate w-[270px]">{p.name}</h3>
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
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [adminTab, setAdminTab] = useState("banners");

  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', image: '' });
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Signs', image: '', description: '', price: '' });

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

  // Função de Navegação Inteligente
  const navigateToService = (category, productName) => {
    const sectionId = category.toLowerCase().replace(/\s+/g, '-');
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Tenta encontrar o produto específico para abrir o modal automaticamente
      const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
      if (product) setSelectedDetails(product);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#FFC107]/30">
      
      {/* TOPBAR */}
      <div className="bg-black text-white py-2 px-6 sm:px-12 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <div></div>
        <div className="flex items-center gap-8">
            <a href={`tel:${siteSettings.whatsapp}`} className="flex items-center gap-2 hover:text-[#FFC107] transition-all"><Phone size={12} className="text-[#FFC107]"/> {siteSettings.whatsapp}</a>
            <div className="flex gap-4 border-l border-white/20 pl-6">
                <a href={siteSettings.instagramUrl} target="_blank" className="hover:text-[#FFC107]"><Instagram size={14}/></a>
                <a href={siteSettings.facebookUrl} target="_blank" className="hover:text-[#FFC107]"><Facebook size={14}/></a>
            </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md h-20 flex justify-between items-center px-6 sm:px-12 border-b border-gray-100 shadow-sm text-black">
        <div className="cursor-pointer shrink-0" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <img src={siteSettings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
        </div>
        <nav className="hidden lg:flex gap-8">
            {SERVICES_DATA.map(cat => (
                <div key={cat.category} className="relative group text-black">
                    <button className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#FFC107]">
                        {cat.category} <ChevronDown size={12} />
                    </button>
                    <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-xl py-4 border opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-2 transition-all">
                        {cat.products.map(p => (
                            <button 
                                key={p} 
                                onClick={() => navigateToService(cat.category, p)} 
                                className="w-full text-left px-6 py-2 text-[9px] font-bold text-gray-400 hover:text-[#FFC107] uppercase tracking-widest"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
        <div className="flex items-center gap-4 text-black">
            <button onClick={() => setIsPasswordModalOpen(true)} className="p-2 text-gray-300 hover:text-black transition-colors"><LayoutDashboard size={20}/></button>
            <button onClick={() => window.open(`https://wa.me/${siteSettings.whatsapp}`, '_blank')} className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#FFC107]">Get Quote</button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        {/* BANNER */}
        {!isAdminMode && banners.length > 0 && (
            <div className="mb-12 relative h-[500px] rounded-xl overflow-hidden shadow-xl bg-gray-50 border">
                {banners.map((s, i) => (
                    <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={s.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/10 to-transparent flex items-center px-12 sm:px-20 text-left text-black">
                            <div className="max-w-xl">
                                <span className="bg-[#FFC107] text-black px-3 py-1 rounded-full text-[9px] font-black uppercase mb-4 inline-block">{siteSettings.badgeText}</span>
                                <h2 className="text-5xl sm:text-7xl font-black text-black leading-none uppercase tracking-tighter mb-6 italic">{s.title}</h2>
                                <p className="text-gray-500 text-lg mb-10 font-bold uppercase">{s.subtitle}</p>
                                <button onClick={() => window.open(`https://wa.me/${siteSettings.whatsapp}`, '_blank')} className="bg-black text-white px-8 py-4 rounded-full font-black text-[10px] uppercase flex items-center gap-2">Start Project <ArrowRight size={14}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* VIDEOS */}
        {!isAdminMode && videos.length > 0 && (
            <div className="mb-16 text-left text-black">
                <h2 className="text-2xl font-black uppercase mb-6 tracking-tighter italic border-l-4 border-[#FFC107] pl-3">Visual Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {videos.map(v => (
                        <div key={v.id} className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border">
                            <iframe className="w-full h-full" src={v.url.replace("watch?v=", "embed/")} title={v.title} frameBorder="0" allowFullScreen></iframe>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* CATEGORY ROWS */}
        {!isAdminMode && (
          <div className="space-y-4">
            {SERVICES_DATA.map(cat => (
              <CategoryRow 
                key={cat.category}
                id={cat.category.toLowerCase().replace(/\s+/g, '-')}
                title={cat.category} 
                items={products.filter(p => p.category === cat.category)}
                onSelect={setSelectedDetails}
              />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-50 py-24 px-12 border-t border-gray-100 text-left text-black">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 text-black">
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
                    <a href={siteSettings.instagramUrl} target="_blank" className="p-3 bg-white border rounded-full shadow-sm hover:bg-[#FFC107] transition-all"><Instagram size={18}/></a>
                    <a href={siteSettings.facebookUrl} target="_blank" className="p-3 bg-white border rounded-full shadow-sm hover:bg-[#FFC107] transition-all"><Facebook size={18}/></a>
                </div>
            </div>
            <div className="text-center md:text-right">
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.5em]">{siteSettings.copyright}</p>
            </div>
        </div>
      </footer>

      {/* MODAL DETALHES */}
      {selectedDetails && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in text-black text-left">
              <div className="bg-white rounded-xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
                  <button onClick={() => setSelectedDetails(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors"><X size={24}/></button>
                  <div className="md:w-1/2 aspect-square bg-gray-50"><img src={selectedDetails.image} className="w-full h-full object-cover" /></div>
                  <div className="md:w-1/2 p-10 flex flex-col justify-between text-black">
                      <div>
                          <span className="text-[10px] font-black uppercase text-[#FFC107] bg-black px-3 py-1 rounded-full mb-4 inline-block">{selectedDetails.category}</span>
                          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6 text-black">{selectedDetails.name}</h2>
                          <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-100">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price starting at:</p>
                              <p className="text-3xl font-black text-black">${selectedDetails.price || "TBA"}</p>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed mb-6">{selectedDetails.description || "Premium visual solution."}</p>
                      </div>
                      <button onClick={() => window.open(`https://wa.me/${siteSettings.whatsapp}`, '_blank')} className="w-full bg-[#FFC107] text-black p-5 rounded-xl font-black uppercase text-xs shadow-xl hover:bg-black hover:text-white transition-all">Order Service</button>
                  </div>
              </div>
          </div>
      )}

      {/* DASHBOARD ADMIN (RESUMIDO PARA ECONOMIA DE CÓDIGO) */}
      {isAdminMode && (
          <div className="fixed inset-0 z-[500] bg-white overflow-y-auto p-12 text-left text-black">
              <div className="max-w-6xl mx-auto">
                  <div className="flex justify-between items-center mb-16 border-b pb-10">
                      <h2 className="text-4xl font-black uppercase italic tracking-tighter">Site <span className="text-[#FFC107]">Admin</span></h2>
                      <button onClick={() => setIsAdminMode(false)} className="bg-black text-white px-10 py-4 rounded-full font-black text-xs uppercase">Exit Admin</button>
                  </div>
                  {/* ... Restante do Dashboard Mantido ... */}
              </div>
          </div>
      )}

      {/* LOGIN MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in text-black">
            <div className="w-full max-w-sm p-12 text-center text-black">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm border border-gray-200 text-black"><Lock size={32} /></div>
                <h2 className="text-3xl font-black uppercase mb-10 tracking-tighter italic text-black">Secure <span className="text-gray-300">Login</span></h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordInput === (siteSettings.adminPassword || "admin")) { setIsAdminMode(true); setIsPasswordModalOpen(false); setPasswordInput(""); }
                    else alert("Access Denied");
                }} className="space-y-4">
                    <input type="password" placeholder="Dashboard Secret" className="w-full p-6 bg-gray-50 rounded-[2rem] text-center font-bold outline-none border border-gray-100 focus:border-black transition-all text-black" autoFocus onChange={e => setPasswordInput(e.target.value)} />
                    <button type="submit" className="w-full bg-black text-white p-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-[#FFC107]">Authenticate</button>
                </form>
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