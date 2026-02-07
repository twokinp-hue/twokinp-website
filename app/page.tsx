"use client";
import React, { useState, useRef } from 'react';
import { Upload, MapPin, Phone, Mail, User, Sparkles, X, ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [lang, setLang] = useState('en');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados do Formulário
  const [selectedService, setSelectedService] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [dimensions, setDimensions] = useState({ w: '', h: '' });
  const [hasDesign, setHasDesign] = useState<string | null>(null);
  const [urgency, setUrgency] = useState('normal');
  const [contact, setContact] = useState({ name: '', phone: '', email: '', location: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Link do Webhook CORRETO
  const N8N_WEBHOOK_URL = "https://webhook.twokinp.cloud/webhook/pedido-site-v2";

  // Imagem de Fundo
  const BG_IMAGE = "https://images.unsplash.com/photo-1621996661665-365188600123?q=80&w=2070&auto=format&fit=crop";

  // Cores Douradas
  const GOLD_COLOR = "text-[#FFC107]";
  const GOLD_BG = "bg-[#FFC107]";
  const GOLD_BORDER = "border-[#FFC107]";
  const GOLD_HOVER = "hover:bg-[#FFB300]";

  // LISTA COMPLETA
  const servicesDB = {
    "car_wrap": { 
      name: "Car Wrap", 
      icon: "🚗", 
      options: ["Full Wrap", "Partial Wrap", "Lettering & Decals", "Commercial Fleet", "Color Change"] 
    },
    "indoor_sign": { 
      name: "Illuminated Sign", 
      icon: "💡", 
      options: ["LED", "Neon Flex"] 
    },
    "window": { 
      name: "Window Graphics", 
      icon: "🪟", 
      options: ["Perforated", "Vinyl", "Lettering", "Frosted"] 
    },
    "wall": { 
      name: "Wall Graphics", 
      icon: "🎨", 
      options: ["Vinyl", "Wall Paper"] 
    },
    "outdoor_sign": { 
      name: "Outdoor Signs", 
      icon: "🏢", 
      options: ["Monuments", "Pole Signs", "Storefront Signs", "Plaques", "Yard Signs", "Real Estate Signs", "Banners", "Post & Panel Signs", "Light Box Signs", "3D Letters Illuminated", "Channel Letters"] 
    },
    "promo": { 
      name: "Promotional Signs", 
      icon: "📣", 
      options: ["Trade Show", "POS Signs", "Pull-up Banner", "Floor Signs", "Backdrop", "Stands", "Booth Display"] 
    },
    "print": { 
      name: "Printing", 
      icon: "🖨️", 
      options: ["Brochure", "Business Card", "Poster", "Hang Door", "Menu", "Envelope", "Flyers", "Folders", "Tri-fold", "Labels"] 
    },
    "services": { 
      name: "Fabrication Services", 
      icon: "⚙️", 
      options: ["Fabrication", "Laser Cutting", "Router CNC", "Wide Print Format", "Plotter Cutting", "Vinyl Installation"] 
    },
    "ada": { 
      name: "ADA Signs", 
      icon: "♿", 
      options: ["Hotel", "Hospital", "Commercial Building"] 
    },
    "directory": { 
      name: "Directory Signs", 
      icon: "📍", 
      options: ["Safety Signs", "Street Signs", "Building Signs", "Parking Signs"] 
    },
    "graphic_design": { 
      name: "Graphic Design", 
      icon: "✏️", 
      options: ["Design", "Illustration", "Logo", "Brand Book", "AI Generative", "Cartoon Creation"] 
    },
    "digital_marketing": { 
      name: "Digital Marketing", 
      icon: "📈", 
      options: ["Google Ads", "Meta Ads", "Social Media Management", "SEO", "Webdesign", "Ecommerce", "AI Automation", "Analytics"] 
    },
    "custom": { 
      name: "Custom Signs", 
      icon: "✨", 
      options: ["Awards", "DTF T-Shirt", "Gifts", "Neon Signs", "Illuminated Signs"] 
    }
  };

  const t = {
    en: {
      slogan: "Premium Wraps & Visual Solutions.", cta: "Get a Free Quote",
      step1: "Select Category", step2: "Select Product & Details", step3: "Contact Info",
      next: "Next", back: "Back", submit: "Send Request",
      form: { name: "Full Name", phone: "Phone Number", email: "Email Address", loc: "City / Zip" },
      success: "Request Sent! We'll allow 24h for a response."
    },
    pt: {
      slogan: "Envelopamento e Comunicação Visual Premium.", cta: "Orçamento Grátis",
      step1: "Escolha a Categoria", step2: "Escolha o Produto e Detalhes", step3: "Seus Dados",
      next: "Próximo", back: "Voltar", submit: "Enviar Pedido",
      form: { name: "Nome Completo", phone: "Telefone / WhatsApp", email: "E-mail", loc: "Cidade / CEP" },
      success: "Sucesso! Entraremos em contato em breve."
    },
    es: {
      slogan: "Rotulación y Soluciones Visuales Premium.", cta: "Cotización Gratis",
      step1: "Seleccionar Categoría", step2: "Producto y Detalles", step3: "Datos de Contacto",
      next: "Siguiente", back: "Atrás", submit: "Enviar Solicitud",
      form: { name: "Nombre Completo", phone: "Teléfono", email: "Correo", loc: "Ciudad / Zip" },
      success: "¡Enviado! Te contactaremos pronto."
    }
  };

  const content = t[lang as keyof typeof t];

  const handleNext = () => {
    if (step === 1 && !selectedService) return alert("Please select a category.");
    if (step === 2 && !selectedProduct) return alert("Please select a specific product.");
    setStep(step + 1);
  };

  // --- FUNÇÃO BLINDADA (NO-CORS) ---
  const handleSubmit = async () => {
    if (!contact.name || !contact.phone) return alert("Name and Phone are required.");
    setIsSubmitting(true);

    // Usando URLSearchParams para evitar bloqueio do navegador
    const formData = new URLSearchParams();
    formData.append('Date', new Date().toLocaleDateString('pt-BR'));
    formData.append('Customer Name', contact.name);
    formData.append('Phone', contact.phone);
    formData.append('Email', contact.email);
    formData.append('Location', contact.location);
    formData.append('Category', servicesDB[selectedService as keyof typeof servicesDB]?.name || selectedService);
    formData.append('Product', selectedProduct);
    formData.append('Dimensions', `${dimensions.w} x ${dimensions.h}`);
    formData.append('Urgency', urgency);
    formData.append('Design Ready?', hasDesign || 'unknown');
    formData.append('language', lang);

    try {
      // O 'no-cors' permite enviar mesmo que o servidor não responda com os headers certos
      await fetch(N8N_WEBHOOK_URL, { 
        method: 'POST', 
        body: formData,
        mode: 'no-cors' 
      });

      // Assumimos sucesso pois no modo 'no-cors' não lemos a resposta
      alert(content.success);
      setIsModalOpen(false);
      
      // Limpar formulário
      setStep(1);
      setSelectedService('');
      setSelectedProduct('');
      setContact({ name: '', phone: '', email: '', location: '' });
      setDimensions({ w: '', h: '' });

    } catch (error) {
      console.error(error);
      alert("Error connecting. Check your internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative font-sans text-white overflow-hidden">
      
      {/* BACKGROUND */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      <div className="absolute inset-0 z-0 bg-black/80 backdrop-blur-sm" />

      {/* HEADER / IDIOMA */}
      <div className="absolute top-6 right-6 flex space-x-4 z-20 font-bold text-xs tracking-widest">
        <button onClick={() => setLang('en')} className={`transition hover:text-white ${lang === 'en' ? GOLD_COLOR : 'text-gray-500'}`}>EN</button>
        <button onClick={() => setLang('es')} className={`transition hover:text-white ${lang === 'es' ? GOLD_COLOR : 'text-gray-500'}`}>ES</button>
        <button onClick={() => setLang('pt')} className={`transition hover:text-white ${lang === 'pt' ? GOLD_COLOR : 'text-gray-500'}`}>PT</button>
      </div>

      {/* HERO SECTION */}
      <main className="text-center space-y-8 z-10 relative max-w-5xl px-4 animate-in fade-in zoom-in duration-700">
        <div className="space-y-2">
          <h2 className={`${GOLD_COLOR} font-bold tracking-[0.2em] text-sm uppercase md:text-base drop-shadow-md`}>MARKETING DIGITAL & VISUAL SOLUTIONS</h2>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl">
            2<span className={GOLD_COLOR}>KINP!</span>
          </h1>
        </div>
        <p className="text-lg md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
          {content.slogan}
        </p>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`group relative ${GOLD_BG} ${GOLD_HOVER} text-black font-black text-lg md:text-xl py-5 px-12 rounded-full transition-all shadow-[0_0_20px_rgba(255,193,7,0.4)] hover:shadow-[0_0_40px_rgba(255,193,7,0.6)] hover:-translate-y-1 cursor-pointer`}
        >
          <span className="flex items-center gap-3 pointer-events-none">
            {content.cta} <Sparkles className="group-hover:rotate-12 transition-transform" />
          </span>
        </button>
      </main>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className={`bg-gray-900/95 border ${GOLD_BORDER}/30 p-5 md:p-6 rounded-3xl w-full max-w-3xl relative shadow-2xl backdrop-blur-xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200`}>
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-4">
               <div className="flex gap-2">
                 {[1, 2, 3].map(s => (
                   <div key={s} className={`h-1 w-8 rounded-full transition-colors duration-300 ${step >= s ? GOLD_BG : 'bg-gray-700'}`} />
                 ))}
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition bg-gray-800/50 p-1.5 rounded-full">
                  <X size={18} />
               </button>
            </div>

            <h2 className="text-xl font-bold mb-4 text-white tracking-tight flex items-center gap-2">
              <span className={GOLD_COLOR}>{step === 1 ? '01.' : step === 2 ? '02.' : '03.'}</span>
              {step === 1 && content.step1}
              {step === 2 && content.step2}
              {step === 3 && content.step3}
            </h2>

            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
              
              {/* PASSO 1: CATEGORIAS (Grid Limpo) */}
              {step === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-2">
                  {Object.entries(servicesDB).map(([key, service]) => (
                    <button 
                      key={key}
                      onClick={() => setSelectedService(key)}
                      className={`p-3 rounded-lg text-left border transition-all duration-200 flex flex-col justify-between h-full ${selectedService === key ? `${GOLD_BG} text-black font-bold shadow-md border-transparent transform scale-[1.02]` : `bg-gray-800/40 border-gray-700 text-gray-300 hover:bg-gray-800 hover:${GOLD_BORDER}`}`}
                    >
                      <span className="text-2xl mb-1 block">{service.icon}</span>
                      <span className="block text-xs md:text-sm font-semibold leading-tight">{service.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* PASSO 2: PRODUTOS + DETALHES */}
              {step === 2 && (
                <div className="space-y-6">
                  
                  {/* SEÇÃO DE PRODUTOS */}
                  <div className="bg-gray-800/20 p-4 rounded-xl border border-gray-700/50">
                    <label className={`text-xs ${GOLD_COLOR} mb-3 block font-bold uppercase tracking-widest`}>
                      Select Specific Product
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {servicesDB[selectedService as keyof typeof servicesDB].options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setSelectedProduct(opt)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${selectedProduct === opt ? 'bg-white text-black border-white shadow-lg' : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detalhes Técnicos */}
                  <div className="space-y-4 pt-2 border-t border-gray-800/50">
                    {/* Tamanho */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Width</label>
                          <input type="text" placeholder="ex: 10ft" className={`w-full bg-black/50 border border-gray-600 p-2.5 rounded-lg text-white text-sm focus:${GOLD_BORDER} outline-none transition`} onChange={e => setDimensions({...dimensions, w: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Height</label>
                          <input type="text" placeholder="ex: 5ft" className={`w-full bg-black/50 border border-gray-600 p-2.5 rounded-lg text-white text-sm focus:${GOLD_BORDER} outline-none transition`} onChange={e => setDimensions({...dimensions, h: e.target.value})} />
                        </div>
                    </div>

                    {/* Arquivo e Design */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
                         <p className="text-[10px] text-gray-400 mb-2 font-bold uppercase">Design Ready?</p>
                         <div className="flex gap-2">
                           <button onClick={() => setHasDesign('yes')} className={`flex-1 p-2 rounded text-xs font-bold transition ${hasDesign === 'yes' ? `${GOLD_BG} text-black` : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>YES</button>
                           <button onClick={() => setHasDesign('no')} className={`flex-1 p-2 rounded text-xs font-bold transition ${hasDesign === 'no' ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>NO</button>
                         </div>
                      </div>

                      <label className={`flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-600 rounded-xl hover:${GOLD_BORDER} hover:bg-yellow-500/5 cursor-pointer transition group`}>
                         <Upload size={16} className={`text-gray-400 group-hover:${GOLD_COLOR} mb-1`} />
                         <span className="text-[10px] text-gray-400 font-bold uppercase">Upload File</span>
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" />
                      </label>
                    </div>

                    {/* Urgência */}
                    <div>
                      <label className="text-[10px] text-gray-400 mb-2 block font-bold uppercase">Urgency</label>
                      <div className="grid grid-cols-3 gap-2">
                         {['normal', 'rush', 'asap'].map((u) => (
                           <button 
                             key={u}
                             onClick={() => setUrgency(u)} 
                             className={`p-2 rounded-lg text-[10px] md:text-xs font-bold border transition ${urgency === u ? `${GOLD_BG} text-black border-transparent` : `bg-transparent border-gray-700 text-gray-500 hover:${GOLD_BORDER}`}`}
                           >
                             {u === 'normal' ? 'Standard' : u === 'rush' ? 'Rush' : 'ASAP'}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PASSO 3: CONTATO */}
              {step === 3 && (
                <div className="space-y-3 pt-2">
                  <div className="relative group">
                    <User className={`absolute left-3 top-3.5 text-gray-500 group-focus-within:${GOLD_COLOR} transition`} size={16} />
                    <input type="text" placeholder={content.form.name} className={`w-full bg-black/50 border border-gray-700 p-3 pl-10 rounded-lg text-white text-sm focus:${GOLD_BORDER} outline-none transition`} onChange={e => setContact({...contact, name: e.target.value})} />
                  </div>
                  <div className="relative group">
                    <Phone className={`absolute left-3 top-3.5 text-gray-500 group-focus-within:${GOLD_COLOR} transition`} size={16} />
                    <input type="tel" placeholder={content.form.phone} className={`w-full bg-black/50 border border-gray-700 p-3 pl-10 rounded-lg text-white text-sm focus:${GOLD_BORDER} outline-none transition`} onChange={e => setContact({...contact, phone: e.target.value})} />
                  </div>
                  <div className="relative group">
                    <Mail className={`absolute left-3 top-3.5 text-gray-500 group-focus-within:${GOLD_COLOR} transition`} size={16} />
                    <input type="email" placeholder={content.form.email} className={`w-full bg-black/50 border border-gray-700 p-3 pl-10 rounded-lg text-white text-sm focus:${GOLD_BORDER} outline-none transition`} onChange={e => setContact({...contact, email: e.target.value})} />
                  </div>
                  <div className="relative group">
                    <MapPin className={`absolute left-3 top-3.5 text-gray-500 group-focus-within:${GOLD_COLOR} transition`} size={16} />
                    <input type="text" placeholder={content.form.loc} className={`w-full bg-black/50 border border-gray-700 p-3 pl-10 rounded-lg text-white text-sm focus:${GOLD_BORDER} outline-none transition`} onChange={e => setContact({...contact, location: e.target.value})} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 mt-2 border-t border-gray-800 flex justify-between items-center">
               {step > 1 ? (
                 <button onClick={() => setStep(step - 1)} className="text-gray-400 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition text-sm">
                   <ChevronLeft size={16} /> {content.back}
                 </button>
               ) : <div/>}

               {step < 3 ? (
                 <button 
                   onClick={handleNext} 
                   className={`bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 flex items-center gap-2 transition text-sm transform active:scale-95`}
                 >
                   {content.next} <ChevronRight size={16} />
                 </button>
               ) : (
                 <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className={`${GOLD_BG} ${GOLD_HOVER} text-black px-6 py-2.5 rounded-lg font-black w-full ml-4 shadow-lg shadow-yellow-500/20 flex justify-center items-center gap-2 disabled:opacity-70 transition transform active:scale-95 text-sm`}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <><CheckCircle2 size={16}/> {content.submit}</>}
                  </button>
               )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}