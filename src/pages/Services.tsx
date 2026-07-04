import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Check } from 'lucide-react';
import Logo from '../components/Logo';

const Services: React.FC = () => {
  const { services } = useData();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-800 py-16 border-b border-gray-200 dark:border-slate-700 transition-colors">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {/* في الدارك مود اللوجو هيكون فاتح */}
            <div className="dark:hidden"><Logo variant="dark" className="scale-125 md:scale-150 origin-center" /></div>
            <div className="hidden dark:block"><Logo variant="light" className="scale-125 md:scale-150 origin-center" /></div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-omega-dark dark:text-white mb-4 mt-8">
            {isAr ? 'خدماتنا' : 'OUR SERVICES'}
          </h1>
          <div className="h-1 w-24 bg-omega-yellow mx-auto mb-6"></div>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {isAr 
              ? 'من الوصول بالحبال إلى الاختبارات غير الإتلافية، نقدم حلولاً صناعية شاملة لضمان السلامة الهيكلية والتشغيلية.' 
              : 'From Rope Access to NDT, we provide comprehensive industrial solutions ensuring structural integrity and operational safety.'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 gap-20">
          {services.map((service, index) => (
            <div id={service.id} key={service.id}>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                 {/* Image Side */}
                 <div className="w-full lg:w-1/2">
                   <div className="relative group">
                     <div className={`absolute inset-0 bg-omega-yellow transform ${index % 2 === 0 ? '-translate-x-4 translate-y-4' : 'translate-x-4 translate-y-4'} rounded-lg transition-transform group-hover:translate-x-0 group-hover:translate-y-0`}></div>
                     <img 
                       src={service.image} 
                       alt={service.title} 
                       className="relative z-10 w-full h-80 md:h-96 object-cover rounded-lg shadow-xl"
                     />
                   </div>
                 </div>

                 {/* Content Side */}
                 <div className="w-full lg:w-1/2">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-omega-blue/10 dark:bg-omega-yellow/20 rounded-full text-omega-blue dark:text-omega-yellow transition-colors">
                        <span className="font-bold text-xl font-display">0{index + 1}</span>
                     </div>
                     <h2 className="text-3xl font-display font-bold text-omega-dark dark:text-white">
                        {isAr && service.titleAr ? service.titleAr : service.title}
                     </h2>
                   </div>
                   
                   <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-lg">
                     {isAr && service.fullDescriptionAr ? service.fullDescriptionAr : service.fullDescription}
                   </p>
                   
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                     <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                        {isAr ? 'الميزات الأساسية' : 'Key Features'}
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {(isAr && service.featuresAr && service.featuresAr.length > 0 && service.featuresAr[0] !== "" ? service.featuresAr : service.features).map((feature, i) => (
                         <div key={i} className="flex items-center gap-3">
                           <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full shrink-0">
                             <Check size={14} className="text-green-600 dark:text-green-400" />
                           </div>
                           <span className="text-gray-800 dark:text-gray-200 font-medium">{feature}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;