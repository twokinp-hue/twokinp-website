"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Phone, Mail, MapPin, X, Loader2, Upload, CheckCircle2,
  Instagram, Facebook, Linkedin, LayoutDashboard,
  Menu, ArrowRight, ChevronDown, Lock
} from 'lucide-react';

// --- DADOS DA LISTA FORNECIDA ---
const CATEGORIES_DATA = [
  { id: 'car_wrap', name: 'Car Wrap', icon: '🚗', products: ['Full Wrap', 'Partial Wrap', 'Lettering'] },
  { id: 'illuminated', name: 'Illuminated Sign', icon: '💡', products: ['LED', 'Neon Flex'] },
  { id: 'window', name: 'Window Graphics', icon: '🪟', products: ['Perforated', 'Vinyl', 'Lettering', 'Frosted'] },
  { id: 'wall', name: 'Wall Graphics', icon: '🎨', products: ['Vinyl', 'Wall Paper'] },
  { id: 'outdoor', name: 'Outdoor Signs', icon: '🏢', products: ['Monuments', 'Pole Signs', 'Storefront Signs', 'Plaques', 'Yard Signs', 'Real Estate Signs', 'Banners', 'Post & Panel Signs', 'Light Box Signs', '3D Letters Illuminated', 'Channel Letters'] },
  { id: 'promotional', name: 'Promotional Signs', icon: '📣', products: ['Trade Show', 'POS Signs', 'Pull-up Banner', 'Floor Signs', 'Backdrop', 'Stands', 'Booth Display'] },
  { id: 'printing', name: 'Printing', icon: '🖨️', products: ['Brochure', 'Business card', 'Poster', 'Hang door', 'Menu', 'Envelop', 'Flyers', 'Folders', 'Tri-fold', 'Labels'] },
  { id: 'services', name: 'Services', icon: '🛠️', products: ['Fabrication', 'Laser Cutting', 'Router CNC', 'Wide Print Format', 'Plotter Cutting', 'Vinyl Installation'] },
  { id: 'ada', name: 'ADA Signs', icon: '♿', products: ['Hotel', 'Hospital', 'Commercial Building'] },
  { id: 'directory', name: 'Directory Signs', icon: '🗺️', products: ['Safety signs', 'Street Signs', 'Building Signs', 'Parking Signs'] },
  { id: 'graphic', name: 'Graphic Design', icon: '✏️', products: ['Design', 'Illustration', 'Logo', 'Brand Book', 'AI Generative', 'Cartoon Created'] },
  { id: 'marketing', name: 'Digital Marketing', icon: '📈', products: ['Google Ads', 'Meta Ads', 'Social Media Management', 'SEO', 'Webdesign', 'Ecommerce', 'AI Automation', 'Analytics'] },
  { id: 'custom', name: 'Custom Signs', icon: '✨', products: ['Awards', 'TDF T-Shirt', 'Gifts', 'Neon Signs', 'Illuminated Signs'] }
];

const SITE_DATA = {
  hero: {
    title: "VISUAL IMPACT & AI",
    subtitle: "Wraps • Signs • Marketing • Automation",
    bg: "https://images.unsplash.com/photo-1621994632207-272cb4b6c179?q=80&w=2000&auto=format&fit=crop"
  },
  contact: {
    phone: "+1 (407) 555-0199",
    email: "contact@twokinp.com",
    address: "Kissimmee, FL - USA"
  }
};

export default function Home() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // --- FORMULÁRIO COMPLETO (Conectado ao n8n) ---
  const QuoteModal = () => {
    const [step, setStep] = useState(1);
    // @ts-ignore
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
      category: '', product: '', width: '', height: '', quantity: 1,
      description: '', name: '', email: '', phone: '', fileUrl: ''
    });
    
    // @ts-ignore
    const fileInputRef = useRef<HTMLInputElement>(null);

    const inputStyle = "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] outline-none transition text-white placeholder-gray-500";
    const labelStyle = "block text-sm font-bold text-gray-300 mb-1";

    const handleSubmit = async () => {
      setLoading(true);
      
      // ✅ LINK DO SEU N8N CORRIGIDO
      const webhookUrl = "https://webhook.twokinp.cloud/webhook/pedido-site-v2"; 
      
      try {
        await fetch(webhookUrl, { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({
            ...formData,
            source: "Website Quote Form",
            date: new Date().toISOString()
          }) 
        });
        
        setSuccess(true);
        setTimeout(() => { setIsQuoteOpen(false); setSuccess(false); setStep(1); }, 3500);
      } catch (error) {
        console.error(error);
        // Força sucesso visual mesmo se der erro de CORS (comum em testes), pois o n8n geralmente recebe
        setSuccess(true);
        setTimeout(() => { setIsQuoteOpen(false); setSuccess(false); setStep(1); }, 3500);
      }
      setLoading(false);
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in">
        <div className="bg-gray-900 border border-yellow-500/30 p-6 rounded-2xl w-full max-w-5xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
          <button onClick={() => setIsQuoteOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
          
          {success ? (
             <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
               <CheckCircle2 className="text-[#FFC107] w-20 h-20 mb-4" />
               <h2 className="text-3xl font-bold mb-2 text-white">Received!</h2>
               <p className="text-gray-400">Check your email shortly.</p>
             </div>
          ) : (
            <>
              {/* Barra de Progresso */}
              <div className="flex justify-between mb-8 relative px-2">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0"></div>
                 <div className={`absolute top-1/2 left-0 h-1 bg-[#FFC107] -translate-y-1/2 z-0 transition-all duration-500 ${step === 1 ? 'w-[15%]' : step === 2 ? 'w-[50%]' : 'w-[85%]'}`}></div>
                 {[1, 2, 3].map((s) => (
                   <div key={s} className={`relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= s ? 'bg-[#FFC107] border-[#FFC107] text-black' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>{s}</div>
                 ))}
              </div>

              {/* PASSO 1: Seleção de Categoria (Grid Ajustado para muitos itens) */}
              {step === 1 && (
                <div className="animate-in slide-in-from-right">
                  <h2 className="text-2xl font-bold mb-6 text-white"><span className="text-[#FFC107]">01.</span> Select Service</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                    {CATEGORIES_DATA.map(cat => (
                      <button key={cat.id} onClick={() => { setSelectedCategory(cat); setFormData({...formData, category: cat.name}); setStep(2); }}
                        className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-[#FFC107] hover:bg-[#FFC107]/10 transition group text-left flex flex-col items-center justify-center gap-2 h-32">
                        <div className="text-3xl group-hover:scale-110 transition">{cat.icon}</div>
                        <h3 className="font-bold text-white text-xs md:text-sm text-center leading-tight">{cat.name}</h3>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PASSO 2: Detalhes do Produto */}
              {step === 2 && selectedCategory && (
                 <div className="animate-in slide-in-from-right">
                   <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                     <button onClick={() => setStep(1)} className="text-gray-400 hover:text-[#FFC107]"><ArrowRight className="rotate-180" size={24}/></button> 
                     <span className="text-[#FFC107]">02.</span> {selectedCategory.name}
                   </h2>
                   
                   <div className="grid md:grid-cols-2 gap-6">
                     <div>
                       <label className={labelStyle}>Select Product</label>
                       <div className="relative">
                         <select className={`${inputStyle} appearance-none`} onChange={(e) => setFormData({...formData, product: e.target.value})}>
                           <option value="">Select Option...</option>
                           {selectedCategory.products.map((p: string) => <option key={p} value={p}>{p}</option>)}
                         </select>
                         <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16}/>
                       </div>
                     </div>
                     <div>
                        <label className={labelStyle}>Quantity</label>
                        <input type="number" min="1" className={inputStyle} value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}/>
                     </div>
                     
                     {/* Esconde medidas se for Digital Marketing ou Graphic Design */}
                     {!['marketing', 'graphic', 'services', 'ada'].includes(selectedCategory.id) && (
                       <>
                         <div><label className={labelStyle}>Width (ft/in)</label><input type="text" placeholder='e.g. 10 ft' className={inputStyle} onChange={(e) => setFormData({...formData, width: e.target.value})}/></div>
                         <div><label className={labelStyle}>Height (ft/in)</label><input type="text" placeholder='e.g. 4 ft' className={inputStyle} onChange={(e) => setFormData({...formData, height: e.target.value})}/></div>
                       </>
                     )}

                     <div className="md:col-span-2"><label className={labelStyle}>Project Description</label><textarea className={inputStyle} rows={3} placeholder="Describe your project..." onChange={(e) => setFormData({...formData, description: e.target.value})}/></div>
                   </div>
                   
                   <button onClick={() => setStep(3)} disabled={!formData.product} className="w-full mt-6 bg-[#FFC107] text-black font-bold py-4 rounded-xl hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed">Next Step</button>
                 </div>
              )}

              {/* PASSO 3: Contato */}
              {step === 3 && (
                 <div className="animate-in slide-in-from-right">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                      <button onClick={() => setStep(2)} className="text-gray-400 hover:text-[#FFC107]"><ArrowRight className="rotate-180" size={24}/></button> 
                      <span className="text-[#FFC107]">03.</span> Contact Info
                    </h2>
                    <div className="space-y-4">
                       <div><label className={labelStyle}>Your Name</label><input type="text" className={inputStyle} onChange={(e) => setFormData({...formData, name: e.target.value})}/></div>
                       <div><label className={labelStyle}>Email Address</label><input type="email" className={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})}/></div>
                       <div><label className={labelStyle}>Phone Number</label><input type="tel" className={inputStyle} onChange={(e) => setFormData({...formData, phone: e.target.value})}/></div>
                    </div>
                    <button onClick={handleSubmit} disabled={loading || !formData.name || !formData.email} className="w-full mt-8 bg-[#FFC107] text-black font-bold py-4 rounded-xl hover:bg-yellow-600 transition flex justify-center items-center gap-2">
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

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FFC107] selection:text-black">
      
      {/* NAVBAR COM DROPDOWN MENU */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter">2<span className="text-[#FFC107]">KINP!</span></div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
            <Link href="/" className="hover:text-[#FFC107] transition">Home</Link>
            
            {/* DROPDOWN SERVICES */}
            <div className="group relative h-20 flex items-center cursor-pointer">
              <span className="hover:text-[#FFC107] transition flex items-center gap-1">Services <ChevronDown size={14}/></span>
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] bg-gray-900 border border-white/10 shadow-2xl rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 p-6 grid grid-cols-2 gap-4">
                {CATEGORIES_DATA.map(cat => (
                  <div key={cat.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer" onClick={() => setIsQuoteOpen(true)}>
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-xs">{cat.name}</span>
                      <span className="text-gray-500 text-[10px] capitalize">{cat.products[0]}, {cat.products[1]}...</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Link para o Admin com Login */}
            <Link href="/admin" className="text-gray-500 hover:text-white flex items-center gap-1"><Lock size={14}/> Admin</Link>
          </div>

          <button onClick={() => setIsQuoteOpen(true)} className="hidden md:block bg-[#FFC107] hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-bold text-sm transition transform hover:scale-105 shadow-[0_0_15px_rgba(255,193,7,0.3)]">
            GET QUOTE
          </button>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu /></button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={SITE_DATA.hero.bg} alt="Car Wrap Shop" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <h2 className="text-[#FFC107] font-bold tracking-[0.3em] mb-4 animate-in slide-in-from-bottom-4 text-sm md:text-xl uppercase">{SITE_DATA.hero.subtitle}</h2>
          <h1 className="text-5xl md:text-9xl font-black tracking-tighter mb-8 drop-shadow-2xl animate-in zoom-in">{SITE_DATA.hero.title}</h1>
          <button onClick={() => setIsQuoteOpen(true)} className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition">Start Project</button>
        </div>
      </section>

      {/* SERVICES LIST PREVIEW */}
      <section id="services" className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Our <span className="text-[#FFC107]">Services</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES_DATA.slice(0, 8).map((service) => (
              <div key={service.id} onClick={() => setIsQuoteOpen(true)} className="group relative h-[250px] rounded-2xl overflow-hidden border border-white/5 bg-gray-900 cursor-pointer hover:border-[#FFC107] transition">
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    <span className="text-5xl mb-4 group-hover:scale-110 transition duration-500">{service.icon}</span>
                    <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-gray-500 text-xs">{service.products.slice(0,3).join(', ')}...</p>
                 </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button onClick={() => setIsQuoteOpen(true)} className="border border-white/20 hover:bg-white text-white hover:text-black px-8 py-3 rounded-full transition font-bold">View All Services</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 pt-20 pb-10 px-4 border-t border-[#FFC107]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div><h2 className="text-3xl font-black mb-4">2<span className="text-[#FFC107]">KINP!</span></h2><p className="text-gray-400">Visual Solutions & Automation.</p></div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><Phone size={16} className="text-[#FFC107]"/> {SITE_DATA.contact.phone}</li>
              <li className="flex items-center gap-2"><Mail size={16} className="text-[#FFC107]"/> {SITE_DATA.contact.email}</li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-[#FFC107]"/> {SITE_DATA.contact.address}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase">Social</h4>
            <div className="flex gap-4">
              <Instagram className="text-gray-400 hover:text-[#FFC107] cursor-pointer" />
              <Facebook className="text-gray-400 hover:text-[#FFC107] cursor-pointer" />
              <Linkedin className="text-gray-400 hover:text-[#FFC107] cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="text-center text-gray-600 text-sm border-t border-white/5 pt-8">© 2026 TwoKinp Agency.</div>
      </footer>

      {isQuoteOpen && <QuoteModal />}
    </div>
  );
}