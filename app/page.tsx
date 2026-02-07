"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Phone, Mail, MapPin, X, Loader2, Upload, CheckCircle2,
  Instagram, Facebook, Linkedin, LayoutDashboard, 
  Car, Lightbulb, Blinds, Palette, Building, Megaphone
} from 'lucide-react';

// --- DADOS DO SITE (Com imagem de fundo nova!) ---
const SITE_DATA = {
  hero: {
    title: "FUTURE OF VISUALS",
    subtitle: "Marketing • AI Automation • Signs",
    // NOVA IMAGEM: Oficina de envelopamento
    bg: "https://images.unsplash.com/photo-1621994632207-272cb4b6c179?q=80&w=2000&auto=format&fit=crop"
  },
  services: [
    {
      id: "marketing",
      title: "Digital Marketing",
      desc: "Performance, SEO & Social Media Growth.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      icon: "📈"
    },
    {
      id: "ai",
      title: "AI & Automation",
      desc: "Generative AI, Chatbots & Workflow Automation.",
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
      icon: "🤖"
    },
    {
      id: "signs",
      title: "Signs & Print",
      desc: "Premium Wraps, Indoor & Outdoor Signage.",
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
      icon: "🎨"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1635350736475-c8cef4b21906?q=80&w=800",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800",
    "https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=800",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800"
  ],
  contact: {
    phone: "+1 (555) 123-4567",
    email: "contact@twokinp.com",
    address: "Kissimmee, FL"
  }
};

export default function Home() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  
  // --- O FORMULÁRIO ORIGINAL COMPLETO (Resgatado!) ---
  const QuoteModal = () => {
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
      category: '', product: '', width: '', height: '', quantity: 1,
      description: '', name: '', email: '', phone: '', fileUrl: ''
    });
    const fileInputRef = useRef(null);

    // Categorias Originais
    const categories = [
      { id: 'wraps', name: 'Car Wrap', icon: <Car size={28}/>, products: ['Full Wrap', 'Partial Wrap', 'Decals/Lettering', 'Color Change'] },
      { id: 'illuminated', name: 'Illuminated Sign', icon: <Lightbulb size={28}/>, products: ['Channel Letters', 'Light Box/Cabinet', 'Backlit Halo', 'Neon/LED Flex'] },
      { id: 'window', name: 'Window Graphics', icon: <Blinds size={28}/>, products: ['Perforated (One-Way)', 'Solid Vinyl Blockout', 'Frosted/Etched', 'Clear Decals'] },
      { id: 'wall', name: 'Wall Graphics', icon: <Palette size={28}/>, products: ['Custom Wallpaper', 'Wall Murals', 'Vinyl Cut Lettering', 'Canvas Prints'] },
      { id: 'outdoor', name: 'Outdoor Signs', icon: <Building size={28}/>, products: ['Monument Signs', 'Pylon/Pole Signs', 'A-Frame (Sidewalk)', 'Post & Panel'] },
      { id: 'promo', name: 'Promotional', icon: <Megaphone size={28}/>, products: ['Banners (Mesh/Vinyl)', 'Yard Signs (Coroplast)', 'Trade Show Displays', 'Flags/Feathers'] },
    ];

    // Estilo dos Inputs (Preto/Cinza sem azul)
    const inputStyle = "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] outline-none transition text-white placeholder-gray-500";
    const labelStyle = "block text-sm font-bold text-gray-300 mb-1";

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      alert("Upload simulado (ative o n8n para funcionar de verdade).");
      setFormData({ ...formData, fileUrl: "https://exemplo.com/arquivo-simulado.jpg" });
    };

    const handleSubmit = async () => {
      setLoading(true);
      const webhookUrl = "https://primary-production-6199.up.railway.app/webhook/1f432313-c395-427c-a8b9-669967258643"; 
      try {
        await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
        setSuccess(true);
        setTimeout(() => { setIsQuoteOpen(false); setSuccess(false); setStep(1); }, 3000);
      } catch (error) {
        alert("Error sending request.");
      }
      setLoading(false);
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in">
        <div className="bg-gray-900 border border-yellow-500/30 p-6 rounded-2xl w-full max-w-4xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
          <button onClick={() => setIsQuoteOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
          
          {success ? (
             <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
               <CheckCircle2 className="text-[#FFC107] w-20 h-20 mb-4" />
               <h2 className="text-3xl font-bold mb-2">Request Received!</h2>
               <p className="text-gray-400">We'll contact you shortly.</p>
             </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="flex justify-between mb-8 relative">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0"></div>
                 <div className={`absolute top-1/2 left-0 h-1 bg-[#FFC107] -translate-y-1/2 z-0 transition-all duration-500 ${step === 1 ? 'w-[15%]' : step === 2 ? 'w-[50%]' : 'w-[85%]'}`}></div>
                 {[1, 2, 3].map((s) => (
                   <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= s ? 'bg-[#FFC107] border-[#FFC107] text-black' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>{s}</div>
                 ))}
              </div>

              {/* STEP 1: Category */}
              {step === 1 && (
                <div className="animate-in slide-in-from-right">
                  <h2 className="text-2xl font-bold mb-6"><span className="text-[#FFC107]">01.</span> Select Category</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => { setSelectedCategory(cat); setFormData({...formData, category: cat.name}); setStep(2); }}
                        className="p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-[#FFC107] hover:bg-[#FFC107]/10 transition group text-left">
                        <div className="text-[#FFC107] mb-3 group-hover:scale-110 transition">{cat.icon}</div>
                        <h3 className="font-bold">{cat.name}</h3>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Details */}
              {step === 2 && selectedCategory && (
                 <div className="animate-in slide-in-from-right">
                   <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><button onClick={() => setStep(1)} className="text-gray-400 hover:text-[#FFC107]"><X size={20}/></button> <span className="text-[#FFC107]">02.</span> {selectedCategory.name} Details</h2>
                   <div className="grid md:grid-cols-2 gap-6">
                     <div>
                       <label className={labelStyle}>Product Type</label>
                       <select className={inputStyle} onChange={e => setFormData({...formData, product: e.target.value})}>
                         <option value="">Select Type...</option>
                         {selectedCategory.products.map(p => <option key={p} value={p}>{p}</option>)}
                       </select>
                     </div>
                     <div>
                        <label className={labelStyle}>Quantity</label>
                        <input type="number" min="1" className={inputStyle} value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})}/>
                     </div>
                     <div><label className={labelStyle}>Width (approx.)</label><input type="text" placeholder='e.g. 10 ft' className={inputStyle} onChange={e => setFormData({...formData, width: e.target.value})}/></div>
                     <div><label className={labelStyle}>Height (approx.)</label><input type="text" placeholder='e.g. 4 ft' className={inputStyle} onChange={e => setFormData({...formData, height: e.target.value})}/></div>
                     <div className="md:col-span-2"><label className={labelStyle}>Project Description / Notes</label><textarea className={inputStyle} rows={3} placeholder="Tell us more about your ideas..." onChange={e => setFormData({...formData, description: e.target.value})}/></div>
                     <div className="md:col-span-2">
                        <label className={labelStyle}>Have a design/logo? (Optional)</label>
                        <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-[#FFC107] transition bg-gray-800/50">
                           <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.ai,.eps" />
                           <Upload className="mx-auto text-gray-400 mb-2" />
                           <p className="text-gray-400 text-sm">{formData.fileUrl ? "File Selected!" : "Click to upload (Images, PDF, AI)"}</p>
                        </div>
                     </div>
                   </div>
                   <button onClick={() => setStep(3)} disabled={!formData.product} className="w-full mt-6 bg-[#FFC107] text-black font-bold py-4 rounded-xl hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed">Continue to Next Step</button>
                 </div>
              )}

              {/* STEP 3: Contact Info */}
              {step === 3 && (
                 <div className="animate-in slide-in-from-right">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><button onClick={() => setStep(2)} className="text-gray-400 hover:text-[#FFC107]"><X size={20}/></button> <span className="text-[#FFC107]">03.</span> Contact Info</h2>
                    <div className="space-y-4">
                       <div><label className={labelStyle}>Your Name</label><input type="text" className={inputStyle} onChange={e => setFormData({...formData, name: e.target.value})}/></div>
                       <div><label className={labelStyle}>Email Address</label><input type="email" className={inputStyle} onChange={e => setFormData({...formData, email: e.target.value})}/></div>
                       <div><label className={labelStyle}>Phone Number</label><input type="tel" className={inputStyle} onChange={e => setFormData({...formData, phone: e.target.value})}/></div>
                    </div>
                    <button onClick={handleSubmit} disabled={loading || !formData.name || !formData.email} className="w-full mt-8 bg-[#FFC107] text-black font-bold py-4 rounded-xl hover:bg-yellow-600 transition flex justify-center items-center gap-2">
                       {loading ? <Loader2 className="animate-spin" /> : "Submit Quote Request"}
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
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter">2<span className="text-[#FFC107]">KINP!</span></div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
            <a href="#home" className="hover:text-[#FFC107] transition">Home</a>
            <a href="#services" className="hover:text-[#FFC107] transition">Services</a>
            <Link href="/admin" className="text-gray-500 hover:text-white flex items-center gap-1"><LayoutDashboard size={14}/> Admin</Link>
          </div>
          <button onClick={() => setIsQuoteOpen(true)} className="bg-[#FFC107] hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-bold text-sm transition transform hover:scale-105 shadow-[0_0_15px_rgba(255,193,7,0.3)]">
            GET QUOTE
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={SITE_DATA.hero.bg} alt="Car Wrap Shop" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <h2 className="text-[#FFC107] font-bold tracking-[0.3em] mb-4 animate-in slide-in-from-bottom-4 text-xl">{SITE_DATA.hero.subtitle}</h2>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 drop-shadow-2xl animate-in zoom-in">{SITE_DATA.hero.title}</h1>
          <button onClick={() => setIsQuoteOpen(true)} className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition">Start Project</button>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">What We Do Best</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SITE_DATA.services.map((service) => (
              <div key={service.id} className="group relative h-[400px] rounded-2xl overflow-hidden border border-white/5 bg-gray-900 cursor-pointer">
                <img src={service.img} alt={service.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <span className="text-4xl mb-4 block">{service.icon}</span>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-[#FFC107] transition">{service.title}</h3>
                  <p className="text-gray-400 text-sm">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto mb-16 text-center"><h2 className="text-4xl font-bold">Recent <span className="text-[#FFC107]">Works</span></h2></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
           {SITE_DATA.gallery.map((img, i) => (
             <div key={i} className={`rounded-xl overflow-hidden relative group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
               <img src={img} alt={`Work ${i}`} className="w-full h-full object-cover hover:scale-105 transition duration-500 filter grayscale hover:grayscale-0" />
             </div>
           ))}
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