// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, X, ExternalLink, LayoutDashboard, Lock, 
  CheckCircle2, Share2, BarChart3, TrendingUp, ChevronDown, MapPin, 
  Mail, Phone, Award, Pencil, PlayCircle, Youtube, ChevronLeft, ChevronRight,
  Loader2, Menu, ArrowRight, MessageSquare, Car, Lightbulb, Printer, Building,
  PlusCircle, Trash2, Settings, Image as ImageIcon, Globe, Instagram, Facebook, Linkedin,
  Palette, PenTool, Megaphone, Maximize, FileText, User, RefreshCw, Key
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

// --- NOVA LISTA DE CATEGORIAS (4 PILARES) ---
const SERVICES_DATA = [
  { 
    category: "Art Design", 
    icon: <Palette size={20}/>,
    products: ["Custom Canvas Print", "Acrylic Print", "DTF T-Shirts", "Cartoon Design", "Photo Design"] 
  },
  { 
    category: "Marketing Digital", 
    icon: <TrendingUp size={20}/>,
    products: ["Google Ads", "Meta Ads", "SEO", "E-mail Marketing", "website", "Landing page", "Ecommerce", "AI Automation", "Social Media Management", "Graphic Design"] 
  },
  { 
    category: "Signs", 
    icon: <Building size={20}/>,
    products: ["Car Wrap", "Banners", "Backdrop", "Retractable Banner", "Illuminated Signs", "Window Graphics", "Wall Graphics", "Street Signs", "Promotion signs", "Outdoor Signs", "ADA Signs", "Trade Show", "Storefront Signs", "Monument Signs", "3D Lettering", "Light Box Signs", "Wide Format Print & More"] 
  },
  { 
    category: "Printing", 
    icon: <Printer size={20}/>,
    products: ["Brochure", "Business Card", "Flyers", "Hang Door", "Post Card", "Table Menu", "Tri Fold", "Poster"] 
  }
];

// --- INICIALIZAÇÃO FIREBASE ---
let db = null;
let auth = null;
const appId = 'twokinp-site-final-production-v8'; 

try {
  const app = getApps().length === 0 ? initializeApp(VERCEL_FIREBASE_CONFIG) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) { 
  console.error("Erro ao conectar no Firebase", e); 
}

// --- MODAL DE ORÇAMENTO ---
const QuoteModal = React.memo(({ onClose }) => {
  const [step, setStep] = useState(1);
  const [qCategory, setQCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    category: '', product: '', width: '', height: '', quantity: 1,
    description: '', name: '', email: '', phone: '', fileUrl: ''
  });

  const handleCategorySelect = (cat) => {
    setQCategory(cat);
    setFormData(prev => ({...prev, category: cat.category}));
    setStep(2); 
  };

  const handleSubmit = async () => {
    setLoading(true);
    const n8nData = {
        "Date": new Date().toLocaleDateString(),
        "Customer Name": formData.name,
        "Phone": formData.phone,
        "Email": formData.email,
        "Category": formData.category,
        "Product": formData.product,
        "Quantity": formData.quantity
    };

    try {
        await fetch('https://n8n.twokinp.cloud/webhook/pedido-site-v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(n8nData)
        });

        if (db) {
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), {
                ...formData,
                status: 'New',
                createdAt: new Date().toISOString()
            });
        }
        setSuccess(true); 
        setTimeout(() => onClose(), 3000);
    } catch (error) {
        setSuccess(true);
        setTimeout(() => onClose(), 3000);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"><X /></button>
        
        {success ? (
           <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
             <div className="bg-green-100 p-4 rounded-full mb-4">
                <CheckCircle2 className="text-green-600 w-12 h-12" />
             </div>
             <h2 className="text-2xl font-bold mb-2 text-black">Request Sent!</h2>
             <p className="text-gray-500">We'll get back to you shortly.</p>
           </div>
        ) : (
          <div className="text-left">
            <h2 className="text-2xl font-black uppercase mb-8 text-black tracking-tight">
                {step === 1 && "Start your Project"}
                {step === 2 && `About ${qCategory?.category}`}
                {step === 3 && "Personal Details"}
            </h2>

            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICES_DATA.map(cat => (
                  <button key={cat.category} onClick={() => handleCategorySelect(cat)}
                    className="p-6 bg-gray-50 border border-gray-100 rounded-2xl hover:border-black hover:bg-white transition-all group flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-[#FFC107] transition-colors">{cat.icon}</div>
                    <h3 className="font-bold text-gray-800">{cat.category}</h3>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-black uppercase text-gray-400 mb-3 tracking-widest">Specific Item</label>
                   <select className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 outline-none focus:border-black transition-all" value={formData.product} onChange={(e) => setFormData({...formData, product: e.target.value})}>
                     <option value="">Choose one...</option>
                     {qCategory.products.map(p => <option key={p} value={p}>{p}</option>)}
                   </select>
                 </div>
                 <button onClick={() => setStep(3)} disabled={!formData.product} className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-gray-800 transition shadow-lg disabled:opacity-20">NEXT STEP</button>
               </div>
            )}

            {step === 3 && (
               <div className="space-y-4">
                  <input type="text" placeholder="Your Full Name" className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 outline-none focus:border-black" onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                  <input type="email" placeholder="Email Address" className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 outline-none focus:border-black" onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                  <input type="tel" placeholder="Phone Number" className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 outline-none focus:border-black" onChange={(e) => setFormData({...formData, phone: e.target.value})}/>
                  <button onClick={handleSubmit} disabled={loading || !formData.email} className="w-full bg-[#FFC107] text-black font-black py-5 rounded-2xl hover:bg-yellow-500 transition shadow-lg flex justify-center items-center">
                     {loading ? <Loader2 className="animate-spin" /> : "SEND REQUEST"}
                  </button>
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
  const [banners, setBanners] = useState([]);
  const [leads, setLeads] = useState([]);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [adminTab, setAdminTab] = useState("projects");
  const [isSaving, setIsSaving] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Signs', price: '', description: '', images: ['', '', '', '', ''] });
  const portfolioRef = useRef(null);

  useEffect(() => {
    if (!db) return;
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), (s) => setProducts(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), (s) => setBanners(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), (s) => s.exists() && setSiteSettings(s.data()));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), (s) => setLeads(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners]);

  const handleSaveSettings = async (e) => {
    e.preventDefault(); setIsSaving(true);
    try { await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), siteSettings); alert("Saved!"); } 
    finally { setIsSaving(false); }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => (filter === "All" || p.category === filter) && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                   .sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [products, filter, searchTerm]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#FFC107]/30">
      
      {/* HEADER CLEAN */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-24 flex justify-between items-center px-6 sm:px-12 shadow-sm">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => {setFilter("All"); window.scrollTo(0,0)}}>
          {/* LOGO IMAGE */}
          <img src="https://raw.githubusercontent.com/twokinp-hue/twokinp-website/main/logo.png" alt="Twokinp Logo" className="h-14 w-auto object-contain" />
        </div>

        <div className="hidden lg:flex items-center gap-8">
            {SERVICES_DATA.map(cat => (
                <button key={cat.category} onClick={() => {setFilter(cat.category); portfolioRef.current?.scrollIntoView({behavior:'smooth'})}} 
                className={`text-[11px] font-black uppercase tracking-widest transition-colors ${filter === cat.category ? 'text-[#FFC107]' : 'text-gray-400 hover:text-black'}`}>
                    {cat.category}
                </button>
            ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsPasswordModalOpen(true)} className="p-3 text-gray-400 hover:text-black transition-colors"><LayoutDashboard size={20} /></button>
          <button onClick={() => setIsQuoteModalOpen(true)} className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Get Quote</button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-12">
        
        {/* HERO CLEAN SLIDER */}
        {!isAdminMode && banners.length > 0 && (
          <div className="mb-20 relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100 group">
            {banners.map((slide, idx) => (
              <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                <img src={slide.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center px-12 sm:px-24">
                  <div className="max-w-2xl text-left">
                    <span className="bg-[#FFC107] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">{siteSettings.badgeText}</span>
                    <h2 className="text-5xl sm:text-8xl font-black text-white leading-none uppercase tracking-tighter mb-8">{slide.title}</h2>
                    <p className="text-gray-200 text-lg sm:text-xl mb-10 max-w-md leading-relaxed">{slide.subtitle}</p>
                    <button onClick={() => setIsQuoteModalOpen(true)} className="bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs hover:bg-[#FFC107] transition-all flex items-center gap-3">Start Now <ArrowRight size={16}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PORTFOLIO GRID - CLEAN WHITE CARDS */}
        <div ref={portfolioRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(p => (
            <div key={p.id} onClick={() => setSelectedProduct(p)} className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 mb-6">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="px-2 text-left">
                <span className="text-[9px] font-black uppercase text-[#FFC107] tracking-[0.2em] mb-2 block">{p.category}</span>
                <h3 className="text-2xl font-black uppercase text-black leading-none group-hover:underline">{p.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER CLEAN */}
      <footer className="bg-gray-50 py-24 px-12 border-t border-gray-100 text-center">
        <img src="https://raw.githubusercontent.com/twokinp-hue/twokinp-website/main/logo.png" alt="Logo" className="h-12 mx-auto mb-12 opacity-80" />
        <div className="flex flex-wrap justify-center gap-12 text-[11px] font-black uppercase tracking-widest text-gray-400 mb-16">
          <div className="flex items-center gap-2"><MapPin size={16} className="text-[#FFC107]"/> {siteSettings.address}</div>
          <a href={`tel:${siteSettings.whatsapp}`} className="flex items-center gap-2 hover:text-black"><Phone size={16} className="text-[#FFC107]"/> {siteSettings.whatsapp}</a>
          <a href={`mailto:${siteSettings.email}`} className="flex items-center gap-2 hover:text-black"><Mail size={16} className="text-[#FFC107]"/> {siteSettings.email}</a>
        </div>
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em]">{siteSettings.copyright}</p>
      </footer>

      {/* ADMIN MODAL LOGIN */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in">
            <div className="w-full max-w-sm p-12 text-center">
                <Lock className="mx-auto mb-8 text-gray-200" size={48} />
                <h2 className="text-2xl font-black uppercase mb-8">Admin Access</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordInput === (siteSettings.adminPassword || "admin")) { setIsAdminMode(true); setIsPasswordModalOpen(false); }
                    else alert("Access Denied");
                }} className="space-y-4">
                    <input type="password" placeholder="Password" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl text-center font-bold outline-none focus:border-black" autoFocus onChange={e => setPasswordInput(e.target.value)} />
                    <button type="submit" className="w-full bg-black text-white p-5 rounded-3xl font-black uppercase">Unlock Dashboard</button>
                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="text-xs text-gray-400 uppercase font-black tracking-widest mt-4">Close</button>
                </form>
            </div>
        </div>
      )}

      {/* ADMIN DASHBOARD VIEW */}
      {isAdminMode && (
          <div className="fixed inset-0 z-[90] bg-white overflow-y-auto p-12">
              <div className="max-w-4xl mx-auto">
                  <div className="flex justify-between items-center mb-12">
                      <h2 className="text-3xl font-black uppercase tracking-tighter italic">Dashboard <span className="text-[#FFC107]">Panel</span></h2>
                      <button onClick={() => setIsAdminMode(false)} className="bg-black text-white px-6 py-2 rounded-full font-black text-xs">EXIT ADMIN</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                      <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
                          <h3 className="font-black uppercase text-sm mb-6 flex items-center gap-2"><Settings size={18}/> Global Settings</h3>
                          <form onSubmit={handleSaveSettings} className="space-y-4">
                              <input placeholder="Admin Password" className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none" value={siteSettings.adminPassword} onChange={e => setSiteSettings({...siteSettings, adminPassword: e.target.value})} />
                              <input placeholder="WhatsApp" className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none" value={siteSettings.whatsapp} onChange={e => setSiteSettings({...siteSettings, whatsapp: e.target.value})} />
                              <input placeholder="Address" className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none" value={siteSettings.address} onChange={e => setSiteSettings({...siteSettings, address: e.target.value})} />
                              <button type="submit" className="w-full bg-black text-white p-4 rounded-2xl font-black uppercase text-xs shadow-lg">Save Global Data</button>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* QUOTE MODAL COMPONENT */}
      {isQuoteModalOpen && <QuoteModal onClose={() => setIsQuoteModalOpen(false)} />}

    </div>
  );
}
// TWOKINP V8.0 - CLEAN WHITE DESIGN EDITION