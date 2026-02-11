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

// Firebase Imports
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot, addDoc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';

// --- CONFIGURAÇÃO FIREBASE ---
const VERCEL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCxRhZLz3H4zeEEvNkxh4U_ZjeTEGg6PPE",
  authDomain: "the-gsi-catalog.firebaseapp.com",
  projectId: "the-gsi-catalog",
  storageBucket: "the-gsi-catalog.firebasestorage.app",
  messagingSenderId: "434905220729",
  appId: "1:434905220729:web:69f23b774cf711a5df6aa8",
  measurementId: "G-FHDQQKEE7E"
};

// --- DADOS PADRÃO ---
const DEFAULT_SETTINGS = {
  companyName: "Twokinp",
  address: "Kissimmee, FL - USA",
  whatsapp: "14075550199",
  email: "twokinp@gmail.com",
  instagramUrl: "https://instagram.com/twokinp",
  facebookUrl: "https://facebook.com",
  linkedinUrl: "",
  copyright: "Twokinp Agency LLC. All Rights Reserved.",
  badgeText: "PREMIUM SOLUTIONS",
  adminPassword: "admin"
};

const SERVICES_DATA = [
  { 
    category: "Art Design", 
    products: ["Custom Canvas Print", "Acrylic Print", "DTF T-Shirts", "Cartoon Design", "Photo Design"] 
  },
  { 
    category: "Marketing Digital", 
    products: ["Google Ads", "Meta Ads", "SEO", "E-mail Marketing", "website", "Landing page", "Ecommerce", "AI Automation", "Social Media Management", "Graphic Design"] 
  },
  { 
    category: "Signs", 
    products: ["Car Wrap", "Banners", "Backdrop", "Retractable Banner", "Illuminated Signs", "Window Graphics", "Wall Graphics", "Street Signs", "Promotion signs", "Outdoor Signs", "ADA Signs", "Trade Show", "Storefront Signs", "Monument Signs", "3D Lettering", "Light Box Signs", "Wide Format Print & More"] 
  },
  { 
    category: "Printing", 
    products: ["Brochure", "Business Card", "Flyers", "Hang Door", "Post Card", "Table Menu", "Tri Fold", "Poster"] 
  }
];

// --- INICIALIZAÇÃO FIREBASE ---
let db = null;
let auth = null;
const appId = 'twokinp-site-final-production-v9'; 

try {
  const app = getApps().length === 0 ? initializeApp(VERCEL_FIREBASE_CONFIG) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) { console.error("Firebase Error", e); }

// --- COMPONENTE MODAL DE ORÇAMENTO ---
const QuoteModal = React.memo(({ onClose }) => {
  const [step, setStep] = useState(1);
  const [qCategory, setQCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ category: '', product: '', quantity: 1, name: '', email: '', phone: '' });

  const handleCategorySelect = (cat) => { setQCategory(cat); setFormData({...formData, category: cat.category}); setStep(2); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        await fetch('https://n8n.twokinp.cloud/webhook/pedido-site-v2', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        if (db) await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), { ...formData, createdAt: new Date().toISOString() });
        setSuccess(true); setTimeout(() => onClose(), 3000);
    } catch (e) { setSuccess(true); setTimeout(() => onClose(), 3000); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
      <div className="bg-white p-10 rounded-[3rem] w-full max-w-xl relative shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"><X /></button>
        {success ? (
            <div className="py-10 text-center animate-in zoom-in">
                <CheckCircle2 className="mx-auto text-green-500 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-black uppercase">Sent!</h2>
            </div>
        ) : (
            <div className="text-left">
                <h2 className="text-2xl font-black uppercase mb-8">{step === 1 ? "Select Area" : "Details"}</h2>
                {step === 1 && (
                    <div className="grid grid-cols-1 gap-3">
                        {SERVICES_DATA.map(c => (
                            <button key={c.category} onClick={() => handleCategorySelect(c)} className="w-full p-5 bg-gray-50 rounded-2xl text-left font-bold hover:bg-[#FFC107] transition-all flex items-center justify-between">
                                {c.category} <ArrowRight size={18}/>
                            </button>
                        ))}
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-4">
                        <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})}>
                            <option>Which service?</option>
                            {qCategory.products.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <input type="text" placeholder="Name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" onChange={e => setFormData({...formData, name: e.target.value})}/>
                        <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" onChange={e => setFormData({...formData, email: e.target.value})}/>
                        <button onClick={handleSubmit} className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase shadow-xl">Submit Request</button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
});

export default function App() {
  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);
  const [filter, setFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [adminTab, setAdminTab] = useState("projects");
  const [isSaving, setIsSaving] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Signs', image: '', description: '' });

  const portfolioRef = useRef(null);

  useEffect(() => {
    if (!db) return;
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), s => setProducts(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'videos'), s => setVideos(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), s => setBanners(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), s => s.exists() && setSiteSettings(s.data()));
  }, []);

  const handleAddVideo = async (e) => {
      e.preventDefault(); if(!newVideo.url) return;
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'videos'), { ...newVideo, createdAt: new Date().toISOString() });
      setNewVideo({title: '', url: ''});
  };

  const handleDeleteVideo = async (id) => { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'videos', id)); };

  const handleAddProduct = async (e) => {
      e.preventDefault();
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'products'), { ...newProduct, createdAt: new Date().toISOString() });
      setNewProduct({ name: '', category: 'Signs', image: '', description: '' });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => (filter === "All" || p.category === filter)).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [products, filter]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* TOP BAR - CONTACT & SOCIALS */}
      <div className="bg-gray-50 border-b border-gray-100 py-3 px-6 sm:px-12 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
        <div className="flex items-center gap-6">
            <a href={`tel:${siteSettings.whatsapp}`} className="flex items-center gap-2 hover:text-[#FFC107] transition-colors"><Phone size={14} className="text-[#FFC107]"/> {siteSettings.whatsapp}</a>
            <div className="hidden sm:flex items-center gap-2"><MapPin size={14}/> {siteSettings.address}</div>
        </div>
        <div className="flex items-center gap-4">
            <a href={siteSettings.instagramUrl} target="_blank" className="hover:text-black transition-colors"><Instagram size={16}/></a>
            <a href={siteSettings.facebookUrl} target="_blank" className="hover:text-black transition-colors"><Facebook size={16}/></a>
        </div>
      </div>

      {/* HEADER CLEAN */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl h-24 flex justify-between items-center px-6 sm:px-12 border-b border-gray-50">
        <div className="cursor-pointer" onClick={() => {setFilter("All"); window.scrollTo(0,0)}}>
          <img src="https://raw.githubusercontent.com/twokinp-hue/twokinp-website/main/logo.png" alt="Twokinp Logo" className="h-16 w-auto" />
        </div>

        <div className="hidden lg:flex gap-10">
            {SERVICES_DATA.map(c => (
                <button key={c.category} onClick={() => {setFilter(c.category); portfolioRef.current?.scrollIntoView({behavior:'smooth'})}} 
                className={`text-[11px] font-black uppercase tracking-widest transition-all ${filter === c.category ? 'text-[#FFC107] scale-110' : 'text-gray-400 hover:text-black'}`}>
                    {c.category}
                </button>
            ))}
        </div>

        <div className="flex items-center gap-4">
            <button onClick={() => setIsPasswordModalOpen(true)} className="p-2 text-gray-300 hover:text-black transition-colors"><LayoutDashboard size={20}/></button>
            <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#FFC107] hover:text-black transition-all shadow-xl">Get Quote</button>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-12">
        
        {/* SLIDER */}
        {!isAdminMode && banners.length > 0 && (
            <div className="mb-20 relative h-[650px] rounded-[4rem] overflow-hidden shadow-2xl">
                {banners.map((s, i) => (
                    <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={s.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent"></div>
                        <div className="absolute inset-0 flex items-center px-12 sm:px-24">
                            <div className="max-w-xl text-left">
                                <span className="bg-[#FFC107] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-6 inline-block">{siteSettings.badgeText}</span>
                                <h2 className="text-6xl sm:text-8xl font-black text-black leading-none uppercase tracking-tighter mb-8">{s.title}</h2>
                                <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-10 py-5 rounded-full font-black uppercase text-xs flex items-center gap-3">Request Price <ArrowRight size={18}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* VIDEOS SECTION (IF ANY) */}
        {!isAdminMode && videos.length > 0 && (
            <div className="mb-20 text-left">
                <h2 className="text-4xl font-black uppercase mb-10 tracking-tighter">Featured <span className="text-[#FFC107]">Works</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map(v => (
                        <div key={v.id} className="aspect-video bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100">
                            <iframe className="w-full h-full" src={v.url.replace("watch?v=", "embed/")} title={v.title} frameBorder="0" allowFullScreen></iframe>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* PROJECTS GRID */}
        <div ref={portfolioRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProducts.map(p => (
                <div key={p.id} onClick={() => setSelectedProduct(p)} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 mb-6">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <div className="text-left px-4">
                        <span className="text-[9px] font-black uppercase text-[#FFC107] tracking-widest mb-2 block">{p.category}</span>
                        <h3 className="text-3xl font-black uppercase text-black leading-none tracking-tighter">{p.name}</h3>
                    </div>
                </div>
            ))}
        </div>
      </main>

      <footer className="bg-gray-50 py-24 px-12 border-t border-gray-100 text-center">
        <img src="https://raw.githubusercontent.com/twokinp-hue/twokinp-website/main/logo.png" alt="Logo" className="h-16 mx-auto mb-12" />
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.5em]">{siteSettings.copyright}</p>
      </footer>

      {/* DASHBOARD ADMIN */}
      {isAdminMode && (
          <div className="fixed inset-0 z-[90] bg-white overflow-y-auto p-12 text-left animate-in slide-in-from-bottom">
              <div className="max-w-6xl mx-auto">
                  <div className="flex justify-between items-center mb-16">
                      <h2 className="text-4xl font-black uppercase tracking-tighter italic">TWOKINP <span className="text-[#FFC107]">ADMIN</span></h2>
                      <button onClick={() => setIsAdminMode(false)} className="bg-black text-white px-8 py-3 rounded-full font-black text-xs">CLOSE PANEL</button>
                  </div>

                  <div className="flex gap-4 mb-10 overflow-x-auto pb-4">
                      {["projects", "videos", "settings"].map(t => (
                          <button key={t} onClick={() => setAdminTab(t)} className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest ${adminTab === t ? 'bg-[#FFC107] text-black shadow-lg' : 'bg-gray-100 text-gray-400'}`}>{t}</button>
                      ))}
                  </div>

                  {adminTab === "projects" && (
                      <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
                          <input placeholder="Project Title" className="p-5 bg-white rounded-2xl border-none outline-none shadow-sm" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                          <select className="p-5 bg-white rounded-2xl border-none outline-none shadow-sm" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                              {SERVICES_DATA.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                          </select>
                          <input placeholder="Image URL" className="p-5 bg-white rounded-2xl border-none outline-none shadow-sm md:col-span-2" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} required />
                          <button type="submit" className="md:col-span-2 bg-black text-white p-5 rounded-2xl font-black uppercase">Save Project</button>
                      </form>
                  )}

                  {adminTab === "videos" && (
                      <div className="space-y-10">
                          <form onSubmit={handleAddVideo} className="bg-gray-50 p-10 rounded-[3rem] grid grid-cols-1 md:grid-cols-2 gap-6">
                              <input placeholder="Video Title" className="p-5 bg-white rounded-2xl outline-none" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} required />
                              <input placeholder="YouTube URL (https://...)" className="p-5 bg-white rounded-2xl outline-none" value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} required />
                              <button type="submit" className="md:col-span-2 bg-[#FFC107] p-5 rounded-2xl font-black uppercase">Add Video to Site</button>
                          </form>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {videos.map(v => (
                                  <div key={v.id} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center border border-gray-100">
                                      <span className="font-bold text-xs">{v.title}</span>
                                      <button onClick={() => handleDeleteVideo(v.id)} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={18}/></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {adminTab === "settings" && (
                      <form onSubmit={handleSaveSettings} className="bg-gray-50 p-10 rounded-[3rem] grid grid-cols-1 md:grid-cols-2 gap-6">
                          <input placeholder="WhatsApp" className="p-5 bg-white rounded-2xl outline-none shadow-sm" value={siteSettings.whatsapp} onChange={e => setSiteSettings({...siteSettings, whatsapp: e.target.value})} />
                          <input placeholder="Address" className="p-5 bg-white rounded-2xl outline-none shadow-sm" value={siteSettings.address} onChange={e => setSiteSettings({...siteSettings, address: e.target.value})} />
                          <input placeholder="Instagram URL" className="p-5 bg-white rounded-2xl outline-none shadow-sm" value={siteSettings.instagramUrl} onChange={e => setSiteSettings({...siteSettings, instagramUrl: e.target.value})} />
                          <input placeholder="Facebook URL" className="p-5 bg-white rounded-2xl outline-none shadow-sm" value={siteSettings.facebookUrl} onChange={e => setSiteSettings({...siteSettings, facebookUrl: e.target.value})} />
                          <button type="submit" className="md:col-span-2 bg-black text-white p-5 rounded-2xl font-black uppercase">Update Global Info</button>
                      </form>
                  )}
              </div>
          </div>
      )}

      {/* LOGIN MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in">
            <div className="w-full max-w-sm p-12 text-center">
                <Lock className="mx-auto mb-8 text-gray-200" size={48} />
                <h2 className="text-2xl font-black uppercase mb-8">Admin Access</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordInput === (siteSettings.adminPassword || "admin")) { setIsAdminMode(true); setIsPasswordModalOpen(false); setPasswordInput(""); }
                    else alert("Access Denied");
                }} className="space-y-4">
                    <input type="password" placeholder="Enter Password" className="w-full p-5 bg-gray-50 rounded-3xl text-center font-bold outline-none focus:border-black" autoFocus onChange={e => setPasswordInput(e.target.value)} />
                    <button type="submit" className="w-full bg-black text-white p-5 rounded-3xl font-black uppercase">Unlock</button>
                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="text-xs text-gray-400 uppercase font-black tracking-widest mt-6">Cancel</button>
                </form>
            </div>
        </div>
      )}

      {isQuoteModalOpen && <QuoteModal onClose={() => setIsQuoteModalOpen(false)} />}

    </div>
  );
}
// TWOKINP V9.0 - ULTRA CLEAN & VIDEO READY