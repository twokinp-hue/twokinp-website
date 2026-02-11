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

// --- NOVA ESTRUTURA DE CATEGORIAS ---
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
const appId = 'twokinp-site-final-production-v10'; 

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white p-10 rounded-[3rem] w-full max-w-xl relative shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"><X /></button>
        {success ? (
            <div className="py-10 text-center animate-in zoom-in">
                <CheckCircle2 className="mx-auto text-green-500 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-black uppercase">Sent!</h2>
            </div>
        ) : (
            <div className="text-left text-black">
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
                        <button onClick={handleSubmit} className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase shadow-xl hover:bg-[#FFC107] hover:text-black transition-all">Submit Request</button>
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
  const [adminTab, setAdminTab] = useState("projects");
  const [isSaving, setIsSaving] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Signs', image: '', description: '' });
  const [activeDropdown, setActiveDropdown] = useState(null);

  const portfolioRef = useRef(null);

  // --- DATA LOADING ---
  useEffect(() => {
    if (!db) return;
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), s => setProducts(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'videos'), s => setVideos(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), s => setBanners(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), s => s.exists() && setSiteSettings(s.data()));
  }, []);

  // --- ADMIN ACTIONS ---
  const handleSaveSettings = async (e) => {
    e.preventDefault(); setIsSaving(true);
    try { await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), siteSettings); alert("Settings Saved!"); } 
    catch(e) { alert("Error"); } finally { setIsSaving(false); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'products'), { ...newProduct, createdAt: new Date().toISOString() });
    setNewProduct({ name: '', category: 'Signs', image: '', description: '' });
    alert("Project Added!");
  };

  const handleDeleteProduct = async (id) => { if(confirm("Delete?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', id)); };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'videos'), { ...newVideo, createdAt: new Date().toISOString() });
    setNewVideo({title: '', url: ''});
    alert("Video Added!");
  };

  const handleDeleteVideo = async (id) => { if(confirm("Delete Video?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'videos', id)); };

  const filteredProducts = useMemo(() => {
    return products.filter(p => (filter === "All" || p.category === filter)).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [products, filter]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#FFC107]/30 overflow-x-hidden">
      
      {/* TOP INFO BAR */}
      <div className="bg-black text-white py-3 px-6 sm:px-12 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
        <div className="flex items-center gap-6">
            <a href={`tel:${siteSettings.whatsapp}`} className="flex items-center gap-2 hover:text-[#FFC107] transition-colors"><Phone size={12}/> {siteSettings.whatsapp}</a>
            <div className="hidden md:flex items-center gap-2"><MapPin size={12}/> {siteSettings.address}</div>
        </div>
        <div className="flex items-center gap-4">
            <a href={siteSettings.instagramUrl} target="_blank" className="hover:text-[#FFC107] transition-colors"><Instagram size={14}/></a>
            <a href={siteSettings.facebookUrl} target="_blank" className="hover:text-[#FFC107] transition-colors"><Facebook size={14}/></a>
        </div>
      </div>

      {/* HEADER WITH REAL DROPDOWN */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl h-24 flex justify-between items-center px-6 sm:px-12 border-b border-gray-100">
        <div className="cursor-pointer shrink-0" onClick={() => {setFilter("All"); window.scrollTo(0,0)}}>
          <img src="https://raw.githubusercontent.com/twokinp-hue/twokinp-website/main/logo.png" alt="Twokinp Logo" className="h-16 w-auto" />
        </div>

        {/* NAVIGATION WITH DROPDOWNS */}
        <nav className="hidden lg:flex gap-8">
            {SERVICES_DATA.map(cat => (
                <div key={cat.category} className="relative group" onMouseEnter={() => setActiveDropdown(cat.category)} onMouseLeave={() => setActiveDropdown(null)}>
                    <button onClick={() => {setFilter(cat.category); portfolioRef.current?.scrollIntoView({behavior:'smooth'})}} 
                    className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest transition-all ${filter === cat.category ? 'text-[#FFC107]' : 'text-gray-400 hover:text-black'}`}>
                        {cat.category} <ChevronDown size={12} className={`transition-transform ${activeDropdown === cat.category ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* DROPDOWN MENU */}
                    <div className={`absolute top-full left-0 w-64 bg-white shadow-2xl rounded-2xl border border-gray-50 py-4 transition-all duration-300 ${activeDropdown === cat.category ? 'opacity-100 translate-y-2 visible' : 'opacity-0 translate-y-4 invisible'}`}>
                        {cat.products.map(p => (
                            <button key={p} onClick={() => {setFilter(cat.category); setIsQuoteModalOpen(true);}} className="w-full text-left px-6 py-2.5 text-[10px] font-bold text-gray-500 hover:bg-gray-50 hover:text-[#FFC107] transition-colors uppercase tracking-wider">
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

      <main className="max-w-[1800px] mx-auto px-6 py-12">
        
        {/* HERO SLIDER */}
        {!isAdminMode && banners.length > 0 && (
            <div className="mb-20 relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl bg-gray-50">
                {banners.map((s, i) => (
                    <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={s.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent"></div>
                        <div className="absolute inset-0 flex items-center px-12 sm:px-24">
                            <div className="max-w-xl text-left">
                                <span className="bg-[#FFC107] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-6 inline-block shadow-sm">{siteSettings.badgeText}</span>
                                <h2 className="text-6xl sm:text-8xl font-black text-black leading-none uppercase tracking-tighter mb-8">{s.title}</h2>
                                <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-10 py-5 rounded-full font-black uppercase text-xs flex items-center gap-3 hover:bg-[#FFC107] hover:text-black transition-all">Free Quote <ArrowRight size={18}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* VIDEOS SECTION */}
        {!isAdminMode && videos.length > 0 && (
            <div className="mb-24 text-left">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px bg-gray-100 flex-1"></div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Featured <span className="text-[#FFC107]">Works</span></h2>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map(v => (
                        <div key={v.id} className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100">
                            <iframe className="w-full h-full" src={v.url.replace("watch?v=", "embed/")} title={v.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* PROJECTS GRID */}
        <div ref={portfolioRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
            {filteredProducts.map(p => (
                <div key={p.id} className="group cursor-default">
                    <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 mb-6 transition-transform hover:scale-[1.02] duration-500">
                        <img src={p.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                             <button onClick={() => setIsQuoteModalOpen(true)} className="bg-white text-black p-5 rounded-full shadow-2xl"><ExternalLink/></button>
                        </div>
                    </div>
                    <div className="px-4">
                        <span className="text-[9px] font-black uppercase text-[#FFC107] tracking-widest mb-2 block">{p.category}</span>
                        <h3 className="text-3xl font-black uppercase text-black leading-none tracking-tighter">{p.name}</h3>
                        <p className="text-gray-400 text-xs mt-3 line-clamp-2">{p.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </main>

      <footer className="bg-gray-50 py-24 px-12 border-t border-gray-100 text-center mt-20">
        <img src="https://raw.githubusercontent.com/twokinp-hue/twokinp-website/main/logo.png" alt="Logo" className="h-16 mx-auto mb-12 opacity-80" />
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.6em]">{siteSettings.copyright}</p>
      </footer>

      {/* DASHBOARD ADMIN COMPLETO */}
      {isAdminMode && (
          <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-12 text-left animate-in slide-in-from-bottom duration-500">
              <div className="max-w-6xl mx-auto">
                  <div className="flex justify-between items-center mb-16 border-b border-gray-100 pb-8">
                      <div className="flex items-center gap-4">
                          <div className="bg-[#FFC107] p-3 rounded-2xl"><LayoutDashboard className="text-black" /></div>
                          <h2 className="text-4xl font-black uppercase tracking-tighter italic">Twokinp <span className="text-gray-300">Admin</span></h2>
                      </div>
                      <button onClick={() => setIsAdminMode(false)} className="bg-black text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#FFC107] hover:text-black transition-all">Exit Dashboard</button>
                  </div>

                  <div className="flex gap-4 mb-12 bg-gray-50 p-2 rounded-full w-fit">
                      {["projects", "videos", "settings"].map(t => (
                          <button key={t} onClick={() => setAdminTab(t)} className={`px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${adminTab === t ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-black'}`}>{t}</button>
                      ))}
                  </div>

                  {/* ADMIN: PROJECTS */}
                  {adminTab === "projects" && (
                      <div className="space-y-12">
                          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-12 rounded-[3rem] border border-gray-100 shadow-sm">
                              <h3 className="md:col-span-2 text-xl font-black uppercase mb-4">Add New Portfolio Item</h3>
                              <input placeholder="Project Title" className="p-5 bg-white rounded-2xl border-none outline-none shadow-sm font-bold" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                              <select className="p-5 bg-white rounded-2xl border-none outline-none shadow-sm font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                                  {SERVICES_DATA.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                              </select>
                              <input placeholder="Image URL (Highly recommended: Use direct links)" className="p-5 bg-white rounded-2xl border-none outline-none shadow-sm md:col-span-2 font-bold text-[#FFC107]" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} required />
                              <textarea placeholder="Description" className="p-5 bg-white rounded-2xl border-none outline-none shadow-sm md:col-span-2 h-32 font-bold" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                              <button type="submit" className="md:col-span-2 bg-black text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-[#FFC107] hover:text-black transition-all">Save Project</button>
                          </form>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                              {products.map(p => (
                                  <div key={p.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm relative group">
                                      <img src={p.image} className="w-full h-32 object-cover rounded-2xl mb-4" />
                                      <h4 className="font-black uppercase text-[10px] truncate">{p.name}</h4>
                                      <button onClick={() => handleDeleteProduct(p.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* ADMIN: VIDEOS */}
                  {adminTab === "videos" && (
                      <div className="space-y-12">
                          <form onSubmit={handleAddVideo} className="bg-gray-50 p-12 rounded-[3rem] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm">
                              <h3 className="md:col-span-2 text-xl font-black uppercase mb-4">Add Feature Video</h3>
                              <input placeholder="Video Title" className="p-5 bg-white rounded-2xl outline-none font-bold" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} required />
                              <input placeholder="YouTube URL" className="p-5 bg-white rounded-2xl outline-none font-bold text-[#FFC107]" value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} required />
                              <button type="submit" className="md:col-span-2 bg-black text-white p-6 rounded-2xl font-black uppercase hover:bg-[#FFC107] hover:text-black transition-all">Add Video to Gallery</button>
                          </form>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {videos.map(v => (
                                  <div key={v.id} className="p-6 bg-gray-50 rounded-[2rem] flex justify-between items-center border border-gray-100">
                                      <div className="flex items-center gap-3">
                                          <PlayCircle className="text-[#FFC107]" />
                                          <span className="font-black uppercase text-[10px]">{v.title}</span>
                                      </div>
                                      <button onClick={() => handleDeleteVideo(v.id)} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={18}/></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* ADMIN: SETTINGS */}
                  {adminTab === "settings" && (
                      <form onSubmit={handleSaveSettings} className="bg-gray-50 p-12 rounded-[3rem] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
                          <h3 className="md:col-span-2 text-xl font-black uppercase mb-4">Company & Security Settings</h3>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Admin Password</label>
                              <input className="w-full p-5 bg-white rounded-2xl outline-none shadow-sm font-bold" value={siteSettings.adminPassword} onChange={e => setSiteSettings({...siteSettings, adminPassword: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">WhatsApp Number</label>
                              <input className="w-full p-5 bg-white rounded-2xl outline-none shadow-sm font-bold" value={siteSettings.whatsapp} onChange={e => setSiteSettings({...siteSettings, whatsapp: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Company Address</label>
                              <input className="w-full p-5 bg-white rounded-2xl outline-none shadow-sm font-bold md:col-span-2" value={siteSettings.address} onChange={e => setSiteSettings({...siteSettings, address: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Instagram URL</label>
                              <input className="w-full p-5 bg-white rounded-2xl outline-none shadow-sm font-bold" value={siteSettings.instagramUrl} onChange={e => setSiteSettings({...siteSettings, instagramUrl: e.target.value})} />
                          </div>
                          <button type="submit" disabled={isSaving} className="md:col-span-2 bg-black text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-[#FFC107] hover:text-black transition-all">
                              {isSaving ? "Saving..." : "Update All Info"}
                          </button>
                      </form>
                  )}
              </div>
          </div>
      )}

      {/* LOGIN MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in">
            <div className="w-full max-w-sm p-12 text-center">
                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm border border-gray-100"><Lock className="text-black" size={32} /></div>
                <h2 className="text-3xl font-black uppercase mb-10 tracking-tighter">Admin Access</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordInput === (siteSettings.adminPassword || "admin")) { setIsAdminMode(true); setIsPasswordModalOpen(false); setPasswordInput(""); }
                    else alert("Access Denied");
                }} className="space-y-4">
                    <input type="password" placeholder="Enter Password" className="w-full p-6 bg-gray-50 rounded-3xl text-center font-bold outline-none border border-gray-100 focus:border-black transition-all" autoFocus onChange={e => setPasswordInput(e.target.value)} />
                    <button type="submit" className="w-full bg-black text-white p-6 rounded-3xl font-black uppercase tracking-widest shadow-xl hover:bg-[#FFC107] hover:text-black transition-all">Sign In</button>
                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="text-[10px] text-gray-300 uppercase font-black tracking-widest mt-8 hover:text-black transition-colors">Go Back</button>
                </form>
            </div>
        </div>
      )}

      {isQuoteModalOpen && <QuoteModal onClose={() => setIsQuoteModalOpen(false)} />}

    </div>
  );
}
// TWOKINP V10.0 - FINAL STABLE