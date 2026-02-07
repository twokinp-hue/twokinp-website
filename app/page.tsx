"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, Mail, MapPin, Sparkles, X, Loader2, 
  Instagram, Facebook, Linkedin, LayoutDashboard 
} from 'lucide-react';

// --- DADOS DO SITE ---
const SITE_DATA = {
  hero: {
    title: "FUTURE OF VISUALS",
    subtitle: "Marketing • AI Automation • Signs",
    bg: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop"
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
  
  // --- COMPONENTE MODAL ---
  const QuoteModal = () => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', desc: '' });
    
    const servicesList = ["Car Wrap", "Indoor Signs", "Outdoor Signs", "Marketing", "AI Automation"];

    const handleSubmit = async () => {
      setIsSubmitting(true);
      // Simulação de envio
      setTimeout(() => {
        alert("Request Sent to 2KINP!");
        setIsSubmitting(false);
        setIsQuoteOpen(false);
      }, 1500);
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
        <div className="bg-gray-900 border border-yellow-500/30 p-6 rounded-2xl w-full max-w-lg relative shadow-2xl">
          <button onClick={() => setIsQuoteOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
          
          <h2 className="text-2xl font-bold text-white mb-6">Get a <span className="text-[#FFC107]">Free Quote</span></h2>
          
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-400">Select a Service:</p>
              <div className="grid grid-cols-2 gap-3">
                {servicesList.map(s => (
                  <button key={s} onClick={() => setStep(2)} className="p-3 bg-gray-800 hover:bg-[#FFC107] hover:text-black transition rounded-lg text-sm font-bold border border-gray-700">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <input placeholder="Name" className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-white" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Phone" className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-white" onChange={e => setFormData({...formData, phone: e.target.value})} />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-400">Back</button>
                <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-[#FFC107] text-black font-bold py-3 rounded-lg flex justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Send"}
                </button>
              </div>
            </div>
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
          <button onClick={() => setIsQuoteOpen(true)} className="bg-[#FFC107] hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-bold text-sm transition transform hover:scale-105">
            GET QUOTE
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={SITE_DATA.hero.bg} alt="Background Hero" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <h2 className="text-[#FFC107] font-bold tracking-[0.3em] mb-4 animate-in slide-in-from-bottom-4">{SITE_DATA.hero.subtitle}</h2>
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