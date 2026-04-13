import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { CheckCircle, AlertTriangle, XCircle, FileText, Calendar, Shield } from 'lucide-react';
import Logo from '../components/Logo';

const CertificateView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { certificates, loading } = useData();
  const [cert, setCert] = useState<any>(null);

  useEffect(() => {
    if (!loading && id) {
      // تعديل هام: البحث بـ ID الشهادة أو السيريال نمبر مع تجاهل حالة الأحرف
      const query = id.toLowerCase();
      const found = certificates.find(c => 
        c.id.toLowerCase() === query || 
        c.serialNumber.toLowerCase() === query
      );
      setCert(found);
    }
  }, [id, certificates, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-omega-yellow border-t-transparent rounded-full"></div></div>;

  if (!cert) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle size={64} className="text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-omega-dark mb-2">Certificate Not Found</h1>
        <p className="text-gray-600 mb-6">The certificate ID or Serial Number you entered does not exist in our system.</p>
        <Link to="/" className="bg-omega-blue text-white px-6 py-2 rounded-full font-bold">Go to Homepage</Link>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'valid': return { color: 'text-green-600', bg: 'bg-green-100', icon: <CheckCircle size={24} />, text: 'Valid & Active' };
      case 'expiring': return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <AlertTriangle size={24} />, text: 'Expiring Soon' };
      default: return { color: 'text-red-600', bg: 'bg-red-100', icon: <XCircle size={24} />, text: 'Expired' };
    }
  };

  const statusInfo = getStatusDisplay(cert.status);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6 flex justify-center items-start">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-2xl border-t-8 border-omega-yellow">
        <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
          <Logo variant="dark" showSubtitle={false} className="scale-75 origin-top-left rtl:origin-top-right" />
          <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg ${statusInfo.bg} ${statusInfo.color}`}>
            {statusInfo.icon}
            <span className="font-bold text-sm uppercase tracking-wide mt-1">{statusInfo.text}</span>
          </div>
        </div>

        <div className="space-y-6" dir="ltr">
          <h2 className="text-2xl font-display font-bold text-omega-dark uppercase tracking-wide">
            Equipment Certification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><Shield size={14}/> Certificate ID</p>
              <p className="text-lg font-mono font-bold text-gray-800">{cert.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><FileText size={14}/> Serial Number</p>
              <p className="text-lg font-mono font-bold text-gray-800">{cert.serialNumber}</p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Equipment Name</p>
              <p className="text-xl font-bold text-omega-blue">{cert.equipmentName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 border border-gray-100 rounded-lg">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><Calendar size={14}/> Inspected On</p>
              <p className="font-bold text-gray-800">{cert.inspectionDate}</p>
            </div>
            <div className="p-4 border border-gray-100 rounded-lg">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><Calendar size={14}/> Expiry Date</p>
              <p className="font-bold text-gray-800">{cert.expiryDate}</p>
            </div>
          </div>

          {/* حالة المعدة (مقبولة أو مرفوضة) */}
          <div className={`mt-6 p-5 rounded-xl border-2 flex items-center justify-between ${cert.equipmentStatus === 'Rejected' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Equipment Final Status</p>
              <p className={`text-2xl font-bold uppercase ${cert.equipmentStatus === 'Rejected' ? 'text-red-700' : 'text-green-700'}`}>
                {cert.equipmentStatus === 'Rejected' ? 'REJECTED (مرفوضة)' : 'ACCEPTED (مقبولة)'}
              </p>
            </div>
            {cert.equipmentStatus === 'Rejected' ? <XCircle size={48} className="text-red-400" /> : <CheckCircle size={48} className="text-green-400" />}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          {cert.pdfUrl && cert.pdfUrl !== '#' ? (
            <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className="bg-omega-dark text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-omega-blue transition-colors flex items-center gap-2 shadow-lg hover:-translate-y-1 transform">
              <FileText size={18} /> View & Download Full PDF
            </a>
          ) : (
             <p className="text-gray-400 italic text-sm">No PDF attached for this certificate.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateView;