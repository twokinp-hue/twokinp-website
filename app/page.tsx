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
  copyright: "Twokinp Agency LLC. All Rights Reserved.",
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
let auth = null;
const appId = 'twokinp-site-final-production-v12'; 

try {
  const app = getApps().length === 0 ? initializeApp(VERCEL_FIREBASE_CONFIG) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) { console.error("Firebase Error", e); }

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white p-10 rounded-2xl w-full max-w-xl relative shadow-2xl text-black">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X /></button>
        {success ? (
            <div className="py-10 text-center animate-in zoom-in">
                <CheckCircle2 className="mx-auto text-green-500 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-black uppercase">Sent!</h2>
            </div>
        ) : (
            <div className="text-left">
                <h2 className="text-xl font-black uppercase mb-8">{step === 1 ? "Select Area" : "Details"}</h2>
                {step === 1 && (
                    <div className="grid grid-cols-1 gap-2">
                        {SERVICES_DATA.map(c => (
                            <button key={c.category} onClick={() => handleCategorySelect(c)} className="w-full p-4 bg-gray-50 rounded-xl text-left font-bold hover:bg-[#FFC107] transition-all flex items-center justify-between">
                                {c.category} <ArrowRight size={16}/>
                            </button>
                        ))}
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-4">
                        <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-bold" value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})}>
                            <option>Which service?</option>
                            {qCategory.products.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <input type="text" placeholder="Name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-bold" onChange={e => setFormData({...formData, name: e.target.value})}/>
                        <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-bold" onChange={e => setFormData({...formData, email: e.target.value})}/>
                        <button onClick={handleSubmit} className="w-full bg-black text-white p-4 rounded-xl font-black uppercase shadow-xl hover:bg-[#FFC107] hover:text-black transition-all">Submit Request</button>
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
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [adminTab, setAdminTab] = useState("banners");
  const [isSaving, setIsSaving] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Estados de Edição
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);

  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Signs', image: '', description: '' });
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', image: '' });

  const portfolioRef = useRef(null);

  useEffect(() => {
    if (!db) return;
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), s => setProducts(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'videos'), s => setVideos(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), s => setBanners(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), s => s.exists() && setSiteSettings(s.data()));
  }, []);

  // --- ACTIONS ---
  const handleSaveSettings = async (e) => {
    e.preventDefault(); setIsSaving(true);
    try { await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), siteSettings); alert("Settings Updated!"); } 
    finally { setIsSaving(false); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if(editingProjectId) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', editingProjectId), newProduct);
        setEditingProjectId(null);
    } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'products'), { ...newProduct, createdAt: new Date().toISOString() });
    }
    setNewProduct({ name: '', category: 'Signs', image: '', description: '' });
  };

  const handleAddBanner = async (e) => {
      e.preventDefault();
      if(editingBannerId) {
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'banners', editingBannerId), newBanner);
          setEditingBannerId(null);
      } else {
          await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), { ...newBanner, createdAt: new Date().toISOString() });
      }
      setNewBanner({ title: '', subtitle: '', image: '' });
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if(editingVideoId) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'videos', editingVideoId), newVideo);
        setEditingVideoId(null);
    } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'videos'), { ...newVideo, createdAt: new Date().toISOString() });
    }
    setNewVideo({title: '', url: ''});
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => (filter === "All" || p.category === filter)).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [products, filter]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#FFC107]/30">
      
      {/* TOP INFO BAR */}
      <div className="bg-black text-white py-2 px-6 sm:px-12 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <div>{/* Left spacer */}</div>
        <div className="flex items-center gap-6">
            <a href={`tel:${siteSettings.whatsapp}`} className="flex items-center gap-2 hover:text-[#FFC107]"><Phone size={12} className="text-[#FFC107]"/> {siteSettings.whatsapp}</a>
            <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                <a href={siteSettings.instagramUrl} target="_blank" className="hover:text-[#FFC107]"><Instagram size={14}/></a>
                <a href={siteSettings.facebookUrl} target="_blank" className="hover:text-[#FFC107]"><Facebook size={14}/></a>
            </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md h-20 flex justify-between items-center px-6 sm:px-12 border-b border-gray-50 shadow-sm">
        <div className="cursor-pointer shrink-0" onClick={() => {setFilter("All"); window.scrollTo(0,0)}}>
          <img src={siteSettings.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
        </div>

        <nav className="hidden lg:flex gap-8">
            {SERVICES_DATA.map(cat => (
                <div key={cat.category} className="relative group" onMouseEnter={() => setActiveDropdown(cat.category)} onMouseLeave={() => setActiveDropdown(null)}>
                    <button onClick={() => {setFilter(cat.category); portfolioRef.current?.scrollIntoView({behavior:'smooth'})}} 
                    className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat.category ? 'text-[#FFC107]' : 'text-gray-400 hover:text-black'}`}>
                        {cat.category} <ChevronDown size={10} className={`transition-transform duration-300 ${activeDropdown === cat.category ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <div className={`absolute top-full left-0 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-3 transition-all duration-300 ${activeDropdown === cat.category ? 'opacity-100 translate-y-2 visible' : 'opacity-0 translate-y-4 invisible'}`}>
                        {cat.products.map(p => (
                            <button key={p} onClick={() => {setFilter(cat.category); setIsQuoteModalOpen(true);}} className="w-full text-left px-5 py-2 text-[9px] font-bold text-gray-400 hover:bg-gray-50 hover:text-[#FFC107] transition-colors uppercase tracking-widest">
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </nav>

        <div className="flex items-center gap-4">
            <button onClick={() => setIsPasswordModalOpen(true)} className="p-2 text-gray-300 hover:text-black transition-colors"><LayoutDashboard size={18}/></button>
            <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#FFC107] hover:text-black transition-all">Get Quote</button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        
        {/* HERO SLIDER (CURVAS REDUZIDAS) */}
        {!isAdminMode && banners.length > 0 && (
            <div className="mb-16 relative h-[550px] rounded-2xl overflow-hidden shadow-xl bg-gray-50 border border-gray-100">
                {banners.map((s, i) => (
                    <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={s.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/10 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center px-12 sm:px-20">
                            <div className="max-w-xl text-left">
                                <span className="bg-[#FFC107] text-black px-3 py-1 rounded-full text-[9px] font-black uppercase mb-4 inline-block">{siteSettings.badgeText}</span>
                                <h2 className="text-5xl sm:text-7xl font-black text-black leading-none uppercase tracking-tighter mb-6">{s.title}</h2>
                                <p className="text-gray-500 text-base mb-8 font-bold uppercase tracking-tight">{s.subtitle}</p>
                                <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-8 py-4 rounded-full font-black uppercase text-[10px] flex items-center gap-2">Request Quote <ArrowRight size={14}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* VIDEOS (CURVAS REDUZIDAS) */}
        {!isAdminMode && videos.length > 0 && (
            <div className="mb-20">
                <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter italic">Featured <span className="text-[#FFC107]">Gallery</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map(v => (
                        <div key={v.id} className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                            <iframe className="w-full h-full" src={v.url.replace("watch?v=", "embed/")} title={v.title} frameBorder="0" allowFullScreen></iframe>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* PROJECTS (CURVAS REDUZIDAS) */}
        <div ref={portfolioRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(p => (
                <div key={p.id} className="group cursor-default">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-4 shadow-sm">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                             <button onClick={() => setIsQuoteModalOpen(true)} className="bg-white text-black p-4 rounded-full"><ExternalLink size={20}/></button>
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

      <footer className="bg-gray-50 py-16 px-12 border-t border-gray-100 text-center">
        <img src={siteSettings.logoUrl} alt="Logo" className="h-10 mx-auto mb-8 opacity-60 grayscale hover:grayscale-0 transition-all" />
        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.5em]">{siteSettings.copyright}</p>
      </footer>

      {/* ADMIN DASHBOARD (COM EDIÇÃO) */}
      {isAdminMode && (
          <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-10 text-left animate-in slide-in-from-bottom">
              <div className="max-w-5xl mx-auto">
                  <div className="flex justify-between items-center mb-10 border-b pb-6">
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Control <span className="text-[#FFC107]">Center</span></h2>
                      <button onClick={() => { setIsAdminMode(false); setEditingBannerId(null); setEditingProjectId(null); setEditingVideoId(null); }} className="bg-black text-white px-8 py-3 rounded-full font-black text-xs">EXIT ADMIN</button>
                  </div>

                  <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-full w-fit">
                      {["banners", "projects", "videos", "settings"].map(t => (
                          <button key={t} onClick={() => setAdminTab(t)} className={`px-8 py-3 rounded-full font-black text-[10px] uppercase transition-all ${adminTab === t ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}>{t}</button>
                      ))}
                  </div>

                  {/* ADMIN: BANNERS (COM EDIT) */}
                  {adminTab === "banners" && (
                      <div className="space-y-10">
                          <form onSubmit={handleAddBanner} className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-10 rounded-2xl border-2 transition-all ${editingBannerId ? 'border-blue-400 bg-blue-50/20' : 'bg-gray-50 border-gray-100'}`}>
                              <h3 className="md:col-span-2 text-sm font-black uppercase mb-2">{editingBannerId ? "📝 Edit Banner" : "✨ Add Slider"}</h3>
                              <input placeholder="Title" className="p-4 bg-white rounded-xl outline-none shadow-sm" value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} required />
                              <input placeholder="Image Link" className="p-4 bg-white rounded-xl outline-none shadow-sm text-blue-500" value={newBanner.image} onChange={e => setNewBanner({...newBanner, image: e.target.value})} required />
                              <input placeholder="Subtitle" className="p-4 bg-white rounded-xl outline-none shadow-sm md:col-span-2" value={newBanner.subtitle} onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})} />
                              <button type="submit" className={`md:col-span-2 p-5 rounded-xl font-black uppercase text-xs transition-all ${editingBannerId ? 'bg-blue-500 text-white' : 'bg-black text-white hover:bg-[#FFC107] hover:text-black'}`}>
                                  {editingBannerId ? "Update Banner Data" : "Save New Slider"}
                              </button>
                              {editingBannerId && <button type="button" onClick={() => { setEditingBannerId(null); setNewBanner({title:'', subtitle:'', image:''})}} className="md:col-span-2 text-xs text-red-400 font-bold uppercase">Cancel Edit</button>}
                          </form>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {banners.map(b => (
                                  <div key={b.id} className="relative group rounded-xl overflow-hidden shadow-sm aspect-video">
                                      <img src={b.image} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button onClick={() => { setEditingBannerId(b.id); setNewBanner({...b}); window.scrollTo(0,0); }} className="bg-white p-3 rounded-full text-blue-500"><Pencil size={18}/></button>
                                          <button onClick={async () => { if(confirm("Delete?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'banners', b.id)); }} className="bg-white p-3 rounded-full text-red-500"><Trash2 size={18}/></button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* ADMIN: PROJECTS (COM EDIT) */}
                  {adminTab === "projects" && (
                      <div className="space-y-10">
                          <form onSubmit={handleAddProduct} className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-10 rounded-2xl border-2 transition-all ${editingProjectId ? 'border-blue-400 bg-blue-50/20' : 'bg-gray-50 border-gray-100'}`}>
                              <h3 className="md:col-span-2 text-sm font-black uppercase mb-2">{editingProjectId ? "📝 Edit Portfolio Item" : "✨ Add New Project"}</h3>
                              <input placeholder="Title" className="p-4 bg-white rounded-xl outline-none shadow-sm font-bold" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                              <select className="p-4 bg-white rounded-xl outline-none shadow-sm font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                                  {SERVICES_DATA.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                              </select>
                              <input placeholder="Image URL" className="p-4 bg-white rounded-xl outline-none shadow-sm md:col-span-2 text-blue-500" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} required />
                              <textarea placeholder="Small description" className="p-4 bg-white rounded-xl outline-none shadow-sm md:col-span-2 h-20" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                              <button type="submit" className={`md:col-span-2 p-5 rounded-xl font-black uppercase text-xs transition-all ${editingProjectId ? 'bg-blue-500 text-white' : 'bg-black text-white hover:bg-[#FFC107] hover:text-black'}`}>
                                  {editingProjectId ? "Update Project Data" : "Save Project"}
                              </button>
                              {editingProjectId && <button type="button" onClick={() => { setEditingProjectId(null); setNewProduct({name:'', category:'Signs', image:'', description:''})}} className="md:col-span-2 text-xs text-red-400 font-bold uppercase">Cancel Edit</button>}
                          </form>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-black">
                              {products.map(p => (
                                  <div key={p.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative group">
                                      <img src={p.image} className="w-full h-24 object-cover rounded-lg mb-2" />
                                      <h4 className="font-black uppercase text-[8px] truncate">{p.name}</h4>
                                      <div className="flex gap-2 mt-2">
                                          <button onClick={() => { setEditingProjectId(p.id); setNewProduct({...p}); window.scrollTo(0,0); }} className="text-blue-500 p-1"><Pencil size={14}/></button>
                                          <button onClick={async () => { if(confirm("Delete?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', p.id)); }} className="text-red-500 p-1"><Trash2 size={14}/></button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* ADMIN: VIDEOS (COM EDIT) */}
                  {adminTab === "videos" && (
                      <div className="space-y-10">
                          <form onSubmit={handleAddVideo} className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-10 rounded-2xl border-2 transition-all ${editingVideoId ? 'border-blue-400 bg-blue-50/20' : 'bg-gray-50 border-gray-100'}`}>
                              <h3 className="md:col-span-2 text-sm font-black uppercase mb-2">{editingVideoId ? "📝 Edit Video" : "✨ Add Video"}</h3>
                              <input placeholder="Title" className="p-4 bg-white rounded-xl outline-none shadow-sm" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} required />
                              <input placeholder="YouTube URL" className="p-4 bg-white rounded-xl outline-none shadow-sm text-red-500 font-bold" value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} required />
                              <button type="submit" className={`md:col-span-2 p-5 rounded-xl font-black uppercase text-xs transition-all ${editingVideoId ? 'bg-blue-500 text-white' : 'bg-black text-white hover:bg-[#FFC107] hover:text-black'}`}>
                                  {editingVideoId ? "Update Video Data" : "Save Video"}
                              </button>
                          </form>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {videos.map(v => (
                                  <div key={v.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                          <PlayCircle className="text-[#FFC107]" size={20}/>
                                          <span className="font-black uppercase text-[9px]">{v.title}</span>
                                      </div>
                                      <div className="flex gap-2">
                                          <button onClick={() => { setEditingVideoId(v.id); setNewVideo({...v}); window.scrollTo(0,0); }} className="text-blue-500 p-1"><Pencil size={16}/></button>
                                          <button onClick={async () => { if(confirm("Delete Video?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'videos', v.id)); }} className="text-red-500 p-1"><Trash2 size={16}/></button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* ADMIN: SETTINGS (DINAMIC HEADER) */}
                  {adminTab === "settings" && (
                      <form onSubmit={handleSaveSettings} className="bg-gray-50 p-10 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm text-black">
                          <h3 className="md:col-span-2 text-sm font-black uppercase mb-2 flex items-center gap-2 text-blue-500"><Settings size={18}/> Header & Identity Settings</h3>
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">Logo Image URL</label>
                              <input className="w-full p-4 bg-white rounded-xl outline-none shadow-sm font-bold text-blue-500" value={siteSettings.logoUrl} onChange={e => setSiteSettings({...siteSettings, logoUrl: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">WhatsApp Display</label>
                              <input className="w-full p-4 bg-white rounded-xl outline-none shadow-sm font-bold" value={siteSettings.whatsapp} onChange={e => setSiteSettings({...siteSettings, whatsapp: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">Instagram URL</label>
                              <input className="w-full p-4 bg-white rounded-xl outline-none shadow-sm font-bold" value={siteSettings.instagramUrl} onChange={e => setSiteSettings({...siteSettings, instagramUrl: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">Facebook URL</label>
                              <input className="w-full p-4 bg-white rounded-xl outline-none shadow-sm font-bold" value={siteSettings.facebookUrl} onChange={e => setSiteSettings({...siteSettings, facebookUrl: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">Physical Address</label>
                              <input className="w-full p-4 bg-white rounded-xl outline-none shadow-sm font-bold md:col-span-2" value={siteSettings.address} onChange={e => setSiteSettings({...siteSettings, address: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">Admin Dashboard Password</label>
                              <input className="w-full p-4 bg-white rounded-xl outline-none shadow-sm font-bold" value={siteSettings.adminPassword} onChange={e => setSiteSettings({...siteSettings, adminPassword: e.target.value})} />
                          </div>
                          <button type="submit" disabled={isSaving} className="md:col-span-2 bg-black text-white p-6 rounded-xl font-black uppercase tracking-widest hover:bg-[#FFC107] hover:text-black transition-all shadow-lg mt-4">
                              {isSaving ? "Syncing Data..." : "Apply Global Changes"}
                          </button>
                      </form>
                  )}
              </div>
          </div>
      )}

      {/* LOGIN MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in">
            <div className="w-full max-w-sm p-12 text-center text-black">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm"><Lock className="text-black" size={28} /></div>
                <h2 className="text-2xl font-black uppercase mb-8 tracking-tighter italic text-black">Secure <span className="text-gray-300">Login</span></h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordInput === (siteSettings.adminPassword || "admin")) { setIsAdminMode(true); setIsPasswordModalOpen(false); setPasswordInput(""); }
                    else alert("Access Denied");
                }} className="space-y-4">
                    <input type="password" placeholder="Dashboard Secret" className="w-full p-5 bg-gray-50 rounded-2xl text-center font-bold outline-none border border-gray-100 focus:border-black" autoFocus onChange={e => setPasswordInput(e.target.value)} />
                    <button type="submit" className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-[#FFC107] hover:text-black transition-all">Authenticate</button>
                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="text-[9px] text-gray-300 uppercase font-black tracking-widest mt-8 hover:text-black transition-colors">Go Back</button>
                </form>
            </div>
        </div>
      )}

      {isQuoteModalOpen && <QuoteModal onClose={() => setIsQuoteModalOpen(false)} />}

    </div>
  );
}
// TWOKINP V12.0 - CLEAN EDITABLE & SOFT DESIGN