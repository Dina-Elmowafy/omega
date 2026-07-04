import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { CheckCircle, AlertTriangle, XCircle, FileText, Calendar, User } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Logo from '../components/Logo';

const LicenseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { licenses, loading } = useData();
  const [license, setLicense] = useState<any>(null);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhotoPreview, setOwnerPhotoPreview] = useState<string>('');

  useEffect(() => {
    if (!loading && id) {
      const query = id.toLowerCase().trim();
      const found = licenses.find(l => {
        const safeId = l.id ? String(l.id).toLowerCase() : '';
        const safeSerial = l.serialNumber ? String(l.serialNumber).toLowerCase() : '';
        return safeId === query || safeSerial === query;
      });
      setLicense(found);
      if (found) {
        setOwnerName(found.licenseOwnerName || '');
        setOwnerPhotoPreview(found.licenseOwnerPhotoUrl || '');
      }
    }
  }, [id, licenses, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-omega-yellow border-t-transparent rounded-full"></div></div>;

  if (!license) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle size={64} className="text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-omega-dark mb-2">License Not Found</h1>
        <p className="text-gray-600 mb-6">The license serial number or ID you entered does not match a valid record.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/license" className="bg-omega-blue text-white px-6 py-2 rounded-full font-bold">Search Licenses</Link>
        </div>
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

  const statusInfo = getStatusDisplay(license.status);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6 flex justify-center items-start">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-3xl border-t-8 border-omega-yellow">
        <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
          <Logo variant="dark" showSubtitle={false} className="scale-75 origin-top-left rtl:origin-top-right" />
          <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg ${statusInfo.bg} ${statusInfo.color}`}>
            {statusInfo.icon}
            <span className="font-bold text-sm uppercase tracking-wide mt-1">{statusInfo.text}</span>
          </div>
        </div>

        <div className="space-y-6" dir="ltr">
          <h2 className="text-2xl font-display font-bold text-omega-dark uppercase tracking-wide">License Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><FileText size={14}/> Serial Number</p>
              <p className="text-lg font-mono font-bold text-gray-800">{license.serialNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Equipment Name</p>
              <p className="text-xl font-bold text-omega-blue">{license.equipmentName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Model</p>
              <p className="text-xl font-bold text-omega-blue">{license.model || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 border border-gray-100 rounded-lg">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><Calendar size={14}/> Inspected On</p>
              <p className="font-bold text-gray-800">{license.inspectionDate || 'N/A'}</p>
            </div>
            <div className="p-4 border border-gray-100 rounded-lg">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><Calendar size={14}/> Expiry Date</p>
              <p className="font-bold text-gray-800">{license.expiryDate || 'N/A'}</p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <User size={18} className="text-omega-blue" />
              <h3 className="font-semibold text-lg">License Owner</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Enter license owner name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-omega-blue outline-none"
                />
                <p className="mt-3 text-sm text-gray-500">If the license contains an owner photo, it will appear automatically after scanning the QR/barcode.</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-4 flex flex-col items-center justify-center gap-4">
                {ownerPhotoPreview ? (
                  <>
                    <div className="w-40 h-40 rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
                      <img src={ownerPhotoPreview} alt="Owner" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">{ownerName || 'Owner photo'}</p>
                  </>
                ) : (
                  <div className="w-full h-40 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-4 text-gray-400">
                    <p className="font-semibold">Owner photo will appear here</p>
                    <p className="text-xs mt-2">After scanning the code, the saved photo appears automatically.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
            <div className="flex flex-col gap-3">
              <Link to="/license" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">Search another license</Link>
              {license.pdfUrl && typeof license.pdfUrl === 'string' && license.pdfUrl.trim() !== '' && license.pdfUrl !== '#' ? (
                <a href={license.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-omega-dark text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-omega-blue transition-colors">Download License PDF</a>
              ) : (
                <span className="text-gray-400 italic text-sm">No PDF link available for this license.</span>
              )}
            </div>
            <div className="bg-slate-950 text-white rounded-3xl p-5 text-center shadow-lg">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Scan to open this license</p>
              <div className="inline-block rounded-3xl overflow-hidden bg-white p-3">
                <QRCodeCanvas
                  value={`${window.location.origin}/#/license/${license.id}`}
                  size={180}
                  level="H"
                  className="w-44 h-44"
                />
              </div>
              <p className="mt-3 text-xs text-slate-300 break-all">{window.location.origin}/#/license/{license.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseView;
