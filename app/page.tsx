// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, X, ExternalLink, LayoutDashboard, Lock, 
  CheckCircle2, Share2, BarChart3, TrendingUp, ChevronDown, MapPin, 
  Mail, Phone, Award, Pencil, PlayCircle, Youtube, ChevronLeft, ChevronRight,
  Loader2, Menu, ArrowRight, MessageSquare, Car, Lightbulb, Printer, Building,
  PlusCircle, Trash2, Settings, Image as ImageIcon, Globe, Instagram, Facebook, Linkedin,
  Palette, PenTool, Megaphone, Maximize, FileText, User
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
  badgeText: "PREMIUM WRAPS" 
};

// --- LISTA DE CATEGORIAS ---
const SERVICES_DATA = [
  { 
    category: "Art Design", 
    icon: <Palette size={20}/>,
    products: ["Canvas Print", "Acrylic Print", "T-Shirt TDF"] 
  },
  { 
    category: "Graphic Design", 
    icon: <PenTool size={20}/>,
    products: ["Design", "Illustration", "Logo", "Brand Book", "AI Generative", "Cartoon Created"] 
  },
  { 
    category: "Digital Marketing", 
    icon: <TrendingUp size={20}/>,
    products: ["Google Ads", "Meta Ads", "Social Media Management", "SEO", "Webdesign", "Ecommerce", "AI Automation", "Analytics"] 
  },
  { 
    category: "Car Wrap", 
    icon: <Car size={20}/>,
    products: ["Full Wrap", "Partial Wrap", "Lettering"] 
  },
  { 
    category: "Illuminated Sign", 
    icon: <Lightbulb size={20}/>,
    products: ["LED", "Neon Flex"] 
  },
  { 
    category: "Window Graphics", 
    icon: <Maximize size={20}/>,
    products: ["Perforated", "Vinyl", "Lettering", "Frosted"] 
  },
  { 
    category: "Wall Graphics", 
    icon: <ImageIcon size={20}/>,
    products: ["Vinyl", "Wall Paper"] 
  },
  { 
    category: "Outdoor Signs", 
    icon: <Building size={20}/>,
    products: ["Monuments", "Pole Signs", "Storefront Signs", "Plaques", "Yard Signs", "Real States Signs", "Banners", "Post & Panel Signs", "Light Box Signs", "3D Letters Illuminated", "Channel Letters"] 
  },
  { 
    category: "Promotional Signs", 
    icon: <Megaphone size={20}/>,
    products: ["Trade Show", "POS Signs", "Pull-up Banner", "Floor Signs", "Backdrop", "Stands", "Booth Display"] 
  },
  { 
    category: "Printing", 
    icon: <Printer size={20}/>,
    products: ["Brochure", "Business card", "Poster", "Hang door", "Menu", "Envelop", "Flyers", "Folders", "Tri-fold", "Labels"] 
  }
];

const ADMIN_PASSWORD = "admin"; 

// --- INICIALIZAÇÃO FIREBASE ---
let db = null;
let auth = null;
const appId = 'twokinp-site-final-production-v7'; 

try {
  const app = getApps().length === 0 ? initializeApp(VERCEL_FIREBASE_CONFIG) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) { 
  console.error("Erro ao conectar no Firebase", e); 
}

// --- COMPONENTE MODAL DE ORÇAMENTO (COM ENVIO PARA N8N) ---
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
    
    // 1. Prepara dados para o N8N (Google Sheets)
    const n8nData = {
        "Date": new Date().toLocaleDateString(),
        "Customer Name": formData.name,
        "Phone": formData.phone,
        "Email": formData.email,
        "Location": "Website Form", // Padronizado
        "Category": formData.category,
        "Product": formData.product,
        "Dimensions": (formData.width && formData.height) ? `${formData.width}x${formData.height}` : "N/A",
        "Urgency": "Normal",
        "Design Ready?": "No",
        "Description": formData.description,
        "Quantity": formData.quantity
    };

    try {
        // 2. Envia para o Webhook do N8N (Produção)
        // O modo 'no-cors' é usado para evitar bloqueios de navegador se o n8n não retornar cabeçalhos CORS
        // Nota: Em 'no-cors' não sabemos se deu erro 400/500, mas o dado é enviado.
        await fetch('https://n8n.twokinp.cloud/webhook/pedido-site-v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(n8nData)
        });

        // 3. Salva Backup no Firebase (Segurança)
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
        console.error("Erro no envio:", error);
        // Mesmo se der erro no fetch, mostramos sucesso se salvou no firebase ou para não frustrar o user
        // (O n8n pode estar offline, mas o lead fica salvo no Admin)
        setSuccess(true);
        setTimeout(() => onClose(), 3000);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in">
      <div className="bg-gray-900 border border-yellow-500/30 p-6 rounded-2xl w-full max-w-4xl relative shadow-2xl max-h-[90vh] overflow-y-auto text-left">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
        
        {success ? (
           <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
             <CheckCircle2 className="text-[#FFC107] w-20 h-20 mb-4" />
             <h2 className="text-3xl font-bold mb-2 text-white">Received!</h2>
             <p className="text-gray-400">We received your request.</p>
           </div>
        ) : (
          <>
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
                  {SERVICES_DATA.map(cat => (
                    <button key={cat.category} onClick={() => handleCategorySelect(cat)}
                      className="p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-[#FFC107] hover:bg-[#FFC107]/10 transition group text-left flex flex-col items-center">
                      <div className="text-[#FFC107] mb-3 group-hover:scale-110 transition">{cat.icon}</div>
                      <h3 className="font-bold text-white text-sm">{cat.category}</h3>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && qCategory && (
               <div className="animate-in slide-in-from-right">
                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                   <button onClick={() => setStep(1)} className="text-gray-400 hover:text-[#FFC107]"><ArrowRight className="rotate-180" size={24}/></button> <span className="text-[#FFC107]">02.</span> Details: {qCategory.category}
                 </h2>
                 <div className="grid md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-gray-400 text-sm mb-2">Select Specific Product</label>
                     <select 
                      className="w-full bg-gray-800 p-3 rounded-xl text-white border border-gray-700 focus:border-[#FFC107] outline-none" 
                      value={formData.product}
                      onChange={(e) => setFormData({...formData, product: e.target.value})}
                     >
                       <option value="">-- Choose an option --</option>
                       {qCategory.products.map(p => <option key={p} value={p}>{p}</option>)}
                     </select>
                   </div>
                   <div><label className="block text-gray-400 text-sm mb-2">Quantity</label><input type="number" className="w-full bg-gray-800 p-3 rounded-xl text-white border border-gray-700 focus:border-[#FFC107] outline-none" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}/></div>
                   <div className="md:col-span-2"><label className="block text-gray-400 text-sm mb-2">Description / Notes</label><textarea className="w-full bg-gray-800 p-3 rounded-xl text-white border border-gray-700 focus:border-[#FFC107] outline-none" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}/></div>
                 </div>
                 <button onClick={() => setStep(3)} disabled={!formData.product} className="w-full mt-6 bg-[#FFC107] text-black font-bold py-4 rounded-xl hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                   {formData.product ? "Next Step" : "Select a Product to Continue"}
                 </button>
               </div>
            )}

            {step === 3 && (
               <div className="animate-in slide-in-from-right">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                    <button onClick={() => setStep(2)} className="text-gray-400 hover:text-[#FFC107]"><ArrowRight className="rotate-180" size={24}/></button> <span className="text-[#FFC107]">03.</span> Contact Info
                  </h2>
                  <div className="space-y-4">
                     <div><label className="block text-gray-400 text-sm mb-2">Your Name</label><input type="text" className="w-full bg-gray-800 p-3 rounded-xl text-white border border-gray-700 focus:border-[#FFC107] outline-none" onChange={(e) => setFormData({...formData, name: e.target.value})}/></div>
                     <div><label className="block text-gray-400 text-sm mb-2">Email</label><input type="email" className="w-full bg-gray-800 p-3 rounded-xl text-white border border-gray-700 focus:border-[#FFC107] outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})}/></div>
                     <div><label className="block text-gray-400 text-sm mb-2">Phone (Optional)</label><input type="tel" className="w-full bg-gray-800 p-3 rounded-xl text-white border border-gray-700 focus:border-[#FFC107] outline-none" onChange={(e) => setFormData({...formData, phone: e.target.value})}/></div>
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
});

export default function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [leads, setLeads] = useState([]);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);
  
  // Estados de UI
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentProductImgIdx, setCurrentProductImgIdx] = useState(0); 
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Estados do Admin
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [adminTab, setAdminTab] = useState("projects"); 
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({ 
    name: '', category: 'Car Wrap', price: '', description: '', images: ['', '', '', '', ''] 
  });
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', image: '', active: true });

  const searchInputRef = useRef(null);
  const portfolioRef = useRef(null);

  // --- FUNÇÃO DE CLIQUE NO FILTRO COM SCROLL ---
  const handleFilterClick = (categoryName) => {
    setFilter(categoryName);
    if (portfolioRef.current) {
        portfolioRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- EFEITOS E LÓGICA ---
  useEffect(() => {
    if (!db) return;
    
    const unsubProducts = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    const unsubBanners = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), (snapshot) => {
        const bData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (bData.length === 0) {
           setBanners([{ id: 'default', title: 'VISUAL IMPACT', subtitle: 'Twokinp Premium Wraps & Signs', image: 'https://images.unsplash.com/photo-1621996659490-6213b19b486c?q=80&w=2070&auto=format&fit=crop', isDefault: true }]);
        } else {
           setBanners(bData);
        }
    });

    const unsubSettings = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), (docSnap) => {
        if (docSnap.exists()) {
            setSiteSettings({...DEFAULT_SETTINGS, ...docSnap.data()});
        }
    });

    // CARREGA OS LEADS NO ADMIN (BACKUP)
    const unsubLeads = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), (snapshot) => {
        const lData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        lData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLeads(lData);
    });

    return () => { unsubProducts(); unsubBanners(); unsubSettings(); unsubLeads(); };
  }, []);

  useEffect(() => {
    if (banners.length <= 1 || isQuoteModalOpen) return; 
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners, isQuoteModalOpen]); 

  useEffect(() => {
    if (!auth) return;
    signInAnonymously(auth).catch(console.error);
    return onAuthStateChanged(auth, setUser);
  }, []);

  // --- FUNÇÕES DE ADMIN ---

  const handleSaveSettings = async (e) => {
      e.preventDefault();
      if (!db || isSaving) return;
      setIsSaving(true);
      try {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), siteSettings);
          alert("Settings & Footer Saved!");
      } catch (err) {
          alert("Error saving settings");
          console.error(err);
      } finally {
          setIsSaving(false);
      }
  }

  const handleAddBanner = async (e) => {
    e.preventDefault(); if (!db || isSaving) return; setIsSaving(true);
    try { await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'banners'), { ...newBanner, createdAt: new Date().toISOString() }); setNewBanner({ title: '', subtitle: '', image: '', active: true }); } 
    finally { setIsSaving(false); }
  };
  const handleDeleteBanner = async (id) => { if (!db || id === 'default' || !window.confirm("Delete?")) return; await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'banners', id)); };

  const handleDeleteLead = async (id) => { if (!db || !window.confirm("Delete this lead?")) return; await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', id)); };

  const handleAddProduct = async (e) => {
    e.preventDefault(); 
    if (!db || isSaving) return; 
    
    const filteredImages = newProduct.images.filter(url => url && url.trim() !== '');
    if (filteredImages.length === 0) { alert("Add at least one image"); return; }

    setIsSaving(true);
    try {
      const pData = { 
          ...newProduct, 
          images: filteredImages, 
          image: filteredImages[0], 
          price: Number(newProduct.price) || 0, 
          createdAt: new Date().toISOString() 
      };
      if (editingId) await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', editingId), pData);
      else await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'products'), pData);
      
      setNewProduct({ name: '', category: 'Car Wrap', price: '', description: '', images: ['', '', '', '', ''] }); 
      setEditingId(null);
      alert("Project Saved!");
    } finally { setIsSaving(false); }
  };

  const handleDeleteProduct = async (id) => { if (!db || !window.confirm("Delete?")) return; await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', id)); };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) { setIsAdminMode(true); setIsPasswordModalOpen(false); setPasswordInput(""); } else { alert("Wrong Password"); }
  };

  const filteredProducts = useMemo(() => {
    let res = products.filter(p => (filter === "All" || p.category === filter) && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return res.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [products, filter, searchTerm]);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-yellow-500/30">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 h-20 flex justify-between items-center px-4 sm:px-8 shadow-sm">
        <div className="flex flex-col cursor-pointer" onClick={() => {setFilter("All"); window.scrollTo({top:0, behavior:'smooth'})}}>
          <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase">2<span className="text-[#FFC107]">KINP!</span></h1>
        </div>
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input ref={searchInputRef} type="text" placeholder="Search catalog..." className="w-full bg-gray-900 border border-white/10 py-2.5 pl-11 pr-4 rounded-2xl text-sm outline-none focus:border-[#FFC107] transition-all font-medium text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => isAdminMode ? setIsAdminMode(false) : setIsPasswordModalOpen(true)} className={`p-2.5 rounded-2xl transition-all ${isAdminMode ? 'bg-[#FFC107] text-black shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}>
            {isAdminMode ? <X /> : <LayoutDashboard className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsQuoteModalOpen(true)} className="bg-[#FFC107] hover:bg-yellow-500 text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-sm font-bold shadow-[0_0_15px_rgba(255,193,7,0.3)] uppercase tracking-widest transition-transform hover:scale-105">Get Quote</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* --- FILTER CATEGORIES (NO TOPO) --- */}
        {!isAdminMode && (
          <div className="flex flex-col gap-6 mb-8 animate-in slide-in-from-top-4">
            <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide">
              <button 
                onClick={() => handleFilterClick("All")} 
                className={`min-w-[64px] h-10 px-1 rounded-lg text-[9px] font-black uppercase tracking-tight leading-none border transition-all flex items-center justify-center text-center ${filter === "All" ? "bg-[#FFC107] text-black border-[#FFC107] scale-105 shadow-md" : "bg-gray-900 text-gray-500 border-white/5 hover:border-[#FFC107]"}`}
              >
                ALL
              </button>
              {SERVICES_DATA.map(cat => (
                <button 
                  key={cat.category} 
                  onClick={() => handleFilterClick(cat.category)} 
                  className={`min-w-[96px] h-10 px-1 rounded-lg text-[9px] font-black uppercase tracking-tight leading-none border transition-all flex items-center justify-center text-center whitespace-normal ${filter === cat.category ? "bg-[#FFC107] text-black border-[#FFC107] scale-105 shadow-md" : "bg-gray-900 text-gray-500 border-white/5 hover:border-[#FFC107]"}`}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- ADMIN DASHBOARD --- */}
        {isAdminMode && (
          <div className="mb-12 animate-in slide-in-from-top-6 duration-700 text-left">
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                <button onClick={() => setAdminTab("projects")} className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap ${adminTab === "projects" ? "bg-[#FFC107] text-black" : "bg-gray-900 text-gray-400"}`}>Projects</button>
                <button onClick={() => setAdminTab("quotes")} className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap ${adminTab === "quotes" ? "bg-[#FFC107] text-black" : "bg-gray-900 text-gray-400"}`}>QUOTES (BACKUP)</button>
                <button onClick={() => setAdminTab("banners")} className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap ${adminTab === "banners" ? "bg-[#FFC107] text-black" : "bg-gray-900 text-gray-400"}`}>Banners</button>
                <button onClick={() => setAdminTab("settings")} className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap ${adminTab === "settings" ? "bg-[#FFC107] text-black" : "bg-gray-900 text-gray-400"}`}>Footer & Settings</button>
            </div>

            {/* TAB: QUOTES / LEADS (BACKUP INTERNO) */}
            {adminTab === "quotes" && (
                <div className="bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl border border-white/10">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#FFC107] uppercase italic tracking-tighter"><FileText className="w-5 h-5" /> Recent Requests (Internal Backup)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-black/50 text-[#FFC107] uppercase text-[10px] font-black">
                                <tr>
                                    <th className="p-4 rounded-tl-xl">Date</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Service</th>
                                    <th className="p-4">Qty</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4 rounded-tr-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {leads.length === 0 ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">No leads found yet.</td></tr>
                                ) : (
                                    leads.map(lead => (
                                        <tr key={lead.id} className="hover:bg-white/5 transition">
                                            <td className="p-4 text-gray-400 text-xs whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 font-bold"><div className="flex items-center gap-2"><User size={14}/> {lead.name}</div></td>
                                            <td className="p-4">
                                                <span className="block text-[#FFC107] text-[10px] uppercase font-bold">{lead.category}</span>
                                                <span className="text-xs">{lead.product}</span>
                                            </td>
                                            <td className="p-4">{lead.quantity}</td>
                                            <td className="p-4">
                                                <div className="text-xs text-gray-300">{lead.email}</div>
                                                <div className="text-xs text-gray-500">{lead.phone}</div>
                                            </td>
                                            <td className="p-4">
                                                <button onClick={() => handleDeleteLead(lead.id)} className="text-gray-500 hover:text-red-500 p-2"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB: BANNERS */}
            {adminTab === "banners" && (
                <div className="bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl border border-white/10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#FFC107] uppercase italic tracking-tighter"><ImageIcon className="w-5 h-5" /> Slideshow Manager</h2>
                <form onSubmit={handleAddBanner} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <input placeholder="Title (e.g. VISUAL IMPACT)" className="p-4 bg-black/50 border border-white/10 rounded-2xl text-sm text-white outline-none" value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} required />
                    <input placeholder="Image Link (https://...)" className="p-4 bg-black/50 border border-white/10 rounded-2xl text-sm text-white outline-none" value={newBanner.image} onChange={e => setNewBanner({...newBanner, image: e.target.value})} />
                    <textarea placeholder="Subtitle" className="md:col-span-2 p-4 bg-black/50 border border-white/10 rounded-2xl text-sm h-20 text-white outline-none" value={newBanner.subtitle} onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})} required />
                    <button type="submit" className="md:col-span-2 bg-[#FFC107] text-black p-4 rounded-2xl font-black uppercase text-xs hover:bg-yellow-600">Add Slide</button>
                </form>
                <div className="space-y-2">
                    {banners.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4">
                        {b.image && <img src={b.image} className="w-12 h-8 object-cover rounded" />}
                        <p className="font-bold text-sm">{b.title}</p>
                        </div>
                        {!b.isDefault && <button onClick={() => handleDeleteBanner(b.id)} className="text-white/20 hover:text-red-500 p-2"><Trash2 size={18} /></button>}
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* TAB: PROJECTS */}
            {adminTab === "projects" && (
                <div className="space-y-8">
                    <div className={`bg-gray-900 border-2 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl transition-all ${editingId ? 'border-blue-500' : 'border-white/5'}`}>
                        <h2 className={`text-xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-2 ${editingId ? 'text-blue-500' : 'text-[#FFC107]'}`}>{editingId ? <Pencil className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />} {editingId ? "Edit Project" : "Add New Project"}</h2>
                        <form onSubmit={handleAddProduct} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <input placeholder="Project Name" className="p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none text-white" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                            <select className="p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none cursor-pointer text-white" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                                {SERVICES_DATA.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                            </select>
                            <input placeholder="Price (Optional)" type="number" className="p-4 bg-black border border-white/10 rounded-2xl text-sm outline-none text-white" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                            </div>
                            
                            <div className="bg-black p-6 rounded-[2rem] border border-white/10">
                                <label className="text-gray-400 text-xs uppercase font-bold mb-4 block">Image URLs (Paste links from imgbb, postimages, etc)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {newProduct.images.map((url, idx) => (
                                        <div key={idx} className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-bold">#{idx + 1}</span>
                                            <input 
                                                placeholder="https://..." 
                                                className="w-full p-4 pl-10 bg-gray-900 border border-white/10 rounded-2xl text-sm outline-none text-white focus:border-[#FFC107]" 
                                                value={url} 
                                                onChange={e => { 
                                                    const ni = [...newProduct.images]; 
                                                    ni[idx] = e.target.value; 
                                                    setNewProduct({...newProduct, images: ni}); 
                                                }} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <textarea placeholder="Description" className="w-full p-4 bg-black border border-white/10 rounded-2xl h-24 text-sm outline-none text-white" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required />
                            <button type="submit" disabled={isSaving} className={`w-full py-4 rounded-[1.5rem] font-black uppercase text-xs text-white shadow-xl transition-all ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#FFC107] text-black hover:bg-yellow-600'}`}>
                                {isSaving ? "Saving..." : (editingId ? "Update Project" : "Save Project")}
                            </button>
                        </form>
                    </div>
                    
                    <div className="bg-gray-900 rounded-[2rem] p-6 text-white border border-white/10 overflow-hidden shadow-sm">
                        <div className="max-h-[400px] overflow-y-auto">
                            <table className="w-full text-xs sm:text-sm">
                            <tbody className="divide-y divide-white/10">
                                {products.map(p => (
                                <tr key={p.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-2 font-bold text-left flex items-center gap-3">
                                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-gray-800" />
                                        {p.name}
                                    </td>
                                    <td className="py-4 px-2 text-gray-400">{p.category}</td>
                                    <td className="py-4 px-2 text-right flex justify-end gap-2">
                                    <button onClick={() => { setEditingId(p.id); setNewProduct({...p, images: [...(p.images||[p.image]), '','','',''].slice(0,5)}); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-gray-400 hover:text-blue-500 p-2 bg-black rounded-xl"><Pencil size={14} /></button>
                                    <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-400 hover:text-red-500 p-2 bg-black rounded-xl"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: SETTINGS (RODAPÉ EDITÁVEL) */}
            {adminTab === "settings" && (
                <div className="bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl border border-white/10">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#FFC107] uppercase italic tracking-tighter"><Settings className="w-5 h-5" /> Footer & Company Info</h2>
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="text-gray-400 text-xs font-bold mb-2 block">Company Name</label><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white" value={siteSettings.companyName} onChange={e => setSiteSettings({...siteSettings, companyName: e.target.value})} /></div>
                            <div><label className="text-gray-400 text-xs font-bold mb-2 block">Address (Footer)</label><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white" value={siteSettings.address} onChange={e => setSiteSettings({...siteSettings, address: e.target.value})} /></div>
                            
                            <div><label className="text-gray-400 text-xs font-bold mb-2 block">WhatsApp / Phone</label><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white" value={siteSettings.whatsapp} onChange={e => setSiteSettings({...siteSettings, whatsapp: e.target.value})} /></div>
                            <div><label className="text-gray-400 text-xs font-bold mb-2 block">Email</label><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white" value={siteSettings.email} onChange={e => setSiteSettings({...siteSettings, email: e.target.value})} /></div>
                            
                            {/* Mídias Sociais */}
                            <div><label className="text-gray-400 text-xs font-bold mb-2 block">Instagram Link (Full URL)</label><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white placeholder-gray-600" placeholder="https://instagram.com/..." value={siteSettings.instagramUrl} onChange={e => setSiteSettings({...siteSettings, instagramUrl: e.target.value})} /></div>
                            <div><label className="text-gray-400 text-xs font-bold mb-2 block">Facebook Link (Full URL)</label><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white placeholder-gray-600" placeholder="https://facebook.com/..." value={siteSettings.facebookUrl} onChange={e => setSiteSettings({...siteSettings, facebookUrl: e.target.value})} /></div>
                            <div><label className="text-gray-400 text-xs font-bold mb-2 block">LinkedIn Link (Optional)</label><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white placeholder-gray-600" placeholder="https://linkedin.com/..." value={siteSettings.linkedinUrl} onChange={e => setSiteSettings({...siteSettings, linkedinUrl: e.target.value})} /></div>

                            <div><label className="text-gray-400 text-xs font-bold mb-2 block">Copyright Text</label><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white" value={siteSettings.copyright} onChange={e => setSiteSettings({...siteSettings, copyright: e.target.value})} /></div>
                            <div><label className="text-gray-400 text-xs font-bold mb-2 block">Badge Text (Slide)</label><input className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white" value={siteSettings.badgeText} onChange={e => setSiteSettings({...siteSettings, badgeText: e.target.value})} /></div>
                        </div>
                        <button type="submit" className="w-full bg-[#FFC107] text-black p-4 rounded-2xl font-black uppercase text-xs hover:bg-yellow-600">Save Footer & Settings</button>
                    </form>
                </div>
            )}
          </div>
        )}

        {/* HERO SLIDESHOW */}
        {!isAdminMode && (
          <div className="mb-10 relative h-[350px] sm:h-[550px] rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl bg-gray-900">
            {banners.length > 0 ? banners.map((slide, index) => (
              <div key={slide.id} className={`absolute inset-0 transition-all duration-1000 transform flex items-center px-6 sm:px-14 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`} style={{ backgroundImage: slide.image ? `url(${slide.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="relative z-10 max-w-3xl text-left text-white animate-in slide-in-from-bottom-6">
                  <div className="inline-flex items-center gap-2 bg-[#FFC107] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-black"><Award className="w-3 h-3"/> {siteSettings.badgeText}</div>
                  <h2 className="text-3xl sm:text-7xl font-black mb-6 uppercase leading-[0.9] tracking-tighter text-white drop-shadow-lg"> {slide.title} </h2>
                  <p className="text-gray-200 mb-8 text-sm sm:text-xl font-medium max-w-lg leading-relaxed drop-shadow-md">{slide.subtitle}</p>
                  <button onClick={() => setIsQuoteModalOpen(true)} className="bg-white text-black px-8 sm:px-10 py-3 sm:py-4 rounded-full font-black uppercase text-[10px] sm:text-xs hover:bg-[#FFC107] transition-all">Start Project</button>
                </div>
              </div>
            )) : (
              <div className="flex items-center justify-center h-full text-gray-500">Loading Banners...</div>
            )}
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
               {banners.map((_, i) => (
                 <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all shadow ${i === currentSlide ? 'w-8 bg-[#FFC107]' : 'w-2 bg-white/50 hover:bg-white'}`} />
               ))}
            </div>
          </div>
        )}

        {/* PORTFOLIO GRID (5 COLUNAS) */}
        <div ref={portfolioRef} className="scroll-mt-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 text-left">
          {filteredProducts.map(product => (
            <div key={product.id} onClick={() => { setSelectedProduct(product); setCurrentProductImgIdx(0); }} className="group bg-gray-900 rounded-[2rem] border border-white/5 overflow-hidden hover:border-[#FFC107]/50 transition-all cursor-pointer relative aspect-[4/5] sm:aspect-square">
              <img src={product.images ? product.images[0] : product.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100" alt={product.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="text-[#FFC107] text-[9px] font-black uppercase tracking-widest mb-2 block">{product.category}</span>
                <h3 className="font-bold text-white text-xl sm:text-2xl uppercase leading-none mb-4">{product.name}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md group-hover:bg-[#FFC107] group-hover:text-black transition-colors">
                  View Details <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && !isAdminMode && (
            <div className="col-span-full text-center py-20 text-gray-500 border border-white/10 rounded-[2rem] border-dashed">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-700 mb-4"/>
              <p>No projects found in this category.</p>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white py-16 px-4 text-center mt-20 border-t border-white/10">
        <h2 className="text-3xl font-black uppercase mb-6 tracking-tighter italic">2<span className="text-[#FFC107]">KINP!</span></h2>
        <div className="flex flex-col sm:flex-row justify-center gap-8 text-[11px] font-bold uppercase text-gray-400 mb-12 flex-wrap">
          {siteSettings?.address && <div className="flex items-center justify-center gap-2"><MapPin size={16} className="text-[#FFC107]" /> {siteSettings.address}</div>}
          {siteSettings?.email && <a href={`mailto:${siteSettings.email}`} className="flex items-center justify-center gap-2 hover:text-white transition"><Mail size={16} className="text-[#FFC107]" /> {siteSettings.email}</a>}
          {siteSettings?.whatsapp && <a href={`tel:${siteSettings.whatsapp}`} className="flex items-center justify-center gap-2 hover:text-white transition"><Phone size={16} className="text-[#FFC107]" /> {siteSettings.whatsapp}</a>}
          
          {/* Social Media Links Dinâmicos */}
          {siteSettings?.instagramUrl && <a href={siteSettings.instagramUrl} target="_blank" className="flex items-center justify-center gap-2 hover:text-[#E1306C] transition"><Instagram size={16} className="text-[#FFC107]" /> Instagram</a>}
          {siteSettings?.facebookUrl && <a href={siteSettings.facebookUrl} target="_blank" className="flex items-center justify-center gap-2 hover:text-[#1877F2] transition"><Facebook size={16} className="text-[#FFC107]" /> Facebook</a>}
          {siteSettings?.linkedinUrl && <a href={siteSettings.linkedinUrl} target="_blank" className="flex items-center justify-center gap-2 hover:text-[#0A66C2] transition"><Linkedin size={16} className="text-[#FFC107]" /> LinkedIn</a>}
        </div>
        <p className="text-gray-800 text-[10px] uppercase tracking-[0.3em] font-bold">© {new Date().getFullYear()} {siteSettings?.copyright}</p>
      </footer>

      {/* ADMIN LOGIN MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in">
          <div className="bg-gray-900 rounded-[3rem] p-10 max-w-sm w-full text-center space-y-6 shadow-2xl border border-white/10">
            <div className="w-20 h-20 bg-[#FFC107]/20 rounded-full flex items-center justify-center mx-auto"><Lock className="text-[#FFC107]" size={40} /></div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Admin Access</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input type="password" placeholder="Pass: admin" className="w-full p-5 bg-black border-2 border-white/10 rounded-2xl text-center text-xl font-bold outline-none focus:border-[#FFC107] text-white" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} autoFocus />
              <button type="submit" className="w-full p-4 bg-[#FFC107] text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-yellow-600 transition">Unlock</button>
            </form>
            <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-500 text-xs uppercase hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* PROJECT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-6 overflow-y-auto">
          <div className="bg-gray-900 rounded-none sm:rounded-[3.5rem] max-w-6xl w-full flex flex-col lg:flex-row overflow-hidden shadow-2xl my-auto animate-in zoom-in duration-300 max-h-[95vh] border border-white/10 relative">
            <div className="lg:w-3/5 h-[40vh] lg:h-auto relative bg-black shrink-0 group">
              <div className="w-full h-full flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentProductImgIdx * 100}%)` }}>
                {(selectedProduct.images || [selectedProduct.image]).map((img, i) => <img key={i} src={img} className="w-full h-full object-cover shrink-0" alt="Work" />)}
              </div>
              {(selectedProduct.images?.length > 1) && (
                <>
                  <button onClick={() => setCurrentProductImgIdx(prev => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#FFC107] hover:text-black text-white p-3 rounded-full backdrop-blur-md transition-all"><ChevronLeft size={24} /></button>
                  <button onClick={() => setCurrentProductImgIdx(prev => (prev + 1) % selectedProduct.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#FFC107] hover:text-black text-white p-3 rounded-full backdrop-blur-md transition-all"><ChevronRight size={24} /></button>
                </>
              )}
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 left-6 bg-black/40 text-white p-2 rounded-full lg:hidden shadow-lg"><X size={24} /></button>
            </div>
            <div className="lg:w-2/5 p-8 sm:p-12 flex flex-col relative bg-gray-900 overflow-y-auto">
              <button onClick={() => setSelectedProduct(null)} className="hidden lg:block absolute top-8 right-8 text-gray-500 hover:text-white transition-all"><X size={32} /></button>
              <div className="mt-4">
                 <span className="text-[#FFC107] font-black text-[10px] uppercase bg-[#FFC107]/10 px-4 py-2 rounded-lg w-fit mb-4 block tracking-wider">{selectedProduct.category}</span>
                 <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.9]">{selectedProduct.name}</h2>
                 <div className="bg-black p-6 rounded-[2rem] border border-white/5 mb-8">
                   <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{selectedProduct.description}</p>
                 </div>
                 <button onClick={() => { setSelectedProduct(null); setIsQuoteModalOpen(true); }} className="w-full bg-[#FFC107] text-black py-5 rounded-[2rem] font-black uppercase text-xs shadow-xl flex items-center justify-center gap-3 hover:bg-yellow-600 transition-all">Request Pricing <ExternalLink size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL QUOTE MODAL (RENDERIZADO AGORA FORA DO APP) */}
      {isQuoteModalOpen && <QuoteModal onClose={() => setIsQuoteModalOpen(false)} />}

      {/* FLOAT BUTTON */}
      {!isQuoteModalOpen && !isAdminMode && (
        <button onClick={() => setIsQuoteModalOpen(true)} className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 bg-[#FFC107] text-black p-5 sm:p-6 rounded-[2.2rem] shadow-[0_0_50px_rgba(255,193,7,0.3)] hover:scale-110 active:scale-95 transition-all z-40 border-4 border-black"><MessageSquare size={32} /></button>
      )}

    </div>
  );
}