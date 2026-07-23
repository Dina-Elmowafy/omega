import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, Calendar, CheckCircle, FileText, Shield, XCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Logo from '../components/Logo';

const NewCertificateView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { newCertificates, loading } = useData();
  const [cert, setCert] = useState<any>(null);

  useEffect(() => {
    const query = id?.toLowerCase().trim();
    if (!loading && query) setCert(newCertificates.find((item) =>
      [item.barcodeId, item.id, item.chassisNumber].some((value) => String(value || '').toLowerCase() === query)
    ));
  }, [id, newCertificates, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-omega-yellow border-t-transparent rounded-full" /></div>;
  if (!cert) return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center"><AlertTriangle size={64} className="text-red-500 mb-4" /><h1 className="text-3xl font-bold text-omega-dark mb-2">Certificate Not Found</h1><Link to="/" className="bg-omega-blue text-white px-6 py-2 rounded-full font-bold">Go to Homepage</Link></div>;

  const accepted = cert.equipmentStatus !== 'Rejected';
  const active = cert.status === 'valid';
  return <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6 flex justify-center"><div className="bg-white text-slate-900 p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-3xl border-t-8 border-omega-yellow">
    <div className="flex justify-between items-start border-b pb-6 mb-6"><Logo variant="dark" showSubtitle={false} className="scale-75 origin-top-left" /><div className={`px-4 py-2 rounded-lg font-bold ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{active ? 'VALID / سارية' : cert.status === 'expiring' ? 'EXPIRING SOON / تنتهي قريباً' : 'EXPIRED / منتهية'}</div></div>
    <h2 className="text-2xl font-display font-bold text-omega-dark uppercase tracking-wide mb-6">New Certificate Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 p-6 rounded-lg border border-gray-200">
      {[["Certificate Number", cert.id], ["Company Name", cert.companyName], ["Vehicle Type / نوع المركبة", cert.vehicleType], ["Brand / الماركة", cert.brand], ["Model / الموديل", cert.model], ["Plate Number / رقم اللوحات", cert.plateNumber], ["Chassis Number / رقم الشاسيه", cert.chassisNumber]].map(([label, value]) => <div key={String(label)}><p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{label}</p><p className="text-lg font-bold text-omega-blue">{value || 'N/A'}</p></div>)}
    </div>
    <div className="grid grid-cols-2 gap-6 mt-6"><div className="p-4 border rounded-lg"><p className="text-xs text-gray-500 font-bold mb-1 flex gap-2"><Calendar size={14}/> Inspection Date</p><p className="font-bold">{cert.inspectionDate || 'N/A'}</p></div><div className="p-4 border rounded-lg"><p className="text-xs text-gray-500 font-bold mb-1 flex gap-2"><Calendar size={14}/> Expiry Date</p><p className="font-bold">{cert.expiryDate || 'N/A'}</p></div></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"><div className={`p-5 rounded-xl border-2 flex items-center justify-between ${accepted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}><span className={`font-bold ${accepted ? 'text-green-800' : 'text-red-800'}`}>{accepted ? 'ACCEPTED / مقبولة' : 'REJECTED / مرفوضة'}</span>{accepted ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}</div><div className={`p-5 rounded-xl border-2 flex items-center justify-between ${active ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}><span className={`font-bold ${active ? 'text-green-800' : 'text-red-800'}`}>{active ? 'ACTIVE / سارية' : 'NOT ACTIVE / غير سارية'}</span><Shield className={active ? 'text-green-500' : 'text-red-500'} /></div></div>
    <div className="mt-8 text-center">{cert.pdfUrl ? <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex gap-2 bg-omega-dark text-white px-8 py-3 rounded-full font-bold"><FileText size={18}/> View & Download PDF</a> : <p className="text-gray-400">No PDF link provided.</p>}</div>
  </div></div>;
};
export default NewCertificateView;
