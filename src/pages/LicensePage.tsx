import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, User, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

const LicensePage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { companyInfo } = useData();
  const [licenseQuery, setLicenseQuery] = useState('');

  const handleLicenseSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!licenseQuery.trim()) return;
    navigate(`/license/${licenseQuery.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <Helmet>
        <title>OMEGA | {language === 'ar' ? 'الرخص' : 'Licenses'}</title>
      </Helmet>

      <section className="relative py-24 bg-gradient-to-br from-omega-dark via-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tight mb-6">
              {language === 'ar' ? 'خدمة إصدار الرخص' : 'Professional License Issuance'}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-12">
              {language === 'ar'
                ? 'يمكنك هنا البحث عن الرخصة برقم الرخصة أو السيريال وعرض تفاصيلها مع إمكانية إضافة اسم صاحب الرخصة وصورته.'
                : 'Search your license by license ID or serial number and view the details with a dedicated owner name and photo section.'}
            </p>

            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
                <div className="flex items-center gap-3 bg-white/10 px-5 py-4 rounded-2xl">
                  <Shield size={28} className="text-omega-yellow" />
                  <div>
                    <p className="text-sm uppercase tracking-widest text-slate-300">{language === 'ar' ? 'الرخص' : 'Licenses'}</p>
                    <p className="text-base font-semibold">{language === 'ar' ? 'تفاصيل متكاملة' : 'Complete details'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 px-5 py-4 rounded-2xl">
                  <User size={28} className="text-omega-yellow" />
                  <div>
                    <p className="text-sm uppercase tracking-widest text-slate-300">{language === 'ar' ? 'مالك الرخصة' : 'License Owner'}</p>
                    <p className="text-base font-semibold">{language === 'ar' ? 'اسم + صورة' : 'Name + photo'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 px-5 py-4 rounded-2xl">
                  <FileText size={28} className="text-omega-yellow" />
                  <div>
                    <p className="text-sm uppercase tracking-widest text-slate-300">{language === 'ar' ? 'بدون رقم الرخصة' : 'No License ID'}</p>
                    <p className="text-base font-semibold">{language === 'ar' ? 'عرض بدون معلومات حساسة' : 'View without sensitive details'}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleLicenseSearch} className="flex flex-col md:flex-row gap-3 items-stretch">
                <input
                  type="text"
                  value={licenseQuery}
                  onChange={(e) => setLicenseQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل رقم الرخصة أو السيريال...' : 'Enter License ID or Serial Number...'}
                  className="flex-1 rounded-full border border-white/20 bg-slate-950/70 px-6 py-4 text-white placeholder-slate-400 outline-none focus:border-omega-yellow focus:ring-2 focus:ring-omega-yellow/20"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-omega-yellow px-8 py-4 text-sm font-bold uppercase tracking-wide text-omega-dark hover:bg-yellow-400 transition"
                >
                  <Search size={18} />
                  {language === 'ar' ? 'عرض الرخصة' : 'View License'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-omega-dark">
              {language === 'ar' ? 'نظام رخص احترافي' : 'A dedicated license system'}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'الرخص هنا مصممة لتعرض بيانات المعدات الأساسية فقط، وتوفر لك مساحة لإضافة مالك الرخصة وصورته دون عرض رقم الشهادة أو حالة المعدة.'
                : 'This license page displays the core equipment details while providing a separate section for license owner name and photo, without showing the sensitive license ID or equipment status.'}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 p-6 bg-white shadow-sm">
                <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">{language === 'ar' ? 'سهولة استخدام' : 'Easy to use'}</p>
                <p className="text-slate-700">{language === 'ar' ? 'ابحث عن الرخصة برقم السيريال أو رقم الرخصة.' : 'Search by serial or license ID in one click.'}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 p-6 bg-white shadow-sm">
                <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">{language === 'ar' ? 'معلومات آمنة' : 'Secure details'}</p>
                <p className="text-slate-700">{language === 'ar' ? 'لا نعرض رقم الرخصة أو حالة المعدة في صفحة الرخصة.' : 'We omit the license ID and equipment status from the license detail view.'}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">{language === 'ar' ? 'احصل على رخصتك الآن' : 'Get your license now'}</h3>
            <p className="text-slate-300 leading-relaxed mb-6">
              {language === 'ar'
                ? 'يمكنك زيارة أي رخصة موجودة في النظام باستخدام رابط الرخصة الخاص بها.'
                : 'Visit any license in the system using its license link.'}
            </p>
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800">
                <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">{language === 'ar' ? 'مثال' : 'Example'}</p>
                <p className="font-mono text-sm text-slate-100">{window.location.origin}/#/license/12345</p>
              </div>
              <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800">
                <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">{language === 'ar' ? 'نصيحة' : 'Tip'}</p>
                <p className="text-slate-100">{language === 'ar' ? 'يمكنك مشاركة رابط الرخصة مع العملاء مباشرة.' : 'You can share the license link with clients directly.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-slate-300 text-center">
        <p>{companyInfo.fullName || 'OMEGA Contracting & Petroleum Services'}</p>
      </footer>
    </div>
  );
};

export default LicensePage;
