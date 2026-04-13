import React from 'react';
import { Target, Eye, Shield, Users, Award, Zap } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { aboutContent } = useData();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const safeAbout = aboutContent && Object.keys(aboutContent).length > 0 ? aboutContent : {
    title: "WHO WE ARE",
    subtitle: "Excellence in Engineering & Industrial Services",
    story: "Founded by a team of visionary engineers, OMEGA was built on a foundation of uncompromising safety...",
    mission: "To deliver superior inspection, maintenance, and engineering services...",
    vision: "To be the undisputed leader in industrial solutions...",
    coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356f58?auto=format&fit=crop&q=80"
  };

  return (
    <div className="pt-20 pb-16 bg-white dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden mb-24">
        <div className="absolute inset-0 z-0">
          <img src={safeAbout.coverImage} alt="Omega Team" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-omega-dark/80 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="text-omega-yellow font-bold tracking-widest uppercase mb-4 block">
            {isAr ? 'قصتنا' : 'Our Story'}
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 uppercase">
            {isAr && safeAbout.titleAr ? safeAbout.titleAr : safeAbout.title}
          </h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            {isAr && safeAbout.subtitleAr ? safeAbout.subtitleAr : safeAbout.subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-omega-dark dark:text-white mb-6">
                {isAr ? 'معايير أوميجا' : 'THE OMEGA STANDARD'}
            </h2>
            <div className="w-20 h-1.5 bg-omega-yellow mb-8"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 whitespace-pre-line">
              {isAr && safeAbout.storyAr ? safeAbout.storyAr : safeAbout.story}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-xl border-t-4 border-omega-blue shadow-sm transition-colors">
              <Target size={40} className="text-omega-blue dark:text-omega-yellow mb-6" />
              <h3 className="text-xl font-bold text-omega-dark dark:text-white mb-4 uppercase">
                {isAr ? 'مهمتنا' : 'Our Mission'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {isAr && safeAbout.missionAr ? safeAbout.missionAr : safeAbout.mission}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-xl border-t-4 border-omega-yellow shadow-sm sm:mt-12 transition-colors">
              <Eye size={40} className="text-omega-yellow mb-6" />
              <h3 className="text-xl font-bold text-omega-dark dark:text-white mb-4 uppercase">
                {isAr ? 'رؤيتنا' : 'Our Vision'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {isAr && safeAbout.visionAr ? safeAbout.visionAr : safeAbout.vision}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-12 md:p-20 text-center border border-gray-100 dark:border-slate-700 transition-colors">
          <h2 className="text-3xl font-display font-bold text-omega-dark dark:text-white mb-16">
            {isAr ? 'قيمنا الأساسية' : 'OUR CORE VALUES'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div><Shield size={48} className="mx-auto text-omega-blue dark:text-omega-yellow mb-6" /><h3 className="text-xl font-bold text-omega-dark dark:text-white mb-3">{isAr ? 'السلامة أولاً' : 'Safety First'}</h3><p className="text-gray-500 dark:text-gray-400 text-sm">{isAr ? 'لا مساومة على سلامة فريقنا.' : 'Zero compromise on the well-being of our team.'}</p></div>
            <div><Award size={48} className="mx-auto text-omega-blue dark:text-omega-yellow mb-6" /><h3 className="text-xl font-bold text-omega-dark dark:text-white mb-3">{isAr ? 'التميز' : 'Excellence'}</h3><p className="text-gray-500 dark:text-gray-400 text-sm">{isAr ? 'تقديم أعلى معايير الجودة.' : 'Delivering the highest quality standards.'}</p></div>
            <div><Users size={48} className="mx-auto text-omega-blue dark:text-omega-yellow mb-6" /><h3 className="text-xl font-bold text-omega-dark dark:text-white mb-3">{isAr ? 'الشراكة' : 'Partnership'}</h3><p className="text-gray-500 dark:text-gray-400 text-sm">{isAr ? 'بناء علاقات طويلة الأمد مبنية على الثقة.' : 'Building long-term, trust-based relationships.'}</p></div>
            <div><Zap size={48} className="mx-auto text-omega-blue dark:text-omega-yellow mb-6" /><h3 className="text-xl font-bold text-omega-dark dark:text-white mb-3">{isAr ? 'الابتكار' : 'Innovation'}</h3><p className="text-gray-500 dark:text-gray-400 text-sm">{isAr ? 'التبني المستمر للتكنولوجيا الحديثة.' : 'Continuously adopting new technologies.'}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;