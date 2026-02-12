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
  aboutUs: "Twokinp Agency LLC is dedicated to providing high-end visual solutions and digital marketing.",
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
const appId = 'twokinp-v16-final-fixed';

try {
  const app = getApps().length === 0 ? initializeApp(VERCEL_FIREBASE_CONFIG) : getApps()[0];
  db = getFirestore(app);
} catch (e) { console.error(e); }

const ProductDetailsModal = ({ product, onClose, whatsapp }) => {
    if (!product) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-white rounded-xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row shadow-2xl relative text-black text-left">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-black transition-colors"><X size={24}/></button>
                <div className="md:w-1/2 aspect-square"><img src={product.image} className="w-full h-full object-cover" /></div>
                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase text-[#FFC107] bg-black px-3 py-1 rounded-full mb-4 inline-block">{product.category}</span>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6 leading-none">{product.name}</h2>
                        <div className="bg-gray-50 p-5 rounded-xl mb-6 border">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price starting at:</p>
                            <p className="text-3xl font-black text-black">${product.price || "TBA"}</p>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description || "No description available."}</p>
                    </div>
                    <button onClick={() => window.open(`https://wa.me/${whatsapp}`, '_blank')} className="w-full bg-[#FFC107] text-black p-5 rounded-xl font-black uppercase text-xs shadow-xl hover:bg-black hover:text-white transition-all">Order Service</button>
                </div>
            </div>
        </div>
    );
};

const QuoteModal = React.memo(({ onClose }) => {
  const [step, setStep] = useState(1);
  const [qCategory, setQCategory] = useState(null);
  const [formData, setFormData] = useState({ category: '', product: '', name: '', email: '' });

  const handleCategorySelect = (cat) => { setQCategory(cat); setFormData({...formData, category: cat.category}); setStep(2); };

  const handleSubmit = async () => {
    try {
        await fetch('https://n8n.twokinp.cloud/webhook/pedido-site-v2', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        if (db) await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), { ...formData, createdAt: new Date().toISOString() });
        onClose();
    } catch (e) { onClose(); }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md text-black">
      <div className="bg-white p-10 rounded-2xl w-full max-w-xl relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X /></button>
        <h2 className="text-xl font-black uppercase mb-8 text-left">{step === 1 ? "Start Project" : "Details"}</h2>
        {step === 1 ? (
            <div className="space-y-2">{SERVICES_DATA.map(c => (<button key={c.category} onClick={() => handleCategorySelect(c)} className="w-full p-4 bg-gray-50 rounded-xl text-left font-bold flex justify-between hover:bg-[#FFC107] transition-all">{c.category} <ArrowRight/></button>))}</div>
        ) : (
            <div className="space-y-4 text-left">
                <select className="w-full p-4 bg-gray-50 border rounded-xl font-bold" onChange={e => setFormData({...formData, product: e.target.value})}><option>Select Service</option>{qCategory.products.map(p => <option key={p} value={p}>{p}</option>)}</select>
                <input placeholder="Name" className="w-full p-4 bg-gray-50 border rounded-xl font-bold" onChange={e => setFormData({...formData, name: e.target.value})} />
                <button onClick={handleSubmit} className="w-full bg-black text-white p-5 rounded-xl font-black uppercase tracking-widest">Send Request</button>
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const portfolioRef = useRef(null);

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

  const filteredProducts = useMemo(() => products.filter(p => (filter === "All" || p.category === filter)), [products, filter]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* TOPBAR */}
      <div className="bg-black text-white py-2 px-6 sm:px-12 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <div>{/* Left */}</div>
        <div className="flex items-center gap-8">
            <a href={`tel:${siteSettings.whatsapp}`} className="flex items-center gap-2 hover:text-[#FFC107] transition-all"><Phone size={12} className="text-[#FFC107]"/> {siteSettings.whatsapp}</a>
            <div className="flex gap-4 pl-6 border-l border-white/20">
                <a href={siteSettings.instagramUrl} target="_blank" className="hover:text-[#FFC107]"><Instagram size={14}/></a>
                <a href={siteSettings.facebookUrl} target="_blank" className="hover:text-[#FFC107]"><Facebook size={14}/></a>
            </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md h-20 flex justify-between items-center px-6 sm:px-12 border-b border-gray-100 shadow-sm text-black">
        <div className="cursor-pointer shrink-0" onClick={() => {setFilter("All"); window.scrollTo(0,0)}}>
          <img src={siteSettings.logoUrl} onError={(e) => e.target.src = "https://raw.githubusercontent.com/twokinp-hue/twokinp-website/main/logo.jpg"} alt="Logo" className="h-12 w-auto object-contain" />
        </div>

        <nav className="hidden lg:flex gap-8">
            {SERVICES_DATA.map(cat => (
                <div key={cat.category} className="relative group" onMouseEnter={() => setActiveDropdown(cat.category)} onMouseLeave={() => setActiveDropdown(null)}>
                    <button className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest ${filter === cat.category ? 'text-[#FFC107]' : 'text-gray-400'}`}>
                        {cat.category} <ChevronDown size={12} />
                    </button>
                    <div className={`absolute top-full left-0 w-64 bg-white shadow-2xl rounded-xl py-4 border transition-all ${activeDropdown === cat.category ? 'opacity-100 visible translate-y-2' : 'opacity-0 invisible translate-y-4'}`}>
                        {cat.products.map(p => (<button key={p} onClick={() => {setFilter(cat.category); setIsQuoteModalOpen(true);}} className="w-full text-left px-6 py-2 text-[9px] font-bold text-gray-400 hover:text-[#FFC107] uppercase tracking-widest">{p}</button>))}
                    </div>
                </div>
            ))}
        </nav>

        <div className="flex items-center gap-4">
            <button onClick={() => setIsPasswordModalOpen(true)} className="p-2 text-gray-300"><LayoutDashboard size={22}/></button>
            <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#FFC107] shadow-lg">Get Quote</button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        
        {/* SLIDER (3 SECONDS) */}
        {!isAdminMode && banners.length > 0 && (
            <div className="mb-16 relative h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gray-50 border">
                {banners.map((s, i) => (
                    <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={s.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/10 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center px-12 sm:px-24 text-left">
                            <div className="max-w-xl animate-in slide-in-from-left">
                                <span className="bg-[#FFC107] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase mb-4 inline-block">{siteSettings.badgeText}</span>
                                <h2 className="text-6xl sm:text-8xl font-black text-black leading-none uppercase tracking-tighter mb-8 italic">{s.title}</h2>
                                <p className="text-gray-500 text-lg mb-10 font-bold uppercase tracking-tight">{s.subtitle}</p>
                                <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-10 py-5 rounded-full font-black text-xs uppercase flex items-center gap-2 hover:bg-[#FFC107]">Start Project <ArrowRight/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* VIDEOS */}
        {!isAdminMode && videos.length > 0 && (
            <div className="mb-20 text-left">
                <h2 className="text-4xl font-black uppercase mb-10 tracking-tighter italic">Featured <span className="text-[#FFC107]">Videos</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {videos.map(v => (
                        <div key={v.id} className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl border">
                            <iframe className="w-full h-full" src={v.url.replace("watch?v=", "embed/")} frameBorder="0" allowFullScreen></iframe>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* PROJECTS GRID */}
        <div ref={portfolioRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
            {filteredProducts.map(p => (
                <div key={p.id} onClick={() => setSelectedDetails(p)} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border shadow-sm mb-6 transition-all group-hover:shadow-2xl">
                        <img src={p.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                             <div className="bg-white text-black px-6 py-2 rounded-full font-black uppercase text-[10px]">View Detail</div>
                        </div>
                    </div>
                    <div className="px-2">
                        <span className="text-[10px] font-black uppercase text-[#FFC107] tracking-widest mb-1 block">{p.category}</span>
                        <h3 className="text-3xl font-black uppercase text-black italic leading-none">{p.name}</h3>
                    </div>
                </div>
            ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-50 py-24 px-12 border-t text-left text-black">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
                <img src={siteSettings.logoUrl} onError={(e) => e.target.src = "https://raw.githubusercontent.com/twokinp-hue/twokinp-website/main/logo.jpg"} alt="Logo" className="h-12 mb-8" />
                <p className="text-gray-400 text-xs font-bold uppercase leading-relaxed">{siteSettings.aboutUs}</p>
            </div>
            <div>
                <h4 className="font-black uppercase text-[11px] mb-8 tracking-widest">Contact Info</h4>
                <div className="space-y-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    <p className="flex items-center gap-3"><MapPin size={14} className="text-[#FFC107]"/> {siteSettings.address}</p>
                    <p className="flex items-center gap-3"><Phone size={14} className="text-[#FFC107]"/> {siteSettings.whatsapp}</p>
                    <p className="flex items-center gap-3"><Mail size={14} className="text-[#FFC107]"/> {siteSettings.email}</p>
                </div>
            </div>
            <div>
                <h4 className="font-black uppercase text-[11px] mb-8 tracking-widest">Follow Us</h4>
                <div className="flex gap-4"><a href={siteSettings.instagramUrl} target="_blank" className="p-4 bg-white border rounded-full shadow-sm hover:bg-[#FFC107]"><Instagram size={18}/></a></div>
            </div>
            <div className="text-center md:text-right">
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.6em]">{siteSettings.copyright}</p>
            </div>
        </div>
      </footer>

      {/* ADMIN PORTAL */}
      {isAdminMode && (
          <div className="fixed inset-0 z-[500] bg-white overflow-y-auto p-12 text-left text-black animate-in slide-in-from-bottom">
              <div className="max-w-6xl mx-auto text-black">
                  <div className="flex justify-between items-center mb-16 border-b pb-10">
                      <h2 className="text-4xl font-black uppercase italic tracking-tighter">Control <span className="text-[#FFC107]">Center</span></h2>
                      <button onClick={() => setIsAdminMode(false)} className="bg-black text-white px-10 py-4 rounded-full font-black text-xs uppercase shadow-xl">Exit Admin</button>
                  </div>
                  <div className="flex gap-3 mb-12 bg-gray-50 p-2 rounded-full w-fit">
                      {["banners", "projects", "videos", "settings"].map(t => (<button key={t} onClick={() => setAdminTab(t)} className={`px-10 py-4 rounded-full font-black text-[11px] uppercase transition-all ${adminTab === t ? 'bg-white text-black shadow-lg' : 'text-gray-400'}`}>{t}</button>))}
                  </div>

                  {adminTab === "settings" && (
                      <form onSubmit={async (e) => { e.preventDefault(); await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), siteSettings); alert("Sync Done!"); }} className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50 p-12 rounded-[2.5rem] border shadow-sm">
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400 ml-2">Logo Image URL</label><input className="w-full p-5 bg-white border rounded-2xl" value={siteSettings.logoUrl} onChange={e => setSiteSettings({...siteSettings, logoUrl: e.target.value})} /></div>
                          <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-400 ml-2">WhatsApp</label><input className="w-full p-5 bg-white border rounded-2xl" value={siteSettings.whatsapp} onChange={e => setSiteSettings({...siteSettings, whatsapp: e.target.value})} /></div>
                          <div className="space-y-3 md:col-span-2"><label className="text-[10px] font-black uppercase text-gray-400 ml-2">About Us Statement</label><textarea className="w-full p-5 bg-white border rounded-2xl h-32" value={siteSettings.aboutUs} onChange={e => setSiteSettings({...siteSettings, aboutUs: e.target.value})} /></div>
                          <button type="submit" className="md:col-span-2 bg-black text-white p-7 rounded-3xl font-black uppercase tracking-widest hover:bg-[#FFC107]">Update Identity</button>
                      </form>
                  )}

                  {adminTab === "projects" && (
                      <div className="space-y-12">
                          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-12 rounded-[2.5rem] border shadow-sm">
                              <input placeholder="Name" className="p-5 bg-white rounded-2xl border" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                              <select className="p-5 bg-white rounded-2xl border" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>{SERVICES_DATA.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}</select>
                              <input placeholder="Image URL" className="p-5 bg-white rounded-2xl border md:col-span-2" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} required />
                              <input placeholder="Price" className="p-5 bg-white rounded-2xl border" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                              <textarea placeholder="Small Description" className="p-5 bg-white rounded-2xl border md:col-span-2 h-24" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                              <button type="submit" className="md:col-span-2 bg-black text-white p-6 rounded-2xl font-black uppercase">{editingProjectId ? "Update Project" : "Add Project"}</button>
                          </form>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                              {products.map(p => (<div key={p.id} className="bg-white p-4 rounded-3xl border relative group">
                                  <img src={p.image} className="w-full h-32 object-cover rounded-2xl mb-4" />
                                  <h4 className="font-black uppercase text-[10px] truncate">{p.name}</h4>
                                  <div className="flex gap-2 mt-4">
                                      <button onClick={() => { setEditingProjectId(p.id); setNewProduct({...p}); window.scrollTo(0,0); }} className="text-blue-500 p-2 bg-blue-50 rounded-xl"><Pencil size={16}/></button>
                                      <button onClick={async () => { if(confirm("Delete?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', p.id)); }} className="text-red-500 p-2 bg-red-50 rounded-xl"><Trash2 size={16}/></button>
                                  </div>
                              </div>))}
                          </div>
                      </div>
                  )}

                  {adminTab === "banners" && (
                      <div className="space-y-12 text-black">
                          <form onSubmit={handleAddBanner} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-12 rounded-[2.5rem] border shadow-sm">
                              <input placeholder="Headline" className="p-5 bg-white rounded-2xl border" value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} required />
                              <input placeholder="Image URL" className="p-5 bg-white rounded-2xl border" value={newBanner.image} onChange={e => setNewBanner({...newBanner, image: e.target.value})} required />
                              <textarea placeholder="Subtitle" className="md:col-span-2 p-5 bg-white rounded-2xl border" value={newBanner.subtitle} onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})} />
                              <button type="submit" className="md:col-span-2 bg-black text-white p-6 rounded-2xl font-black uppercase">Publish Slider</button>
                          </form>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              {banners.map(b => (<div key={b.id} className="relative group rounded-[2.5rem] overflow-hidden aspect-video border shadow-xl">
                                  <img src={b.image} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                      <button onClick={() => { setEditingBannerId(b.id); setNewBanner({...b}); window.scrollTo(0,0); }} className="bg-white p-4 rounded-full text-blue-500 shadow-2xl"><Pencil size={20}/></button>
                                      <button onClick={async () => { if(confirm("Delete?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'banners', b.id)); }} className="bg-white p-4 rounded-full text-red-500 shadow-2xl"><Trash2 size={20}/></button>
                                  </div>
                              </div>))}
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* DETAILS MODAL */}
      {selectedDetails && <ProductDetailsModal product={selectedDetails} onClose={() => setSelectedDetails(null)} whatsapp={siteSettings.whatsapp} />}
      {isQuoteModalOpen && <QuoteModal onClose={() => setIsQuoteModalOpen(false)} />}
      
      {/* ADMIN LOGIN */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in text-black">
            <div className="w-full max-w-sm p-12 text-center text-black">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm border text-black"><Lock size={32} /></div>
                <h2 className="text-3xl font-black uppercase mb-10 tracking-tighter italic">Secure <span className="text-gray-300">Login</span></h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordInput === (siteSettings.adminPassword || "admin")) { setIsAdminMode(true); setIsPasswordModalOpen(false); setPasswordInput(""); }
                    else alert("Access Denied");
                }} className="space-y-4 text-black">
                    <input type="password" placeholder="Dashboard Secret" className="w-full p-6 bg-gray-50 rounded-[2rem] text-center font-bold outline-none border border-gray-100 focus:border-black transition-all text-black" autoFocus onChange={e => setPasswordInput(e.target.value)} />
                    <button type="submit" className="w-full bg-black text-white p-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-[#FFC107]">Authenticate</button>
                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="text-[10px] text-gray-300 uppercase font-black tracking-[0.3em] mt-10 hover:text-black underline underline-offset-8">Go Back</button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}
// TWOKINP V16.0 - STABLE VERSION