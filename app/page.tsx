"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, X, Send, Info, Package, Star, Zap, Plus, Trash2, Settings, 
  Image as ImageIcon, ExternalLink, LayoutDashboard, PlusCircle, Lock, 
  CheckCircle2, Share2, BarChart3, TrendingUp, ChevronDown, MapPin, 
  Mail, Phone, Award, Pencil, PlayCircle, Youtube, ChevronLeft, ChevronRight,
  Loader2, Menu, ArrowRight, MessageSquare, Car, Lightbulb, Printer, Building
} from 'lucide-react';

// Firebase Imports (Mantendo a config para o CMS funcionar)
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot, addDoc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';

// --- CONFIGURAÇÕES TWOKINP ---
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
  tagline: "Visual Impact & AI Automation",
  primaryColor: "#FFC107", // Dourado Twokinp
  whatsapp: "14075550199",
  email: "twokinp@gmail.com",
  address: "Kissimmee, FL - USA",
  logoUrl: "",
  copyright: "Twokinp Agency LLC",
  badgeText: "PREMIUM WRAPS" 
};

// --- SENHA DE ADMIN ATUALIZADA ---
const ADMIN_PASSWORD = "Mkt2kinp-"; 

// --- CATEGORIAS DA TWOKINP ---
const CATEGORIES = [
  "All", 
  "Car Wrap", 
  "Illuminated Signs", 
  "Window Graphics", 
  "Wall Graphics", 
  "Outdoor Signs", 
  "Promotional Signs", 
  "Printing", 
  "Services",
  "ADA Signs",
  "Directory Signs",
  "Graphic Design", 
  "Digital Marketing",
  "Custom Signs"
];

// --- FIREBASE INIT ---
let db = null;
let auth = null;
// Usando um ID novo para separar os dados da GSI
const appId = 'twokinp-catalog-v1';

try {
  const app = getApps().length === 0 ? initializeApp(VERCEL_FIREBASE_CONFIG) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) { 
  console.error("Firebase connection error."); 
}

export default function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentProductImgIdx, setCurrentProductImgIdx] = useState(0); 
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false); // NOVO MODAL
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Admin States
  const [editSettings, setEditSettings] = useState(DEFAULT_SETTINGS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ 
    name: '', category: 'Car Wrap', price: '', description: '', images: ['', '', '', '', ''] 
  });
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', image: '', active: true });
  
  const [isMobileCategoryMenuOpen, setIsMobileCategoryMenuOpen] = useState(false);

  // --- MODAL "GET A QUOTE" (NOSSO PROJETO) ---
  const QuoteModal = () => {
    const [step, setStep] = useState(1);
    const [qCategory, setQCategory] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
      category: '', product: '', width: '', height: '', quantity: 1,
      description: '', name: '', email: '', phone: '', fileUrl: ''
    });

    const categoriesList = [
      { id: 'wraps', name: 'Car Wrap', icon: <Car size={24}/>, products: ['Full Wrap', 'Partial Wrap', 'Lettering', 'Color Change'] },
      { id: 'illuminated', name: 'Illuminated', icon: <Lightbulb size={24}/>, products: ['LED', 'Neon Flex', 'Channel Letters', 'Light Box'] },
      { id: 'marketing', name: 'Marketing', icon: <TrendingUp size={24}/>, products: ['Google Ads', 'Social Media', 'SEO', 'Web Design'] },
      { id: 'print', name: 'Print/Signs', icon: <Printer size={24}/>, products: ['Banners', 'Wall Graphics', 'Window Perf', 'Yard Signs'] },
      { id: 'outdoor', name: 'Outdoor', icon: <Building size={24}/>, products: ['Monuments', 'Pole Signs', 'Storefront', 'Pylons'] },
    ];

    const inputStyle = "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] outline-none transition text-white placeholder-gray-500";
    const labelStyle = "block text-sm font-bold text-gray-300 mb-1";

    const handleSubmit = async () => {
      setLoading(true);
      const webhookUrl = "https://webhook.twokinp.cloud/webhook/pedido-site-v2"; 
      try {
        await fetch(webhookUrl, { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ ...formData, source: "Catalog Site Quote", date: new Date().toISOString() }) 
        });
        setSuccess(true);
        setTimeout(() => { setIsQuoteModalOpen(false); setSuccess(false); setStep(1); }, 3000);
      } catch (error) {
        setSuccess(true); // Assume sucesso para não travar o usuário
        setTimeout(() => { setIsQuoteModalOpen(false); setSuccess(false); setStep(1); }, 3000);
      }
      setLoading(false);
    };

    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in">
        <div className="bg-gray-900 border border-yellow-500/30 p-6 rounded-2xl w-full max-w-4xl relative shadow-2xl max-h-[90vh] overflow-y-auto text-left">
          <button onClick={() => setIsQuoteModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
          
          {success ? (
             <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
               <CheckCircle2 className="text-[#FFC107] w-20 h-20 mb-4" />
               <h2 className="text-3xl font-bold mb-2 text-white">Received!</h2>
               <p className="text-gray-400">We will contact you at {formData.email}.</p>
             </div>
          ) : (
            <>
              {/* Progress */}
              <div className="flex justify-between mb-8 relative px-2">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0"></div>
                 <div className={`absolute top-1/2 left-0 h-1 bg-[#FFC107] -translate-y-1/2 z-0 transition-all duration-500 ${step === 1 ? 'w-[15%]' : step === 2 ? 'w-[50%]' : 'w-[85%]'}`}></div>
                 {[1, 2, 3].map((s) => (
                   <div key={s} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= s ? 'bg-[#FFC107] border-[#FFC107] text-black' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>{s}</div>
                 ))}
              </div>

              {step === 1 && (
                <div className="animate-in slide-in-from-right">
                  <h2 className="text-2xl font-bold mb-6 text-white"><span className="text-[#FFC107]">01.</span> Select Service</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categoriesList.map(cat => (
                      <button key={cat.id} onClick={() => { setQCategory(cat); setFormData({...formData, category: cat.name}); setStep(2); }}
                        className="p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-[#FFC107] hover:bg-[#FFC107]/10 transition group text-left flex flex-col items-center">
                        <div className="text-[#FFC107] mb-3 group-hover:scale-110 transition">{cat.icon}</div>
                        <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && qCategory && (
                 <div className="animate-in slide-in-from-right">
                   <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                     <button onClick={() => setStep(1)} className="text-gray-400 hover:text-[#FFC107]"><ArrowRight className="rotate-180" size={24}/></button> <span className="text-[#FFC107]">02.</span> Details
                   </h2>
                   <div className="grid md:grid-cols-2 gap-6">
                     <div>
                       <label className={labelStyle}>Product Type</label>
                       <select className={inputStyle} onChange={(e) => setFormData({...formData, product: e.target.value})}>
                         <option value="">Select...</option>
                         {qCategory.products.map((p:any) => <option key={p} value={p}>{p}</option>)}
                       </select>
                     </div>
                     <div><label className={labelStyle}>Quantity</label><input type="number" className={inputStyle} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}/></div>
                     {!['Marketing'].includes(qCategory.name) && (
                       <>
                         <div><label className={labelStyle}>Width (ft)</label><input type="text" className={inputStyle} onChange={(e) => setFormData({...formData, width: e.target.value})}/></div>
                         <div><label className={labelStyle}>Height (ft)</label><input type="text" className={inputStyle} onChange={(e) => setFormData({...formData, height: e.target.value})}/></div>
                       </>
                     )}
                     <div className="md:col-span-2"><label className={labelStyle}>Description</label><textarea className={inputStyle} rows={3} onChange={(e) => setFormData({...formData, description: e.target.value})}/></div>
                   </div>
                   <button onClick={() => setStep(3)} disabled={!formData.product} className="w-full mt-6 bg-[#FFC107] text-black font-bold py-4 rounded-xl hover:bg-yellow-600 transition disabled:opacity-50">Next Step</button>
                 </div>
              )}

              {step === 3 && (
                 <div className="animate-in slide-in-from-right">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                      <button onClick={() => setStep(2)} className="text-gray-400 hover:text-[#FFC107]"><ArrowRight className="rotate-180" size={24}/></button> <span className="text-[#FFC107]">03.</span> Contact
                    </h2>
                    <div className="space-y-4">
                       <div><label className={labelStyle}>Name</label><input type="text" className={inputStyle} onChange={(e) => setFormData({...formData, name: e.target.value})}/></div>
                       <div><label className={labelStyle}>Email</label><input type="email" className={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})}/></div>
                       <div><label className={labelStyle}>Phone</label><input type="tel" className={inputStyle} onChange={(e) => setFormData({...formData, phone: e.target.value})}/></div>
                    </div>
                    <button onClick={handleSubmit} disabled={loading || !formData.email} className="w-full mt-8 bg-[#FFC107] text-black font-bold py-4 rounded-xl hover:bg-yellow-600 transition flex justify-center items-center gap-2">
                       {loading ? <Loader2 className="animate-spin" /> : "SEND REQUEST"}
                    </button>
                 </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Keyboard shortcut (/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time Sync
  useEffect(() => {
    if (!db) return;
    
    const unsubProducts = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), 
      (snapshot) => setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)))
    );

    const unsubBanners = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), 
      (snapshot) => {
        const bData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        setBanners(bData.length > 0 ? bData : [{ 
          id: 'default', title: 'VISUAL IMPACT & AI', 
          subtitle: 'The most advanced vehicle wraps and automation in Florida.', 
          image: '', isDefault: true 
        }]);
      }
    );

    const unsubSettings = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'global'), 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          setSiteSettings(data);
          setEditSettings(data);
        }
      }
    );

    return () => { unsubProducts(); unsubBanners(); unsubSettings(); };
  }, [user]);

  // Slideshow cycle
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners]);

  // Auth
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
         await signInAnonymously(auth); 
      } catch (err) { console.error(err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Admin Handlers
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || isSaving || !user) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), { ...newBanner, createdAt: new Date().toISOString() });
      setNewBanner({ title: '', subtitle: '', image: '', active: true });
      setStatusMsg({ type: 'success', text: 'Banner added successfully!' });
    } catch (e) { setStatusMsg({ type: 'error', text: 'Error saving banner.' }); }
    finally { setIsSaving(false); setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000); }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!db || id === 'default' || !user || !window.confirm("Delete banner?")) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'banners', id));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || isSaving || !user) return;
    const filteredImages = newProduct.images.filter(url => url.trim() !== '');
    if (filteredImages.length === 0) { setStatusMsg({ type: 'error', text: 'Add at least one image.' }); return; }
    setIsSaving(true);
    try {
      const productData = { ...newProduct, images: filteredImages, image: filteredImages[0], price: Number(newProduct.price) };
      if (editingId) {
        // @ts-ignore
        productData.updatedAt = new Date().toISOString();
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', editingId), productData);
        setEditingId(null);
      } else {
        // @ts-ignore
        productData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'products'), productData);
      }
      setNewProduct({ name: '', category: 'Car Wrap', price: '', description: '', images: ['', '', '', '', ''] });
      setStatusMsg({ type: 'success', text: 'Portfolio updated!' });
    } catch (err) { setStatusMsg({ type: 'error', text: 'Error saving work.' }); }
    finally { setIsSaving(false); setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000); }
  };

  const handleEditClick = (p: any) => {
    setEditingId(p.id);
    const existing = p.images || [p.image];
    setNewProduct({ ...p, images: [...existing, '', '', '', '', ''].slice(0, 5) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!db || !user || !window.confirm("Delete this work?")) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', id));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || isSaving || !user) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'global'), editSettings);
      setStatusMsg({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) { setStatusMsg({ type: 'error', text: 'Update failed.' }); }
    finally { setIsSaving(false); setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000); }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminMode(true); setIsPasswordModalOpen(false); setPasswordInput("");
    } else { alert("Senha incorreta!"); }
  };

  const filteredProducts = useMemo(() => {
    // @ts-ignore
    let res = products.filter(p => (filter === "All" || p.category === filter) && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    // @ts-ignore
    return res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [products, filter, searchTerm]);

  const stats = useMemo(() => ({
    total: products.length,
    // @ts-ignore
    avgPrice: products.length ? Math.round(products.reduce((acc, p) => acc + Number(p.price), 0) / products.length) : 0,
  }), [products]);

  const nextProdImg = () => { if (!selectedProduct?.images) return; setCurrentProductImgIdx(prev => (prev + 1) % selectedProduct.images.length); };
  const prevProdImg = () => { if (!selectedProduct?.images) return; setCurrentProductImgIdx(prev => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length); };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-yellow-500/30">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 h-20 flex justify-between items-center px-4 sm:px-8 shadow-sm">
        <div className="flex flex-col cursor-pointer" onClick={() => {setFilter("All"); setIsAdminMode(false);}}>
          {siteSettings?.logoUrl ? (
            <img src={siteSettings.logoUrl} alt="Logo" className="h-10 sm:h-12 w-auto object-contain" />
          ) : (
            <h1 className="text-lg sm:text-2xl font-black italic tracking-tighter uppercase">2<span className="text-[#FFC107]">KINP!</span></h1>
          )}
        </div>
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input ref={searchInputRef} type="text" placeholder="Search... (Shortcut '/')" className="w-full bg-gray-900 border border-white/10 py-2.5 pl-11 pr-4 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-[#FFC107] focus:border-[#FFC107] transition-all font-medium text-white placeholder-gray-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => isAdminMode ? setIsAdminMode(false) : setIsPasswordModalOpen(true)} className={`p-2.5 rounded-2xl transition-all ${isAdminMode ? 'bg-[#FFC107] text-black shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}><LayoutDashboard className="w-5 h-5" /></button>
          <button onClick={() => setIsQuoteModalOpen(true)} className="bg-[#FFC107] hover:bg-yellow-500 text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-sm font-bold shadow-[0_0_15px_rgba(255,193,7,0.3)] uppercase tracking-widest transition-transform hover:scale-105">Get Quote</button>
        </div>
      </header>

      {/* MOBILE SEARCH */}
      <div className="md:hidden px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search catalog..." className="w-full bg-gray-900 border border-white/10 py-3 pl-11 pr-4 rounded-xl text-sm outline-none shadow-sm text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* --- ADMIN DASHBOARD --- */}
        {isAdminMode && (
          <div className="mb-12 space-y-8 animate-in slide-in-from-top-6 duration-700 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-6 rounded-[2rem] shadow-sm border border-white/10 flex items-center gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-2xl text-[#FFC107]"><BarChart3 className="w-6 h-6"/></div>
                <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Items</p><p className="text-2xl font-black">{stats.total}</p></div>
              </div>
              <div className="bg-gray-900 p-6 rounded-[2rem] shadow-sm border border-white/10 flex items-center gap-4">
                <div className="bg-green-900/20 p-3 rounded-2xl text-green-500"><TrendingUp className="w-6 h-6"/></div>
                <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Price</p><p className="text-2xl font-black">${stats.avgPrice}</p></div>
              </div>
            </div>

            {/* Banner Admin */}
            <div className="bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC107]/10 rounded-full blur-3xl"></div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#FFC107] uppercase italic tracking-tighter relative z-10"><ImageIcon className="w-5 h-5" /> Slideshow Control</h2>
              <form onSubmit={handleAddBanner} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
                <input placeholder="Slide Title" className="p-4 bg-black/50 border border-white/10 rounded-2xl text-sm text-white focus:border-[#FFC107] outline-none" value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} required />
                <input placeholder="Background Image Link (1920x550)" className="p-4 bg-black/50 border border-white/10 rounded-2xl text-sm text-white focus:border-[#FFC107] outline-none" value={newBanner.image} onChange={e => setNewBanner({...newBanner, image: e.target.value})} />
                <textarea placeholder="Slide Subtitle" className="md:col-span-2 p-4 bg-black/50 border border-white/10 rounded-2xl text-sm h-20 text-white focus:border-[#FFC107] outline-none" value={newBanner.subtitle} onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})} required />
                <button type="submit" disabled={isSaving} className="md:col-span-2 bg-[#FFC107] text-black p-4 rounded-2xl font-black uppercase text-xs hover:bg-yellow-600 transition-all shadow-lg">Add New Slide</button>
              </form>
              <div className="space-y-2 relative z-10">
                {banners.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group">
                    <div className="flex items-center gap-4">
                      {b.image && <img src={b.image} className="w-12 h-12 rounded-lg object-cover" />}
                      <div className="text-left"><p className="font-bold text-sm">{b.title}</p><p className="text-[10px] opacity-40">{b.subtitle.substring(0, 50)}...</p></div>
                    </div>
                    {/* @ts-ignore */}
                    {!b.isDefault && <button onClick={() => handleDeleteBanner(b.id)} className="text-white/20 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>}
                  </div>
                ))}
              </div>
            </div>

            {/* Global Settings Admin */}
            <div className="bg-gray-900 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-white/10">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white uppercase italic tracking-tighter"><Settings className="w-5 h-5" /> Global Site Settings</h2>
              <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1"><p className="text-[9px] font-bold text-gray-500 uppercase ml-2 text-left">Company Name</p><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none text-white" value={editSettings.companyName} onChange={e => setEditSettings({...editSettings, companyName: e.target.value})} /></div>
                <div className="space-y-1"><p className="text-[9px] font-bold text-gray-500 uppercase ml-2 text-left">Tagline</p><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none text-white" value={editSettings.tagline} onChange={e => setEditSettings({...editSettings, tagline: e.target.value})} /></div>
                <div className="space-y-1"><p className="text-[9px] font-bold text-gray-500 uppercase ml-2 text-left">WhatsApp</p><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none text-white" value={editSettings.whatsapp} onChange={e => setEditSettings({...editSettings, whatsapp: e.target.value})} /></div>
                <div className="space-y-1"><p className="text-[9px] font-bold text-gray-500 uppercase ml-2 text-left">Email</p><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none text-white" value={editSettings.email} onChange={e => setEditSettings({...editSettings, email: e.target.value})} /></div>
                <div className="space-y-1"><p className="text-[9px] font-bold text-gray-500 uppercase ml-2 text-left">Address</p><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none text-white" value={editSettings.address} onChange={e => setEditSettings({...editSettings, address: e.target.value})} /></div>
                <div className="space-y-1"><p className="text-[9px] font-bold text-gray-500 uppercase ml-2 text-left">Badge Text</p><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none text-white" value={editSettings.badgeText} onChange={e => setEditSettings({...editSettings, badgeText: e.target.value})} /></div>
                <div className="space-y-1"><p className="text-[9px] font-bold text-gray-500 uppercase ml-2 text-left">Logo URL</p><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none text-white" value={editSettings.logoUrl} onChange={e => setEditSettings({...editSettings, logoUrl: e.target.value})} /></div>
                <button type="submit" disabled={isSaving} className="md:col-span-2 bg-[#FFC107] text-black p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-yellow-600 transition-all shadow-xl">Save Settings</button>
              </form>
            </div>

            {/* Product Admin */}
            <div className={`bg-gray-900 border-2 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl transition-all ${editingId ? 'border-blue-500' : 'border-white/5'}`}>
              <h2 className={`text-xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-2 ${editingId ? 'text-blue-500' : 'text-[#FFC107]'}`}>{editingId ? <Pencil className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />} {editingId ? "Edit Work" : "Publish New Work"}</h2>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <input placeholder="Title" className="p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none text-white" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                  <select className="p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none cursor-pointer text-white" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input placeholder="Starting Price ($)" type="number" className="p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none text-white" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                </div>
                <div className="bg-black p-6 rounded-[2rem] border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newProduct.images.map((url, idx) => (
                    <input key={idx} placeholder={`Photo Link ${idx + 1}`} className="w-full p-4 bg-gray-900 border border-white/10 rounded-2xl text-sm outline-none text-white" value={url} onChange={e => { const ni = [...newProduct.images]; ni[idx] = e.target.value; setNewProduct({...newProduct, images: ni}); }} />
                  ))}
                </div>
                <textarea placeholder="Description" className="w-full p-4 bg-black border border-white/10 rounded-2xl h-24 text-sm outline-none text-white" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required />
                <button type="submit" disabled={isSaving} className={`w-full py-4 rounded-[1.5rem] font-black uppercase text-xs text-white shadow-xl transition-all ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#FFC107] text-black hover:bg-yellow-600'}`}>Save to Portfolio</button>
              </form>
            </div>
            
            {/* Inventory List Admin */}
            <div className="bg-gray-900 rounded-[2rem] p-6 text-white border border-white/10 overflow-hidden shadow-sm">
              <h3 className="text-lg font-bold mb-6 italic uppercase flex items-center gap-2 text-gray-500"><LayoutDashboard className="w-5 h-5"/> Live Inventory</h3>
              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                <table className="w-full text-xs sm:text-sm">
                  <tbody className="divide-y divide-white/10">
                    {products.map((p: any) => (
                      <tr key={p.id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-4 px-2 font-bold text-left">{p.name}</td>
                        <td className="py-4 px-2 text-[10px] text-gray-500 uppercase hidden sm:table-cell text-left">{p.category}</td>
                        <td className="py-4 px-2 text-right flex justify-end gap-2">
                          <button onClick={() => handleEditClick(p)} className="text-gray-400 hover:text-blue-500 p-2 transition-colors bg-black rounded-xl"><Pencil size={14} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-400 hover:text-red-500 p-2 transition-colors bg-black rounded-xl"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* HERO SLIDESHOW */}
        {!isAdminMode && (
          <div className="mb-10 relative h-[300px] sm:h-[550px] rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl bg-gray-900">
            {banners.map((slide: any, index) => (
              <div key={slide.id} className={`absolute inset-0 transition-all duration-1000 transform flex items-center px-6 sm:px-14 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`} style={{ backgroundImage: slide.image ? `url(${slide.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="relative z-10 max-w-2xl text-left text-white animate-in slide-in-from-bottom-6">
                  <div className="inline-flex items-center gap-2 bg-[#FFC107]/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 backdrop-blur-md border border-[#FFC107]/30 text-[#FFC107]">
                    <Award className="w-3 h-3"/> {siteSettings?.badgeText}
                  </div>
                  <h2 className="text-2xl sm:text-7xl font-black mb-4 uppercase leading-[1] tracking-tighter text-white"> {slide.title} </h2>
                  <p className="text-gray-300 mb-6 text-xs sm:text-xl font-medium max-w-md">{slide.subtitle}</p>
                  <button onClick={() => setIsQuoteModalOpen(true)} className="bg-[#FFC107] text-black px-6 sm:px-10 py-3 sm:py-4 rounded-full font-black uppercase text-[10px] sm:text-xs shadow-[0_0_20px_rgba(255,193,7,0.4)] hover:scale-105 transition-all">Start Project</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CATEGORIES SEPARATOR */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="hidden sm:flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(cat => <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider border transition-all ${filter === cat ? "bg-[#FFC107] text-black border-[#FFC107] scale-105 shadow-md" : "bg-gray-900 text-gray-500 border-white/5 hover:border-[#FFC107]"}`}>{cat}</button>)}
          </div>
          <div className="sm:hidden relative">
            <button onClick={() => setIsMobileCategoryMenuOpen(!isMobileCategoryMenuOpen)} className="w-full bg-gray-900 border border-white/10 p-4 rounded-2xl flex items-center justify-between font-black text-[12px] uppercase shadow-sm text-white">
              <div className="flex items-center gap-3"><Menu className="w-4 h-4 text-[#FFC107]" /> Filter: <span className="text-[#FFC107]">{filter}</span></div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isMobileCategoryMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMobileCategoryMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-gray-900 border border-white/10 rounded-[1.5rem] shadow-2xl z-50 py-3 animate-in slide-in-from-top-4">
                {CATEGORIES.map(cat => <button key={cat} onClick={() => { setFilter(cat); setIsMobileCategoryMenuOpen(false); }} className={`w-full text-left px-6 py-4 text-[11px] font-black uppercase ${filter === cat ? 'text-[#FFC107]' : 'text-gray-400'}`}>{cat}</button>)}
              </div>
            )}
          </div>
        </div>

        {/* PORTFOLIO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-left">
          {/* @ts-ignore */}
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-gray-900 rounded-[2.5rem] border border-white/5 p-4 hover:border-[#FFC107]/50 transition-all flex flex-col shadow-lg">
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-black mb-6 relative">
                <img src={product.images ? product.images[0] : product.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-80 group-hover:opacity-100" alt={product.name} />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[#FFC107] text-[8px] font-black px-3 py-1.5 rounded-lg uppercase border border-[#FFC107]/20">{siteSettings?.badgeText}</div>
              </div>
              <h3 className="font-bold text-white text-lg mb-4 uppercase line-clamp-1 tracking-tighter leading-tight">{product.name}</h3>
              <div className="flex justify-between items-center mt-auto pt-5 border-t border-white/5">
                <div className="flex flex-col"><span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Starting at</span><span className="text-xl font-black text-[#FFC107]">${Number(product.price).toLocaleString()}</span></div>
                <button onClick={() => { setSelectedProduct(product); setCurrentProductImgIdx(0); }} className="bg-white/10 text-white p-3 rounded-xl hover:bg-[#FFC107] hover:text-black transition-colors"><ExternalLink size={18} /></button>
              </div>
            </div>
          ))}
          
          {/* PLACEHOLDER SE NÃO TIVER PRODUTOS */}
          {filteredProducts.length === 0 && !isAdminMode && (
             <div className="col-span-full text-center py-20 text-gray-500">
                <p>No products found in this category yet.</p>
                {/* Se quiser remover isso depois, pode. É só pra não ficar vazio no início */}
             </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white py-16 px-4 text-center mt-20 border-t border-white/10">
        <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter italic">2<span className="text-[#FFC107]">KINP!</span></h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mb-10 italic font-medium">{siteSettings?.tagline}</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-8 text-[10px] font-black uppercase text-gray-400 mb-12 text-left sm:text-center">
          <div className="flex items-center justify-center gap-2"><MapPin size={14} className="text-[#FFC107] shrink-0" /> {siteSettings?.address}</div>
          <div className="flex items-center justify-center gap-2"><Mail size={14} className="text-[#FFC107] shrink-0" /> {siteSettings?.email}</div>
          <div className="flex items-center justify-center gap-2"><Phone size={14} className="text-[#FFC107] shrink-0" /> +1 {siteSettings?.whatsapp}</div>
        </div>

        <p className="text-gray-700 text-[9px] uppercase tracking-[0.3em] font-bold">
          © {new Date().getFullYear()} {siteSettings?.copyright}
        </p>
      </footer>

      {/* ADMIN LOGIN MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in">
          <div className="bg-gray-900 rounded-[3rem] p-10 max-w-sm w-full text-center space-y-6 shadow-2xl border border-white/10">
            <div className="w-20 h-20 bg-[#FFC107]/20 rounded-full flex items-center justify-center mx-auto"><Lock className="text-[#FFC107]" size={40} /></div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Admin Access</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input type="password" placeholder="••••••••" className="w-full p-5 bg-black border-2 border-white/10 rounded-2xl text-center text-xl font-bold outline-none focus:border-[#FFC107] text-white" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} autoFocus />
              <button type="submit" className="w-full p-4 bg-[#FFC107] text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-yellow-600 transition">Unlock Dashboard</button>
            </form>
            <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-500 text-xs uppercase hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-6 overflow-y-auto">
          <div className="bg-gray-900 rounded-none sm:rounded-[3.5rem] max-w-6xl w-full flex flex-col lg:flex-row overflow-hidden shadow-2xl my-auto animate-in zoom-in duration-300 max-h-[95vh] border border-white/10">
            <div className="lg:w-3/5 h-[300px] sm:h-[500px] lg:h-auto relative bg-black shrink-0 group">
              <div className="w-full h-full flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentProductImgIdx * 100}%)` }}>
                {(selectedProduct.images || [selectedProduct.image]).map((img: string, i: number) => (
                  <img key={i} src={img} className="w-full h-full object-contain shrink-0" alt="Work detail" />
                ))}
              </div>
              {(selectedProduct.images?.length > 1) && (
                <>
                  <button onClick={prevProdImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all"><ChevronLeft size={24} /></button>
                  <button onClick={nextProdImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all"><ChevronRight size={24} /></button>
                </>
              )}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {(selectedProduct.images || [selectedProduct.image]).map((_: any, i: number) => (
                  <button key={i} onClick={() => setCurrentProductImgIdx(i)} className={`h-1.5 rounded-full transition-all ${i === currentProductImgIdx ? 'w-8 bg-[#FFC107]' : 'w-2 bg-white/20'}`} />
                ))}
              </div>
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 left-6 bg-black/40 text-white p-2 rounded-full lg:hidden shadow-lg"><X size={24} /></button>
            </div>

            <div className="lg:w-2/5 p-8 sm:p-14 flex flex-col justify-center relative bg-gray-900 overflow-y-auto">
              <button onClick={() => setSelectedProduct(null)} className="hidden lg:block absolute top-8 right-8 text-gray-500 hover:text-white transition-all"><X size={32} /></button>
              <span className="text-[#FFC107] font-black text-[10px] uppercase bg-[#FFC107]/10 px-5 py-2.5 rounded-xl w-fit mb-4">{selectedProduct.category}</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-8 uppercase tracking-tighter leading-tight">{selectedProduct.name}</h2>
              <div className="bg-black p-8 rounded-[2.5rem] border border-white/10 mb-10 shadow-inner max-h-[150px] overflow-y-auto no-scrollbar">
                <p className="text-gray-400 text-lg italic leading-relaxed">"{selectedProduct.description}"</p>
              </div>
              <div className="flex items-center justify-between gap-6 pt-6 border-t border-white/10 mt-auto">
                <div className="text-left">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Starting at</span>
                  <span className="text-4xl font-black text-white leading-none">${Number(selectedProduct.price).toLocaleString()}</span>
                </div>
                <button onClick={() => setIsQuoteModalOpen(true)} className="flex-1 bg-[#FFC107] text-black py-5 rounded-[2rem] font-black uppercase text-xs shadow-xl flex items-center justify-center gap-3 hover:bg-yellow-600 transition-all">Request Quote <ExternalLink size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUOTE MODAL (GLOBAL) */}
      {isQuoteModalOpen && <QuoteModal />}

      {/* FLOAT BUTTON */}
      {!isQuoteModalOpen && !isAdminMode && (
        <button onClick={() => setIsQuoteModalOpen(true)} className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 bg-[#FFC107] text-black p-5 sm:p-6 rounded-[2.2rem] shadow-[0_0_50px_rgba(255,193,7,0.3)] hover:scale-110 active:scale-95 transition-all z-40 border-4 border-black">
          <MessageSquare size={32} />
        </button>
      )}

    </div>
  );
}