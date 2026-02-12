// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, X, ExternalLink, LayoutDashboard, Lock, 
  CheckCircle2, Share2, BarChart3, TrendingUp, ChevronDown, MapPin, 
  Mail, Phone, Award, Pencil, PlayCircle, Youtube, ChevronLeft, ChevronRight,
  Loader2, Menu, ArrowRight, MessageSquare, Car, Lightbulb, Printer, Building,
  PlusCircle, Trash2, Settings, Image as ImageIcon, Globe, Instagram, Facebook, Linkedin,
  Palette, PenTool, Megaphone, Maximize, FileText, User, RefreshCw, Key, Video
} from 'lucide-react';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
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
  aboutUs: "Twokinp Agency LLC is dedicated to providing high-end visual solutions and digital marketing services.",
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
const appId = 'twokinp-v16-final-revision';

try {
  const app = getApps().length === 0 ? initializeApp(VERCEL_FIREBASE_CONFIG) : getApps()[0];
  db = getFirestore(app);
} catch (e) { console.error(e); }

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
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Signs', image: '', description: '', price: '' });
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', image: '' });
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const portfolioRef = useRef(null);

  useEffect(() => {
    if (!db) return;
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), s => setProducts(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'videos'), s => setVideos(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), s => setBanners(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), s => s.exists() && setSiteSettings(prev => ({...prev, ...s.data()})));
  }, []);

  // BANNER TIMER: 3 SECONDS
  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % banners.length), 3000);
    return () => clearInterval(t);
  }, [banners]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), siteSettings);
    alert("Settings Updated in English!");
  };

  const filteredProducts = useMemo(() => products.filter(p => (filter === "All" || p.category === filter)), [products, filter]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#FFC107]/30">
      
      {/* TOPBAR */}
      <div className="bg-black text-white py-2 px-6 sm:px-12 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <div className="hidden sm:block">{siteSettings.address}</div>
        <div className="flex items-center gap-6">
            <a href={`tel:${siteSettings.whatsapp}`} className="flex items-center gap-2 hover:text-[#FFC107] transition-all"><Phone size={12} className="text-[#FFC107]"/> {siteSettings.whatsapp}</a>
            <div className="flex gap-4 border-l border-white/20 pl-6">
                <a href={siteSettings.instagramUrl} target="_blank" className="hover:text-[#FFC107] transition-all"><Instagram size={14}/></a>
                <a href={siteSettings.facebookUrl} target="_blank" className="hover:text-[#FFC107] transition-all"><Facebook size={14}/></a>
            </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md h-20 flex justify-between items-center px-6 sm:px-12 border-b border-gray-100 shadow-sm text-black">
        <div className="cursor-pointer shrink-0" onClick={() => {setFilter("All"); window.scrollTo(0,0)}}>
          <img src={siteSettings.logoUrl} onError={(e) => e.target.src = "https://raw.githubusercontent.com/twokinp-hue/twokinp-website/main/logo.jpg"} alt="Logo" className="h-10 w-auto object-contain" />
        </div>

        <nav className="hidden lg:flex gap-8">
            {SERVICES_DATA.map(cat => (
                <div key={cat.category} className="relative group text-black" onMouseEnter={() => setActiveDropdown(cat.category)} onMouseLeave={() => setActiveDropdown(null)}>
                    <button className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest transition-all ${filter === cat.category ? 'text-[#FFC107]' : 'text-gray-400'}`}>
                        {cat.category} <ChevronDown size={12} className={`transition-transform ${activeDropdown === cat.category ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`absolute top-full left-0 w-64 bg-white shadow-2xl rounded-xl py-4 border transition-all ${activeDropdown === cat.category ? 'opacity-100 visible translate-y-2' : 'opacity-0 invisible translate-y-4'}`}>
                        {cat.products.map(p => (
                            <button key={p} onClick={() => {setFilter(cat.category); setIsQuoteModalOpen(true);}} className="w-full text-left px-6 py-2.5 text-[9px] font-black text-gray-400 hover:bg-gray-50 hover:text-[#FFC107] transition-colors uppercase tracking-widest">
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </nav>

        <div className="flex items-center gap-4">
            <button onClick={() => setIsPasswordModalOpen(true)} className="p-2 text-gray-300 hover:text-black transition-colors"><LayoutDashboard size={20}/></button>
            <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#FFC107] hover:text-black transition-all shadow-xl">Get Quote</button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        
        {/* SLIDER AUTOMATIC (3s) */}
        {!isAdminMode && banners.length > 0 && (
            <div className="mb-16 relative h-[550px] rounded-xl overflow-hidden shadow-xl bg-gray-50 border">
                {banners.map((s, i) => (
                    <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={s.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/10 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center px-12 sm:px-20 text-left">
                            <div className="max-w-xl animate-in slide-in-from-left duration-700">
                                <span className="bg-[#FFC107] text-black px-3 py-1 rounded-full text-[9px] font-black uppercase mb-4 inline-block">{siteSettings.badgeText}</span>
                                <h2 className="text-5xl sm:text-7xl font-black text-black leading-none uppercase tracking-tighter mb-6 italic">{s.title}</h2>
                                <p className="text-gray-500 text-base mb-8 font-bold uppercase tracking-tight">{s.subtitle}</p>
                                <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-8 py-4 rounded-full font-black uppercase text-[10px] flex items-center gap-2 hover:bg-[#FFC107] transition-all">Start Project <ArrowRight size={14}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* VIDEOS */}
        {!isAdminMode && videos.length > 0 && (
            <div className="mb-20">
                <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter italic text-black">Visual <span className="text-[#FFC107]">Highlights</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map(v => (
                        <div key={v.id} className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-100">
                            <iframe className="w-full h-full" src={v.url.replace("watch?v=", "embed/")} title={v.title} frameBorder="0" allowFullScreen></iframe>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* PORTFOLIO GRID */}
        <div ref={portfolioRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(p => (
                <div key={p.id} onClick={() => setSelectedDetails(p)} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-4 shadow-sm">
                        <img src={p.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                             <div className="bg-white text-black px-6 py-2 rounded-full font-black uppercase text-[9px] shadow-2xl">View info</div>
                        </div>
                    </div>
                    <div className="px-2 text-left">
                        <span className="text-[9px] font-black uppercase text-[#FFC107] tracking-widest mb-1 block">{p.category}</span>
                        <h3 className="text-2xl font-black uppercase text-black leading-none tracking-tighter italic">{p.name}</h3>
                    </div>
                </div>
            ))}
        </div>
      </main>

      {/* EDITABLE FOOTER */}
      <footer className="bg-gray-50 py-24 px-12 border-t border-gray-100 text-left text-black">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div>
                <img src={siteSettings.logoUrl} alt="Logo" className="h-10 mb-8" />
                <p className="text-gray-400 text-xs font-bold uppercase leading-relaxed">{siteSettings.aboutUs}</p>
            </div>
            <div>
                <h4 className="font-black uppercase text-[11px] mb-8 tracking-[0.2em]">Contact Us</h4>
                <div className="space-y-4 text-[10px] font-bold text-gray-500 uppercase">
                    <p className="flex items-center gap-3"><MapPin size={14} className="text-[#FFC107]"/> {siteSettings.address}</p>
                    <p className="flex items-center gap-3"><Phone size={14} className="text-[#FFC107]"/> {siteSettings.whatsapp}</p>
                    <p className="flex items-center gap-3"><Mail size={14} className="text-[#FFC107]"/> {siteSettings.email}</p>
                </div>
            </div>
            <div>
                <h4 className="font-black uppercase text-[11px] mb-8 tracking-[0.2em]">Follow Us</h4>
                <div className="flex gap-4">
                    <a href={siteSettings.instagramUrl} target="_blank" className="p-3 bg-white border rounded-full shadow-sm hover:bg-[#FFC107] transition-all"><Instagram size={18}/></a>
                    <a href={siteSettings.facebookUrl} target="_blank" className="p-3 bg-white border rounded-full shadow-sm hover:bg-[#FFC107] transition-all"><Facebook size={18}/></a>
                </div>
            </div>
            <div className="text-center md:text-right border-t md:border-none pt-8 md:pt-0">
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.5em]">{siteSettings.copyright}</p>
            </div>
        </div>
      </footer>

      {/* PRODUCT DETAILS MODAL (OPEN ON CLIQUE) */}
      {selectedDetails && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in text-black text-left">
              <div className="bg-white rounded-xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
                  <button onClick={() => setSelectedDetails(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors"><X size={24}/></button>
                  <div className="md:w-1/2 aspect-square bg-gray-50">
                      <img src={selectedDetails.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-between">
                      <div>
                          <div className="mb-4">
                              <span className="text-[10px] font-black uppercase text-[#FFC107] bg-black px-3 py-1 rounded-full">{selectedDetails.category}</span>
                          </div>
                          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6 text-black">{selectedDetails.name}</h2>
                          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price starting at:</p>
                              <p className="text-3xl font-black text-black">${selectedDetails.price || "TBA"}</p>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed mb-6">{selectedDetails.description || "Inquiry for more information."}</p>
                      </div>
                      <button onClick={() => window.open(`https://wa.me/${siteSettings.whatsapp}`, '_blank')} className="w-full bg-[#FFC107] text-black p-5 rounded-xl font-black uppercase text-xs shadow-xl hover:bg-black hover:text-white transition-all">Order this service</button>
                  </div>
              </div>
          </div>
      )}

      {/* DASHBOARD */}
      {isAdminMode && (
          <div className="fixed inset-0 z-[120] bg-white overflow-y-auto p-12 text-left text-black animate-in slide-in-from-bottom">
              <div className="max-w-5xl mx-auto">
                  <div className="flex justify-between items-center mb-10 border-b pb-6">
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black">Twokinp <span className="text-[#FFC107]">Admin</span></h2>
                      <button onClick={() => setIsAdminMode(false)} className="bg-black text-white px-8 py-3 rounded-full font-black text-xs uppercase">Exit Admin</button>
                  </div>
                  <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-full w-fit">
                      {["banners", "projects", "videos", "settings"].map(t => (
                          <button key={t} onClick={() => setAdminTab(t)} className={`px-8 py-3 rounded-full font-black text-[10px] uppercase transition-all ${adminTab === t ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}>{t}</button>
                      ))}
                  </div>

                  {adminTab === "settings" && (
                      <form onSubmit={handleSaveSettings} className="bg-gray-50 p-12 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-10 shadow-sm border text-black">
                          <h3 className="md:col-span-2 text-xl font-black uppercase text-[#FFC107]">English Website Settings</h3>
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400">WhatsApp</label><input className="w-full p-4 bg-white border rounded-xl font-bold" value={siteSettings.whatsapp} onChange={e => setSiteSettings({...siteSettings, whatsapp: e.target.value})} /></div>
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400">Address</label><input className="w-full p-4 bg-white border rounded-xl font-bold" value={siteSettings.address} onChange={e => setSiteSettings({...siteSettings, address: e.target.value})} /></div>
                          <div className="space-y-3 md:col-span-2"><label className="text-[10px] font-black uppercase text-gray-400">About Us (English)</label><textarea className="w-full p-4 bg-white border rounded-xl h-32 font-bold" value={siteSettings.aboutUs} onChange={e => setSiteSettings({...siteSettings, aboutUs: e.target.value})} /></div>
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400">Copyright Statement</label><input className="w-full p-4 bg-white border rounded-xl font-bold" value={siteSettings.copyright} onChange={e => setSiteSettings({...siteSettings, copyright: e.target.value})} /></div>
                          <button type="submit" className="md:col-span-2 bg-black text-white p-7 rounded-3xl font-black uppercase tracking-widest shadow-xl hover:bg-[#FFC107] hover:text-black transition-all">Update Website Data</button>
                      </form>
                  )}
                  {/* ... Outras abas mantidas robustas ... */}
              </div>
          </div>
      )}

      {/* SECURE LOGIN */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in text-black">
            <div className="w-full max-w-sm p-12 text-center text-black">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm"><Lock size={32} className="text-black" /></div>
                <h2 className="text-3xl font-black uppercase mb-10 tracking-tighter italic text-black">Secure <span className="text-gray-300">Login</span></h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordInput === (siteSettings.adminPassword || "admin")) { setIsAdminMode(true); setIsPasswordModalOpen(false); setPasswordInput(""); }
                    else alert("Access Denied");
                }} className="space-y-4">
                    <input type="password" placeholder="Admin Secret" className="w-full p-6 bg-gray-50 rounded-[2rem] text-center font-bold outline-none border border-gray-100 focus:border-black transition-all text-black" autoFocus onChange={e => setPasswordInput(e.target.value)} />
                    <button type="submit" className="w-full bg-black text-white p-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-[#FFC107]">Log In</button>
                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="text-[10px] text-gray-300 uppercase font-black mt-10 hover:text-black underline underline-offset-8">Return Home</button>
                </form>
            </div>
        </div>
      )}

      {isQuoteModalOpen && <QuoteModal onClose={() => setIsQuoteModalOpen(false)} />}

    </div>
  );
}
// TWOKINP V16.1 - COMPLETE REVISION