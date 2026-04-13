import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { INDUSTRIES, WHY_CHOOSE_US } from '../constants';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import ServiceCard from '../components/ServiceCard';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
 const { services, homeContent } = useData();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [certSearchQuery, setCertSearchQuery] = useState('');

  const getLocalizedText = (enText: string, arText?: string) => {
    return language === 'ar' && arText ? arText : enText;
  };

  const handleCertSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certSearchQuery.trim()) {
      toast.error(language === 'ar' ? 'الرجاء إدخال رقم الشهادة' : 'Please enter a certificate ID');
      return;
    }
    navigate(`/certificate/${certSearchQuery.trim()}`);
  };

  const safeHomeContent = homeContent && Object.keys(homeContent).length > 0 ? homeContent : {
    heroTitle: "ALWAYS DELIVER \n", heroHighlight: "MORE THAN EXPECTED", heroSubtitle: "Your trusted partner for Inspection...", heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
    stats: [ { label: "Completed Projects", val: "150+" } ],
    industriesTitle: "INDUSTRIES WE SERVE", industriesSubtitle: "Delivering strategic solutions...", industries: INDUSTRIES,
    whyChooseUsTitle: "WHY CHOOSE OMEGA?", whyChooseUsImage: "image/WHY CHOOSE OMEGA.png", whyChooseUsItems: WHY_CHOOSE_US
  };

  return (
    <div className="overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
      <Helmet>
        <title>OMEGA | Always Deliver More Than Expected</title>
        <meta name="description" content={safeHomeContent.heroSubtitle} />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }} className="w-full h-full">
            <img src={safeHomeContent.heroImage} alt="Background" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-slate-900/70 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-tight mb-6 drop-shadow-2xl whitespace-pre-line">
               {getLocalizedText(safeHomeContent.heroTitle, safeHomeContent.heroTitleAr)}
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-omega-yellow to-yellow-200 ml-2 rtl:mr-2 rtl:ml-0">
                 {getLocalizedText(safeHomeContent.heroHighlight, safeHomeContent.heroHighlightAr)}
               </span>
             </h1>
             <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
               {getLocalizedText(safeHomeContent.heroSubtitle, safeHomeContent.heroSubtitleAr)}
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
               <Link to="/contact" className="px-10 py-4 bg-omega-yellow text-omega-dark font-bold uppercase tracking-wide hover:bg-white hover:text-omega-blue transition-all duration-300 rounded-full shadow-lg">
                 {t('requestInspection')}
               </Link>
             </div>

             {/* Certificate Search Bar */}
             <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-2xl">
               <form onSubmit={handleCertSearch} className="flex relative">
                 <input 
                   type="text" 
                   value={certSearchQuery}
                   onChange={(e) => setCertSearchQuery(e.target.value)}
                   placeholder={language === 'ar' ? "أدخل رقم الشهادة للتحقق..." : "Enter Certificate ID to verify..."} 
                   className="w-full bg-transparent text-white placeholder-gray-300 px-6 py-3 outline-none"
                 />
                 <button type="submit" className="bg-omega-blue hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors">
                   <Search size={18} /> <span className="hidden sm:inline">{language === 'ar' ? "تحقق" : "Verify"}</span>
                 </button>
               </form>
             </div>
           </motion.div>
        </div>
      </section>

      {/* باقي الصفحة كما هي بدون تغييرات (الخدمات، الصناعات، الخ) */}
      {/* Services Overview */}
      <section className="py-24 bg-gray-50 dark:bg-slate-800 transition-colors">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-omega-yellow font-bold uppercase tracking-widest text-sm mb-2 block">{language === 'ar' ? 'قدراتنا' : 'Our Capabilities'}</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-omega-dark dark:text-white uppercase">
                {language === 'ar' ? 'حلول صناعية عالمية المستوى' : 'WORLD-CLASS INDUSTRIAL SOLUTIONS'}
              </h2>
              <div className="h-1.5 w-24 bg-omega-yellow mt-6 rounded-full"></div>
            </div>
            <Link to="/services" className="group hidden md:flex items-center gap-2 text-omega-blue dark:text-omega-yellow font-bold uppercase tracking-wider hover:text-omega-dark transition-colors">
              {language === 'ar' ? `عرض كل الخدمات (${services.length})` : `View All ${services.length} Services`} <ArrowRight size={16} className="transform rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"/>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 bg-omega-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase">
              {getLocalizedText(safeHomeContent.industriesTitle || "INDUSTRIES WE SERVE", safeHomeContent.industriesTitleAr)}
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
              {getLocalizedText(safeHomeContent.industriesSubtitle || "", safeHomeContent.industriesSubtitleAr)}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {(safeHomeContent.industries || INDUSTRIES).map((ind, idx) => (
              <motion.div key={idx} whileHover={{ y: -10 }} className="relative h-96 group overflow-hidden rounded-xl shadow-2xl bg-slate-800">
                {ind.image ? <img src={ind.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 group-hover:scale-110" /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="w-10 h-1 bg-omega-yellow mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rtl:origin-right duration-300"></div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2 leading-none">{getLocalizedText(ind.title, ind.titleAr)}</h3>
                  <div className="overflow-hidden max-h-0 group-hover:max-h-32 transition-all duration-500"><p className="text-sm text-gray-300 mt-2 leading-snug">{getLocalizedText(ind.description, ind.descriptionAr)}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-omega-yellow py-16">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x rtl:divide-x-reverse divide-omega-dark/10">
              {safeHomeContent.stats.map((s, i) => (
                <div key={i} className="px-4">
                  <h3 className="text-5xl font-display font-bold text-omega-dark mb-2">{s.val}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-omega-dark/80">{getLocalizedText(s.label, s.labelAr)}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;